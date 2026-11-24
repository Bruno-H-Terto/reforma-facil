import { useState } from "react";
import { CurrencyInput } from "../components/CurrencyInput";
import {
  card,
  field,
  PageIntro,
  SectionTitle,
  Source,
  primary,
} from "../components/ui";
import {
  compare,
  defaults,
  effectiveRate,
  type Scenario,
} from "../lib/scenarios";
import { sources } from "../data/content";
const law123 = "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm";
const calculator =
  "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/julho/receita-federal-libera-ferramenta-oficial-de-calculo-da-reforma-tributaria-sobre-o-consumo/";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const percent = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) + "%";
const fields: {
  key: keyof Scenario;
  label: string;
  help: string;
  max?: number;
}[] = [
  {
    key: "revenue",
    label: "Receita mensal para o DAS (R$)",
    help: "Receita tributável simplificada para os dois cenários.",
  },
  {
    key: "operationBase",
    label: "Base de operações IBS/CBS (R$)",
    help: "Valor das operações sem o próprio IBS/CBS; pode diferir da receita do DAS.",
  },
  {
    key: "dasInside",
    label: "DAS total com IBS/CBS (%)",
    help: "Alíquota efetiva hipotética do DAS, incluindo os novos tributos.",
    max: 100,
  },
  {
    key: "dasOutside",
    label: "DAS sem IBS/CBS (%)",
    help: "Alíquota efetiva hipotética dos demais tributos, após retirar as parcelas de IBS/CBS.",
    max: 100,
  },
  {
    key: "ibsRate",
    label: "Alíquota IBS (%)",
    help: "Hipótese editável, não alíquota oficial.",
    max: 100,
  },
  {
    key: "cbsRate",
    label: "Alíquota CBS (%)",
    help: "Hipótese editável, não alíquota oficial.",
    max: 100,
  },
  {
    key: "ibsCredit",
    label: "Créditos de IBS (R$)",
    help: "Informe apenas créditos elegíveis de IBS.",
  },
  {
    key: "cbsCredit",
    label: "Créditos de CBS (R$)",
    help: "Informe apenas créditos elegíveis de CBS.",
  },
];
const asStrings = (s: Scenario) =>
  Object.fromEntries(
    Object.entries(s).map(([k, v]) => [k, String(v)]),
  ) as Record<keyof Scenario, string>;
