export type Item = { label: string; to: string; match: (p: string) => boolean };
export const areas: Item[] = [
  { label: "Início", to: "/", match: (p) => p === "/" },
  {
    label: "Entenda",
    to: "/entenda",
    match: (p) => p === "/entenda",
  },
  {
    label: "Minha empresa",
    to: "/empresas",
    match: (p) => p.startsWith("/empresas") || p === "/mei" || p === "/estados",
  },
  {
    label: "Simular",
    to: "/simulador",
    match: (p) => p.startsWith("/simulador") || p.startsWith("/calculadoras"),
  },
  {
    label: "Fontes oficiais",
    to: "/noticias",
    match: (p) => p === "/noticias" || p === "/biblioteca",
  },
];
