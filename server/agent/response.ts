import type { ChatHistory } from "./agent.ts";

const greeting =
  /^\s*(?:\*\*)?(?:olá|oi|bom dia|boa tarde|boa noite)(?=\s|[!.,:;]|$)[!.,:;\s]*(?:\*\*)?\s*/i;
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
  if (explicitRecall.test(question)) return answer.trim();

  let updated = answer.trim().replace(greeting, "").trim();
  if (!updated) updated = answer.trim();

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
