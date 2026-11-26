import { tool } from "langchain";
import { z } from "zod";
import { quickDas } from "../../src/lib/quickDas.ts";
import { incomeTax, presumed } from "../../src/lib/taxes.ts";
import { taxSources } from "../../src/data/taxTables.ts";

const amount = z.number().finite().nonnegative().max(100_000_000);

/**
 * TOOL: simulate_taxes
 *
 * Objetivo: executar os cálculos DETERMINÍSTICOS já usados pelo Reforma Clara.
 * Não consulta a internet nem deixa o modelo inventar percentuais.
 *
 * Entrada:
 * - regime: simples_nacional | lucro_presumido | lucro_real
 * - ano: 2026 | 2027 | 2028 (simulação do DAS); para IRPJ/CSLL, somente 2026
 * - Simples: anexo, receita12Meses, faturamentoMes
 * - Presumido: atividade e receitaTrimestre (cenário básico, sem ajustes)
 * - Real: baseIrpj e baseCsll (bases fiscais já calculadas pelo contribuinte)
 *
 * Saída: JSON com valores em reais, premissas e limitações, ou campos faltantes.
 *
 * Exemplos:
 *   { regime: "simples_nacional", ano: 2026, anexo: "I",
 *     receita12Meses: 300000, faturamentoMes: 25000 }
 *   { regime: "lucro_real", ano: 2026,
 *     baseIrpj: 80000, baseCsll: 80000 }
 *
 * Não serve para apurar impostos efetivamente devidos ou substituir contador.
 */
