import { serviceCases } from "../data/serviceCases";
import {
  cbsReference,
  cbsReferenceNote,
  cbsReferenceSource,
} from "../data/rates";
import { CurrencyInput } from "../components/CurrencyInput";
import { compare } from "../lib/scenarios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { BookOpen01, Coins01, AlertTriangle, Link01 } from "@untitledui/icons";
import {
  BusinessPanelIntro,
  InfoColumns,
  RegimeTabs,
  SummaryPanel,
} from "../components/business/BusinessSections";
import { ReforminhaTip } from "../components/mascot/ReforminhaTip";
import {
  Action,
  PageIntro,
  SectionTitle,
  Source,
  card,
  field,
} from "../components/ui";
import {
  regimes,
  annexes,
  profiles,
  states,
  cases,
  legal,
  type Entry,
} from "../data/business";
import { sources } from "../data/content";
import { meiSources, limits, das2026 } from "../data/mei";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
function Cards({ entries, base }: { entries: Entry[]; base: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <Link
          key={e.id}
          to={base + "/" + e.id}
          className={
            card +
            " block transition hover:border-accent hover:shadow-md active:bg-soft"
          }
        >
          <h3 className="font-semibold text-brand">{e.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {e.subtitle}
          </p>
          <p className="mt-4 text-sm font-semibold text-accent">
            Entender mudanças →
          </p>
        </Link>
      ))}
    </div>
  );
}
type BusinessTab =
  "mei" | "simples-nacional" | "lucro-presumido" | "lucro-real";
const businessTabs: { id: BusinessTab; label: string }[] = [
  { id: "mei", label: "MEI" },
  { id: "simples-nacional", label: "Simples Nacional" },
  { id: "lucro-presumido", label: "Lucro Presumido" },
  { id: "lucro-real", label: "Lucro Real" },
];
const isBusinessTab = (value: string | null): value is BusinessTab =>
  businessTabs.some((tab) => tab.id === value);

