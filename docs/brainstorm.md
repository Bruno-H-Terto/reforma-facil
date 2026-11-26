# Reforma Clara — brainstorm e critérios de aceitação
Revisão editorial: 24/11/2026. Protótipo acadêmico, Grupo 1, Princípios de Administração II.
## Problema e público
Os anexos GRUPO 1 (5W1H) e Diagrama de Ishikawa descrevem informação dispersa, desatualizada, linguagem técnica, dificuldade de comparação, ausência de integração e custos de manutenção. Persona 1: Camila, sócia de confecção, precisa entender o Simples e comparar cenários. Persona 2: contadores, fiscais e assessorias precisam consultar regras e orientar clientes. Estudantes também são público.
## Solução
Portal sem login: início com visão geral e próximos passos; guia por público; cronograma 2026–2033; comparativo dos tributos; simulador didático parametrizado (por dentro do DAS vs regime regular); biblioteca pesquisável por tema com data e fonte; FAQ/glossário. Não confundir cálculo por dentro do preço com recolhimento dentro do DAS. Assistente IA generativa é fase futura: não simular IA ou expor chaves no navegador. Busca local e FAQ são funcionais. Sem alegação de atualização automática.
## Critérios
1. Pessoa sem conhecimento identifica o que muda e quando, em até dois cliques.
2. Empresário encontra orientação do Simples e simula hipóteses editáveis, sem recomendação fiscal automática.
3. Contador encontra texto legal e notícias datadas por busca e categoria.
4. Layout responsivo, navegação por teclado, sem rolagem horizontal; feedback de busca vazia e validação de números.
5. Regras e fontes separadas da apresentação; sem backend ou dependências desnecessárias.
## Identidade e referências
Reforma Clara: azul petróleo, verde moderado, fundo claro, contraste e tipografia legível; hierarquia editorial, cards, tabelas, navegação e detalhes progressivos. Referência de stack: https://github.com/delfino-marcal/nordion-consultoria (React, TS, Vite, Tailwind, React Aria, Router, Oxlint). Padrões de navegação e detalhes: https://design-system.service.gov.uk/components/service-navigation/ e https://design-system.service.gov.uk/components/accordion/; React Aria https://react-aria.adobe.com/Disclosure.
## Pesquisa oficial
- https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/entenda
- https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria/perguntas-e-respostas
- https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm
- https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp227.htm
- https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/simples-nacional-2027-entenda-os-novos-prazos-e-faca-sua-escolha-com-consciencia-e-tranquilidade/
- https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/novembro/rfb-e-cgibs-alinham-proximos-passos-da-implementacao-da-reforma-e-reforcam-compromisso-com-a-conformidade-tributaria

## Extensão de escopo — 25/11/2026
Central de notícias com revisão editorial, classificação nacional/UF, filtros de período/tema e acesso a fontes oficiais. Seis casos de serviços, incluindo anexos III, IV e V, com alíquotas diferenciadas condicionais e referência CBS do TCU explicitamente provisória. A atualização automática de notícias depende de uma integração futura com fontes oficiais; não é simulada.

## Extensão MEI — 25/11/2026
Página específica para SIMEI, distinta dos anexos do Simples e das simulações regulares de IBS/CBS, com limite proporcional por ano, DAS oficial 2026, exemplos de remissão condicionada e notícias oficiais. Referência principal: LC 238/2026 e orientações da Receita Federal/PGFN.

## Calculadoras por regime — 25/11/2026
DAS de 2026 com faixas e deduções oficiais, fator R e aviso de sublimite; apuração trimestral de IRPJ/CSLL do Lucro Presumido e Real com memória de cálculo e limitações explícitas. Simulação de reforma permanece separada.

## Glossário contextual — 25/11/2026
Exibir as definições de IBS, CBS e IS logo na página inicial e os significados em versão compacta junto aos contextos de uso, sem exigir navegação prévia ao glossário.

## Simulação rápida — 25/11/2026
Priorizar a estimativa mensal de DAS com dados conhecidos pelo empresário. Exibir composição IBS/CBS dentro do total de 2027–2028; fórmulas e fontes em detalhes recolhidos; preservar modo avançado separado. Não estimar casos fora do escopo das cinco primeiras faixas ou com receitas sujeitas a tratamentos diferentes.

## Implementação de IA e arquitetura — 26/11/2026

A descrição inicial de IA como etapa futura acima é histórica. Nesta iteração
foram implementados o widget público do Reforminha e o endpoint serverless
`/api/chat` para Vercel, com DeepSeek configurável por variáveis de ambiente
do servidor. A arquitetura utiliza `createAgent` e `tool()` do LangChain.js,
schemas Zod, simulação com funções determinísticas do próprio portal,
pesquisa oficial e explicações separadas para MEI, Simples, Lucro Presumido
e Lucro Real. Ver `docs/chatbot-tools.md`.

A interface apresenta expressões diferentes do mascote e uma página 404.
O agente foi testado com modelos simulados e ferramentas reais; o uso efetivo
da API DeepSeek ainda depende de credenciais e sua qualidade não foi validada.
Publicação com custo de IA requer controle de abuso e consumo persistente.
Não foram introduzidos armazenamento de conversas ou atualização editorial
automática.

O simulador concentra os fluxos Simples tradicional e híbrido em abas na
mesma tela; o endereço legado `/simulador/avancado` redireciona para o modo
de comparação. As alíquotas de IBS/CBS usadas na comparação do ano escolhido
são exibidas, em vez de oferecidas para edição livre. Para 2028, a ferramenta
não calcula CBS sem parâmetro oficialmente definido.
