import { sources } from "./content.js";
export const legal = {
  simples: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
  junior: "https://legis.senado.leg.br/norma/602492/publicacao/15639320",
  renda:
    "https://www2.camara.leg.br/legin/fed/lei/1998/lei-9718-27-novembro-1998-372109-normaatualizada-pl.html",
  lc224: "https://planalto.gov.br/ccivil_03/leis/lcp/lcp224.htm",
  update:
    "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/comite-gestor-do-simples-nacional-publica-novas-regras-para-o-simples-nacional-e-para-a-transicao-da-reforma-tributaria",
  pib: "https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9054-.html",
  ranking:
    "https://www.fazenda.pr.gov.br/Noticia/4a-economia-do-Pais-PIB-do-Parana-cresce-34-e-alcanca-R-72663-bilhoes-em-2024",
};
export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  before: string;
  after: string;
  impact: string;
  example: string;
  actions: string[];
  refs: [string, string][];
};
const iva: [string, string] = [
  "LC 214/2025, arts. 11, 41 e 47 (texto compilado)",
  sources.law,
];
const sn: [string, string] = ["LC 123/2006, art. 18 e anexos", legal.simples];
const update: [string, string] = [
  "CGSN — Resolução 196/2026 (24/11/2026)",
  legal.update,
];
const renda: [string, string] = ["Lei 9.718/1998, arts. 13 e 14", legal.renda];
export const regimes: Entry[] = [
  {
    id: "simples-nacional",
    title: "Simples Nacional",
    subtitle: "Para pequenos negócios que recolhem tributos em uma guia.",
    before:
      "DAS reúne tributos conforme a atividade, receita e faixa. Há exceções e recolhimentos fora da guia.",
    after:
      "O regime permanece. A partir de 2027, IBS e CBS entram na sistemática do Simples conforme a transição. É possível optar por apurá-los no regime regular, mantendo os demais tributos no Simples.",
    impact:
      "Dentro do DAS, não há apropriação própria de créditos de IBS/CBS; o cliente do regime regular pode aproveitar o valor devido por meio do Simples, nas condições legais. Fora do DAS, aplicam-se as regras de créditos do regime regular.",
    example:
      "Uma loja que vende ao consumidor final pode valorizar a simplicidade; uma fornecedora de empresas deve comparar créditos transferidos e custo efetivo. Nenhuma opção é automaticamente melhor.",
    actions: [
      "Identifique o anexo e a receita dos últimos 12 meses.",
      "Separe vendas para consumidores e empresas.",
      "Compare os dois modos de recolhimento e confira os prazos de opção.",
    ],
    refs: [sn, iva, update],
  },
  {
    id: "lucro-presumido",
    title: "Lucro Presumido",
    subtitle: "Para empresas elegíveis que calculam IRPJ e CSLL por presunção.",
    before:
      "IRPJ e CSLL seguem bases presumidas; PIS/Cofins são geralmente cumulativos. ICMS e ISS dependem da operação.",
    after:
      "A reforma do consumo substitui PIS/Cofins pela CBS e, gradualmente, ICMS/ISS pelo IBS. A apuração de IRPJ/CSLL não se transforma em Lucro Real por causa dessa reforma.",
    impact:
      "O regime regular de IBS/CBS permite créditos elegíveis de compras. Serviços intensivos em mão de obra podem ter menos créditos, porque salários não geram IBS/CBS. A LC 224/2025, medida distinta da reforma do consumo, alterou percentuais de presunção sobre a parcela de receita acima do limite legal.",
    example:
      "Uma consultoria que vende R$ 100 mil por mês e compra poucos insumos tributados deve revisar margem, preço e contratos; uma distribuidora com compras tributadas pode ter mais créditos.",
    actions: [
      "Valide elegibilidade: receita anterior até R$ 78 milhões, observadas as vedações.",
      "Separe tributos de renda dos tributos de consumo.",
      "Mapeie compras com créditos, contratos e clientes.",
    ],
    refs: [renda, iva, ["LC 224/2025, art. 4º", legal.lc224]],
  },
  {
    id: "lucro-real",
    title: "Lucro Real",
    subtitle: "Para empresas que apuram IRPJ e CSLL sobre lucro ajustado.",
    before:
      "IRPJ/CSLL calculados sobre lucro fiscal ajustado; PIS/Cofins geralmente não cumulativos, com exceções.",
    after:
      "CBS e IBS seguem o regime regular de consumo. O Lucro Real continua existindo para IRPJ/CSLL; as bases e créditos dos novos tributos seguem normas próprias.",
    impact:
      "Empresas com cadeia extensa precisam reconciliar documentos, créditos, estoque, contratos, saldos legados e caixa. O split payment deve ser acompanhado conforme sua implementação.",
    example:
      "Uma indústria com filiais deve conferir o destino de cada venda, os créditos de fornecedores e os efeitos sobre capital de giro; não basta trocar a alíquota no ERP.",
    actions: [
      "Inventarie créditos antigos e benefícios fiscais.",
      "Adapte ERP e documentos por operação e destino.",
      "Simule margem e caixa durante cada fase da transição.",
    ],
    refs: [renda, iva, ["LC 227/2026", sources.law227]],
  },
];
export const annexes: Entry[] = [
  {
    id: "anexo-i",
    title: "Anexo I — Comércio",
    subtitle: "Lojas, revendas e comércio eletrônico.",
    before:
      "DAS sobre receitas de revenda, conforme faixa e segregação; ICMS pode ter regras externas.",
    after:
      "CBS e IBS entram na transição do Simples; comparar regime regular é relevante quando há compras tributadas e vendas B2B.",
    impact:
      "O estoque e as notas de fornecedores influenciam créditos no regime regular; no DAS não há crédito próprio de IBS/CBS.",
    example:
      "Uma loja de roupas vende ao público e a lojistas. Separe os dois públicos antes de comparar preço e crédito.",
    actions: [
      "Classifique mercadorias e receitas.",
      "Revise ICMS-ST, devoluções e fornecedores durante a transição.",
    ],
    refs: [sn, iva, update],
  },
  {
    id: "anexo-ii",
    title: "Anexo II — Indústria",
    subtitle: "Fabricação e industrialização.",
    before:
      "DAS inclui componentes próprios da indústria, inclusive IPI, conforme atividade e exceções.",
    after:
      "CBS/IBS seguem a transição; IPI terá alíquota zero na maioria dos casos a partir de 2027, ressalvadas as exceções.",
    impact:
      "Máquinas, materiais e insumos elegíveis podem gerar créditos no regime regular; vendas a outras indústrias tornam a transferência de créditos importante.",
    example:
      "Uma pequena fábrica de móveis compra madeira e ferragens e vende para revendedores. Compare a cadeia de compras e vendas, não só o DAS.",
    actions: [
      "Mapeie insumos e produtos.",
      "Revise classificação fiscal e exceções do IPI.",
    ],
    refs: [sn, iva, update],
  },
  {
    id: "anexo-iii",
    title: "Anexo III — Serviços",
    subtitle:
      "Serviços enquadrados no III, inclusive alguns sujeitos ao fator R.",
    before:
      "DAS inclui ISS e, em regra, CPP. Para atividades sujeitas ao fator R, razão de folha/receita de pelo menos 28% pode levar ao III.",
    after:
      "IBS/CBS incorporados conforme cronograma; o enquadramento do anexo e a folha continuam relevantes.",
    impact:
      "Salários não geram créditos de IBS/CBS. Benefícios e reduções de serviços dependem da atividade e das condições legais, não simplesmente do anexo.",
    example:
      "Uma empresa de manutenção com equipe própria deve comparar gastos tributados e folha antes de decidir pelo regime regular.",
    actions: [
      "Confirme atividade e fator R, quando aplicável.",
      "Separe folha de compras tributadas.",
    ],
    refs: [sn, iva, update],
  },
  {
    id: "anexo-iv",
    title: "Anexo IV — Serviços específicos",
    subtitle:
      "Construção, limpeza, vigilância e advocacia, conforme enquadramento legal.",
    before:
      "A contribuição previdenciária patronal (CPP) não integra o DAS do Anexo IV.",
    after:
      "IBS e CBS seguem a transição; a CPP permanece uma obrigação separada conforme a legislação.",
    impact:
      "Empresas com muita folha podem ter poucos créditos. Obras e serviços podem ter regras específicas de local e base; a folha fora do DAS precisa entrar na comparação financeira.",
    example:
      "Uma empresa de limpeza com muitos funcionários deve comparar DAS, CPP e tributos sobre consumo separadamente.",
    actions: [
      "Inclua CPP fora do DAS no orçamento.",
      "Verifique tratamento específico da atividade e local da prestação.",
    ],
    refs: [sn, iva, update],
  },
  {
    id: "anexo-v",
    title: "Anexo V — Serviços especializados",
    subtitle: "Atividades intelectuais sujeitas às regras de enquadramento.",
    before:
      "Atividades sujeitas ao fator R podem ficar no V quando a razão folha/receita é inferior a 28%.",
    after: "O Anexo V não desaparece; IBS e CBS seguem a transição do Simples.",
    impact:
      "Não confunda redução de alíquota de IBS/CBS para profissões regulamentadas com a tabela do DAS. Cada regra possui requisitos próprios.",
    example:
      "Uma consultoria de tecnologia com pouca folha deve conferir seu enquadramento e créditos disponíveis antes de optar pelo regime regular.",
    actions: [
      "Calcule fator R quando aplicável.",
      "Confirme o tratamento legal de cada serviço.",
    ],
    refs: [sn, iva, update],
  },
];
export const profiles: Entry[] = [
  {
    id: "pequena",
    title: "Micro e pequena empresa",
    subtitle: "Foco em preço, caixa e simplicidade.",
    before:
      "Pode estar no Simples, Presumido ou Real conforme elegibilidade e escolha.",
    after: "IBS/CBS afetam compras e vendas; o Simples permanece.",
    impact:
      "Evite decidir pelo menor percentual isolado. Compare a carga sobre consumo, custos de operação e crédito do cliente.",
    example:
      "Uma padaria deve separar produtos, fornecedores e vendas ao consumidor.",
    actions: [
      "Descubra seu regime e atividades.",
      "Revise preços com o contador.",
    ],
    refs: [sn, iva],
  },
  {
    id: "media",
    title: "Empresa média",
    subtitle: "Foco em margens, contratos e cadeia de fornecedores.",
    before:
      "Porte não define sozinho o regime. Pode optar pelo Presumido se atender aos requisitos.",
    after:
      "No regime regular, compras elegíveis geram créditos de IBS/CBS e a tributação segue o destino.",
    impact:
      "Se estiver no Presumido, avalie separadamente a LC 224/2025 e os efeitos sobre IRPJ/CSLL; na reforma do consumo, revise contratos e preço líquido.",
    example:
      "Uma distribuidora regional deve comparar operações por destino e disponibilidade de créditos.",
    actions: [
      "Revise elegibilidade e faturamento.",
      "Segmente clientes e contratos.",
    ],
    refs: [renda, iva, ["LC 224/2025", legal.lc224]],
  },
  {
    id: "grande",
    title: "Grande empresa",
    subtitle: "Foco em operações multiestaduais, ERP e governança.",
    before:
      "Receita anterior superior a R$ 78 milhões obriga Lucro Real; outras hipóteses também obrigam. Porte societário não equivale automaticamente a esse limite.",
    after:
      "A reforma modifica consumo, não determina por si só a migração de regime de renda.",
    impact:
      "Controle créditos de cada estabelecimento, preços por destino, benefícios, saldos antigos e fluxos de caixa.",
    example:
      "Uma rede nacional precisa modelar as vendas por UF e município e testar sistemas em paralelo durante a transição.",
    actions: [
      "Crie matriz de operações e destinos.",
      "Audite cadastro, benefícios e créditos; prepare ERP e tesouraria.",
    ],
    refs: [renda, iva, ["LC 227/2026", sources.law227]],
  },
  {
    id: "empresa-junior",
    title: "Empresa júnior",
    subtitle: "Associação civil estudantil, não uma empresa comercial comum.",
    before:
      "A Lei 13.267/2016 define a empresa júnior como associação civil gerida por estudantes. Pode cobrar por serviços; isso não determina Lucro Presumido.",
    after:
      "Serviços remunerados devem ser avaliados pelas regras de incidência do IBS/CBS e eventual imunidade. A natureza sem fins lucrativos não garante dispensa geral.",
    impact:
      "Separe mensalidades estatutárias sem contraprestação, doações e serviços remunerados. Avalie finalidade, estatuto e requisitos legais.",
    example:
      "Uma empresa júnior recebe doação e cobra por um projeto de engenharia. As duas entradas não devem receber automaticamente o mesmo tratamento.",
    actions: [
      "Confira estatuto e natureza de cada receita.",
      "Solicite avaliação contábil sobre imunidade e obrigações.",
    ],
    refs: [
      ["Lei 13.267/2016, art. 2º", legal.junior],
      iva,
      ["LC 227/2026 — contribuições associativas", sources.law227],
    ],
  },
  {
    id: "associacao",
    title: "Associações",
    subtitle: "Entidades civis com receitas associativas e eventuais serviços.",
    before:
      "O tratamento fiscal depende da finalidade, receitas e requisitos de imunidade ou isenção.",
    after:
      "Contribuições associativas estatutárias sem contraprestação destinadas à manutenção de associações civis sem fins econômicos que atendam ao art. 14 do CTN estão fora da incidência conforme LC 227/2026.",
    impact:
      "Mensalidade associativa não equivale automaticamente a pagamento por serviço. Receitas contraprestacionais exigem análise própria.",
    example:
      "Uma associação cobra contribuição estatutária e vende ingressos para evento. Classifique as receitas separadamente.",
    actions: [
      "Verifique estatuto, escrituração e requisitos do CTN.",
      "Separe contribuição de prestação remunerada.",
    ],
    refs: [["LC 227/2026", sources.law227], iva],
  },
  {
    id: "sem-fins-lucrativos",
    title: "Entidades sem fins lucrativos",
    subtitle:
      "ONGs, instituições e outras entidades sem distribuição de resultados.",
    before:
      "Imunidade e isenção não são sinônimos e dependem de requisitos. Nem toda entidade sem fins lucrativos é imune.",
    after:
      "A LC 214 prevê imunidades específicas, inclusive para instituições de educação e assistência social sem fins lucrativos que cumpram requisitos legais.",
    impact:
      "Avalie fornecimentos e aquisições separadamente; imunidade nas saídas não significa automaticamente ausência de tributo nas compras.",
    example:
      "Uma instituição educacional sem fins lucrativos deve comprovar requisitos e examinar receitas acessórias e custos de aquisição.",
    actions: [
      "Confirme natureza jurídica e requisitos legais.",
      "Avalie cada operação e preserve documentação.",
    ],
    refs: [
      ["LC 214/2025, arts. 6º a 9º", sources.law],
      ["LC 227/2026", sources.law227],
    ],
  },
];
export const states = [
  ["AC", "Acre"],
  ["AL", "Alagoas"],
  ["AP", "Amapá"],
  ["AM", "Amazonas"],
  ["BA", "Bahia"],
  ["CE", "Ceará"],
  ["DF", "Distrito Federal"],
  ["ES", "Espírito Santo"],
  ["GO", "Goiás"],
  ["MA", "Maranhão"],
  ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"],
  ["PA", "Pará"],
  ["PB", "Paraíba"],
  ["PR", "Paraná"],
  ["PE", "Pernambuco"],
  ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"],
  ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"],
  ["RR", "Roraima"],
  ["SC", "Santa Catarina"],
  ["SP", "São Paulo"],
  ["SE", "Sergipe"],
  ["TO", "Tocantins"],
];
export const cases = [
  {
    uf: "SP",
    rank: 1,
    activity: "Comércio eletrônico em Campinas",
    destination: "Belo Horizonte (MG)",
    before: "Verifique ICMS interestadual, DIFAL e eventuais regras de ST.",
    after:
      "Na entrega de mercadoria, o IBS considera o destino em MG e o município de entrega.",
    focus: "Cadastro de endereços e preço por destino.",
    source:
      "https://portal.fazenda.sp.gov.br/servicos/simples/Paginas/Sobre.aspx",
  },
  {
    uf: "RJ",
    rank: 2,
    activity: "Distribuidora no Rio de Janeiro",
    destination: "Vitória (ES)",
    before:
      "Verifique ICMS interestadual e tratamento específico da mercadoria.",
    after: "A entrega no ES determina o destino do IBS na hipótese geral.",
    focus: "Revisar contratos, estoques e eventual incentivo fiscal.",
    source: "https://portal.fazenda.rj.gov.br/",
  },
  {
    uf: "MG",
    rank: 3,
    activity: "Fábrica de móveis em Juiz de Fora",
    destination: "Rio de Janeiro (RJ)",
    before:
      "Avalie ICMS/IPI e PIS/Cofins aplicáveis, além dos créditos atuais.",
    after:
      "O IBS considera o destino no RJ; compras elegíveis podem gerar créditos no regime regular.",
    focus: "Mapear materiais, fornecedores e margem.",
    source: "https://www.fazenda.mg.gov.br/reforma-tributaria",
  },
  {
    uf: "PR",
    rank: 4,
    activity: "Indústria de embalagens em Curitiba",
    destination: "São Paulo (SP)",
    before: "Verifique ICMS interestadual e créditos de insumos.",
    after: "O IBS da entrega considera SP; CBS segue a regra federal.",
    focus: "Atualizar cadastro de itens e documentos fiscais.",
    source: "https://www.fazenda.pr.gov.br/Pagina/Reforma-Tributaria",
  },
  {
    uf: "RS",
    rank: 5,
    activity: "Fabricante de calçados em Novo Hamburgo",
    destination: "Florianópolis (SC)",
    before: "Avalie ICMS, créditos e benefícios aplicáveis ao estabelecimento.",
    after:
      "O IBS considera o destino em SC; a transição exige conciliar os dois modelos.",
    focus: "Rever benefícios e preço para revendedores.",
    source: "https://receita.fazenda.rs.gov.br/",
  },
  {
    uf: "SC",
    rank: 6,
    activity: "Confecção em Blumenau",
    destination: "Curitiba (PR)",
    before: "Verifique ICMS, PIS/Cofins e benefícios estaduais aplicáveis.",
    after:
      "O IBS considera o destino no PR, e os créditos elegíveis seguem a LC 214.",
    focus: "Revisar cadeia de insumos, notas fiscais e logística.",
    source:
      "https://www.sef.sc.gov.br/noticias/novas-malhas-fiscais-da-fazenda-auxiliam-no-atendimento-a-mudancas-impostas-pela-reforma-tributaria",
  },
];
