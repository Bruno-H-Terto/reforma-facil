import { useState } from "react";
import { CurrencyInput } from "../CurrencyInput";
import { SectionTitle, Source, Action, FAQ, card, field } from "../ui";
import { limits, meiLimit, meiSources } from "../../data/mei";

const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Calculadoras que existiam em /mei, preservadas dentro de Minha empresa. */
export function MeiTools() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [revenue, setRevenue] = useState("90000");
  const [debt, setDebt] = useState("1000");
  const [local, setLocal] = useState("60");

  const limit = meiLimit(year, month);
  const amount = Number(revenue);

  return (
    <div className="space-y-5">
      <section className={card + " space-y-4"}>
        <SectionTitle title="Meu faturamento cabe no MEI?">
          Simulação educativa do limite geral de receita bruta, não do lucro.
          Para negócios iniciados antes do ano selecionado, use janeiro. Não se
          aplica ao MEI Caminhoneiro.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold text-brand">
            Ano-calendário
            <select
              className={field + " mt-2"}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {limits.map((entry) => (
                <option key={entry.year} value={entry.year}>
                  {entry.year}
                </option>
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
        <div className="rounded-lg bg-soft p-4 text-sm" aria-live="polite">
          <p>
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
        <p className="text-xs leading-relaxed text-muted">
          A receita dentro do limite não garante o enquadramento: confirme
          ocupação, empregados, participação em outras empresas e requisitos
          legais.
        </p>
        <Source url={meiSources.ceiling}>
          Ministério do Empreendedorismo — limites
        </Source>
      </section>

      <section className={card + " space-y-4"}>
        <SectionTitle title="Perdão do MEI: exemplo de valores">
          Somente a parcela previdenciária elegível pode ser remitida; ICMS e
          ISS não são abrangidos. Não consultamos débitos reais nem confirmamos
          elegibilidade.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
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
        <p className="rounded-lg bg-soft p-4 text-sm" aria-live="polite">
          Em um cenário que cumpra todos os requisitos,{" "}
          <strong>{money(Number(debt))}</strong> poderão ser cancelados, e{" "}
          <strong>{money(Number(local))}</strong> permanecerão devidos.
        </p>
        <div className="flex flex-wrap gap-3">
          <Source url={meiSources.remission}>
            Receita Federal — regras da remissão
          </Source>
          <Source url={meiSources.pgfn}>PGFN — perguntas frequentes</Source>
          <Action to="/noticias?topic=MEI">Notícias sobre MEI</Action>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle title="Exemplos e dúvidas do MEI">
          Os exemplos são fictícios. As regras devem ser confirmadas para a
          atividade e o ano da empresa.
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
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
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-line p-3">
              <h3 className="font-semibold text-brand">{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </article>
          ))}
        </div>
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
              "Não. O simulador deste portal é exclusivo do limite geral. Consulte as regras específicas no Portal do Empreendedor.",
            ],
          ]}
        />
      </section>

      <section className="flex flex-wrap gap-4 border-t border-line pt-4">
        <Source url={meiSources.law}>LC 238/2026</Source>
        <Source url="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor">
          Portal do Empreendedor
        </Source>
        <Source url="https://www8.receita.fazenda.gov.br/SimplesNacional/">
          Portal do Simples Nacional
        </Source>
      </section>
    </div>
  );
}
