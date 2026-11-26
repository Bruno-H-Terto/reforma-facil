export type ChatLine = {
  role: "user" | "assistant";
  content: string;
  /** Uma mensagem sem resposta não deve ser reutilizada como contexto. */
  failed?: boolean;
};

type HistoryMessage = Pick<ChatLine, "role" | "content">;

const MAX_HISTORY_MESSAGES = 10;
const MAX_PAYLOAD_BYTES = 14_000;

/**
 * Envia apenas turnos concluídos e a pergunta nova.
 * Limita o JSON em bytes, não só em número de mensagens, evitando HTTP 413
 * depois que o modelo devolve respostas Markdown maiores.
 */
export function buildChatHistory(
  messages: ChatLine[],
  newQuestion: string,
): HistoryMessage[] {
  const completed: HistoryMessage[] = messages
    .filter((message) => !message.failed)
    .map(({ role, content }) => ({ role, content }));

  const history = [
    ...completed,
    { role: "user" as const, content: newQuestion },
  ].slice(-MAX_HISTORY_MESSAGES);

  const bytes = (items: HistoryMessage[]) =>
    new TextEncoder().encode(JSON.stringify({ messages: items })).length;

  while (history.length > 1 && bytes(history) > MAX_PAYLOAD_BYTES) {
    history.shift();
  }
  // Não começar o histórico com uma resposta sem a respectiva pergunta.
  while (history.length > 1 && history[0].role === "assistant") {
    history.shift();
  }
  return history;
}
