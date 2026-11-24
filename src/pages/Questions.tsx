import { card, FAQ, PageIntro, SectionTitle, Source } from '../components/ui'
import { faqs, glossary, sources } from '../data/content'
export function Questions() {
  return <div className="space-y-8"><PageIntro label="Perguntas e respostas" title="Tire suas dúvidas">Explicações rápidas para os termos e perguntas mais comuns.</PageIntro><section><SectionTitle title="Perguntas frequentes"/><FAQ items={faqs}/><div className="mt-4"><Source url={sources.overview}/></div></section><section><SectionTitle title="Glossário"/><dl className="grid gap-4 md:grid-cols-2">{glossary.map(([term,meaning])=><div key={term} className={card}><dt className="font-semibold text-brand">{term}</dt><dd className="mt-2 text-sm leading-relaxed text-slate-600">{meaning}</dd></div>)}</dl></section></div>
}