function BusinessText({ entry }: { entry: Entry }) {
  return (
    <div className="space-y-9">
      <section aria-labelledby="business-changes-title">
        <h3
          id="business-changes-title"
          className="text-xl font-semibold text-brand"
        >
          O que muda com a reforma?
        </h3>
        <p className="mt-3 leading-relaxed text-ink">{entry.after}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <strong className="text-brand">Como funciona hoje:</strong>{" "}
          {entry.before}
        </p>
      </section>
      <section className="border-t border-line pt-6">
        <h3 className="text-lg font-semibold text-brand">Na prática</h3>
        <p className="mt-3 leading-relaxed">{entry.example}</p>
      </section>
      <section className="border-t border-line pt-6">
        <h3 className="text-lg font-semibold text-brand">
          O que merece atenção
        </h3>
        <p className="mt-3 leading-relaxed text-muted">{entry.impact}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {entry.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>
      <div
        className="flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-5"
        aria-label="Referências oficiais"
      >
        {entry.refs.map(([label, url]) => (
          <Source key={url + label} url={url}>
            {label}
          </Source>
        ))}
      </div>
    </div>
  );
}

export function BusinessHome() {
  const [params, setParams] = useSearchParams();
  const regimeParam = params.get("regime");
  const [annexId, setAnnexId] = useState("anexo-i");
  const active: BusinessTab = isBusinessTab(regimeParam) ? regimeParam : "mei";
  const selected = regimes.find((entry) => entry.id === active);
  const annex = annexes.find((entry) => entry.id === annexId) ?? annexes[0];

  const changeRegime = (next: BusinessTab) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("regime", next);
    nextParams.delete("assunto");
    setParams(nextParams, { replace: true, preventScrollReset: true });
  };
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-4 grid items-center gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
        <PageIntro
          label="Minha empresa"
          title="Entenda o impacto da reforma no seu negócio"
        >
          Veja o que muda no seu regime tributário, como ficam os impostos e
          quais são as obrigações e os principais pontos de atenção.
        </PageIntro>
        <img
          src="/images/business-tax-guide.svg"
          alt="Ilustração de uma loja e uma lista de orientações tributárias"
          width={480}
          height={300}
          className="mx-auto hidden w-full max-w-[320px] md:block"
        />
      </div>

      <RegimeTabs
        items={businessTabs}
        selected={active}
        onChange={changeRegime}
        panelId="business-tab-panel"
      />

      <section
        role="tabpanel"
        id="business-tab-panel"
        aria-labelledby={"business-tab-" + active}
        className="min-w-0"
      >
        {active === "mei" ? (
          <div className="space-y-7 pt-6">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
              <BusinessPanelIntro
                title="MEI"
                subtitle="Microempreendedor Individual"
              >
                O MEI continua com um modelo simplificado de recolhimento, por
                meio do DAS mensal. A reforma preserva o tratamento próprio do
                SIMEI, embora novas exigências de documentos fiscais possam
                afetar a rotina do negócio.
              </BusinessPanelIntro>
              <SummaryPanel
                items={[
                  "Recolhimento simplificado pelo SIMEI",
                  "Pagamento mensal por meio do DAS",
                  "O valor depende da categoria de atividade",
                  "Atenção às obrigações de emissão de documentos fiscais",
                ]}
              />
            </div>

            <InfoColumns
              sections={[
                {
                  title: "O que muda com a reforma?",
                  icon: BookOpen01,
                  content:
                    "Segundo a Receita Federal, as vendas do MEI não sofrem incidência de IBS e CBS. É importante acompanhar as orientações sobre emissão de documentos fiscais.",
                },
                {
                  title: "Como funciona o DAS?",
                  icon: Coins01,
                  content:
                    "O pagamento permanece mensal e reúne contribuição previdenciária e, conforme a atividade, ICMS ou ISS. Não é calculado pelas alíquotas dos Anexos I a V.",
                },
                {
                  title: "O que conferir no negócio?",
                  icon: AlertTriangle,
                  content: (
                    <ul className="list-disc space-y-2 pl-5 marker:text-accent">
                      <li>Atividade permitida no MEI</li>
                      <li>Faturamento dentro do limite aplicável</li>
                      <li>Obrigatoriedade de emitir notas fiscais</li>
                      <li>Categoria correta no recolhimento do DAS</li>
                    </ul>
                  ),
                },
              ]}
            />

            <section
              aria-labelledby="mei-limites-das"
              className={card + " space-y-4"}
            >
              <h3
                id="mei-limites-das"
                className="text-lg font-semibold text-brand"
              >
                Limite de faturamento e DAS do MEI
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                O limite de faturamento é anual, não mensal. Para empresas
                abertas durante o ano, aplica-se o limite proporcional aos meses
                de atividade. Os tetos futuros previstos em lei dependem das
                condições indicadas na legislação.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {limits.map(({ year, annual }) => (
                  <div key={year} className="rounded-lg bg-soft p-3">
                    <p className="text-xs font-semibold text-accent">
                      {year} · limite geral anual
                    </p>
                    <p className="mt-1 text-lg font-semibold text-brand">
                      {money(annual)}
                    </p>
                    {year > 2026 && (
                      <p className="mt-1 text-xs text-muted">
                        Previsto em lei, sujeito às condições legais
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-brand">
                Valores mensais de DAS em 2026 para o MEI comum:
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["Comércio ou indústria", das2026.commerce],
                    ["Serviços", das2026.services],
                    ["Comércio e serviços", das2026.mixed],
                  ] as const
                ).map(([label, amount]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-line p-3"
                  >
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-1 font-semibold text-brand">
                      {money(amount)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted">
                O DAS varia com o salário mínimo e a atividade. Estes valores
                não incluem encargos por atraso nem se aplicam ao MEI
                Caminhoneiro. Enquadramento exige observar ocupação, empregados
                e demais requisitos.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3">
                <Source url={meiSources.ceiling}>
                  Ministério do Empreendedorismo — limites
                </Source>
                <Source url={meiSources.das}>
                  Portal do Simples Nacional — DAS
                </Source>
              </div>
            </section>

            <section
              aria-labelledby="mei-remissao-heading"
              className={card + " space-y-4"}
            >
              <div>
                <h3
                  id="mei-remissao-heading"
                  className="text-lg font-semibold text-brand"
                >
                  Perdão de dívidas do MEI: quem tem direito?
                </h3>
                <p className="mt-2 leading-relaxed text-ink">
                  A Lei Complementar nº 238/2026 prevê o perdão da parte do INSS
                  incluída no DAS-MEI com vencimento até 13 de outubro de 2026,
                  incluindo juros, multas e encargos. Em geral, são abrangidas
                  competências até agosto de 2026.
                </p>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                <li>
                  O cancelamento será processado automaticamente a partir de 1º
                  de janeiro de 2027, inclusive para dívidas parceladas. Não é
                  necessário fazer um pedido, salvo situações judiciais
                  específicas.
                </li>
                <li>
                  O perdão não inclui ICMS ou ISS do DAS nem devolve valores já
                  pagos. Dívidas não abrangidas continuam devidas.
                </li>
                <li>
                  Quem permanecer como MEI deverá pagar em dia as guias de
                  janeiro a junho de 2027 para não perder o benefício. A
                  condição tem exceções para quem já deixou de ser MEI.
                </li>
                <li>
                  Mesmo com o perdão, as declarações anuais DASN-Simei continuam
                  obrigatórias.
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted">
                Consulte sua situação fiscal no portal da Receita Federal ou no
                Regularize, no caso de dívidas inscritas em Dívida Ativa da
                União.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3">
                <Source url={meiSources.remission}>
                  Receita Federal — perdão do MEI
                </Source>
                <Source url={meiSources.pgfn}>
                  PGFN — perguntas frequentes
                </Source>
                <Source url={meiSources.law}>LC 238/2026</Source>
              </div>
            </section>

            <ReforminhaTip variant="feature">
              Mantenha seu cadastro e os dados da empresa atualizados. Confira
              periodicamente as orientações oficiais para evitar pendências com
              o DAS e com a emissão de notas fiscais.
            </ReforminhaTip>

            <div
              className={
                card + " flex flex-wrap items-center gap-x-5 gap-y-3 !p-4"
              }
            >
              <span className="flex items-center gap-2 font-semibold text-brand">
                <Link01 className="size-5" aria-hidden="true" /> Saiba mais
              </span>
              <Source url={meiSources.reform}>Receita Federal</Source>
              <Source url={meiSources.das}>Portal do Simples Nacional</Source>
              <Source url={sources.law}>LC 214/2025</Source>
            </div>
          </div>
        ) : selected ? (
          <div className="space-y-8 pt-8">
            <div>
              <h2 className="text-section font-semibold tracking-tight text-brand">
                {selected.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                {selected.subtitle}
              </p>
            </div>
            <BusinessText key={selected.id} entry={selected} />
            {active === "lucro-presumido" && (
              <section
                aria-labelledby="presumido-atualizacoes"
                className={card + " space-y-5"}
              >
                <div>
                  <h3
                    id="presumido-atualizacoes"
                    className="text-lg font-semibold text-brand"
                  >
                    Notícias e mudanças recentes do Lucro Presumido
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    As regras do imposto sobre o lucro e a reforma dos tributos
                    sobre o consumo são assuntos distintos. Veja os principais
                    efeitos e a fonte de cada atualização.
                  </p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <article className="space-y-2">
                    <p className="text-xs font-semibold text-accent">
                      2026 · IRPJ e CSLL
                    </p>
                    <h4 className="font-semibold text-brand">
                      Mudança nos percentuais de presunção
                    </h4>
                    <p className="text-sm leading-relaxed text-muted">
                      Para a parcela da receita bruta total que excede R$ 5
                      milhões no ano-calendário, a LC 224/2025 estabeleceu um
                      acréscimo de 10% nos percentuais de presunção aplicáveis.
                      Isso não significa adicionar dez pontos percentuais à
                      alíquota do imposto. A regra passou a valer para IRPJ em
                      janeiro de 2026 e CSLL em abril de 2026, observadas as
                      condições legais.
                    </p>
                    <Source url="https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-edita-norma-que-dispoe-sobre-a-reducao-de-beneficios-tributarios">
                      Receita Federal — alteração dos percentuais
                    </Source>
                  </article>
                  <article className="space-y-2">
                    <p className="text-xs font-semibold text-accent">
                      Novembro de 2026 · CBS e IBS
                    </p>
                    <h4 className="font-semibold text-brand">
                      Atenção ao destaque nos documentos fiscais
                    </h4>
                    <p className="text-sm leading-relaxed text-muted">
                      A Receita, o Comitê Gestor do IBS e o CFC divulgaram
                      orientações sobre inconsistências no destaque de CBS e IBS
                      em documentos fiscais eletrônicos. Empresas devem conferir
                      a parametrização e os campos exigidos em suas notas,
                      conforme o cronograma da transição.
                    </p>
                    <Source url="https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/novembro/receita-cgibs-e-cfc-vao-orientar-sobre-destaque-de-cbs-ibs-em-documentos-fiscais">
                      Ministério da Fazenda — documentos fiscais
                    </Source>
                  </article>
                </div>
              </section>
            )}
            {active === "simples-nacional" && (
              <section
                aria-labelledby="simples-voltar-mei"
                className={card + " space-y-4"}
              >
                <h3
                  id="simples-voltar-mei"
                  className="text-lg font-semibold text-brand"
                >
                  Posso voltar a ser MEI em janeiro de 2027?
                </h3>
                <p className="leading-relaxed">
                  Sim, em determinadas situações. O empresário individual que
                  está no Simples Nacional pode solicitar a opção pelo SIMEI
                  durante janeiro de 2027, desde que cumpra todos os requisitos
                  do MEI. A solicitação depende de análise e aprovação; não
                  ocorre automaticamente.
                </p>
                <p className="text-sm font-semibold text-brand">
                  Antes de solicitar, confira:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                  <li>
                    Se a empresa tem natureza de empresário individual e está no
                    Simples Nacional.
                  </li>
                  <li>
                    Se a ocupação é permitida, há apenas um estabelecimento e
                    não existe participação em outra empresa.
                  </li>
                  <li>
                    Se faturamento, quantidade de empregados e demais condições
                    atendem aos limites aplicáveis em 2027.
                  </li>
                  <li>
                    Se há pendências fiscais ou cadastrais que impeçam o
                    enquadramento.
                  </li>
                </ul>
                <p className="text-sm leading-relaxed text-muted">
                  A opção pelo SIMEI continua em janeiro, mesmo com a mudança do
                  prazo de opção pelo Simples Nacional para empresas já
                  constituídas. Se a empresa estiver fora do Simples Nacional,
                  deverá verificar primeiro a situação e o prazo próprio desse
                  regime.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3">
                  <Source url="https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/opcao-pelo-simei-permanece-em-janeiro">
                    Receita Federal — opção em janeiro
                  </Source>
                  <Source url="https://www.gov.br/pt-br/servicos/optar-pelo-sistema-de-recolhimento-do-mei">
                    Requisitos e solicitação do SIMEI
                  </Source>
                  <Source url={meiSources.law}>LC 238/2026</Source>
                </div>
              </section>
            )}
            {active === "simples-nacional" && (
              <section
                id="fator-r"
                aria-labelledby="fator-r-heading"
                className={card + " space-y-3 scroll-mt-24"}
              >
                <h3
                  id="fator-r-heading"
                  className="text-lg font-semibold text-brand"
                >
                  Fator R: como saber se o serviço é Anexo III ou V?
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Para determinadas atividades de serviços, o fator R é a
                  relação entre folha de salários e encargos elegíveis dos
                  últimos 12 meses (FS12) e receita bruta dos últimos 12 meses
                  (RBT12). Quando a relação é de pelo menos 28%, aplica-se o
                  Anexo III; abaixo disso, o Anexo V.
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  Essa regra não se aplica a todas as empresas de serviços. A
                  contabilidade deve confirmar a atividade e quais valores podem
                  integrar a folha. Se a empresa acabou de abrir, há regras
                  específicas de cálculo.
                </p>
                <Source url={sources.simples}>
                  Receita Federal — Simples Nacional
                </Source>
              </section>
            )}
            {active === "simples-nacional" && (
              <section
                className="border-t border-line pt-7"
                aria-labelledby="annex-title"
              >
                <h3
                  id="annex-title"
                  className="text-lg font-semibold text-brand"
                >
                  Sua atividade no Simples Nacional
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Se você conhece o anexo aplicável à sua atividade, selecione-o
                  para conferir as informações específicas. O anexo deve ser
                  confirmado com a contabilidade.
                </p>
                <label
                  htmlFor="business-annex"
                  className="mt-5 block text-sm font-semibold text-brand"
                >
                  Anexo da atividade
                </label>
                <select
                  id="business-annex"
                  className={field + " mt-2 max-w-lg"}
                  value={annex.id}
                  onChange={(event) => setAnnexId(event.target.value)}
                >
                  {annexes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <div className="mt-5 border-l-[3px] border-accent pl-5">
                  <p className="font-semibold text-brand">{annex.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    <strong className="text-brand">Como funciona hoje:</strong>{" "}
                    {annex.before}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    <strong className="text-brand">Na reforma:</strong>{" "}
                    {annex.after}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {annex.example}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {annex.impact}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                    {annex.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
        ) : null}
      </section>

      <footer className="mt-10 border-t border-line pt-5">
        <p className="text-sm leading-relaxed text-muted">
          Não sabe qual é o seu regime tributário? Verifique o enquadramento nos
          documentos fiscais da empresa ou com a contabilidade. Porte e
          atividade não determinam isoladamente o regime.
        </p>
      </footer>
    </div>
  );
}

function Detail({ entry, base }: { entry: Entry; base: string }) {
  const [technical, setTechnical] = useState(false);
  return (
    <div className="space-y-7">
      <Link
        to="/empresas"
        className="text-sm font-semibold text-accent hover:underline"
      >
        ← Todos os perfis e regimes
      </Link>
      <PageIntro
        label={
          base === "anexos"
            ? "Simples Nacional"
            : base === "perfis"
              ? "Perfil empresarial"
              : "Regime tributário"
        }
        title={entry.title}
      >
        {entry.subtitle}
      </PageIntro>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Nível de detalhamento"
      >
        {[
          [false, "Explicação simples"],
          [true, "Visão técnica"],
        ].map(([v, t]) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={technical === v}
            onClick={() => setTechnical(Boolean(v))}
            className={
              "rounded-lg border px-4 py-2 text-sm font-semibold transition " +
              (technical === v
                ? "bg-brand border-brand text-white"
                : "border-slate-300 bg-white text-brand hover:border-accent")
            }
          >
            {t}
          </button>
        ))}
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <article className={card}>
          <h2 className="font-semibold text-brand">
            Como funciona antes da reforma
          </h2>
          <p className="mt-3 text-sm leading-relaxed">{entry.before}</p>
        </article>
        <article className={card + " border-emerald-300"}>
          <h2 className="font-semibold text-brand">O que muda</h2>
          <p className="mt-3 text-sm leading-relaxed">{entry.after}</p>
        </article>
      </section>
      <section className={card}>
        <SectionTitle title="Na prática: o que isso significa?" />
        <p className="leading-relaxed">{entry.example}</p>
        {technical && (
          <div className="mt-5 border-t border-slate-200 pt-5">
            <h3 className="font-semibold text-brand">
              Impacto fiscal e operacional
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{entry.impact}</p>
          </div>
        )}
      </section>
      <section className={card}>
        <SectionTitle title="O que você precisa fazer" />
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {entry.actions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
      {(base === "regimes" || base === "anexos") && (
        <section className={card}>
          <SectionTitle title="Calcule os tributos da sua empresa" />
          {(entry.id === "simples-nacional" || base === "anexos") && (
            <div className="mb-3">
              <Action
                to={
                  base === "anexos"
                    ? "/simulador?anexo=" + entry.id.replace("anexo-", "")
                    : "/simulador"
                }
              >
                Quanto vou pagar de DAS?
              </Action>
            </div>
          )}
          <Action
            to={
              base === "anexos"
                ? "/calculadoras/simples/" + entry.id.replace("anexo-", "")
                : entry.id === "lucro-real"
                  ? "/calculadoras/real"
                  : entry.id === "lucro-presumido"
                    ? "/calculadoras/presumido"
                    : "/calculadoras/simples"
            }
          >
            Abrir calculadora tributária
          </Action>
        </section>
      )}
      {entry.id === "simples-nacional" && (
        <section>
          <SectionTitle title="Escolha seu anexo" />
          <div className="mb-4">
            <Action to="/empresas?regime=mei">
              Sou MEI — ver regras específicas
            </Action>
          </div>
          <Cards entries={annexes} base="/empresas/anexos" />
          <div className="mt-4">
            <Action to="/simulador?modo=comparar">
              Comparar formas de recolhimento
            </Action>
          </div>
        </section>
      )}
      {entry.id === "lucro-presumido" && (
        <section>
          <SectionTitle title="Qual é o perfil da organização?">
            Atenção: estes perfis não são automaticamente optantes do Lucro
            Presumido.
          </SectionTitle>
          <Cards entries={profiles} base="/empresas/perfis" />
        </section>
      )}
      {(entry.id === "simples-nacional" ||
        (base === "anexos" &&
          ["anexo-iii", "anexo-iv", "anexo-v"].includes(entry.id))) && (
        <ServiceExamples filter={entry.id} />
      )}
      {base === "regimes" && entry.id !== "simples-nacional" && (
        <section className={card}>
          <SectionTitle title="Exemplo numérico do novo modelo" />
          <RegularExample />
        </section>
      )}
      <section className={card}>
        <SectionTitle title="Base legal e próximos passos" />
        <div className="flex flex-col items-start gap-3">
          {entry.refs.map(([label, url]) => (
            <Source key={label} url={url}>
              {label}
            </Source>
          ))}
          <Link
            className="text-sm font-semibold text-accent underline"
            to="/entenda#cronograma"
          >
            Ver cronograma completo
          </Link>
        </div>
      </section>
    </div>
  );
}
export function BusinessDetail() {
  const { group, id } = useParams();
  const collection =
    group === "regimes"
      ? regimes
      : group === "anexos"
        ? annexes
        : group === "perfis"
          ? profiles
          : [];
  const entry = collection.find((e) => e.id === id);
  return entry ? (
    <Detail key={id} entry={entry} base={group ?? ""} />
  ) : (
    <BusinessHome />
  );
}
function RegularExample({
  preset,
}: { preset?: (typeof serviceCases)[number] } = {}) {
  const [base, setBase] = useState(String(preset?.base ?? 10000));
  const [old, setOld] = useState(String(preset?.old ?? 1200));
  const [ibsRate, setIbsRate] = useState(
    Math.round(12 * (1 - (preset?.reduction ?? 0) / 100) * 100) / 100,
  );
  const [cbsRate, setCbsRate] = useState(
    Math.round(cbsReference * (1 - (preset?.reduction ?? 0) / 100) * 100) / 100,
  );
  const [ibsCredit, setIbsCredit] = useState(String(preset?.ibsCredit ?? 500));
  const [cbsCredit, setCbsCredit] = useState(String(preset?.cbsCredit ?? 300));
  const result = compare({
    revenue: 0,
    operationBase: Number(base),
    dasInside: 0,
    dasOutside: 0,
    ibsRate,
    cbsRate,
    ibsCredit: Number(ibsCredit),
    cbsCredit: Number(cbsCredit),
  });
  const net = result.outside;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Cenário comparativo sem ano fiscal específico, com alíquotas editáveis,
        não oficiais. Informe tributos anteriores líquidos sobre consumo
        comparáveis, sem IRPJ/CSLL. Não contempla todos os regimes especiais,
        benefícios ou regras de transição.
      </p>
      <p className="text-sm text-slate-600">
        {cbsReferenceNote} <Source url={cbsReferenceSource}>Fonte TCU</Source>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Base de venda sem IBS/CBS", base, setBase],
            ["Tributos anteriores líquidos", old, setOld],
            ["Créditos elegíveis de IBS", ibsCredit, setIbsCredit],
            ["Créditos elegíveis de CBS", cbsCredit, setCbsCredit],
          ] as const
        ).map(([label, value, set]) => (
          <label
            key={label}
            className="block min-w-0 text-sm font-medium text-brand"
          >
            {label}
            <CurrencyInput
              className={field + " mt-1"}
              value={value}
              onValueChange={set}
            />
          </label>
        ))}
        {(
          [
            ["Alíquota hipotética de IBS (%)", ibsRate, setIbsRate],
            ["Alíquota hipotética de CBS (%)", cbsRate, setCbsRate],
          ] as const
        ).map(([label, value, set]) => (
          <label
            key={label}
            className="block min-w-0 text-sm font-medium text-brand"
          >
            {label}
            <input
              className={field + " mt-1"}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={value}
              onChange={(e) =>
                set(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
              }
            />
          </label>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
        {[
          ["Antes (informado)", Number(old)],
          ["Depois (estimado)", net],
          ["Diferença (depois − antes)", net - Number(old)],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="min-w-0 rounded-xl bg-slate-100 p-4"
          >
            <p className="text-xs text-slate-600">{label}</p>
            <p className="mt-2 break-words text-lg font-semibold text-brand">
              {money(Number(value))}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm">
        <h3 className="font-semibold text-brand">Como o valor foi calculado</h3>
        <p>
          IBS: {money(Number(base))} × {ibsRate}% = {money(result.ibs.debit)};
          menos {money(Number(ibsCredit))} de créditos → saldo a pagar de{" "}
          {money(result.ibs.due)}.
        </p>
        <p>
          CBS: {money(Number(base))} × {cbsRate}% = {money(result.cbs.debit)};
          menos {money(Number(cbsCredit))} de créditos → saldo a pagar de{" "}
          {money(result.cbs.due)}.
        </p>
        <p>
          Saldo total: {money(result.ibs.due)} + {money(result.cbs.due)} ={" "}
          {money(net)}. Saldos credores não são compensados entre tributos: IBS{" "}
          {money(result.ibs.excess)}, CBS {money(result.cbs.excess)}.
        </p>
      </div>
      <Source url={sources.law}>LC 214/2025, arts. 12–15 e 47</Source>
    </div>
  );
}
export function States() {
  const [uf, setUf] = useState("SP");
  const selected = cases.find((c) => c.uf === uf);
  const name = states.find((s) => s[0] === uf)?.[1];
  return (
    <div className="space-y-8">
      <PageIntro label="Impacto regional" title="A reforma em cada estado">
        A legislação de IBS/CBS é nacional. O destino, município, produto,
        benefícios e regras atuais de ICMS podem alterar o resultado de cada
        operação.
      </PageIntro>
      <section>
        <SectionTitle title="As seis maiores economias estaduais">
          Critério: PIB de 2024, Contas Regionais do IBGE, divulgadas em
          novembro de 2026. Exemplos fictícios com cidades e operações
          plausíveis, não empresas reais auditadas.
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cases.map((c) => (
            <button
              key={c.uf}
              type="button"
              aria-pressed={uf === c.uf}
              onClick={() => setUf(c.uf)}
              className={
                card +
                " text-left transition " +
                (uf === c.uf
                  ? "!border-accent !bg-soft ring-1 ring-accent"
                  : "hover:border-accent")
              }
            >
              <p className="text-xs font-semibold text-accent">
                {c.rank}º · {c.uf}
              </p>
              <p className="mt-1 font-semibold text-brand">
                {states.find((s) => s[0] === c.uf)?.[1]}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Source url={legal.pib}>IBGE — Contas Regionais 2024</Source>
          <Source url={legal.ranking}>
            Ranking divulgado pela Fazenda do Paraná
          </Source>
        </div>
      </section>
      <section className={card}>
        <label className="block max-w-md text-sm font-semibold text-brand">
          Selecione qualquer UF
          <select
            className={field + " mt-2"}
            value={uf}
            onChange={(e) => setUf(e.target.value)}
          >
            {states.map(([code, n]) => (
              <option key={code} value={code}>
                {n} ({code})
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6">
          <SectionTitle title={name ?? uf} />
          {selected ? (
            <>
              <h3 className="font-semibold text-brand">
                {selected.activity} → {selected.destination}
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-100 p-4">
                  <h4 className="font-semibold">Antes</h4>
                  <p className="mt-2 text-sm">{selected.before}</p>
                </div>
                <div className="rounded-xl bg-soft p-4">
                  <h4 className="font-semibold">Depois</h4>
                  <p className="mt-2 text-sm">{selected.after}</p>
                </div>
              </div>
              <p className="my-4 text-sm">
                <strong>Prioridade:</strong> {selected.focus}
              </p>
              <Source url={selected.source}>Consulta à Fazenda estadual</Source>
            </>
          ) : (
            <p className="text-sm leading-relaxed">
              Para {name}, aplicam-se as regras nacionais e a legislação local
              vigente durante a transição. Consulte ICMS atual, município de
              destino, classificação do produto e incentivos. Ainda não há
              estudo de caso específico revisado para esta UF.
            </p>
          )}
          <div className="mt-4">
            <Source url={sources.law}>
              LC 214/2025, art. 11 — local da operação
            </Source>
          </div>
        </div>
      </section>
      {selected && (
        <section className={card}>
          <SectionTitle title="Compare uma operação neste cenário">
            Edite os valores para explorar a diferença. O estado não preenche
            alíquotas futuras automaticamente; informe valores apurados ou
            hipóteses.
          </SectionTitle>
          <RegularExample key={uf} />
        </section>
      )}
      {selected && <ServiceExamples uf={uf} />}
      <div className="flex flex-wrap gap-3">
        <Action to={"/noticias?uf=" + uf}>Notícias de {name}</Action>
        <Action to="/noticias?uf=BR">Notícias nacionais</Action>
      </div>
      <p className="text-sm text-slate-600">
        Não há uma alíquota única definitiva para cada estado e tipo de
        operação. O IBS soma alíquotas do estado e município de destino,
        observadas as regras legais. Consulte também o município e o{" "}
        <Source url="https://www.cgibs.gov.br/">Comitê Gestor do IBS</Source>.
      </p>
    </div>
  );
}

function ServiceExamples({ uf, filter }: { uf?: string; filter?: string }) {
  const entries = serviceCases.filter(
    (e) =>
      (!uf || e.uf === uf) &&
      (!filter ||
        filter === "simples-nacional" ||
        (filter === "anexo-iii" && e.regime.includes("III")) ||
        (filter === "anexo-iv" && e.regime.includes("IV")) ||
        (filter === "anexo-v" && e.regime.includes(" V"))),
  );
  const [active, setActive] = useState(entries[0]?.uf);
  const current = entries.find((e) => e.uf === active) ?? entries[0];
  if (!current) return null;
  return (
    <section className={card}>
      <SectionTitle title="Prestação de serviços: casos práticos">
        Exemplos fictícios com foco no Simples. O cálculo é apenas do regime
        regular de IBS/CBS, não o valor total do DAS. As reduções pressupõem
        atendimento aos requisitos legais.
      </SectionTitle>
      <div
        role="group"
        aria-label="Escolha o serviço"
        className="grid gap-2 sm:grid-cols-2"
      >
        {entries.map((e) => (
          <button
            type="button"
            key={e.uf}
            aria-pressed={current.uf === e.uf}
            onClick={() => setActive(e.uf)}
            className={
              "rounded-xl border p-3 text-left text-sm font-semibold " +
              (current.uf === e.uf
                ? "border-brand bg-brand text-white"
                : "border-slate-300 text-brand hover:bg-soft")
            }
          >
            {e.title}
          </button>
        ))}
      </div>
      <div className="my-5">
        <h3 className="text-lg font-semibold text-brand">{current.title}</h3>
        <p className="my-2 text-sm font-medium text-accent">{current.regime}</p>
        <p className="text-sm leading-relaxed">{current.detail}</p>
        <p className="mt-3 text-sm font-semibold">
          Referência CBS: 11,3%{" "}
          {current.reduction > 0
            ? "× " +
              (100 - current.reduction) +
              "% = " +
              (cbsReference * (1 - current.reduction / 100)).toLocaleString(
                "pt-BR",
                { maximumFractionDigits: 2 },
              ) +
              "% (condicional)"
            : "(sem redução presumida)"}
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Valores de tributos anteriores e créditos fictícios; informe seus
          valores reais. O IBS de 12% antes de reduções é hipótese, não alíquota
          oficial.
        </p>
        <div className="mt-3">
          <Source url={sources.law}>
            LC 214/2025, arts. 127, 129 e 130 e anexos II/III
          </Source>
        </div>
      </div>
      <RegularExample key={current.uf} preset={current} />
      <div className="mt-5">
        <Action to="/simulador?modo=comparar">
          Comparar DAS com regime regular
        </Action>
      </div>
    </section>
  );
}
