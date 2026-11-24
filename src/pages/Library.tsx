import { useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { card, field, PageIntro, Source } from "../components/ui";
import { topics, reviewed, sources } from "../data/content";
const categories = ["Todos", ...new Set(topics.map((t) => t.category))];
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function Library() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const results = topics.filter(
    (t) =>
      (category === "Todos" || t.category === category) &&
      normalize(t.title + " " + t.text + " " + t.category).includes(
        normalize(query.trim()),
      ),
  );
  return (
    <>
      <PageIntro label="Fontes e atualizações" title="Biblioteca tributária">
        Consulte normas, orientações e notícias selecionadas de fontes oficiais.
        Revisão editorial: {reviewed}.
      </PageIntro>
      <div className={card + " mb-6 grid gap-4 sm:grid-cols-[2fr_1fr]"}>
        <label className="text-sm font-medium">
          Buscar assunto
          <div className="relative mt-2">
            <SearchLg
              className="absolute left-3 top-3 size-5 text-slate-500"
              aria-hidden="true"
            />
            <input
              className={field + " pl-10"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Simples Nacional, IBS, CBS"
            />
          </div>
        </label>
        <label className="text-sm font-medium">
          Categoria
          <select
            className={field + " mt-2"}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-sm text-slate-600" role="status">
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
      </p>
      {results.length === 0 ? (
        <div className={card}>
          <h2 className="font-semibold">Nenhum conteúdo encontrado</h2>
          <p className="my-3 text-sm">
            Experimente outro termo ou selecione todas as categorias.
          </p>
          <button
            className="rounded font-semibold text-accent underline active:bg-emerald-100 active:text-brand transition-colors"
            onClick={() => {
              setQuery("");
              setCategory("Todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <article key={t.title} className={card + " flex flex-col"}>
              <p className="text-xs font-semibold text-accent">
                {t.category} · {t.date}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-brand">
                {t.title}
              </h2>
              <p className="my-3 flex-1 text-sm leading-relaxed text-slate-600">
                {t.text}
              </p>
              <Source url={t.url} />
            </article>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Source url={sources.legislation}>
          Consultar toda a legislação na Receita Federal
        </Source>
      </div>
    </>
  );
}
