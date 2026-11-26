import { Link } from "react-router-dom";
import { ArrowRight, File02 } from "@untitledui/icons";
import { news } from "../../data/news";
import { SectionContainer } from "./SectionContainer";

const latest = [...news].sort((a, b) => b.date.localeCompare(a.date))[0];

export function NewsHighlights() {
  return (
    <SectionContainer
      labelledBy="home-news-heading"
      className="bg-paper"
      spacing="tight"
    >
      <div className="grid min-w-0 items-center gap-3 border-t border-line py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-4 sm:gap-y-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto]">
        <h2
          id="home-news-heading"
          className="flex min-w-0 items-center gap-3 text-lg font-semibold leading-snug text-brand"
        >
          <File02
            className="size-6 shrink-0 text-gold-ink"
            aria-hidden="true"
          />
          <span>Atualizações e legislação</span>
        </h2>
        {latest && (
          <a
            href={latest.url}
            target="_blank"
            rel="noreferrer"
            className="group flex min-w-0 flex-col gap-1 rounded-md py-2 text-sm text-muted hover:text-brand sm:col-span-2 sm:row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1"
          >
            <time dateTime={latest.date} className="text-xs">
              {latest.date.split("-").reverse().join("/")}
            </time>
            <span className="font-medium text-brand group-hover:underline">
              {latest.title}
            </span>
            <span className="sr-only">
              Ler publicação original (abre nova aba)
            </span>
          </a>
        )}
        <Link
          to="/noticias"
          className="inline-flex min-h-11 min-w-0 items-center gap-3 text-sm font-semibold text-accent underline underline-offset-4 hover:text-brand sm:col-start-2 sm:row-start-1 sm:justify-self-end lg:col-start-3"
        >
          <span>Ver todas as publicações</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </SectionContainer>
  );
}
