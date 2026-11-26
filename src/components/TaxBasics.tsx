import { GlossaryText } from "./guide/GlossaryText";
import { TaxExample } from "./guide/TaxExample";
import { Link } from "react-router-dom";
import { taxTerms } from "../data/taxTerms";
import { sources } from "../data/content";
import { card, SectionTitle, Source } from "./ui";

export function TaxBasics({
  compact = false,
  guide = false,
}: {
  compact?: boolean;
  guide?: boolean;
}) {
  if (compact)
    return (
      <aside
        aria-label="Significado dos tributos"
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700"
      >
        <span>IBS: tributo estadual e municipal. CBS: tributo federal.</span>
        <Link
          to="/entenda#tributos"
          className="font-semibold text-accent underline"
        >
          Entenda os tributos
        </Link>
      </aside>
    );
  return (
    <section id="tributos" className="scroll-mt-6">
      <SectionTitle title="Conheça os novos tributos">
        <GlossaryText
          introduce={["IBS", "CBS", "IS"]}
          text="IBS e CBS substituem tributos sobre consumo; o IS é separado."
        />
      </SectionTitle>
      <div className="grid items-start gap-4 md:grid-cols-3">
        {taxTerms.map((t) => (
          <article key={t.acronym} className={card + " flex min-w-0 flex-col"}>
            <span className="mb-3 w-fit rounded-lg bg-soft px-3 py-1 text-xl font-semibold text-accent">
              {t.acronym}
            </span>
            <h3 className="font-semibold leading-snug text-brand">{t.name}</h3>

            <p className="mt-3 text-sm font-semibold text-brand">
              <GlossaryText
                text={t.change}
                introduce={
                  t.acronym === "IBS"
                    ? ["ICMS", "ISS"]
                    : t.acronym === "CBS"
                      ? ["PIS e Cofins"]
                      : []
                }
              />
            </p>
            <TaxExample
              acronym={t.acronym}
              description={t.description}
              example={t.example}
            />
          </article>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Source url={sources.overview}>Fonte: Receita Federal</Source>
        {!guide && (
          <Link
            to="/entenda#cronograma"
            className="text-sm font-semibold text-accent underline underline-offset-4"
          >
            Veja quando cada mudança acontece
          </Link>
        )}
      </div>
    </section>
  );
}
