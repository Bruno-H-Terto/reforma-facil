export const reviewed = "24/11/2026";
const rfb =
  "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo";
export const sources = {
  overview: rfb + "/entenda",
  law: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm",
  law227: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp227.htm",
  timeline:
    "https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria/perguntas-e-respostas/como-sera-a-transicao-para",
  simples:
    "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/simples-nacional-2027-entenda-os-novos-prazos-e-faca-sua-escolha-com-consciencia-e-tranquilidade/",
  service:
    "https://www.gov.br/pt-br/servicos/escolher-regime-de-apuracao-de-bens-e-servicos-ibs-e-da-contribuicao-sobre-bens-e-servicos-cbs",
  legislation: rfb + "/legislacao",
  news: "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/rfb-e-cgibs-alinham-proximos-passos-da-implementacao-da-reforma-e-reforcam-compromisso-com-a-conformidade-tributaria",
  manuals:
    "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/manuais/reforma-tributaria-do-consumo",
};
export const timeline = [
  {
    year: "2026",
    title: "Ano de teste",
    text: "Fase inicial de IBS e CBS. A dispensa de recolhimento das alíquotas de teste depende do cumprimento das obrigações previstas na legislação.",
  },
  {
    year: "2027–2028",
    title: "Início da CBS",
    text: "CBS substitui PIS e Cofins; início do Imposto Seletivo e redução do IPI a zero, ressalvadas as exceções legais.",
  },
  {
    year: "2029–2032",
    title: "Transição gradual",
    text: "ICMS e ISS diminuem gradualmente enquanto o IBS ganha participação.",
  },
  {
    year: "2033",
    title: "Novo modelo em vigor",
    text: "IBS substitui integralmente ICMS e ISS no cronograma geral.",
  },
];
export const topics = [
  {
    title: "O que muda com a reforma?",
    category: "Entenda",
    date: "20/12/2023",
    text: "O novo sistema de tributação sobre consumo reúne tributos em um IVA dual: CBS federal e IBS estadual e municipal. O Imposto Seletivo é separado.",
    url: sources.overview,
  },
  {
    title: "Lei Complementar 214/2025",
    category: "Legislação",
    date: "16/01/2025",
    text: "Institui IBS, CBS e Imposto Seletivo. Consulte o texto compilado para regras e exceções.",
    url: sources.law,
  },
  {
    title: "Lei Complementar 227/2026",
    category: "Legislação",
    date: "13/01/2026",
    text: "Dispõe sobre o Comitê Gestor do IBS e altera regras da regulamentação.",
    url: sources.law227,
  },
  {
    title: "Simples Nacional: dentro ou fora do DAS?",
    category: "Simples Nacional",
    date: "2026",
    text: "Optantes podem escolher a apuração regular de IBS e CBS separadamente do DAS. A decisão depende de créditos, preços e perfil dos clientes. Confira os prazos e regras vigentes.",
    url: sources.simples,
  },
  {
    title: "Receita Federal e CGIBS alinham implementação",
    category: "Atualizações",
    date: "18/11/2026",
    text: "Os órgãos discutiram próximos passos da implementação e atuação conjunta na gestão do IVA dual.",
    url: sources.news,
  },
  {
    title: "Cronograma da transição",
    category: "Entenda",
    date: "2026",
    text: "Veja a implantação gradual do novo modelo entre 2026 e 2033 e as regras de transição.",
    url: sources.timeline,
  },
  {
    title: "Manuais oficiais e orientações técnicas",
    category: "Atualizações",
    date: "2026",
    text: "Documentação da Receita Federal para preparar sistemas, documentos fiscais e rotinas.",
    url: sources.manuals,
  },
];
export const glossary = [
  ["CBS", "Contribuição sobre Bens e Serviços, de competência federal."],
  [
    "IBS",
    "Imposto sobre Bens e Serviços, de competência compartilhada entre estados e municípios.",
  ],
  ["IVA dual", "Modelo de imposto sobre valor agregado dividido em CBS e IBS."],
  [
    "DAS",
    "Documento de Arrecadação do Simples Nacional: guia unificada de pagamento.",
  ],
  [
    "Crédito tributário",
    "Neste contexto, valor de tributo sobre aquisições que pode ser aproveitado para reduzir o saldo devido, conforme requisitos legais.",
  ],
  [
    "Imposto Seletivo",
    "Tributo federal sobre bens e serviços prejudiciais à saúde ou ao meio ambiente, conforme legislação.",
  ],
];
export const faqs = [
  [
    "A reforma já começou?",
    "Sim. 2026 é o ano inicial de teste. As mudanças são graduais até 2033. Consulte as obrigações aplicáveis ao seu caso.",
  ],
  [
    "O Simples Nacional vai acabar?",
    "Não. O regime permanece. Empresas poderão recolher IBS e CBS no Simples ou, observadas as regras, pelo regime regular.",
  ],
  [
    "A alíquota será igual para todas as empresas?",
    "Não necessariamente. Há reduções, regimes específicos e exceções; alíquotas de referência e regras dependem da regulamentação.",
  ],
  [
    "O simulador informa quanto vou pagar de imposto?",
    "Não. Ele compara hipóteses fornecidas por você e não faz apuração fiscal oficial.",
  ],
  [
    "Qual a diferença entre dentro do DAS e imposto por dentro do preço?",
    "Dentro do DAS é uma forma de recolhimento. Por dentro do preço é um método de cálculo. São conceitos distintos.",
  ],
];
