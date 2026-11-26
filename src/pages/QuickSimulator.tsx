import { ReforminhaTip } from "../components/mascot/ReforminhaTip";
import { DisclosureSummary } from "../components/ui";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CurrencyInput } from "../components/CurrencyInput";
import {
  card,
  field,
  PageIntro,
  Source,
  secondary,
  primary,
} from "../components/ui";
import { annexTables, taxSources, type Annex } from "../data/taxTables";
import { transitionSource, transitionNews } from "../data/simplesTransition";
import { quickDas } from "../lib/quickDas";
import { activities } from "../data/simplesActivities";
import { RegimeTabs } from "../components/business/BusinessSections";
import { Simulator } from "./Simulator";
import {
  DasCalculator,
  PresumedCalculator,
  RealCalculator,
} from "./TaxCalculators";
import { RegularConsumptionCalculator } from "../components/business/RegularConsumptionCalculator";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) + "%";
type SimulationMode = "das" | "comparar" | "presumido" | "real";
const simulatorTabs: { id: SimulationMode; label: string }[] = [
  { id: "das", label: "Simples Nacional" },
  { id: "presumido", label: "Lucro Presumido" },
  { id: "real", label: "Lucro Real" },
];

function RegimeSectionLinks({ regime }: { regime: "presumido" | "real" }) {
  return (
    <nav
      aria-label="Ir para seção desta simulação"
      className="flex flex-wrap items-center gap-2 text-sm"
    >
      <span className="mr-1 font-medium text-muted">Ir para:</span>
      <a
        href={"#simular-" + regime + "-renda"}
        className="rounded-lg border border-line-strong px-3 py-2 font-semibold text-brand hover:bg-soft focus-visible:outline-2 focus-visible:outline-accent"
      >
        IRPJ e CSLL
      </a>
      <a
        href={"#simular-" + regime + "-consumo"}
        className="rounded-lg border border-line-strong px-3 py-2 font-semibold text-brand hover:bg-soft focus-visible:outline-2 focus-visible:outline-accent"
      >
        IBS e CBS
      </a>
    </nav>
  );
}

