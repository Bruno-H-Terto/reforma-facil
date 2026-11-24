import {
  ArrowRight,
  BookOpen01,
  Calculator,
  Calendar,
  FileSearch02,
} from "@untitledui/icons";
import { Link } from "react-router-dom";
import { Action, card, SectionTitle, Source } from "../components/ui";
import { TopicCarousel } from "../components/TopicCarousel";
import { sources, timeline, reviewed } from "../data/content";
const features = [
  {
    icon: BookOpen01,
    title: "Entenda as mudanças",
    text: "O que são IBS, CBS e o novo sistema, sem complicação.",
    to: "/entenda",
  },
  {
    icon: Calculator,
    title: "Simule cenários",
    text: "Compare hipóteses de recolhimento para sua empresa.",
    to: "/simulador",
  },
  {
    icon: FileSearch02,
    title: "Consulte a legislação",
    text: "Encontre normas, notícias e manuais em fontes oficiais.",
    to: "/biblioteca",
  },
];
export function Home() {
  return (
    <div className="space-y-10">
      <section className="grid overflow-hidden rounded-3xl bg-brand text-white lg:grid-cols-[1.25fr_1fr]">
        <div className="p-7 sm:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-200">
            Reforma tributária do consumo
          </p>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Entenda as mudanças. Prepare sua empresa.
          </h1>
          <p className="my-6 max-w-lg text-sm leading-relaxed text-slate-100 sm:text-base">
            O essencial sobre a reforma tributária brasileira, com explicações
            simples, fontes oficiais e ferramentas para planejar seus próximos
            passos.
          </p>
          <Link
            to="/entenda"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand hover:bg-emerald-100"
          >
            Começar pelo básico{" "}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <figure className="relative flex min-h-64 items-center justify-center bg-emerald-50 p-4 sm:p-7">
          <img
            src="/images/analytics.svg"
            alt="Ilustração de profissionais analisando dados empresariais e gráficos"
            width="500"
            height="500"
            className="max-h-80 w-full object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-105 lg:max-h-96"
          />
        </figure>
      </section>
      <section>
        <SectionTitle title="O que você quer fazer?">
          Escolha o caminho mais útil para você.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text, to }) => (
            <Link
              key={to}
              to={to}
              className={
                card +
                " group transition-colors hover:border-accent motion-safe:transition-all motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-md"
              }
            >
              <Icon aria-hidden="true" className="mb-4 size-7 text-accent" />
              <h3 className="font-semibold text-brand">{title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Acessar <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid min-w-0 gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-brand p-6 text-white sm:p-8">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-100">
            <Calendar className="size-5" aria-hidden="true" /> Onde estamos na
            transição
          </p>
          <p className="text-5xl font-semibold">2026</p>
          <p className="mt-2 font-medium">Ano de teste e adaptação</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-100">
            Prepare sistemas, acompanhe as obrigações e avalie os efeitos das
            novas regras.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            {timeline.map((t, i) => (
              <div key={t.year}>
                <div
                  className={
                    "mb-2 h-1.5 rounded-full " +
                    (i === 0 ? "bg-emerald-300" : "bg-white/30")
                  }
                />
                {t.year}
              </div>
            ))}
          </div>
          <Link
            to="/entenda#cronograma"
            className="mt-5 text-sm font-semibold underline underline-offset-4"
          >
            Ver cronograma completo
          </Link>
        </div>

        <div
          className={
            card + " grid min-w-0 items-center gap-4 sm:grid-cols-[1fr_0.65fr]"
          }
        >
          <div>
            <p className="text-xs font-semibold uppercase text-accent">
              Para empresas
            </p>
            <h2 className="mt-2 text-xl font-semibold text-brand">
              Sua empresa está no Simples?
            </h2>
            <p className="my-4 text-sm leading-relaxed text-slate-600">
              Entenda a diferença entre o recolhimento dentro do DAS e o regime
              regular de IBS e CBS.
            </p>
            <Action to="/simulador">Comparar cenários</Action>
          </div>
          <figure className="min-w-0">
            <img
              src="/images/finance.svg"
              width="500"
              height="500"
              alt="Ilustração de planejamento financeiro"
              className="mx-auto h-auto max-h-48 w-full object-contain"
            />
          </figure>
        </div>
      </section>
      <TopicCarousel />
      <p className="text-xs text-slate-600">
        Conteúdo revisado em {reviewed}.{" "}
        <Source url={sources.overview}>Base oficial</Source>
      </p>
    </div>
  );
}
