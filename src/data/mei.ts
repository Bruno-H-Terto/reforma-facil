export const meiSources = {
  law: "https://planalto.gov.br/ccivil_03/leis/lcp/lcp238.htm",
  ceiling: "https://www.gov.br/memp/pt-br/prospera-mei/teto-do-mei",
  reform:
    "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/reforma-de-fato",
  remission:
    "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/perdao-das-dividas-do-mei-sera-automatico-nao-e-preciso-fazer-pedido",
  pgfn: "https://www.gov.br/pgfn/pt-br/servicos/perguntas-frequentes/perguntas-frequentes-perdao-do-mei",
  das: "https://www8.receita.fazenda.gov.br/simplesnacional/Noticias/NoticiaCompleta.aspx?id=c3b2044c-ff97-432a-b33c-ecf2a3df6dc3",
};
export const limits = [
  { year: 2026, annual: 81000, monthly: 6750 },
  { year: 2027, annual: 110000, monthly: 9166.67 },
  { year: 2028, annual: 140000, monthly: 11666.67 },
];
export function meiLimit(year: number, month: number) {
  const l = limits.find((x) => x.year === year);
  if (!l || !Number.isInteger(month) || month < 1 || month > 12) return 0;
  return month === 1
    ? l.annual
    : Math.round(l.monthly * (13 - month) * 100) / 100;
}
export const das2026 = { commerce: 82.05, services: 86.05, mixed: 87.05 };
