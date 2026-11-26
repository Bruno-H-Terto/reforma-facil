import { TaxComparison } from "../components/guide/TaxComparison";
import { TransitionTimeline } from "../components/guide/TransitionTimeline";
import { Navigate, useLocation } from "react-router-dom";
import { GlossaryText } from "../components/guide/GlossaryText";
import { TaxBasics } from "../components/TaxBasics";
import { Action, card, PageIntro, SectionTitle } from "../components/ui";
export function Guide() {
  const { hash } = useLocation();
  if (hash === "#glossario") return <Navigate to="/entenda#tributos" replace />;
  if (hash === "#duvidas") return <Navigate to="/#duvidas" replace />;
  return (
    <div className="space-y-10">
      <div>
        <PageIntro label="Guia essencial" title="O que muda na prática?">
          <GlossaryText
            introduce={["IVA dual"]}
            text="A reforma reorganiza os tributos sobre bens e serviços em um IVA dual. A mudança acontece por etapas."
          />
        </PageIntro>
        <aside
          aria-label="Como consultar os termos"
          className="flex w-full items-center gap-3 rounded-xl bg-soft px-3 py-2 sm:gap-5 sm:px-5"
        >
          <img
            src="/images/mascot/chat-thinking.webp"
            alt="Reforminha pensativo"
            width={150}
            height={150}
            className="h-auto w-16 shrink-0 object-contain sm:w-20"
          />
          <div className="min-w-0">
            <p className="text-base font-semibold text-brand">
              Encontrou um termo desconhecido?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Passe o mouse ou toque nas{" "}
              <span className="underline decoration-dotted underline-offset-[0.2em]">
                palavras sublinhadas
              </span>{" "}
              para consultar seu significado.
            </p>
          </div>
        </aside>
      </div>
      <TaxBasics guide />
      <TaxComparison />
      <TransitionTimeline />
      <section className={card}>
        <SectionTitle title="O que fazer agora?" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "Empresários",
              "Converse com seu contador, revise preços, clientes, fornecedores e o DAS, quando aplicável.",
            ],
            [
              "Contadores",
              "Revise documentos fiscais, regimes, créditos tributários e sistemas com base na legislação.",
            ],
            ["Estudantes", "Comece pelo comparativo e cronograma."],
          ].map(([t, a]) => (
            <div key={t}>
              <h3 className="font-semibold text-brand">{t}</h3>
              <p className="mt-2 text-sm">
                <GlossaryText
                  text={a}
                  introduce={
                    t === "Empresários"
                      ? ["DAS"]
                      : t === "Contadores"
                        ? ["Crédito tributário"]
                        : []
                  }
                />
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Action to="/simulador">Explorar cenários</Action>
        </div>
      </section>
    </div>
  );
}