export const simulateTaxes = tool(
  async (input) => {
    const { regime, ano } = input;

    if (regime === "simples_nacional") {
      const required = [
        "ano",
        "anexo",
        "receita12Meses",
        "faturamentoMes",
      ] as const;
      const missing = required.filter((key) => input[key] === undefined);
      if (missing.length)
        return JSON.stringify({ status: "missing_inputs", fields: missing });

      const result = quickDas(
        input.anexo!,
        input.receita12Meses!,
        input.faturamentoMes!,
        ano!,
      );
      if (!result) {
        return JSON.stringify({
          status: "not_supported",
          message:
            "Não é possível estimar com esta calculadora simplificada: revise RBT12, faixa, sublimites e elegibilidade ao Simples.",
          path: "/simulador",
        });
      }
      return JSON.stringify({
        status: "ok",
        regime,
        ano,
        periodo: "mensal",
        anexo: input.anexo,
        aliquotaEfetivaPercentual: Number(result.effective.toFixed(5)),
        dasEstimado: result.total,
        // São parcelas do DAS, não cobranças adicionais.
        parcelaCbsNoDas: result.cbs,
        parcelaIbsNoDas: result.ibs,
        demaisParcelasDoDas: result.remaining,
        fonte: taxSources.simples,
        path: "/simulador",
        aviso:
          "Cenário educativo para empresa de atividade única, sem regime especial. Parcelas IBS/CBS fazem parte do DAS, não devem ser somadas novamente. Não equivale a guia ou apuração fiscal.",
      });
    }

    if (ano === undefined) {
      return JSON.stringify({ status: "missing_inputs", fields: ["ano"] });
    }
    if (ano !== 2026) {
      return JSON.stringify({
        status: "not_supported",
        message:
          "A demonstração simplificada de IRPJ/CSLL desta ferramenta só contempla 2026. Use a aba do regime no simulador para consultar as orientações.",
      });
    }

    if (regime === "lucro_presumido") {
      const required = ["atividade", "receitaTrimestre"] as const;
      const missing = required.filter((key) => input[key] === undefined);
      if (missing.length)
        return JSON.stringify({ status: "missing_inputs", fields: missing });
      // Acima desse valor, a interface exige tratar a LC 224/2025 e receitas acumuladas.
      if (input.receitaTrimestre! > 1_250_000) {
        return JSON.stringify({
          status: "not_supported",
          message:
            "Receita trimestral superior a R$ 1.250.000: exige verificar o histórico anual e os ajustes previstos na LC 224/2025.",
          path: "/simulador?modo=presumido",
        });
      }
      const [irRate, csRate] =
        input.atividade === "comercio" ? [8, 12] : [32, 32];
      const result = presumed(
        input.receitaTrimestre!,
        irRate,
        csRate,
        0,
        0,
        0,
        0,
      );
      if (!result) return JSON.stringify({ status: "invalid_inputs" });

      return JSON.stringify({
        status: "ok",
        regime,
        ano,
        periodo: "trimestral",
        presuncaoIrpjPercentual: irRate,
        presuncaoCsllPercentual: csRate,
        baseIrpj: result.ir,
        baseCsll: result.cs,
        irpjEstimado: result.irpj,
        csllEstimada: result.csll,
        totalIrpjCsllEstimado: result.total,
        path: "/simulador?modo=presumido",
        fonte: taxSources.presumido,
        aviso:
          "Demonstração básica para uma atividade, sem outras receitas ou ajustes, condicionada ao histórico anual. Não inclui IBS/CBS nem demais tributos; a LC 224/2025 pode exigir ajustes mesmo nesta faixa.",
      });
    }

    const required = ["baseIrpj", "baseCsll"] as const;
    const missing = required.filter((key) => input[key] === undefined);
    if (missing.length)
      return JSON.stringify({ status: "missing_inputs", fields: missing });
    const result = incomeTax(input.baseIrpj!, input.baseCsll!, 3);
    return JSON.stringify({
      status: "ok",
      regime,
      ano,
      periodo: "trimestral",
      baseIrpj: result.ir,
      baseCsll: result.cs,
      irpjEstimado: result.irpj,
      csllEstimada: result.csll,
      totalIrpjCsllEstimado: result.total,
      path: "/simulador?modo=real",
      fonte: taxSources.real,
      aviso:
        "As bases fiscais devem ser fornecidas após ajustes pela contabilidade. Não calcula lucro fiscal automaticamente, IBS/CBS ou tributos totais. Empresa não financeira, apuração trimestral.",
    });
  },
  {
    name: "simulate_taxes",
    description:
      "Executa uma estimativa com as MESMAS funções determinísticas do portal: DAS Simples ou IRPJ/CSLL Presumido/Real. Solicite os campos obrigatórios, jamais invente informações, e explique as limitações. Não é apuração fiscal.",
    schema: z.object({
      regime: z
        .enum(["simples_nacional", "lucro_presumido", "lucro_real"])
        .describe("Qual regime simular"),
      ano: z
        .union([z.literal(2026), z.literal(2027), z.literal(2028)])
        .optional()
        .describe(
          "Ano da simulação, obrigatório para todos; 2027-28 somente Simples",
        ),
      anexo: z
        .enum(["I", "II", "III", "IV", "V"])
        .optional()
        .describe("Simples: anexo tributário da atividade"),
      receita12Meses: amount
        .optional()
        .describe(
          "Simples: receita dos 12 meses anteriores em R$; deve ser positiva",
        ),
      faturamentoMes: amount
        .optional()
        .describe("Simples: receita tributável do mês em R$"),
      atividade: z
        .enum(["comercio", "servicos"])
        .optional()
        .describe(
          "Lucro Presumido: comércio ou serviços sujeitos à regra geral",
        ),
      receitaTrimestre: amount
        .optional()
        .describe("Lucro Presumido: receita tributável do trimestre em R$"),
      baseIrpj: amount
        .optional()
        .describe(
          "Lucro Real: base fiscal trimestral de IRPJ após ajustes em R$",
        ),
      baseCsll: amount
        .optional()
        .describe(
          "Lucro Real: base fiscal trimestral de CSLL após ajustes em R$",
        ),
    }),
  },
);
