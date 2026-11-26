import { useId, useState } from "react";
import { FieldInfo } from "../components/FieldInfo";
import { useParams } from "react-router-dom";
import {
  Action,
  PageIntro,
  SectionTitle,
  Source,
  card,
  field,
} from "../components/ui";
import { CurrencyInput } from "../components/CurrencyInput";
import {
  annexTables,
  ceilings,
  taxSources,
  type Annex,
} from "../data/taxTables";
import { das, incomeTax, presumed } from "../lib/taxes";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) + "%";
function MoneyField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  const id = useId();
  return (
    <div className="block min-w-0 text-sm font-medium text-brand">
      <div className="flex min-w-0 items-center gap-1">
        <label htmlFor={id}>{label}</label>
        {help && <FieldInfo label={label} text={help} />}
      </div>
      <CurrencyInput
        id={id}
        value={value}
        onValueChange={onChange}
        className={field + " mt-1"}
      />
    </div>
  );
}
function Results({ items }: { items: [string, string][] }) {
  return (
    <div
      aria-live="polite"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-xl bg-soft p-4">
          <p className="text-xs font-medium text-brand">{label}</p>
          <p className="mt-2 break-words text-xl font-semibold text-brand">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
function DasCalculator({ initial }: { initial: Annex }) {
  const [selected, setSelected] = useState<Annex | "factor">(initial);
  const [rbt, setRbt] = useState("300000");
  const [month, setMonth] = useState("25000");
  const [payroll, setPayroll] = useState("84000");
  const [external, setExternal] = useState(false);
  const ratio =
    Number(rbt) > 0 && payroll !== "" ? Number(payroll) / Number(rbt) : null;
  const annex: Annex =
    selected === "factor"
      ? ratio !== null && ratio >= 0.28
        ? "III"
        : "V"
      : selected;
  const result =
    rbt !== "" && month !== "" && (selected !== "factor" || ratio !== null)
      ? das(annex, Number(rbt), Number(month))
      : null;
  const permitted = result && (result.index !== 5 || external);
  return (
    <div className="space-y-6">
      <section className={card}>
        <SectionTitle title="Calcular DAS mensal — regras de 2026">
          Empresa com pelo menos 13 meses de atividade, receita exclusivamente
          no mercado interno, uma atividade e tributação normal sem segregações
          especiais. Informe a receita dos 12 meses anteriores ao mês de
          apuração.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-brand">
            Anexo ou atividade
            <select
              aria-label="Anexo ou atividade"
              className={field + " mt-1"}
              value={selected}
              onChange={(e) => setSelected(e.target.value as Annex | "factor")}
            >
              {(Object.keys(annexTables) as Annex[]).map((a) => (
                <option key={a} value={a}>
                  Anexo {a} — {annexTables[a].name}
                </option>
              ))}
              <option value="factor">
                Atividade sujeita ao fator R (III ou V)
              </option>
            </select>
          </label>
          <MoneyField
            label="Receita dos últimos 12 meses (RBT12)"
            value={rbt}
            onChange={setRbt}
          />
          <MoneyField
            label="Receita tributável do mês"
            value={month}
            onChange={setMonth}
          />
          {selected === "factor" && (
            <MoneyField
              label="Folha e encargos elegíveis dos últimos 12 meses (FS12)"
              value={payroll}
              onChange={setPayroll}
            />
          )}
        </div>
        {selected === "factor" && (
          <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
            Fator R:{" "}
            {ratio === null
              ? "informe os valores"
              : pct(ratio * 100) + " → Anexo " + annex}
            . A partir de 28%, Anexo III; abaixo, Anexo V. FS12 inclui
            remunerações e encargos previstos na legislação, não qualquer
            despesa. Use apenas para atividades sujeitas ao fator R.
          </p>
        )}
        {annex === "IV" && (
          <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-slate-800">
            A contribuição previdenciária patronal (CPP) é recolhida fora do DAS
            do Anexo IV; não está incluída no resultado.
          </p>
        )}
        {Number(rbt) > 3600000 && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
            <p>
              O sublimite de ICMS/ISS em 2026 é R$ 3,6 milhões. A receita
              acumulada no ano-calendário, o excesso e o momento de impedimento
              determinam a cobrança fora do DAS; RBT12 isolado não basta.
            </p>
            <label className="mt-3 flex items-start gap-2">
              <input
                type="checkbox"
                checked={external}
                onChange={(e) => setExternal(e.target.checked)}
                className="mt-1"
              />{" "}
              Confirmo que ICMS/ISS são recolhidos fora do DAS no período e que
              a empresa permanece elegível.
            </label>
            <Source url={taxSources.sublimite}>Portaria CGSN 54/2025</Source>
          </div>
        )}
        {permitted && result ? (
          <div className="mt-5 space-y-4">
            <Results
              items={[
                [
                  "Anexo e faixa",
                  annex + " · " + (result.index + 1) + "ª faixa",
                ],
                ["Alíquota nominal", pct(result.nominal)],
                ["Parcela a deduzir", money(result.deduction)],
                ["Alíquota efetiva", pct(result.effective)],
                ["DAS estimado do mês", money(result.total)],
              ]}
            />
            <p className="text-sm leading-relaxed">
              <strong>Memória de cálculo:</strong> ({money(Number(rbt))} ×{" "}
              {pct(result.nominal)} − {money(result.deduction)}) ÷{" "}
              {money(Number(rbt))} = {pct(result.effective)}. Receita mensal{" "}
              {money(Number(month))} × alíquota efetiva (sem arredondamento
              intermediário) = {money(result.total)}.
            </p>
          </div>
        ) : (
          <p role="status" className="mt-5 text-sm font-medium text-brand">
            {Number(rbt) > 4800000
              ? "RBT12 acima do teto das tabelas. Verifique elegibilidade e regras de excesso."
              : result?.index === 5
                ? "Confirme o tratamento de ICMS/ISS acima para estimar a parcela federal do DAS."
                : "Informe RBT12 positivo e valores válidos."}
          </p>
        )}
      </section>
      <section className={card}>
        <SectionTitle title={"Tabela completa — Anexo " + annex}>
          Faixas nominais e deduções da LC 123/2006, vigentes em 2026. A faixa
          encontrada fica destacada.
        </SectionTitle>
        <div
          className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-accent"
          tabIndex={0}
          role="region"
          aria-label="Tabela de faixas do Simples Nacional"
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-brand text-white">
              <tr>
                {["Faixa", "RBT12 até", "Alíquota nominal", "Dedução"].map(
                  (t) => (
                    <th key={t} scope="col" className="p-3">
                      {t}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {annexTables[annex].rows.map(([rate, deduct], i) => (
                <tr
                  key={i}
                  className={
                    "border-b border-slate-200 " +
                    (result?.index === i ? "bg-line font-semibold" : "")
                  }
                >
                  <th scope="row" className="p-3 whitespace-nowrap">
                    {i + 1}ª
                  </th>
                  <td className="p-3 whitespace-nowrap">
                    {money(ceilings[i])}
                  </td>
                  <td className="p-3">{pct(rate)}</td>
                  <td className="p-3 whitespace-nowrap">{money(deduct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Source url={taxSources.simples}>LC 123, art. 18 e anexos I–V</Source>
          <Source url={taxSources.cgsn}>Resolução CGSN 140/2018</Source>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Para as faixas 1 a 5, pressupõe ICMS/ISS dentro do DAS quando
          aplicáveis. Não contempla início de atividade, receitas com
          ST/monofásicos, exportação, retenção de ISS, múltiplos anexos,
          impedimento no ano-calendário ou opção regular de IBS/CBS. A reforma
          altera a composição do DAS a partir de 2027; esta calculadora não
          projeta essas repartições.
        </p>
      </section>
      <Action to="/simulador">Ver DAS com IBS/CBS em 2027–2028</Action>
    </div>
  );
}
function IncomeResult({ r }: { r: ReturnType<typeof incomeTax> }) {
  return (
    <>
      <div className="rounded-xl border border-line-strong bg-soft p-4">
        <p className="text-sm font-semibold text-brand">
          Total IRPJ + CSLL — estimativa trimestral
        </p>
        <p className="mt-1 text-2xl font-bold text-brand">{money(r.total)}</p>
        <p className="mt-1 text-xs text-muted">
          Somente impostos sobre o resultado, antes dos ajustes não abrangidos.
        </p>
      </div>
      <h3 className="font-semibold text-brand">
        Como esse total foi calculado
      </h3>
      <Results
        items={[
          ["Base IRPJ", money(r.ir)],
          ["Base CSLL", money(r.cs)],
          ["IRPJ de 15%", money(r.basic)],
          ["Adicional de IRPJ", money(r.additional)],
          ["CSLL de 9%", money(r.csll)],
        ]}
      />
      <p className="text-sm leading-relaxed">
        IRPJ = 15% da base tributável + 10% da parcela que exceder R$ 60.000 no
        trimestre. CSLL = 9% da base ajustada (regra geral de empresas não
        financeiras). Valores antes de retenções, compensações, incentivos e
        pagamentos antecipados.
      </p>
    </>
  );
}
export function PresumedCalculator({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const [activity, setActivity] = useState("services");
  const [revenue, setRevenue] = useState("300000");
  const [quarter, setQuarter] = useState("2");
  const [irEx, setIrEx] = useState("0"),
    [csEx, setCsEx] = useState("0");
  const [irOther, setIrOther] = useState("0"),
    [csOther, setCsOther] = useState("0");
  const [confirmed, setConfirmed] = useState(false);
  const [irRate, csRate] = activity === "commerce" ? [8, 12] : [32, 32];
  const needs =
    Number(revenue) > 1250000 || Number(irEx) > 0 || Number(csEx) > 0;
  const valid = [revenue, irEx, csEx, irOther, csOther].every((v) => v !== "");
  const r =
    valid && (!needs || confirmed)
      ? presumed(
          Number(revenue),
          irRate,
          csRate,
          Number(irEx),
          quarter === "1" ? 0 : Number(csEx),
          Number(irOther),
          Number(csOther),
        )
      : null;
  return (
    <section className={card + " space-y-5"}>
      <SectionTitle title="Lucro Presumido — IRPJ e CSLL trimestrais de 2026">
        Comece pela atividade e pelo faturamento do trimestre. Você pode
        informar outras receitas e ajustes legais sem sair desta tela. Os
        detalhes e a memória dos resultados continuam disponíveis abaixo.
      </SectionTitle>
      <h3 className="text-base font-semibold text-brand">
        1. Atividade e faturamento
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor="presumido-atividade">Tipo de atividade</label>
            <FieldInfo
              label="Tipo de atividade"
              text="Escolha a principal atividade da receita informada. Os percentuais indicados são usados para estimar a base de IRPJ e CSLL, não são as alíquotas finais dos impostos."
            />
          </div>
          <select
            id="presumido-atividade"
            aria-label="Tipo de atividade"
            className={field + " mt-1"}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="services">
              Prestação de serviços em geral (32% / 32%)
            </option>
            <option value="commerce">
              Comércio e indústria em geral (8% / 12%)
            </option>
          </select>
        </div>
        <div className="text-sm font-medium text-brand">
          <div className="flex items-center gap-1">
            <label htmlFor="presumido-trimestre">Trimestre de 2026</label>
            <FieldInfo
              label="Trimestre de 2026"
              text="Um trimestre reúne três meses: janeiro a março, abril a junho, julho a setembro ou outubro a dezembro. A simulação de IRPJ/CSLL utiliza esse período."
            />
          </div>
          <select
            id="presumido-trimestre"
            aria-label="Trimestre de 2026"
            className={field + " mt-1"}
            value={quarter}
            onChange={(e) => {
              setQuarter(e.target.value);
              setConfirmed(false);
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}º trimestre
              </option>
            ))}
          </select>
        </div>
        <MoneyField
          label="Receita bruta tributável do trimestre"
          value={revenue}
          onChange={setRevenue}
          help="Total das vendas e dos serviços tributáveis dos três meses do trimestre, antes de descontar despesas. A apuração pode exigir segregação de receitas de atividades distintas."
        />
      </div>
      <h3 className="text-base font-semibold text-brand">
        2. Receitas adicionais, se houver
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          label="Outras receitas tributáveis integralmente pelo IRPJ"
          value={irOther}
          onChange={setIrOther}
          help="Receitas que entram integralmente na base do IRPJ, em vez de receber o percentual de presunção da atividade. Se não houver, mantenha zero."
        />
        <MoneyField
          label="Outras receitas tributáveis integralmente pela CSLL"
          value={csOther}
          onChange={setCsOther}
          help="Receitas que entram integralmente na base da CSLL. Podem diferir das do IRPJ. Mantenha zero quando não houver."
        />
      </div>
      <p className="text-sm">
        Presunção normal: IRPJ {irRate}% e CSLL {csRate}%. Despesas operacionais
        não reduzem diretamente essas bases.
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <h3 className="font-semibold text-brand">
          3. Ajustes legais — LC 224/2025 — acréscimo nos percentuais de
          presunção
        </h3>
        <p className="text-sm">
          A partir de 2026, há aumento de 10% no percentual de presunção sobre a
          parcela de receita sujeita à regra (32% passa a 35,2%, por exemplo).
          Limite geral anual de R$ 5 milhões, com apuração proporcional
          trimestral, ajustes acumulados e vigência de CSLL a partir do segundo
          trimestre de 2026. Informe as parcelas já apuradas conforme o
          histórico anual. Ajustes de trimestres anteriores devem ser apurados à
          parte. Não é aumento de 10 pontos percentuais.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <MoneyField
            label="Parcela da receita sujeita à majoração de IRPJ"
            value={irEx}
            onChange={setIrEx}
            help="Informe apenas a parcela da receita do trimestre sujeita ao aumento de 10% do percentual de presunção, considerando o limite anual e o histórico de apuração. Não é aumento de 10 pontos percentuais."
          />
          {quarter !== "1" && (
            <MoneyField
              label="Parcela da receita sujeita à majoração de CSLL"
              value={csEx}
              onChange={setCsEx}
              help="Informe a parcela sujeita ao aumento do percentual de presunção para CSLL conforme o trimestre e o histórico acumulado do ano. A regra começa para CSLL no segundo trimestre de 2026."
            />
          )}
        </div>
        {needs && (
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmei as parcelas sujeitas à majoração com base no histórico do
            ano.
          </label>
        )}
        <div className="flex flex-wrap gap-3">
          <Source url={taxSources.adjustment}>LC 224/2025, art. 4º</Source>
          <Source url={taxSources.adjustmentGuidance}>
            Orientação da Receita Federal
          </Source>
        </div>
      </div>
      <h3 className="text-base font-semibold text-brand">
        4. Resultado do trimestre
      </h3>
      {r ? (
        <IncomeResult r={r} />
      ) : (
        <p role="status" className="text-sm font-medium">
          Revise os valores e confirme a majoração quando aplicável. Cada
          parcela majorada deve ser menor ou igual à receita.
        </p>
      )}
      <p className="text-sm text-slate-600">
        Não contempla percentuais especiais, atividades mistas, retenções,
        benefícios ou ajustes de trimestres anteriores. Verifique se a empresa é
        elegível ao Lucro Presumido. IBS/CBS e tributos atuais sobre consumo são
        calculados separadamente.
      </p>
      <div className="flex flex-wrap gap-4">
        <Source url={taxSources.presumido}>
          Lei 9.249/1995, arts. 3º, 15 e 20
        </Source>
        <Source url={taxSources.irpj}>Receita Federal — IRPJ</Source>
        <Source url={taxSources.csll}>Receita Federal — CSLL</Source>
      </div>
      {!embedded && (
        <Action to="/empresas?regime=lucro-presumido">
          Ver orientações em Minha empresa
        </Action>
      )}
    </section>
  );
}
export function RealCalculator({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const [ir, setIr] = useState("100000"),
    [cs, setCs] = useState("100000");
  const [revenue, setRevenue] = useState("500000");
  const r = incomeTax(Number(ir), Number(cs));
  return (
    <section className={card + " space-y-5"}>
      <SectionTitle title="Lucro Real — IRPJ e CSLL trimestrais">
        Informe as bases fiscais de IRPJ e CSLL para estimar os impostos
        trimestrais. O lucro contábil não é necessariamente o lucro tributável.
        A apuração anual por estimativas não está contemplada.
      </SectionTitle>
      <h3 className="text-base font-semibold text-brand">
        1. Dados do trimestre
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <MoneyField
          label="Receita do trimestre (para percentual ilustrativo)"
          value={revenue}
          onChange={setRevenue}
          help="Quanto a empresa faturou nos três meses. Este valor serve apenas para mostrar a proporção de IRPJ e CSLL em relação à receita: não define as bases tributáveis."
        />
        <MoneyField
          label="Base fiscal do IRPJ após ajustes"
          value={ir}
          onChange={setIr}
          help="Lucro tributável para IRPJ após os ajustes permitidos pela legislação, como adições, exclusões e compensações. Não equivale automaticamente ao lucro contábil."
        />
        <MoneyField
          label="Base fiscal da CSLL após ajustes"
          value={cs}
          onChange={setCs}
          help="Base de cálculo da CSLL após os ajustes fiscais aplicáveis. Pode ser diferente da base do IRPJ."
        />
      </div>
      <h3 className="text-base font-semibold text-brand">
        2. Resultado do trimestre
      </h3>
      {ir !== "" && cs !== "" ? (
        <>
          <IncomeResult r={r} />
          {Number(revenue) > 0 && (
            <p className="text-sm">
              IRPJ + CSLL representam {pct((r.total / Number(revenue)) * 100)}{" "}
              da receita informada, sem os demais tributos.
            </p>
          )}
        </>
      ) : (
        <p role="status" className="text-sm">
          Informe as duas bases.
        </p>
      )}
      <p className="text-sm text-slate-600">
        Prejuízo fiscal ou base negativa: informe zero se não houver base
        tributável. Não calcula o aproveitamento de prejuízos, limite de
        compensação, retenções, incentivos ou a base fiscal a partir das
        demonstrações contábeis. IBS/CBS, PIS/Cofins, ICMS, ISS e folha estão
        fora deste resultado.
      </p>
      <div className="flex flex-wrap gap-4">
        <Source url={taxSources.real}>Lei 9.430/1996</Source>
        <Source url={taxSources.irpj}>Receita Federal — IRPJ</Source>
        <Source url={taxSources.csll}>Receita Federal — CSLL</Source>
      </div>
      {!embedded && (
        <Action to="/empresas?regime=lucro-real">
          Ver orientações em Minha empresa
        </Action>
      )}
    </section>
  );
}
export function TaxCalculators() {
  const { regime, annex } = useParams();
  const active =
    regime === "presumido" || regime === "real" ? regime : "simples";
  const initial =
    annex && Object.hasOwn(annexTables, annex.toUpperCase())
      ? (annex.toUpperCase() as Annex)
      : "III";
  return (
    <div className="space-y-7">
      <PageIntro
        label="Calculadoras tributárias"
        title="Calcule os tributos da sua empresa"
      >
        Escolha o regime para uma estimativa com regras e fontes oficiais. O DAS
        e os tributos sobre renda são diferentes da simulação de IBS/CBS.
      </PageIntro>
      {active === "simples" ? (
        <DasCalculator key={initial} initial={initial} />
      ) : active === "presumido" ? (
        <PresumedCalculator />
      ) : (
        <RealCalculator />
      )}
      <section className={card}>
        <SectionTitle title="Outras ferramentas" />
        <div className="flex flex-wrap gap-3">
          <Action to="/empresas?regime=mei">MEI — DAS fixo</Action>
          <Action to="/simulador">Reforma — simulação de IBS/CBS</Action>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Estimativas educativas, não substituem PGDAS-D, ECF ou apuração fiscal
          profissional. Revisão das regras: 25/11/2026.
        </p>
      </section>
    </div>
  );
}
