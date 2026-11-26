import { tool } from "langchain";
import { regimes } from "../../../src/data/business.ts";
import {
  explainRegime,
  explanationSchema,
  fromBusinessEntry,
} from "./shared.ts";

const content = regimes.find((item) => item.id === "lucro-real");
if (!content) throw new Error("Conteúdo Lucro Real ausente do portal");

/**
 * TOOL: explain_real_changes
 *
 * Explica a transição de tributos sobre consumo para empresas no Lucro Real,
 * sem afirmar que o regime de IRPJ/CSLL foi substituído.
 *
 * Entrada: {topico?: "resumo"|"exemplo"|"cuidados"|"completo"}
 * Saída: JSON do conteúdo editorial de Minha empresa, com fontes e ressalvas.
 * Exemplo: {"topico":"exemplo"}
 */
export const explainRealChanges = tool(
  async ({ topico }) => explainRegime(fromBusinessEntry(content), topico),
  {
    name: "explain_real_changes",
    description:
      "Explica mudanças da reforma para empresas de Lucro Real: CBS/IBS, créditos, transição de ICMS/ISS, impactos sobre ERP, contratos e caixa; IRPJ/CSLL continuam separados.",
    schema: explanationSchema,
  },
);
