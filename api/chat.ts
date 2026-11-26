import { z } from "zod";

/**
 * Endpoint HTTP da Vercel: somente valida requisições e chama o agente.
 * Nenhuma regra fiscal, modelo ou ferramenta é definida aqui.
 */
const MAX_BYTES = 16_000;

const requestSchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          content: z.string().trim().min(1).max(1800),
        }),
        z.object({
          role: z.literal("assistant"),
          // As respostas do modelo costumam ser maiores que as perguntas.
          // Elas precisam ser aceitas ao reenviar o histórico no próximo turno.
          content: z.string().trim().min(1).max(6000),
        }),
      ]),
    )
    .min(1)
    .max(10),
});

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  Allow: "POST",
};

function json(data: unknown, status: number) {
  return Response.json(data, { status, headers: responseHeaders });
}

class BodyTooLarge extends Error {}

async function boundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length") || 0) > MAX_BYTES)
    throw new BodyTooLarge();
  if (!request.body) throw new Error("EMPTY_BODY");

  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) throw new BodyTooLarge();
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== "POST")
    return json({ error: "Método não permitido." }, 405);

  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin) {
    let allowed = false;
    try {
      allowed =
        new URL(origin).host === host || origin === process.env.APP_ORIGIN;
    } catch {
      /* malformed origin */
    }
    if (!allowed) return json({ error: "Origem não autorizada." }, 403);
  }

  let payload: unknown;
  try {
    payload = await boundedJson(request);
  } catch (error) {
    return error instanceof BodyTooLarge
      ? json({ error: "Mensagem muito extensa." }, 413)
      : json({ error: "Corpo inválido." }, 400);
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return json({ error: "Envie uma mensagem válida." }, 400);
  }
  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    return json(
      {
        error:
          "O assistente não está configurado. Defina DEEPSEEK_API_KEY no servidor.",
      },
      503,
    );
  }

  try {
    // Importar o agente somente depois da validação da requisição evita que
    // falhas em dependências do modelo derrubem a função antes de responder.
    // A pasta server/ é compartilhada: apenas api/chat.ts vira endpoint HTTP.
    const { runReforminhaAgent } = await import("../server/agent/agent.ts");
    return json(
      { answer: await runReforminhaAgent(parsed.data.messages) },
      200,
    );
  } catch (error) {
    // O usuário recebe apenas uma mensagem genérica; o diagnóstico fica nos
    // logs privados da Function e nunca expõe o valor de DEEPSEEK_API_KEY.
    const cause =
      error instanceof Error ? error : new Error("Erro desconhecido");
    const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
    const message = apiKey
      ? cause.message.replaceAll(apiKey, "[redacted]")
      : cause.message;
    console.error("[reforminha/chat] Falha no agente:", cause.name, message);
    return json(
      {
        error:
          "Não foi possível consultar o assistente agora. Tente novamente.",
      },
      502,
    );
  }
}

export default { fetch: handleRequest };
