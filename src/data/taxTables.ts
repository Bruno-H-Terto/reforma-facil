export const ceilings = [180000, 360000, 720000, 1800000, 3600000, 4800000];
export const annexTables = {
  I: {
    name: "Comércio",
    rows: [
      [4, 0],
      [7.3, 5940],
      [9.5, 13860],
      [10.7, 22500],
      [14.3, 87300],
      [19, 378000],
    ],
  },
  II: {
    name: "Indústria",
    rows: [
      [4.5, 0],
      [7.8, 5940],
      [10, 13860],
      [11.2, 22500],
      [14.7, 85500],
      [30, 720000],
    ],
  },
  III: {
    name: "Serviços",
    rows: [
      [6, 0],
      [11.2, 9360],
      [13.5, 17640],
      [16, 35640],
      [21, 125640],
      [33, 648000],
    ],
  },
  IV: {
    name: "Serviços específicos",
    rows: [
      [4.5, 0],
      [9, 8100],
      [10.2, 12420],
      [14, 39780],
      [22, 183780],
      [33, 828000],
    ],
  },
  V: {
    name: "Serviços especializados",
    rows: [
      [15.5, 0],
      [18, 4500],
      [19.5, 9900],
      [20.5, 17100],
      [23, 62100],
      [30.5, 540000],
    ],
  },
};
export type Annex = keyof typeof annexTables;
export const taxSources = {
  simples: "https://legis.senado.gov.br/norma/572878/publicacao/34621013",
  cgsn: "https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=92278",
  sublimite:
    "https://www8.receita.fazenda.gov.br/SIMPLESNACiONAL/Noticias/NoticiaCompleta.aspx?id=94c10cc2-7eb5-4ef0-bfb2-5479e72caff8",
  irpj: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/IRPJ",
  csll: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/CSLL",
  presumido: "https://www.planalto.gov.br/ccivil_03/leis/l9249.htm",
  adjustment: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp224.htm",
  adjustmentGuidance:
    "https://normas.receita.fazenda.gov.br/sijut2consulta/consulta/normas.fazenda.gov.br/sijut2consulta/link.action?idAto=131290&visao=relacional",
  real: "https://www.planalto.gov.br/ccivil_03/leis/l9430compilada.htm",
};
