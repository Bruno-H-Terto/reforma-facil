import { sources, timeline } from "../../data/content";
import { Source } from "../ui";

type TimelineStage = (typeof timeline)[number];

function TimelineItem({
  stage,
  index,
}: {
  stage: TimelineStage;
  index: number;
}) {
  const delayed = index % 2 === 1;
  return (
    <li className="relative grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 lg:flex lg:flex-col lg:items-center lg:gap-0 lg:px-2 lg:text-center">
      <p className="col-start-2 row-start-1 text-lg font-semibold tabular-nums text-brand lg:order-1 lg:flex lg:h-9 lg:items-start lg:justify-center xl:text-xl">
        {stage.year}
      </p>
      <span
        aria-hidden="true"
        className="relative z-10 hidden size-3 shrink-0 rounded-full bg-gold ring-4 ring-brand lg:order-2 lg:block"
      />
      <span
        aria-hidden="true"
        className={
          "hidden w-px shrink-0 bg-line-strong lg:order-3 lg:block " +
          (delayed ? "h-16" : "h-6")
        }
      />
      <div
        aria-hidden="true"
        className="relative z-10 col-start-1 row-start-1 row-span-2 grid size-14 shrink-0 place-items-center rounded-full border border-line bg-surface text-brand shadow-panel lg:order-4 lg:size-[4.5rem]"
      >
        <span
          className="size-7 bg-accent lg:size-8"
          style={{
            maskImage: "url(/images/timeline/" + stage.icon + ".svg)",
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        />
      </div>
      <div className="col-start-2 row-start-2 min-w-0 pb-7 lg:order-5 lg:mt-4 lg:pb-0">
        <h3 className="mt-1 text-base font-semibold leading-snug text-brand lg:mt-0">
          {stage.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{stage.text}</p>
      </div>
    </li>
  );
}

export function TransitionTimeline() {
  return (
    <section
      id="cronograma"
      aria-labelledby="timeline-heading"
      className="scroll-mt-6"
    >
      <div className="mb-5">
        <h2
          id="timeline-heading"
          className="text-section font-semibold tracking-tight text-brand"
        >
          Cronograma de transição
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted">
          Da preparação à implantação integral do modelo geral.
        </p>
      </div>
      <div className="rounded-2xl bg-soft px-4 py-6 sm:px-6 sm:py-8 lg:px-5 lg:py-9 xl:px-8">
        <ol className="relative grid gap-2 before:pointer-events-none before:absolute before:top-7 before:bottom-12 before:left-[1.71875rem] before:w-px before:bg-line-strong lg:grid-cols-5 lg:gap-0 lg:before:top-[2.5625rem] lg:before:bottom-auto lg:before:left-[10%] lg:before:right-[10%] lg:before:h-0.5 lg:before:w-auto lg:before:bg-brand">
          {timeline.map((stage, index) => (
            <TimelineItem key={stage.year} stage={stage} index={index} />
          ))}
        </ol>
        <div className="mt-3 border-t border-line pt-4 lg:mt-7">
          <Source url={sources.timeline}>Fonte: Ministério da Fazenda</Source>
          <span className="mx-2 hidden text-muted sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="mt-2 block text-sm text-muted sm:mt-0 sm:inline">
            Cronograma geral, sujeito às regras e exceções legais.
          </span>
        </div>
      </div>
    </section>
  );
}
