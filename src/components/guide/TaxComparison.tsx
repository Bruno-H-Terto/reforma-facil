import { GlossaryText } from "./GlossaryText";
import { Source } from "../ui";
import { sources } from "../../data/content";

const changes = [
  {
    before: "PIS e Cofins",
    beforeDetail: "Tributos federais",
    after: "CBS",
    afterDetail: "Contribuição federal",
  },
  {
    before: "ICMS e ISS",
    beforeDetail: "Tributos estadual e municipal",
    after: "IBS",
    afterDetail: "Tributo estadual e municipal",
  },
  {
    before: "IPI",
    beforeDetail: "Tributo federal",
    after: "IPI com alíquota zero",
    afterDetail: "A partir de 2027, salvo exceções legais.",
  },
  {
    before: "Sem Imposto Seletivo",
    after: "Imposto Seletivo (IS)",
    afterDetail: "Novo tributo federal",
  },
];

function ComparisonNode({
  number,
  title,
  detail,
  after = false,
}: {
  number: number;
  title: string;
  detail?: string;
  after?: boolean;
}) {
  return (
    <div
      className={
        "flex min-w-0 items-stretch overflow-hidden " +
        (after
          ? "flex-row rounded-r-3xl bg-gold/20 text-brand-deep"
          : "flex-row-reverse rounded-l-3xl bg-brand text-white")
      }
    >
      <span
        aria-hidden="true"
        className={
          "grid w-7 shrink-0 place-items-center text-sm font-semibold tabular-nums sm:w-10 sm:text-base " +
          (after ? "bg-gold text-brand-deep" : "bg-brand-mid text-white")
        }
      >
        {String(number).padStart(2, "0")}
      </span>
      <div
        className={
          "flex min-w-0 flex-1 flex-col justify-center gap-1 px-2.5 py-3 sm:px-5 sm:py-4 " +
          (after ? "text-left" : "text-right")
        }
      >
        <span className="text-sm font-semibold leading-snug sm:text-base lg:text-lg">
          <GlossaryText
            text={title}
            introduce={!after && title === "IPI" ? ["IPI"] : []}
          />
        </span>
        {detail && (
          <span
            className={
              "text-xs leading-relaxed sm:text-sm " +
              (after ? "text-muted" : "text-on-dark")
            }
          >
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

function ComparisonMascot() {
  return (
    <div className="relative z-10 mx-auto flex size-24 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--color-brand)_50%,var(--color-gold)_50%)] p-1.5 lg:size-[clamp(6rem,10vw,9rem)] lg:p-2">
      <div className="flex size-full items-center justify-center rounded-full bg-surface">
        <img
          src="/images/mascot/chat-avatar.webp"
          alt="Reforminha"
          width={240}
          height={240}
          className="size-[88%] object-contain"
        />
      </div>
    </div>
  );
}

function ComparisonConnections() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full"
      fill="none"
      strokeWidth="1.5"
    >
      {[50, 150, 250, 350].map((y, i) => (
        <g key={y}>
          <path
            d={`M0 ${y} C64 ${y} 30 ${155 + i * 30} 120 ${155 + i * 30}`}
            stroke="var(--color-brand)"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M240 ${y} C176 ${y} 210 ${155 + i * 30} 120 ${155 + i * 30}`}
            stroke="var(--color-gold-ink)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}

export function TaxComparison() {
  return (
    <section
      id="comparativo"
      aria-labelledby="comparison-heading"
      className="scroll-mt-6"
    >
      <h2
        id="comparison-heading"
        className="text-section text-center font-semibold tracking-tight text-brand"
      >
        Antes e depois da reforma
      </h2>
      <p className="mt-2 text-center text-base leading-relaxed text-muted">
        Veja como os tributos sobre o consumo mudam com a reforma.
      </p>
      <div className="mt-6 min-w-0 rounded-2xl bg-surface px-3 py-5 sm:px-6 sm:py-8">
        <div className="mb-4 lg:hidden">
          <ComparisonMascot />
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-0">
          <h3 className="text-center text-lg font-semibold text-brand lg:text-xl">
            Antes
          </h3>
          <h3 className="text-center text-lg font-semibold text-gold-ink lg:col-start-3 lg:text-xl">
            Depois
          </h3>
        </div>
        <div className="relative">
          <ol className="grid gap-3 sm:gap-4 lg:auto-rows-fr">
            {changes.map(
              ({ before, beforeDetail, after, afterDetail }, index) => (
                <li
                  key={before}
                  className="grid min-w-0 grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-0"
                >
                  <ComparisonNode
                    number={index + 1}
                    title={before}
                    detail={beforeDetail}
                  />
                  <div aria-hidden="true" className="hidden lg:block" />
                  <ComparisonNode
                    number={index + 1}
                    title={after}
                    detail={afterDetail}
                    after
                  />
                </li>
              ),
            )}
          </ol>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[21.5686%] -translate-x-1/2 items-center justify-center lg:flex">
            <ComparisonConnections />
            <ComparisonMascot />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
          <p className="w-full text-sm leading-relaxed text-muted">
            Quadro simplificado do modelo geral. Regimes específicos e exceções
            legais devem ser consultados separadamente.
          </p>
          <Source url={sources.law}>Lei Complementar 214/2025</Source>
          <Source url={sources.timeline}>
            Cronograma oficial da transição
          </Source>
        </div>
      </div>
    </section>
  );
}