export function QuickSimulator() {
  const [params, setParams] = useSearchParams();
  const active: SimulationMode =
    params.get("modo") === "comparar"
      ? "comparar"
      : params.get("modo") === "presumido"
        ? "presumido"
        : params.get("modo") === "real"
          ? "real"
          : "das";
  const switchMode = (next: SimulationMode) => {
    const nextParams = new URLSearchParams(params);
    if (next === "das") nextParams.delete("modo");
    else nextParams.set("modo", next);
    setParams(nextParams, { replace: true, preventScrollReset: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 grid items-center gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
        <div>
          <PageIntro label="Simular" title="Quanto vou pagar de imposto?">
            Explore estimativas para Simples Nacional, Lucro Presumido e Lucro
            Real. Os resultados são demonstrativos e não substituem uma apuração
            fiscal.
          </PageIntro>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            No Simples, calcule o DAS ou conheça o Simples Híbrido, com IBS e
            CBS recolhidos separadamente. Nos outros dois regimes, explore
            estimativas de IRPJ e CSLL e demonstre IBS/CBS separadamente, sem
            confundi-los com o total de impostos da empresa.
          </p>
        </div>
        <img
          src="/images/simulator-tax-comparison.svg"
          alt="Ilustração de calculadora e balança representando dois cenários tributários"
          width={480}
          height={300}
          className="mx-auto hidden w-full max-w-[320px] md:block"
        />
      </div>
      <aside
        aria-label="Limitação regional da simulação"
        className="rounded-xl border border-line bg-soft px-4 py-3 text-sm leading-relaxed text-brand"
      >
        <strong>Sobre estados e municípios:</strong> este simulador não calcula
        diferenças de ICMS/ISS conforme a localidade nem aplica alíquotas
        estaduais e municipais futuras específicas do IBS. Para 2027 e 2028, a
        alíquota-padrão do IBS na transição é igual em todas as UFs, quando
        aplicável; selecionar outro estado, por si só, não altera o DAS
        estimado. A partir de 2029, a tributação poderá depender de alíquotas
        regionais e regras específicas que ainda não integram estes cálculos.{" "}
        <Link
          to="/empresas#impacto-regional"
          className="font-semibold text-accent underline underline-offset-2"
        >
          Consulte os exemplos na seção Minha empresa.
        </Link>
      </aside>
      <RegimeTabs
        items={simulatorTabs}
        selected={active === "comparar" ? "das" : active}
        onChange={switchMode}
        panelId="simulator-tab-panel"
        ariaLabel="Tipos de simulação"
        idPrefix="simulator-tab-"
        fitMobile
      />
      <section
        id="simulator-tab-panel"
        role="tabpanel"
        aria-labelledby={
          "simulator-tab-" + (active === "comparar" ? "das" : active)
        }
        className="min-w-0"
      >
        <div hidden={active !== "das" && active !== "comparar"}>
          <SimpleNationalPanel initialComparison={active === "comparar"} />
        </div>
        <div hidden={active !== "presumido"}>
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-muted">
              Veja uma estimativa de IRPJ e CSLL e uma demonstração separada de
              IBS e CBS. Os resultados têm períodos e bases diferentes e não
              representam a carga tributária total. Use o ícone de ajuda ao lado
              dos campos quando necessário.
            </p>
            <RegimeSectionLinks regime="presumido" />
            <div id="simular-presumido-renda" className="scroll-mt-24">
              <PresumedCalculator embedded />
            </div>
            <div id="simular-presumido-consumo" className="scroll-mt-24">
              <RegularConsumptionCalculator />
            </div>
          </div>
        </div>
        <div hidden={active !== "real"}>
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-muted">
              Veja uma estimativa de IRPJ e CSLL a partir das bases fiscais e
              uma demonstração separada de IBS e CBS. Os resultados não calculam
              a carga tributária total nem determinam automaticamente o lucro
              tributável. Os números iniciais de IBS/CBS são ilustrativos e
              independentes das bases de IRPJ/CSLL. Use a ajuda ao lado dos
              campos.
            </p>
            <RegimeSectionLinks regime="real" />
            <div id="simular-real-renda" className="scroll-mt-24">
              <RealCalculator embedded />
            </div>
            <div id="simular-real-consumo" className="scroll-mt-24">
              <RegularConsumptionCalculator />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SimpleNationalPanel({
  initialComparison,
}: {
  initialComparison: boolean;
}) {
  const [detail, setDetail] = useState<"das" | "hibrido">(
    initialComparison ? "hibrido" : "das",
  );
  const location = useLocation();
  const [params] = useSearchParams();
  const [detailedOpen, setDetailedOpen] = useState(
    () => location.hash === "#das-detalhado",
  );
  const requestedAnnex = params.get("anexo")?.toUpperCase();
  const initialDasAnnex: Annex =
    requestedAnnex && Object.hasOwn(annexTables, requestedAnnex)
      ? (requestedAnnex as Annex)
      : "III";
  // Links antigos que abrem ?modo=comparar selecionam a explicação correspondente.
  const selected = detail;
  return (
    <div className="space-y-5">
      <div className={card + " space-y-2"}>
        <h2 className="text-lg font-semibold text-brand">
          Simples Nacional: DAS tradicional ou Simples Híbrido?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          No modelo tradicional, as parcelas de IBS e CBS previstas para o
          Simples integram o recolhimento unificado. No{" "}
          <strong>Simples Híbrido</strong>, a empresa continua no Simples, mas
          apura e recolhe IBS e CBS pelo regime regular, separadamente do DAS,
          conforme as regras e prazos de opção. Isso não significa mudar para
          Lucro Presumido ou Lucro Real.
        </p>
        <Source url="https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/receita-federal-alerta-comeca-hoje-o-prazo-para-opcao-pelo-simples-nacional-e-para-a-escolha-do-modelo-de-recolhimento-do-ibs-e-da-cbs-em-2027">
          Receita Federal — opções de recolhimento em 2027
        </Source>
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Forma de recolhimento no Simples"
      >
        <button
          type="button"
          aria-pressed={selected === "das"}
          onClick={() => setDetail("das")}
          className={selected === "das" ? primary : secondary}
        >
          Dentro do DAS
        </button>
        <button
          type="button"
          aria-pressed={selected === "hibrido"}
          onClick={() => setDetail("hibrido")}
          className={selected === "hibrido" ? primary : secondary}
        >
          Simples Híbrido: IBS/CBS fora do DAS
        </button>
      </div>
      <div hidden={selected !== "das"} className="space-y-5">
        <QuickDasSimulator />
        <section
          id="das-detalhado"
          className="scroll-mt-24 space-y-4"
          aria-label="Calculadora detalhada do DAS em 2026"
        >
          <button
            type="button"
            aria-controls="das-detailed-panel"
            aria-expanded={detailedOpen}
            onClick={() => setDetailedOpen((open) => !open)}
            className="rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-brand hover:bg-soft"
          >
            {detailedOpen
              ? "Ocultar cálculo detalhado do DAS de 2026"
              : "Cálculo detalhado do DAS de 2026 (faixas e fator R)"}
          </button>
          {detailedOpen && (
            <div id="das-detailed-panel">
              <DasCalculator initial={initialDasAnnex} />
            </div>
          )}
        </section>
      </div>
      <div hidden={selected !== "hibrido"}>
        <Simulator embedded />
      </div>
    </div>
  );
}

function QuickDasSimulator() {
  const [params] = useSearchParams();
  const preview = useLocation().state?.quickPreview as
    { annex?: string; sales?: string; rbt?: string } | undefined;
  const initial = (params.get("anexo") ?? preview?.annex)?.toUpperCase();
  const validAmount = (v: unknown, fallback: string) =>
    typeof v === "string" &&
    (v === "" || /^\d+(\.\d{1,2})?$/.test(v)) &&
    Number(v) <= 100000000000
      ? v
      : fallback;
  const [annex, setAnnex] = useState<Annex>(
    initial && Object.hasOwn(annexTables, initial) ? (initial as Annex) : "II",
  );
  const [year, setYear] = useState<2026 | 2027 | 2028>(2027);
  const [sales, setSales] = useState(() =>
    validAmount(preview?.sales, "25000"),
  );
  const [rbt, setRbt] = useState(() => validAmount(preview?.rbt, "300000"));
  const [estimate, setEstimate] = useState(false);
  const [special, setSpecial] = useState(false);
  const revenue = estimate ? Number(sales) * 12 : Number(rbt);
  const ready = sales !== "" && (estimate || rbt !== "") && !special;
  const result = ready ? quickDas(annex, revenue, Number(sales), year) : null;
  const future = ready ? quickDas(annex, revenue, Number(sales), 2027) : null;
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">
        Informe seu faturamento para estimar o DAS do Simples Nacional,
        incluindo IBS e CBS conforme o ano selecionado.
      </p>
      <div className="grid min-w-0 gap-5 lg:grid-cols-[1.05fr_1fr] items-start">
        <section className={card + " space-y-5 min-w-0"}>
          <div>
            <h2 className="text-lg font-semibold text-brand">
              1. Qual é o tipo de negócio?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Escolha o anexo usado pela sua empresa. Uma padaria pode ter
              receitas de comércio e de fabricação, por exemplo.
            </p>
          </div>
          <div
            role="group"
            aria-label="Tipo de negócio"
            className="grid gap-2 sm:grid-cols-2"
          >
            {activities.map(([a, label, example]) => (
              <button
                key={a}
                type="button"
                aria-pressed={annex === a}
                onClick={() => setAnnex(a)}
                className={
                  "rounded-xl border p-3 text-left transition-colors " +
                  (annex === a
                    ? "border-accent bg-soft ring-1 ring-accent"
                    : "border-slate-200 hover:border-accent hover:bg-slate-50")
                }
              >
                <span className="block text-sm font-semibold text-brand">
                  {label}
                </span>
                <span className="mt-1 block text-xs text-slate-600">
                  Anexo {a} · {example}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            Não sabe se seu serviço é do Anexo III ou V?{" "}
            <Link
              className="font-semibold text-accent underline"
              to="/empresas?regime=simples-nacional#fator-r"
            >
              Entenda o fator R em Minha empresa.
            </Link>
          </p>
          <div>
            <h2 className="text-lg font-semibold text-brand">
              2. Quanto sua empresa vende?
            </h2>
            <label className="mt-3 block text-sm font-semibold text-brand">
              Faturamento do mês
              <CurrencyInput
                value={sales}
                onValueChange={setSales}
                className={field + " mt-1"}
              />
              <span className="mt-1 block text-xs font-normal text-slate-600">
                Total de vendas ou serviços deste mês, antes de descontar
                despesas.
              </span>
            </label>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input
                className="mt-1"
                type="checkbox"
                checked={estimate}
                onChange={(e) => setEstimate(e.target.checked)}
              />
              Não sei o faturamento dos últimos 12 meses. Usar o valor deste mês
              × 12 como aproximação.
            </label>
            {!estimate ? (
              <label className="mt-3 block text-sm font-semibold text-brand">
                Faturamento dos últimos 12 meses
                <CurrencyInput
                  value={rbt}
                  onValueChange={setRbt}
                  className={field + " mt-1"}
                />
                <span className="mt-1 block text-xs font-normal text-slate-600">
                  Some os 12 meses anteriores ao mês que você quer simular.
                </span>
              </label>
            ) : (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-slate-800">
                Receita anual aproximada: <strong>{money(revenue)}</strong>. Se
                as vendas variam, a estimativa pode ficar incorreta.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand">
              3. Qual ano você quer simular?
            </h2>
            <div
              role="group"
              aria-label="Ano da simulação"
              className="mt-3 grid grid-cols-3 gap-2"
            >
              {([2026, 2027, 2028] as const).map((y) => (
                <button
                  key={y}
                  type="button"
                  aria-pressed={year === y}
                  onClick={() => setYear(y)}
                  className={
                    "rounded-lg border py-3 text-sm font-semibold " +
                    (year === y
                      ? "border-brand bg-brand text-white"
                      : "border-slate-300 text-brand hover:bg-soft")
                  }
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              className="mt-1"
              type="checkbox"
              checked={special}
              onChange={(e) => setSpecial(e.target.checked)}
            />
            Minha empresa tem menos de 13 meses, receitas em anexos diferentes,
            benefícios fiscais, ICMS/ISS fora do DAS ou tributação especial.
          </label>
          <a href="#resultado-rapido" className={primary + " w-full lg:hidden"}>
            Ver minha estimativa
          </a>
        </section>
        <section
          className={card + " min-w-0 scroll-mt-5"}
          id="resultado-rapido"
          tabIndex={-1}
          aria-label="Resultado rápido"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-accent">
            Sua estimativa mensal · {year}
          </p>
          {result ? (
            <>
              <p className="mt-4 text-sm text-slate-600">
                Total estimado do DAS
              </p>
              <p className="mt-1 break-words text-4xl font-semibold tracking-tight text-brand">
                {money(result.total)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Anexo {annex} · {result.index + 1}ª faixa ·{" "}
                {pct(result.effective)} do faturamento
              </p>
              {year !== 2026 ? (
                <>
                  <h2 className="mt-6 text-base font-semibold text-brand">
                    O que já está incluído nesse valor?
                  </h2>
                  <div className="mt-3 space-y-3">
                    {[
                      [
                        "CBS — Contribuição sobre Bens e Serviços",
                        result.cbs,
                        "bg-soft",
                      ],
                      [
                        "IBS — Imposto sobre Bens e Serviços",
                        result.ibs,
                        "bg-soft",
                      ],
                      [
                        "Demais tributos do DAS",
                        result.remaining,
                        "bg-slate-100",
                      ],
                    ].map(([label, value, bg]) => (
                      <div
                        key={String(label)}
                        className={
                          String(bg) +
                          " flex flex-wrap items-center justify-between gap-2 rounded-lg p-3"
                        }
                      >
                        <span className="text-sm">{label}</span>
                        <strong className="text-brand">
                          {money(Number(value))}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <ReforminhaTip>
                      <strong>
                        Você não precisa somar IBS e CBS novamente.
                      </strong>{" "}
                      Eles já fazem parte do DAS estimado, se você continuar
                      recolhendo pelo Simples.
                    </ReforminhaTip>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Com o mesmo faturamento e nas mesmas condições, o DAS de
                    2026 seria de {money(result.total)}. Nas cinco primeiras
                    faixas, a inclusão desses tributos em 2027–2028 muda a
                    composição do DAS, não o total das alíquotas da tabela
                    geral.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-5 rounded-lg bg-slate-100 p-4 text-sm">
                    Em 2026, IBS e CBS ainda não integram o DAS. A inclusão
                    começa em 2027.
                  </p>
                  {future && (
                    <p className="mt-3 text-sm">
                      Com o mesmo faturamento, em 2027 o DAS seria{" "}
                      {money(future.total)}, incluindo CBS de{" "}
                      {money(future.cbs)} e IBS de {money(future.ibs)}.
                    </p>
                  )}
                </>
              )}
              {annex === "IV" && (
                <p className="mt-3 text-sm font-medium text-slate-700">
                  A contribuição previdenciária patronal é paga separadamente no
                  Anexo IV.
                </p>
              )}
              <details className="mt-5 border-t border-slate-200 pt-4">
                <DisclosureSummary>
                  Como chegamos a esse valor?
                </DisclosureSummary>
                <div className="mt-3 space-y-2 text-sm">
                  <p>
                    Alíquota efetiva: ({money(revenue)} × {pct(result.nominal)}{" "}
                    − {money(result.deduction)}) ÷ {money(revenue)} ={" "}
                    {pct(result.effective)}.
                  </p>
                  <p>
                    DAS: {money(Number(sales))} × alíquota efetiva ={" "}
                    {money(result.total)}.
                  </p>
                  {year !== 2026 && (
                    <>
                      <p>
                        {result.capped
                          ? "Ajuste do limite de ISS de 5% conforme anexo."
                          : "Percentuais oficiais de repartição do DAS: CBS " +
                            pct(result.cbsShare) +
                            " e IBS " +
                            pct(result.ibsShare) +
                            "."}
                      </p>
                      <p>
                        CBS: {money(Number(sales))} × {pct(result.cbsRate)} ={" "}
                        {money(result.cbs)}. IBS: {money(Number(sales))} ×{" "}
                        {pct(result.ibsRate)} = {money(result.ibs)}.
                      </p>
                      <Source url={transitionSource}>
                        Resolução CGSN 196/2026, anexos I–V
                      </Source>
                    </>
                  )}
                  <p>
                    <Source url={taxSources.simples}>
                      LC 123/2006, art. 18
                    </Source>
                  </p>
                </div>
              </details>
            </>
          ) : (
            <div
              role="status"
              className="mt-4 rounded-xl bg-amber-50 p-4 text-sm"
            >
              {special
                ? "Seu caso requer uma apuração específica. Consulte seu contador ou a calculadora detalhada."
                : revenue > 3600000
                  ? "Acima de R$ 3,6 milhões, o cálculo depende do sublimite e de outras informações. A simulação rápida não se aplica."
                  : "Informe o faturamento do mês e um total positivo dos últimos 12 meses."}
            </div>
          )}
          <p className="mt-5 text-xs leading-relaxed text-slate-600">
            Estimativa para empresa estabelecida há pelo menos 13 meses, uma
            atividade, receitas nacionais normalmente tributadas, sem
            impedimento de ICMS/ISS e que permaneça recolhendo IBS/CBS no DAS.
            Confirme os valores com o contador. Não é uma guia de pagamento.
          </p>
        </section>
      </div>
      <section className={card}>
        <h2 className="text-lg font-semibold text-brand">
          Qual regime se aplica?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Esta simulação rápida calcula o DAS do Simples Nacional. Para MEI,
          Lucro Presumido ou Lucro Real, consulte as orientações na página Minha
          empresa.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/empresas" className={secondary}>
            Conhecer os regimes em Minha empresa
          </Link>
        </div>
        <div className="mt-4">
          <Source url={transitionNews}>
            Receita Federal — atualização de 24/11/2026
          </Source>
        </div>
      </section>
    </div>
  );
}
