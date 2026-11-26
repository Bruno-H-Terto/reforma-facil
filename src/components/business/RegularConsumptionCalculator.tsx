import { useId, useState } from "react";
import { FieldInfo } from "../FieldInfo";
import { CurrencyInput } from "../CurrencyInput";
import { Source, card, field } from "../ui";
import {
  calculateRegularConsumption,
  type TransitionYear,
} from "../../lib/regularConsumption";

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Mesma apuração de IBS/CBS para empresas no regime regular, independentemente
 * de a empresa apurar IRPJ/CSLL pelo Lucro Presumido ou pelo Lucro Real.
 * Demonstra o saldo aritmético, não apura tributos ou benefícios especiais.
 */
export function RegularConsumptionCalculator() {
  const formId = useId();
  const [year, setYear] = useState<TransitionYear>(2026);
  const [base, setBase] = useState("50000");
  const [cbsFutureRate, setCbsFutureRate] = useState("");
  const [ibsCredit, setIbsCredit] = useState("0");
  const [cbsCredit, setCbsCredit] = useState("0");

  const cbsRate = year === 2026 ? 0.9 : Number(cbsFutureRate);
  const missingCbs = year !== 2026 && cbsFutureRate.trim() === "";
  const valid =
    !missingCbs &&
    base !== "" &&
    ibsCredit !== "" &&
    cbsCredit !== "" &&
    [base, ibsCredit, cbsCredit].every(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    ) &&
    Number.isFinite(cbsRate) &&
    cbsRate >= 0 &&
    cbsRate <= 100;
  const result = valid
    ? calculateRegularConsumption({
        year,
        base: Number(base),
        cbsRate,
        ibsCredit: Number(ibsCredit),
        cbsCredit: Number(cbsCredit),
      })
    : null;

  return (
    <section className={card + " min-w-0 space-y-5"}>
      <div>
        <h2 className="text-lg font-semibold text-brand">
          IBS e CBS: demonstração sobre o consumo
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Tanto no Lucro Presumido quanto no Lucro Real, IBS e CBS seguem, em
          regra, o regime regular: há débitos nas operações e podem existir
          créditos nas aquisições elegíveis. A forma de calcular IRPJ/CSLL não
          muda, por si só, essa apuração de IBS/CBS.
        </p>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor={formId + "-year"}>Ano da simulação</label>
            <FieldInfo
              label="Ano da simulação"
              text="Escolha o ano para considerar as regras da transição. Em 2026 há alíquotas de teste; 2027 e 2028 têm regras transitórias diferentes."
            />
          </div>
          <select
            id={formId + "-year"}
            className={field + " mt-1"}
            value={year}
            onChange={(event) =>
              setYear(Number(event.target.value) as TransitionYear)
            }
          >
            <option value={2026}>2026 — ano de testes</option>
            <option value={2027}>2027 — transição</option>
            <option value={2028}>2028 — transição</option>
          </select>
        </div>
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor={formId + "-base"}>
              Base mensal das operações sujeitas a IBS/CBS
            </label>
            <FieldInfo
              label="Base mensal das operações sujeitas a IBS/CBS"
              text="Valor das vendas e dos serviços sujeitos aos tributos neste mês, sem incluir o próprio IBS/CBS. Pode ser diferente da receita usada para IRPJ e CSLL."
            />
          </div>
          <CurrencyInput
            id={formId + "-base"}
            value={base}
            onValueChange={setBase}
            className={field + " mt-1"}
          />
        </div>
        <h3 className="text-base font-semibold text-brand sm:col-span-2">
          2. Alíquotas usadas na demonstração
        </h3>
        <div className="rounded-xl bg-soft p-3 text-sm">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-brand">
              IBS: 0,1% na transição selecionada
            </p>
            <FieldInfo
              label="Alíquota de IBS"
              text="Percentual transitório geral de IBS neste exemplo; reduções e regimes especiais podem alterar o percentual aplicável à operação."
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            {year === 2026
              ? "2026: 0,1% estadual e 0% municipal."
              : "2027–2028: 0,05% estadual e 0,05% municipal."}{" "}
            Para operações submetidas às alíquotas gerais, sem reduções ou
            regimes especiais.
          </p>
        </div>
        {year === 2026 ? (
          <div className="rounded-xl bg-soft p-3 text-sm">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-brand">CBS: 0,9% em 2026</p>
              <FieldInfo
                label="Alíquota de CBS em 2026"
                text="Percentual legal de teste em 2026. Não é uma previsão da alíquota definitiva da CBS a partir de 2027."
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              Alíquota legal de teste, não uma previsão da CBS de 2027 em
              diante.
            </p>
          </div>
        ) : (
          <div className="text-sm font-medium text-brand">
            <div className="flex items-center gap-1">
              <label htmlFor={formId + "-cbs"}>
                Alíquota simulada de CBS para {year} (%)
              </label>
              <FieldInfo
                label="Alíquota simulada de CBS"
                text="Hipótese informada para demonstrar a conta. Não é uma alíquota futura oficial; considere a redução transitória prevista na legislação."
              />
            </div>
            <input
              id={formId + "-cbs"}
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.01"
              placeholder="Informe uma hipótese"
              value={cbsFutureRate}
              onChange={(event) => setCbsFutureRate(event.target.value)}
              className={field + " mt-1"}
            />
            <span className="mt-1 block text-xs font-normal leading-relaxed text-muted">
              Não foi preenchida uma alíquota oficial futura. Informe uma
              hipótese já considerando a redução transitória prevista em lei.
            </span>
          </div>
        )}
        <h3 className="text-base font-semibold text-brand sm:col-span-2">
          3. Créditos de impostos (se houver)
        </h3>
        <p className="text-sm leading-relaxed text-muted sm:col-span-2">
          Se sua empresa não tiver créditos elegíveis, mantenha zero. IBS e CBS
          usam créditos separados.
        </p>
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor={formId + "-ibs-credit"}>
              Créditos elegíveis de IBS no mês
            </label>
            <FieldInfo
              label="Créditos elegíveis de IBS no mês"
              text="Total de créditos de IBS das aquisições elegíveis neste mês. Nem toda despesa dá direito a crédito; confirme com a documentação fiscal."
            />
          </div>
          <CurrencyInput
            id={formId + "-ibs-credit"}
            value={ibsCredit}
            onValueChange={setIbsCredit}
            className={field + " mt-1"}
          />
        </div>
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor={formId + "-cbs-credit"}>
              Créditos elegíveis de CBS no mês
            </label>
            <FieldInfo
              label="Créditos elegíveis de CBS no mês"
              text="Total de créditos de CBS das aquisições elegíveis neste mês, calculado separadamente do IBS. Mantenha zero se não houver."
            />
          </div>
          <CurrencyInput
            id={formId + "-cbs-credit"}
            value={cbsCredit}
            onValueChange={setCbsCredit}
            className={field + " mt-1"}
          />
        </div>
      </div>
      <h3 className="text-base font-semibold text-brand">
        4. Resultado estimado
      </h3>
      {year === 2026 && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-slate-800">
          <strong>2026 é um ano de teste.</strong> A legislação prevê dispensa
          de recolhimento de IBS/CBS para contribuintes que cumprirem as
          obrigações acessórias exigidas. Os números abaixo mostram apenas uma
          conta teórica; não são um valor efetivamente devido.
        </p>
      )}
      {year !== 2026 && (
        <p className="text-sm leading-relaxed text-muted">
          Em 2027 e 2028, PIS/Cofins deixam de integrar a apuração corrente,
          conforme a transição legal, enquanto ICMS/ISS continuam em vigor. Esta
          demonstração não calcula nem soma esses outros tributos.
        </p>
      )}
      {!result ? (
        <p role="status" className="rounded-xl bg-paper p-4 text-sm text-brand">
          {missingCbs
            ? "Informe uma alíquota hipotética de CBS para exibir o cálculo de 2027 ou 2028."
            : "Revise a base, os créditos e a alíquota informados."}
        </p>
      ) : (
        <div aria-live="polite" className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-soft p-4">
              <p className="text-xs font-medium text-brand">
                IBS: débito − créditos
              </p>
              <p className="mt-1 font-semibold text-brand">
                {money(result.ibsDebit)} − {money(Number(ibsCredit))}
              </p>
              <p className="mt-2 text-lg font-semibold text-brand">
                Saldo positivo: {money(result.ibsDue)}
              </p>
            </div>
            <div className="rounded-xl bg-soft p-4">
              <p className="text-xs font-medium text-brand">
                CBS: débito − créditos
              </p>
              <p className="mt-1 font-semibold text-brand">
                {money(result.cbsDebit)} − {money(Number(cbsCredit))}
              </p>
              <p className="mt-2 text-lg font-semibold text-brand">
                Saldo positivo: {money(result.cbsDue)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-brand">
              IBS + CBS — saldo aritmético ilustrativo
            </p>
            <p className="mt-1 text-2xl font-bold text-brand">
              {money(result.totalPositive)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Não é imposto total da empresa nem valor de guia. Não considera
              saldos a recuperar, regimes diferenciados, benefícios, ajustes,
              devoluções, outros tributos ou a validação dos créditos.
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Source url="https://www2.camara.leg.br/legin/fed/leicom/2025/leicomplementar-214-16-janeiro-2025-796905-normaatualizada-pl.html">
          LC 214/2025 — arts. 41, 43, 45, 47 e transição
        </Source>
        <Source url="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/entenda/entenda-a-reforma-tributaria-do-consumo">
          Receita Federal — etapas da transição
        </Source>
      </div>
    </section>
  );
}
