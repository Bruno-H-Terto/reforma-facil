import { ChatOpenAI } from "@langchain/openai";

/**
 * Cria o modelo DeepSeek (compatível com a API de chat da OpenAI).
 *
 * Configuração obrigatória, exclusiva do servidor:
 *   DEEPSEEK_API_KEY=...
 * Configuração opcional:
 *   DEEPSEEK_MODEL=deepseek-flash
 *
 * Por segurança, a chave jamais deve usar prefixo VITE_.
 */
export function createDeepSeekModel() {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  return new ChatOpenAI({
    apiKey,
    configuration: { baseURL: "https://api.deepseek.com" },
    model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash",
    modelKwargs: { thinking: { type: "disabled" } },
    temperature: 0.2,
    maxTokens: 900,
    timeout: 15_000,
    maxRetries: 0,
  });
}
