import { tool } from "langchain";
import { regimes } from "../../../src/data/business.ts";
import {
  explainRegime,
  explanationSchema,
  fromBusinessEntry,
} from "./shared.ts";

const content = regimes.find((item) => item.id === "lucro-presumido");
if (!content) throw new Error("Conteúdo Lucro Presumido ausente do portal");

/**
 * TOOL: explain_presumed_changes
 *
 * Explica diferença entre IRPJ/CSLL do Lucro Presumido e a reforma do consumo.
 * Não confunde a LC 224/2025 com a substituição de PIS/Cofins e ICMS/ISS.
 *
 * Entrada: {topico?: "resumo"|"exemplo"|"cuidados"|"completo"}
 * Saída: JSON do conteúdo editorial em Minha empresa, com fontes e ressalvas.
 * Exemplo: {"topico":"completo"}
 */
export const explainPresumedChanges = tool(
  async ({ topico }) => explainRegime(fromBusinessEntry(content), topico),
  {
    name: "explain_presumed_changes",
    description:
      "Explica mudanças da reforma para empresas de Lucro Presumido: CBS/IBS no regime regular, créditos, substituição gradual de tributos e distinção de IRPJ/CSLL.",
    schema: explanationSchema,
  },
);
