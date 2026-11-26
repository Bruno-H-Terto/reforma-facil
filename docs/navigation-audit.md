# Auditoria de navegação e consolidação de rotas — 26/11/2026

## Objetivo

Manter estados, MEI, perfis e calculadoras no fluxo já aprovado de Minha empresa
e Simular. URLs antigas continuam resolvendo via redirecionamento, preservando
favoritos e links compartilhados. Nenhuma fórmula tributária foi alterada.

## Rotas ativas

| Rota                      | Conteúdo                                                      | Entrada              |
| ------------------------- | ------------------------------------------------------------- | -------------------- |
| /                         | Início                                                        | Logo, navegação      |
| /entenda                  | Guia, cronograma                                              | Navegação            |
| /empresas                 | Regimes, anexos, perfis, MEI, impacto regional                | Navegação            |
| /simulador                | DAS rápido e detalhado 2026, Simples Híbrido, Presumido, Real | Navegação            |
| /noticias                 | Notícias oficiais por tema/UF                                 | Navegação            |
| /biblioteca               | Legislação e guias                                            | Notícias e conteúdos |
| /404 ou rota desconhecida | Página de erro                                                | Links incorretos     |

## Redirecionamentos de compatibilidade

| URL histórica                 | Página integrada                                                        | Conteúdo                                                    |
| ----------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| /estados                      | /empresas#impacto-regional                                              | 27 UFs, 6 cenários regionais, fontes e exemplos de serviços |
| /mei                          | /empresas?regime=mei#calculadora-mei                                    | Limite proporcional, DAS 2026, dívidas, FAQ                 |
| /empresas/regimes/:id         | /empresas?regime=:id                                                    | Mudanças por regime                                         |
| /empresas/anexos/:id          | /empresas?regime=simples-nacional&anexo=:id#anexos                      | Conteúdo por anexo                                          |
| /empresas/perfis/:id          | /empresas?perfil=:id#perfis                                             | Conteúdo por perfil                                         |
| /calculadoras                 | /simulador?modo=das#das-detalhado                                       | DAS detalhado                                               |
| /calculadoras/simples/:annex? | /simulador?modo=das#das-detalhado (com anexo na query quando informado) | DAS 2026, fator R e faixa                                   |
| /calculadoras/presumido       | /simulador?modo=presumido                                               | IRPJ/CSLL                                                   |
| /calculadoras/real            | /simulador?modo=real                                                    | IRPJ/CSLL                                                   |
| /simulador/avancado           | /simulador?modo=comparar                                                | Simples Híbrido                                             |
| /duvidas                      | /#duvidas                                                               | FAQ do início                                               |

URLs de compatibilidade não são páginas adicionais. IDs inválidos exibem 404.

## Componentes e páginas sem utilização

- A página antiga de MEI foi substituída pela aba MEI com calculadoras, exemplos
  e FAQ; o arquivo de página independente foi removido do Git.
- As páginas BusinessDetail e States foram substituídas pelo conteúdo integrado
  em Minha empresa. O comparador ilustrativo de serviços continua disponível
  na aba Simples.
- A página TaxCalculators foi retirada; os componentes das três calculadoras
  foram mantidos e são utilizados em Simular.
- O componente AreaNavigation.tsx já era ignorado localmente por
  .git/info/exclude e não era importado pelo projeto. Não foi alterado ou
  excluído do computador; não compõe a navegação pública.

## Critérios de verificação

- A navegação principal mantém cinco destinos.
- Escolher outro estado não modifica o DAS nacional.
- Links antigos levam à seção correta e os formulários continuam utilizáveis.
- Informação estadual não é uma nova página; fica dentro de Minha empresa.
- Biblioteca e 404 continuam intencionais.
- Cálculos, fórmulas e limitações legais permanecem como antes da consolidação.
