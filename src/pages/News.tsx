import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageIntro, SectionTitle, Source, card, field } from "../components/ui";
import { states } from "../data/business";
import { news, newsReviewed, officialNews } from "../data/news";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const dateLabel = (s: string) => s.split("-").reverse().join("/");
export function News() {
  const [params, setParams] = useSearchParams();
  const uf = params.get("uf") ?? "all";
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState(params.get("topic") ?? "all");
  const [order, setOrder] = useState("recent");
  const results = news
    .filter(
      (n) =>
        (uf === "all" || n.uf === uf) &&
        (year === "all" || n.date.startsWith(year)) &&
        (topic === "all" || n.topic === topic) &&
        normalize(
          n.title + " " + n.summary + " " + n.impact + " " + n.publisher,
        ).includes(normalize(query)),
    )
    .sort((a, b) =>
      order === "recent"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    );
  return (
    <div className="space-y-8">
      <PageIntro
        label="Central de notícias"
        title="Acompanhe a reforma tributária"
      >
        Encontre notícias e orientações oficiais por tema ou região.
      </PageIntro>
      <section className={card}>
        <SectionTitle title="Filtrar notícias">
          Acervo editorial de janeiro de 2025 a novembro de 2026. Revisão em{" "}
          {newsReviewed}; sem atualização automática.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm font-medium text-brand">
            Buscar notícias
            <input
              className={field + " mt-1"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: CBS, notas fiscais"
            />
          </label>
          <label className="block text-sm font-medium text-brand">
            Estado ou abrangência
            <select
              className={field + " mt-1"}
              value={uf}
              onChange={(e) =>
                setParams(
                  e.target.value === "all" ? {} : { uf: e.target.value },
                )
              }
            >
              <option value="all">Todos</option>
              <option value="BR">Nacional</option>
              {states.map(([id, n]) => (
                <option key={id} value={id}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-brand">
            Período
            <select
              className={field + " mt-1"}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">Todo o acervo</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-brand">
            Tema
            <select
              className={field + " mt-1"}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="all">Todos</option>
              {[...new Set(news.map((n) => n.topic))].sort().map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-brand">
            Ordenar
            <select
              className={field + " mt-1"}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="recent">Mais recentes</option>
              <option value="old">Mais antigas</option>
            </select>
          </label>
          <button
            type="button"
            className="self-end rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-brand hover:bg-soft"
            onClick={() => {
              setParams({});
              setQuery("");
              setYear("all");
              setTopic("all");
              setOrder("recent");
            }}
          >
            Limpar filtros
          </button>
        </div>
      </section>
      <p role="status" className="text-sm font-medium text-slate-600">
        {results.length}{" "}
        {results.length === 1 ? "notícia encontrada" : "notícias encontradas"}
      </p>
      {results.length === 0 ? (
        <div className={card}>
          Nenhuma notícia neste recorte. As notícias nacionais também podem se
          aplicar ao seu estado. Ajuste os filtros ou consulte as fontes
          oficiais abaixo.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((n) => (
            <article key={n.url} className={card + " flex min-w-0 flex-col"}>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-accent">
                <time dateTime={n.date}>{dateLabel(n.date)}</time>
                <span>· {n.uf === "BR" ? "Nacional" : n.uf}</span>
                <span>· {n.topic}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-brand">
                {n.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {n.summary}
              </p>
              <p className="my-4 border-l-2 border-gold pl-3 text-sm leading-relaxed text-muted">
                <strong className="text-brand">Na prática:</strong> {n.impact}
              </p>
              <div className="mt-auto">
                <p className="mb-2 text-xs text-slate-600">{n.publisher}</p>
                <Source url={n.url}>Ler publicação original</Source>
              </div>
            </article>
          ))}
        </div>
      )}
      <section className={card} aria-labelledby="portais-oficiais">
        <div id="portais-oficiais">
          <SectionTitle title="Portais oficiais para acompanhar">
            Acesse diretamente as fontes oficiais para conferir informações
            publicadas após a última revisão do portal.
          </SectionTitle>
        </div>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-soft text-brand">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Órgão ou portal
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Acesso oficial
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {officialNews.map(([name, url]) => (
                <tr key={url} className="bg-surface">
                  <th scope="row" className="px-4 py-3 font-medium text-brand">
                    {name}
                  </th>
                  <td className="px-4 py-3">
                    <Source url={url}>Consultar portal</Source>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
