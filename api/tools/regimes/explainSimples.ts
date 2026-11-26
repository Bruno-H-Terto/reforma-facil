import { tool } from "langchain";
import { regimes } from "../../../src/data/business.ts";
import {
  explainRegime,
  explanationSchema,
  fromBusinessEntry,
} from "./shared.ts";

const content = regimes.find((item) => item.id === "simples-nacional");
if (!content) throw new Error("Conteúdo Simples Nacional ausente do portal");

/**
 * TOOL: explain_simples_changes
 *
 * Para micro e pequenas empresas optantes pelo Simples (não SIMEI).
 * Reutiliza as mesmas orientações oficiais exibidas em Minha empresa.
 *
 * Entrada: {topico?: "resumo"|"exemplo"|"cuidados"|"completo"}
 * Saída: JSON com mudanças, impactos, ações, referências e rota do portal.
 * Exemplo: {"topico":"cuidados"}
 * Não escolhe automaticamente entre IBS/CBS dentro e fora do DAS.
 */
export const explainSimplesChanges = tool(
  async ({ topico }) => explainRegime(fromBusinessEntry(content), topico),
  {
    name: "explain_simples_changes",
    description:
      "Explica mudanças no Simples Nacional (ME/EPP): recolhimento pelo DAS, opção por IBS/CBS no regime regular, créditos e cuidados para a escolha. Não se aplica ao MEI/SIMEI.",
    schema: explanationSchema,
  },
);
