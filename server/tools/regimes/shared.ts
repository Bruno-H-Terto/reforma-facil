import { z } from "zod";
import type { Entry } from "../../../src/data/business.ts";

/**
 * Contrato compartilhado entre as quatro tools de explicação.
 * Usar dados editoriais do próprio site evita textos divergentes entre
 * o chatbot e a página Minha empresa.
 *
 * O tópico filtra as seções, mas fontes, rota, data e ressalvas sempre aparecem.
 */
export const explanationSchema = z.object({
  topico: z
    .enum(["resumo", "exemplo", "cuidados", "completo"])
    .default("resumo")
    .describe(
      "Resumo da reforma, exemplo prático, cuidados do negócio ou explicação completa.",
    ),
});

export type ExplanationTopic = z.infer<typeof explanationSchema>["topico"];

export type RegimeContent = {
  id: string;
  titulo: string;
  antes: string;
  mudancas: string;
  impacto: string;
  exemplo: string;
  acoes: readonly string[];
  fontes: ReadonlyArray<readonly [string, string]>;
  urlPortal: string;
};

/** Monta a resposta estruturada sem consultar o modelo ou inventar informações. */
export function explainRegime(
  content: RegimeContent,
  topico: ExplanationTopic,
) {
  const sections =
    topico === "resumo"
      ? {
          antes: content.antes,
          mudancas: content.mudancas,
          impacto: content.impacto,
        }
      : topico === "exemplo"
        ? {
            mudancas: content.mudancas,
            exemplo: content.exemplo,
          }
        : topico === "cuidados"
          ? {
              impacto: content.impacto,
              acoes: content.acoes,
            }
          : {
              antes: content.antes,
              mudancas: content.mudancas,
              impacto: content.impacto,
              exemplo: content.exemplo,
              acoes: content.acoes,
            };

  return JSON.stringify({
    status: "ok",
    regime: content.id,
    titulo: content.titulo,
    topico,
    ...sections,
    paginaPortal: content.urlPortal,
    fontes: content.fontes.map(([rotulo, url]) => ({ rotulo, url })),
    aviso:
      "Conteúdo educacional do portal, não parecer contábil. Para afirmar vigência ou alterações posteriores, consulte fontes oficiais atualizadas; esta função não faz busca na internet.",
  });
}

/** Seleciona o regime de forma estrita, sem assumir um regime por semelhança. */
export function fromBusinessEntry(entry: Entry): RegimeContent {
  return {
    id: entry.id,
    titulo: entry.title,
    antes: entry.before,
    mudancas: entry.after,
    impacto: entry.impact,
    exemplo: entry.example,
    acoes: entry.actions,
    fontes: entry.refs,
    urlPortal: "/empresas?regime=" + entry.id,
  };
}
