import { useState } from "react";
import {
  Action,
  FAQ,
  PageIntro,
  SectionTitle,
  Source,
  card,
  field,
} from "../components/ui";
import { CurrencyInput } from "../components/CurrencyInput";
import { meiSources, limits, meiLimit, das2026 } from "../data/mei";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function Mei() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [revenue, setRevenue] = useState("90000");
  const [activity, setActivity] = useState<keyof typeof das2026>("services");
  const [debt, setDebt] = useState("1000");
  const [local, setLocal] = useState("60");
  const limit = meiLimit(year, month);
  const amount = Number(revenue);
  return (
    <div className="space-y-8">
      <PageIntro
        label="Microempreendedor individual · MEI"
        title="O que muda para o MEI?"
      >
        Entenda quanto pode faturar, quanto paga no DAS, quais dívidas podem ser
        perdoadas e como a reforma afeta seu negócio.
      </PageIntro>
      <section className="rounded-2xl bg-brand p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          Reforma do consumo · regra do MEI
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          O MEI continua com DAS fixo
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed">
          Segundo a Receita Federal, as vendas do MEI não sofrem incidência de
          IBS e CBS. A referência de 11,3% da CBS não se aplica ao faturamento
          do MEI. Há mudanças nas obrigações de emissão fiscal; acompanhe as
          orientações do seu tipo de atividade.
        </p>
        <a
          href={meiSources.reform}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-line"
        >
          Receita Federal — Reforma de Fato (abre nova aba)
        </a>
      </section>
      <section>
        <SectionTitle title="Quanto o MEI pode faturar?">
          Limites gerais anuais da LC 123 e da LC 238/2026. Novos tetos
          previstos para 2027 e 2028, condicionados à previsão orçamentária do
          art. 3º da LC 238.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {limits.map((l) => (
            <article className={card} key={l.year}>
              <p className="text-sm font-semibold text-accent">
                {l.year} · {l.year === 2026 ? "vigente" : "previsto em lei"}
              </p>
              <p className="mt-3 text-2xl font-semibold text-brand">
                {money(l.annual)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Média mensal equivalente: {money(l.annual / 12)} (não é teto
                mensal).
              </p>
              <p className="mt-2 text-sm font-medium">
                Até {l.year === 2026 ? "1 empregado" : "2 empregados"}.
              </p>
            </article>
          ))}
        </div>
        <div className="mt-4">
          <Source url={meiSources.law}>LC 238/2026, arts. 1º–3º e 10</Source>
        </div>
      </section>
      <section className={card}>
        <SectionTitle title="Meu faturamento cabe no MEI?">
          Simulação do limite geral de receita bruta, não do lucro. Selecione o
          ano e o mês de abertura apenas se começou naquele ano; caso contrário
          use janeiro. Não se aplica ao MEI Caminhoneiro.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold text-brand">
            Ano-calendário
            <select
              className={field + " mt-2"}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {limits.map((l) => (
                <option key={l.year}>{l.year}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-brand">
            Mês inicial da atividade
            <select
              className={field + " mt-2"}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(2026, i, 1).toLocaleDateString("pt-BR", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-brand">
            Receita bruta no ano
            <CurrencyInput
              className={field + " mt-2"}
              value={revenue}
              onValueChange={setRevenue}
            />
          </label>
        </div>
        <div className="mt-5 rounded-xl bg-slate-100 p-4" aria-live="polite">
          <p className="text-sm">
            Limite aplicável: <strong>{money(limit)}</strong>
          </p>
          {revenue !== "" ? (
            <p className="mt-2 font-semibold text-brand">
              {amount <= limit
                ? "Dentro do limite de receita; margem restante: " +
                  money(limit - amount)
                : "Acima do limite de receita em " +
                  money(amount - limit) +
                  ". Verifique as regras de desenquadramento com seu contador."}
            </p>
          ) : (
            <p className="mt-2">Informe a receita bruta.</p>
          )}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Estar abaixo do teto não garante enquadramento. Confirme ocupação
          permitida, participação em outras empresas, empregados e demais
          requisitos. Não há migração automática de ME para MEI.
        </p>
      </section>
      <section className={card}>
        <SectionTitle title="Quanto pago de DAS em 2026?">
          Valores mensais para o MEI comum. Em anos posteriores, consulte a guia
          oficial e o salário mínimo vigente.
        </SectionTitle>
        <label className="block max-w-md text-sm font-semibold text-brand">
          Atividade
          <select
            className={field + " mt-2"}
            aria-label="Atividade"
            value={activity}
            onChange={(e) =>
              setActivity(e.target.value as keyof typeof das2026)
            }
          >
            <option value="commerce">Comércio ou indústria</option>
            <option value="services">Prestação de serviços</option>
            <option value="mixed">Comércio e serviços</option>
          </select>
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-sm">INSS (5% de R$ 1.621)</p>
            <p className="mt-2 font-semibold">{money(81.05)}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-sm">ICMS / ISS</p>
            <p className="mt-2 font-semibold">
              {money(das2026[activity] - 81.05)}
            </p>
          </div>
          <div className="rounded-xl bg-soft p-4">
            <p className="text-sm">Total mensal</p>
            <p
              className="mt-2 text-xl font-semibold text-brand"
              aria-live="polite"
            >
              {money(das2026[activity])}
            </p>
          </div>
        </div>
        <p className="my-3 text-sm text-slate-600">
          Não inclui folha de empregados, juros ou multas. MEI Caminhoneiro tem
          regra previdenciária distinta.
        </p>
        <Source url={meiSources.das}>
          Portal do Simples Nacional — valores de 2026
        </Source>
      </section>
      <section className={card}>
        <SectionTitle title="Perdão das dívidas: o que realmente será cancelado?">
          Remissão prevista na LC 238/2026, com efeitos a partir de 1º de
          janeiro de 2027.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-soft p-4">
            <h3 className="font-semibold text-brand">Incluído</h3>
            <p className="mt-2 text-sm">
              INSS do DAS-MEI vencido até 13/10/2026 (em regra, competências até
              agosto), com juros, multas e encargos correspondentes, inscrito ou
              não em dívida ativa. Abrange também parcelas elegíveis de acordos.
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <h3 className="font-semibold text-brand">Não incluído</h3>
            <p className="mt-2 text-sm">
              ICMS, ISS, dívidas bancárias, contas privadas e contribuições fora
              do período abrangido. Valores já pagos não serão devolvidos.
            </p>
          </div>
        </div>
        <div className="mt-5 border-l-4 border-accent bg-slate-50 p-4">
          <h3 className="font-semibold text-brand">
            Atenção aos seis meses de 2027
          </h3>
          <p className="mt-2 text-sm">
            Se continuar como MEI, pague em dia as guias de janeiro a junho de
            2027, conforme orientação da Receita. O descumprimento pode cancelar
            a remissão. Até 31/12/2026 os débitos e acordos permanecem válidos.
            Em regra a baixa é automática; quem discute a dívida judicialmente
            precisa cumprir o procedimento de desistência e renúncia. Ex-MEIs
            podem se beneficiar de débitos elegíveis sem a condição dos seis
            meses, ressalvados efeitos retroativos.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-brand">
            INSS elegível, incluindo encargos (exemplo)
            <CurrencyInput
              className={field + " mt-2"}
              value={debt}
              onValueChange={setDebt}
            />
          </label>
          <label className="text-sm font-semibold text-brand">
            ICMS e ISS ainda devidos (exemplo)
            <CurrencyInput
              className={field + " mt-2"}
              value={local}
              onValueChange={setLocal}
            />
          </label>
        </div>
        <div
          className="mt-4 rounded-xl bg-slate-100 p-4 text-sm"
          aria-live="polite"
        >
          Em um cenário que cumpra todos os requisitos,{" "}
          <strong>{money(Number(debt))}</strong> poderão ser cancelados, e{" "}
          <strong>{money(Number(local))}</strong> permanecerão devidos. O
          cálculo é ilustrativo: não consulta débitos reais nem confirma
          elegibilidade.
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Source url={meiSources.remission}>
            Receita Federal — regras da remissão
          </Source>
          <Source url={meiSources.pgfn}>PGFN — perguntas frequentes</Source>
          <Source url="https://www.regularize.pgfn.gov.br/">
            Consultar Regularize
          </Source>
        </div>
      </section>
      <section>
        <SectionTitle title="Exemplos do dia a dia">
          Situações fictícias para ilustrar o impacto das novas regras.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Prestadora de serviços",
              "Uma manicure fatura R$ 90 mil no ano inteiro. Superaria o teto geral de 2026; em 2027, ficaria abaixo dos R$ 110 mil previstos, se cumprir os outros requisitos.",
            ],
            [
              "Comerciante",
              "Uma loja com receita anual de R$ 130 mil excede o limite de 2027, mas fica abaixo do teto de R$ 140 mil previsto para 2028. Isso não dispensa verificar o ano anterior e a opção.",
            ],
            [
              "MEI com dívidas",
              "Um eletricista tem R$ 1.000 de INSS elegível e R$ 60 de ISS em atraso. Apenas o saldo previdenciário elegível poderá ser remitido; o ISS continua devido.",
            ],
          ].map(([t, p]) => (
            <article className={card} key={t}>
              <h3 className="font-semibold text-brand">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed">{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="Dúvidas frequentes" />
        <FAQ
          items={[
            [
              "Preciso pagar CBS de 11,3%?",
              "Não sobre vendas como MEI. O DAS segue a sistemática fixa; acompanhe mudanças nos documentos fiscais.",
            ],
            [
              "Ainda preciso entregar a declaração anual?",
              "Sim. A DASN-SIMEI permanece obrigatória, inclusive de anos anteriores.",
            ],
            [
              "Posso contratar duas pessoas agora?",
              "A mudança produz efeitos em 1º de janeiro de 2027; em 2026 a regra geral é de um empregado.",
            ],
            [
              "O perdão é de toda a guia DAS?",
              "Não. Abrange o INSS elegível e encargos; ICMS e ISS não são abrangidos.",
            ],
            [
              "O MEI Caminhoneiro tem o mesmo limite?",
              "Não. O simulador desta página é exclusivo do limite geral. Consulte as regras específicas no Portal do Empreendedor.",
            ],
          ]}
        />
      </section>
      <section className={card}>
        <SectionTitle title="Serviços oficiais e notícias" />
        <div className="flex flex-col items-start gap-3">
          <Source url={meiSources.law}>Lei Complementar 238/2026</Source>
          <Source url={meiSources.ceiling}>
            Ministério do Empreendedorismo — teto do MEI
          </Source>
          <Source url="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor">
            Portal do Empreendedor
          </Source>
          <Source url="https://www8.receita.fazenda.gov.br/SimplesNacional/">
            Portal do Simples Nacional — PGMEI e DASN-SIMEI
          </Source>
          <Action to="/noticias?topic=MEI">Notícias sobre MEI</Action>
        </div>
        <p className="mt-4 text-xs text-slate-600">
          Revisado em 25/11/2026. Conteúdo educativo, não substitui a consulta
          fiscal individual.
        </p>
      </section>
    </div>
  );
}