const presets = [
  {
    name: "Exemplo inicial",
    data: defaults,
    text: "Receita e base de R$ 50 mil, créditos ilustrativos.",
  },
  {
    name: "Poucos créditos",
    data: { ...defaults, ibsCredit: 200, cbsCredit: 400 },
    text: "Teste uma operação com menor volume de créditos.",
  },
  {
    name: "Mais créditos",
    data: { ...defaults, ibsCredit: 2200, cbsCredit: 4500 },
    text: "Teste maior volume de créditos elegíveis.",
  },
];
function RateHelper() {
  const [rbt, setRbt] = useState("600000");
  const [nominal, setNominal] = useState("10");
  const [deduction, setDeduction] = useState("12000");
  const valid =
    [rbt, nominal, deduction].every(
      (v) => v !== "" && Number.isFinite(Number(v)) && Number(v) >= 0,
    ) && Number(nominal) <= 100;
  const rate = valid
    ? effectiveRate(Number(rbt), Number(nominal), Number(deduction))
    : null;
  return (
    <details className={card}>
      <summary className="cursor-pointer font-semibold text-brand">
        Calculadora auxiliar: alíquota efetiva do DAS
      </summary>
      <p className="my-3 text-sm leading-relaxed text-slate-600">
        Exemplo didático da fórmula legal. Consulte o anexo, a faixa, o período
        e o percentual de repartição aplicáveis. Os parâmetros abaixo são
        fictícios e não preenchem automaticamente a comparação.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "RBT12 (R$)", v: rbt, set: setRbt, max: 1e11 },
          {
            label: "Alíquota nominal (%)",
            v: nominal,
            set: setNominal,
            max: 100,
          },
          {
            label: "Parcela a deduzir (R$)",
            v: deduction,
            set: setDeduction,
            max: 1e11,
          },
        ].map((f) => (
          <label key={f.label} className="min-w-0 text-sm font-medium">
            {f.label}
            {f.max === 100 ? (
              <input
                type="number"
                min="0"
                max={f.max}
                step="0.01"
                className={field + " mt-2"}
                value={f.v}
                onChange={(e) => f.set(e.target.value)}
              />
            ) : (
              <CurrencyInput
                value={f.v}
                onValueChange={f.set}
                className={field + " mt-2"}
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-paper p-4 text-sm" aria-live="polite">
        <p>Fórmula: (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12</p>
        <p className="mt-2 font-semibold text-brand">
          {rate === null
            ? "Revise os parâmetros: RBT12 deve ser maior que zero e a dedução não pode superar o produto."
            : "Alíquota efetiva: " + percent(rate)}
        </p>
      </div>
      <div className="mt-4">
        <Source url={law123}>LC 123/2006, art. 18, §§ 1º-A e 3º</Source>
      </div>
    </details>
  );
}
export function Simulator() {
  const [values, setValues] = useState(asStrings(defaults));
  const [result, setResult] = useState(defaults);
  const [dirty, setDirty] = useState(false);
  const c = compare(result);
  const rows = [
    {
      label: "DAS com IBS/CBS",
      formula: `${money(result.revenue)} × ${percent(result.dasInside)}`,
      value: c.inside,
      law: "LC 123/2006, art. 18; taxa informada",
      url: law123,
    },
    {
      label: "DAS sem IBS/CBS",
      formula: `${money(result.revenue)} × ${percent(result.dasOutside)}`,
      value: c.remainingDas,
      law: "LC 214/2025, art. 41; taxa informada",
      url: sources.law,
    },
    ...(
      [
        ["IBS", c.ibs, result.ibsRate],
        ["CBS", c.cbs, result.cbsRate],
      ] as const
    ).flatMap(([name, tax, rate]) => [
      {
        label: name + " · débito",
        formula: `${money(result.operationBase)} × ${percent(rate)}`,
        value: tax.debit,
        law: "LC 214/2025, arts. 12 e 14; taxa hipotética",
        url: sources.law,
      },
      {
        label: name + " · saldo a pagar",
        formula: `máx. (0, ${money(tax.debit)} − ${money(tax.credit)})`,
        value: tax.due,
        law: "LC 214/2025, arts. 45 e 47; créditos elegíveis informados",
        url: sources.law,
      },
    ]),
    {
      label: "Total no regime regular + DAS",
      formula: `${money(c.remainingDas)} + ${money(c.ibs.due)} + ${money(c.cbs.due)}`,
      value: c.outside,
      law: "Soma didática · metodologia do protótipo",
      url: "",
    },
    {
      label: "Diferença entre cenários",
      formula: `${money(c.outside)} − ${money(c.inside)}`,
      value: c.difference,
      law: "Comparação aritmética · metodologia do protótipo",
      url: "",
    },
  ];
  const highest = Math.max(c.inside, c.outside, 1);
  return (
    <div className="space-y-6">
      <PageIntro
        label="Planejamento · Simples Nacional"
        title="Compare dois cenários"
      >
        Explore hipóteses de recolhimento dentro do DAS ou pelo regime regular
        de IBS e CBS. Os valores são educativos e não representam uma previsão
        fiscal.
      </PageIntro>
      <aside className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
        <strong>Simulação educativa, não apuração oficial.</strong> Não aplica
        automaticamente regras por ano, atividade, anexos, sublimites, reduções,
        regimes especiais, créditos do cliente, preço ou fluxo de caixa. Os
        parâmetros iniciais são fictícios. A opção pelo regime regular tem
        regras e prazos próprios.{" "}
        <Source url={sources.simples}>Orientação da Receita Federal</Source>
      </aside>
      <section>
        <SectionTitle title="Experimente um exemplo">
          Escolha um cenário fictício e personalize os valores.
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setValues(asStrings(p.data));
                setResult(p.data);
                setDirty(false);
              }}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-accent hover:bg-emerald-50"
            >
              <span className="block font-semibold text-brand">{p.name}</span>
              <span className="mt-1 block text-xs text-slate-600">
                {p.text}
              </span>
            </button>
          ))}
        </div>
      </section>
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-2">
        <form
          className={card + " min-w-0 space-y-4"}
          onSubmit={(e) => {
            e.preventDefault();
            setResult(
              Object.fromEntries(
                Object.entries(values).map(([k, v]) => [k, Number(v)]),
              ) as Scenario,
            );
            setDirty(false);
          }}
        >
          <SectionTitle title="Informe suas hipóteses">
            Use valores de um mesmo período e confirme os dados com seu
            contador.
          </SectionTitle>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className="block min-w-0 text-sm font-medium">
                {f.label}
                {f.max === 100 ? (
                  <input
                    type="number"
                    required
                    min="0"
                    max={f.max ?? 100000000000}
                    step="0.01"
                    value={values[f.key]}
                    onChange={(e) => {
                      setValues({ ...values, [f.key]: e.target.value });
                      setDirty(true);
                    }}
                    className={field + " mt-2"}
                    aria-describedby={f.key + "-help"}
                  />
                ) : (
                  <CurrencyInput
                    required
                    value={values[f.key]}
                    onValueChange={(value) => {
                      setValues((previous) => ({
                        ...previous,
                        [f.key]: value,
                      }));
                      setDirty(true);
                    }}
                    className={field + " mt-2"}
                    aria-describedby={f.key + "-help"}
                  />
                )}
                <span
                  id={f.key + "-help"}
                  className="mt-1 block text-xs font-normal text-slate-600"
                >
                  {f.help}
                </span>
              </label>
            ))}
          </div>
          <button type="submit" className={primary + " w-full"}>
            Calcular cenários
          </button>
        </form>
        <section
          className={card + " min-w-0"}
          aria-live="polite"
          aria-label="Resultado estimado"
        >
          <SectionTitle title="Resultado estimado">
            {dirty
              ? "Valores alterados. Calcule novamente para atualizar o resultado."
              : "Comparação mensal das hipóteses informadas."}
          </SectionTitle>
          <div className="space-y-5">
            {[
              ["Dentro do DAS", c.inside, "bg-brand"],
              ["Regime regular + DAS", c.outside, "bg-accent"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{label}</span>
                  <strong className="break-all text-xl text-brand">
                    {money(Number(value))}
                  </strong>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <progress
                    aria-label={String(label)}
                    value={Number(value)}
                    max={highest}
                    className={`block h-full w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:rounded-full ${color === "bg-brand" ? "[&::-webkit-progress-value]:bg-brand [&::-moz-progress-bar]:bg-brand" : "[&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-paper p-4">
            <p className="text-sm font-semibold">Diferença (regular − DAS)</p>
            <p className="mt-1 break-all text-2xl font-semibold text-brand">
              {money(c.difference)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Positiva: maior desembolso na hipótese regular. Negativa: menor
              desembolso. Não determina a melhor opção.
            </p>
          </div>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["IBS a pagar", c.ibs.due],
              ["CBS a pagar", c.cbs.due],
              ["Excedente de IBS", c.ibs.excess],
              ["Excedente de CBS", c.cbs.excess],
            ].map(([label, v]) => (
              <div
                className="min-w-0 rounded-lg border border-slate-200 p-3"
                key={label}
              >
                <dt className="text-xs text-slate-600">{label}</dt>
                <dd className="mt-1 break-all font-semibold">
                  {money(Number(v))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-600">
            Créditos não se compensam entre IBS e CBS. Excedentes são mostrados
            separadamente, sem estimar ressarcimento ou transporte de saldo.
          </p>
        </section>
      </div>
      <section className={card + " min-w-0"}>
        <SectionTitle title="Memória de cálculo">
          Veja os valores utilizados, a fórmula e a origem de cada etapa.
          Arredondamento didático a centavos por etapa.
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <article
              key={row.label}
              className="min-w-0 rounded-xl border border-slate-200 p-4"
            >
              <h3 className="font-semibold text-brand">{row.label}</h3>
              <p className="my-2 break-words text-sm text-slate-600">
                {row.formula}
              </p>
              <p className="mb-3 break-all text-lg font-semibold">
                {money(row.value)}
              </p>
              {row.url ? (
                <Source url={row.url}>{row.law}</Source>
              ) : (
                <p className="text-xs text-slate-600">{row.law}</p>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className={card}>
        <SectionTitle title="E se os créditos mudarem?">
          Teste de sensibilidade: redução ou aumento de 20% nos créditos
          informados, mantendo todo o restante fixo. Não é previsão de
          alíquotas.
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0.8, 1, 1.2].map((f) => {
            const scenario = compare({
              ...result,
              ibsCredit: result.ibsCredit * f,
              cbsCredit: result.cbsCredit * f,
            });
            return (
              <div key={f} className="rounded-xl bg-paper p-4">
                <p className="text-xs font-medium text-slate-600">
                  {f === 1
                    ? "Créditos informados"
                    : f < 1
                      ? "Créditos −20%"
                      : "Créditos +20%"}
                </p>
                <p className="mt-1 text-sm">Regular + DAS</p>
                <p className="mt-1 break-all text-lg font-semibold text-brand">
                  {money(scenario.outside)}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Método: multiplicar cada crédito por 0,8 / 1 / 1,2 e repetir a mesma
          memória de cálculo. Percentuais escolhidos exclusivamente para testar
          sensibilidade.
        </p>
      </section>
      <RateHelper />
      <section className={card}>
        <SectionTitle title="Confira as fontes originais">
          Para operações reais, utilize as ferramentas oficiais e consulte um
          profissional.
        </SectionTitle>
        <div className="flex flex-col items-start gap-3">
          <Source url={sources.law}>LC 214/2025 — texto compilado</Source>
          <Source url={sources.law227}>LC 227/2026 — alterações legais</Source>
          <Source url={law123}>LC 123/2006 — Simples Nacional</Source>
          <Source url={sources.simples}>
            Receita Federal — opção pelo regime regular
          </Source>
          <Source url={calculator}>
            Calculadora oficial de Tributos da Receita Federal
          </Source>
        </div>
      </section>
    </div>
  );
}
