import {
  ArrowRight,
  BookOpen01,
  BarChart01,
  Calculator,
  FileSearch02,
} from "@untitledui/icons";
import { Link } from "react-router-dom";
import { SectionContainer } from "./SectionContainer";
const actions = [
  {
    icon: BookOpen01,
    title: "Entenda a reforma",
    text: "Novos impostos e datas da transição.",
    to: "/entenda",
  },
  {
    icon: BarChart01,
    title: "Impactos por regime",
    text: "Entenda as mudanças no seu regime tributário.",
    to: "/empresas",
  },
  {
    icon: Calculator,
    title: "Simule seus tributos",
    text: "Veja uma estimativa em reais.",
    to: "/simulador",
  },
  {
    icon: FileSearch02,
    title: "Consulte fontes",
    text: "Notícias e legislação oficial.",
    to: "/noticias",
  },
];
export function QuickAccessCards() {
  return (
    <SectionContainer
      labelledBy="quick-access-heading"
      className="bg-paper lg:[@media(max-height:800px)]:py-3"
      spacing="normal"
    >
      <h2 id="quick-access-heading" className="sr-only">
        O que você precisa hoje?
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ icon: Icon, title, text, to }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex min-w-0 items-center gap-4 rounded-xl border border-white/90 bg-surface p-3.5 shadow-panel hover:border-accent active:bg-soft transition-colors motion-safe:transition-transform duration-200 motion-safe:hover:-translate-y-0.5 sm:flex-col sm:items-start sm:gap-3 sm:p-5 lg:[@media(max-height:800px)]:flex-row lg:[@media(max-height:800px)]:items-center lg:[@media(max-height:800px)]:gap-3 lg:[@media(max-height:800px)]:p-3"
          >
            <Icon
              className="size-8 shrink-0 text-gold-ink lg:[@media(max-height:800px)]:size-6"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold leading-snug text-brand lg:text-xl lg:[@media(max-height:800px)]:text-lg">
                {title}
              </h3>
              <p className="mt-2 hidden text-base lg:[@media(max-height:800px)]:mt-1 lg:[@media(max-height:800px)]:text-sm leading-relaxed text-muted sm:block">
                {text}
              </p>
            </div>
            <ArrowRight
              className="size-5 shrink-0 self-center text-gold-ink sm:self-end sm:mt-auto lg:[@media(max-height:800px)]:self-center lg:[@media(max-height:800px)]:mt-0 lg:[@media(max-height:800px)]:size-4"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
      <Link
        to="/entenda#cronograma"
        className="mt-2 inline-flex items-center gap-3 text-sm font-semibold text-accent underline underline-offset-4"
      >
        Ver cronograma completo{" "}
        <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
      </Link>
    </SectionContainer>
  );
}
