import { z } from "zod";
import { runReforminhaAgent } from "./agent/agent.ts";

/**
 * Endpoint HTTP da Vercel: somente valida requisições e chama o agente.
 * Nenhuma regra fiscal, modelo ou ferramenta é definida aqui.
 */
const MAX_BYTES = 16_000;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1800),
      }),
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
    return json(
      { answer: await runReforminhaAgent(parsed.data.messages) },
      200,
    );
  } catch {
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
