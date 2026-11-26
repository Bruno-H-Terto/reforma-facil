import type { Annex } from "./taxTables";
// Resolução CGSN 196/2026, art. 3º, anexos I–V, vigência 2027–2028.
// Percentuais da partilha do DAS (não sobre faturamento), faixas 1 a 5.
// Anexo III faixas 3 e 4: 16,41% na resolução de 24/11/2026.
export const shares2728: Record<Annex, number[][]> = {
  I: [
    [15.33, 0.17],
    [15.33, 0.17],
    [15.33, 0.17],
    [15.33, 0.17],
    [15.33, 0.17],
  ],
  II: [
    [13.85, 0.15],
    [13.85, 0.15],
    [13.85, 0.15],
    [13.85, 0.15],
    [13.85, 0.15],
  ],
  III: [
    [15.43, 0.17],
    [16.91, 0.19],
    [16.41, 0.19],
    [16.41, 0.19],
    [15.43, 0.17],
  ],
  IV: [
    [21.26, 0.24],
    [24.73, 0.27],
    [23.74, 0.26],
    [22.75, 0.25],
    [21.76, 0.24],
  ],
  V: [
    [16.96, 0.19],
    [16.96, 0.19],
    [17.95, 0.2],
    [18.94, 0.21],
    [16.96, 0.19],
  ],
};
export const transitionSource =
  "https://www.in.gov.br/web/dou/-/resolucao-cgsn-n-196-de-16-de-novembro-de-2026-745832719";
export const transitionNews =
  "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/comite-gestor-do-simples-nacional-publica-novas-regras-para-o-simples-nacional-e-para-a-transicao-da-reforma-tributaria";
