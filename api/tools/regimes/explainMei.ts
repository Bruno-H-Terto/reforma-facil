import { tool } from "langchain";
import { meiSources } from "../../../src/data/mei.ts";
import { explainRegime, explanationSchema } from "./shared.ts";

/**
 * TOOL: explain_mei_changes
 *
 * Descreve especificamente o MEI/SIMEI, sem confundi-lo com os anexos
 * do Simples Nacional para ME/EPP.
 *
 * Entrada: { topico?: "resumo" | "exemplo" | "cuidados" | "completo" }
 * Saída: JSON com panorama, exemplo, ações, links de fontes e rota Minha empresa.
 * Exemplo: {"topico":"completo"}
 * Não faz cálculo do DAS, busca na internet ou análise fiscal individual.
 */
export const explainMeiChanges = tool(
  async ({ topico }) =>
    explainRegime(
      {
        id: "mei",
        titulo: "Microempreendedor Individual (MEI/SIMEI)",
        antes:
          "O MEI paga mensalmente DAS-SIMEI, composto por contribuição previdenciária e, conforme a atividade, ICMS ou ISS. Seu DAS não segue as faixas dos Anexos I a V do Simples para ME/EPP.",
        mudancas:
          "O tratamento simplificado do SIMEI permanece. Segundo a orientação sobre reforma tributária divulgada pela Receita Federal e reproduzida no portal, as vendas do MEI não sofrem incidência de IBS e CBS. O empreendedor deve acompanhar as regras de emissão de documentos fiscais.",
        impacto:
          "O MEI deve continuar verificando sua atividade permitida, limite de faturamento aplicável e obrigações fiscais. Não deve utilizar as alíquotas de IBS/CBS do regime regular como se fossem adicionais à guia mensal do MEI.",
        exemplo:
          "Uma pessoa que vende produtos como MEI continua acompanhando o DAS-SIMEI de sua atividade. Para emitir notas fiscais, precisa observar as exigências aplicáveis ao destinatário e à operação; isso não significa migrar automaticamente para Lucro Presumido ou Lucro Real.",
        acoes: [
          "Confira a atividade cadastrada e o limite anual aplicável.",
          "Consulte o valor atualizado da guia DAS-SIMEI conforme a categoria.",
          "Verifique a emissão de notas fiscais e as orientações da Receita Federal.",
        ],
        fontes: [
          ["Receita Federal — Reforma de Fato", meiSources.reform],
          ["Portal oficial — regras e teto do MEI", meiSources.ceiling],
          ["Portal do Simples Nacional — DAS MEI", meiSources.das],
        ],
        urlPortal: "/empresas?regime=mei",
      },
      topico,
    ),
  {
    name: "explain_mei_changes",
    description:
      "Explica as mudanças da reforma tributária para MEI/SIMEI: DAS mensal, IBS/CBS nas vendas, documentos fiscais e pontos de atenção. Não é a tool de Simples Nacional para ME/EPP.",
    schema: explanationSchema,
  },
);
