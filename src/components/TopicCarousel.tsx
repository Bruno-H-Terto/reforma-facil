import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "@untitledui/icons";
import { Link } from "react-router-dom";
import { topics } from "../data/content";
import { SectionTitle, Source } from "./ui";

export function TopicCarousel() {
  const [ref, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
  });
  const [position, setPosition] = useState({
    index: 0,
    count: 0,
    prev: false,
    next: false,
  });
  useEffect(() => {
    if (!api) return;
    const sync = () =>
      setPosition({
        index: api.selectedScrollSnap(),
        count: api.scrollSnapList().length,
        prev: api.canScrollPrev(),
        next: api.canScrollNext(),
      });
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);
  const items = topics.filter((t) => t.category !== "Entenda");
  return (
    <section
      aria-label="Publicações em destaque"
      aria-roledescription="carrossel"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle title="Acompanhe as mudanças">
          Uma seleção de materiais oficiais para orientar suas próximas
          decisões.
        </SectionTitle>
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            aria-label="Publicação anterior"
            disabled={!position.prev}
            onClick={() => api?.scrollPrev()}
            className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white text-brand transition-colors hover:bg-soft active:border-accent active:bg-accent active:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Próxima publicação"
            disabled={!position.next}
            onClick={() => api?.scrollNext()}
            className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white text-brand transition-colors hover:bg-soft active:border-accent active:bg-accent active:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={ref} className="overflow-hidden">
        <div className="flex touch-pan-y gap-4">
          {items.map((item, i) => (
            <article
              key={item.title}
              aria-label={`${i + 1} de ${items.length}`}
              className="flex min-w-0 flex-[0_0_100%] flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:flex-[0_0_calc((100%-1rem)/2)] lg:flex-[0_0_calc((100%-2rem)/3)]"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {item.category} · {item.date}
              </span>
              <h3 className="mt-3 font-semibold text-brand">{item.title}</h3>
              <p className="my-3 flex-1 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
              <Source url={item.url} />
            </article>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex items-center gap-1"
          aria-label="Posição do carrossel"
        >
          {Array.from({ length: position.count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir à posição ${i + 1}`}
              aria-current={position.index === i ? "true" : undefined}
              onClick={() => api?.scrollTo(i)}
              className="grid size-9 place-items-center rounded-full transition-colors hover:bg-soft active:bg-line"
            >
              <span
                className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${position.index === i ? "w-6 bg-accent" : "w-2.5 bg-slate-400"}`}
              />
            </button>
          ))}
        </div>
        <Link
          to="/biblioteca"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline underline-offset-4"
        >
          Ver biblioteca completa{" "}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
