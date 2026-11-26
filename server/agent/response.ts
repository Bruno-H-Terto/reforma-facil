import type { ChatHistory } from "./agent.ts";

const greeting =
  /^\s*(?:#{1,3}\s+)?(?:\*\*)?(?:olá|oi|bom dia|boa tarde|boa noite)(?=\s|[!.,:;]|$)[!.,:;\s]*(?:\*\*)?\s*/i;
const explicitRecall =
  /\b(repita|repetir|relembre|relembrar|recapitule|recapitular|resuma|resumir|cite novamente)\b/i;

/**
 * Evita introduções mecânicas em turnos posteriores sem alterar informações
 * fiscais. Remove apenas saudações iniciais e parágrafos longos exatamente
 * iguais aos já respondidos. Não elimina paráfrases ou fatos repetidos.
 */
export function refineFollowUp(answer: string, history: ChatHistory): string {
  const previousAnswers = history
    .filter((line) => line.role === "assistant")
    .map((line) => line.content);
  if (previousAnswers.length === 0) return answer.trim();

  const question = history.at(-1)?.content ?? "";
  // Mesmo quando a pergunta pede uma recapitulação, não repetir saudações.
  const requestedGreeting =
    /\b(cumprimente|cumprimentar|diga boa tarde|diga bom dia|diga boa noite)\b/i.test(
      question,
    );
  if (requestedGreeting) return answer.trim();

  let updated = answer.trim().replace(greeting, "").trim();
  if (!updated) updated = answer.trim();
  if (explicitRecall.test(question)) return updated;

  const paragraphs = updated.split(/\n\s*\n/);
  while (
    paragraphs.length > 1 &&
    paragraphs[0].trim().length >= 70 &&
    previousAnswers.some((previous) => previous.includes(paragraphs[0].trim()))
  ) {
    paragraphs.shift();
  }

  return paragraphs.join("\n\n").trim() || answer.trim();
}
