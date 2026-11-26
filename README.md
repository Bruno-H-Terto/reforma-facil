# Reforma Clara

Portal educacional sobre a Reforma Tributária do Consumo, desenvolvido para o Grupo 1 de Princípios de Administração II.

## Executar

Requer Node.js 22.12+ e npm.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run test:api
npm run typecheck:api
npm run test:e2e
```

Os testes E2E utilizam Google Chrome instalado (desktop e emulação móvel). O servidor de teste usa a porta 4175. O build estático fica em dist/; o `vercel.json` preserva a rota `/api/*` e configura o fallback das páginas SPA. O endpoint do chatbot é uma função serverless, não um servidor em execução contínua. Não há login, armazenamento de conversas em servidor nem publicação automática.

## Organização

- src/components: layout, navegação, componentes visuais e FAQ (React Aria).
- src/pages: início, guia, empresas, notícias, biblioteca, simuladores e página 404. MEI, estados, perfis e calculadoras estão integrados às áreas Minha empresa e Simular; URLs históricas redirecionam para essas seções.
- src/data/content.ts: conteúdo, links oficiais, cronograma e revisão editorial.
- src/lib/scenarios.ts: função pura do simulador.
- api/chat.ts: único endpoint HTTP da Vercel (validação e carregamento tardio do agente).
- server/agent/model.ts: bootstrap do modelo DeepSeek via variáveis de ambiente.
- server/agent/agent.ts: agente LangChain (createAgent) e registro das 7 tools.
- server/tools/: funções independentes de simulação, busca, capacidades e explicação de mudanças por regime.
- docs/chatbot-tools.md: documentação dos schemas, exemplos e arquitetura.
- src/components/chat/ReforminhaChat.tsx: interface de conversa com animação por estados.
- src/pages/NotFound.tsx: página pública de erro 404, com a ilustração do Reforminha.
- tests: testes de caixa-preta com Playwright e axe; testes de bootstrap e validação do endpoint em Node.js.
- docs/brainstorm.md: requisitos, personas, pesquisa e critérios de aceitação.

## Manutenção editorial

Revisar fontes oficiais, datas, prazos e legislação antes de publicar. Atualizar o conteúdo e a data de revisão em src/data/content.ts. Os simuladores são educativos e não constituem apuração fiscal: exigem dados de receita e enquadramento, distinguem taxas de transição e referências técnicas de hipóteses, e não cobrem todos os regimes especiais. O chatbot integra LangChain.js com DeepSeek e ferramentas de simulação, pesquisa e orientação por regime; só faz chamadas reais quando a chave do servidor está configurada. Sem elas, informa indisponibilidade; não há respostas simuladas. Nenhum modelo substitui apuração fiscal ou validação normativa. Não há atualização automática do conteúdo editorial. Nunca coloque chaves no navegador.

## Identidade

Poppins, azul petróleo, verde, fundo neutro. React + TypeScript + Vite + Tailwind CSS, React Router, React Aria, Untitled UI Icons e Oxlint, seguindo a referência Nordion.

## Iteração 02

Consulte [docs/iteracao-02.md](docs/iteracao-02.md) para fontes legislativas, créditos de imagens, metodologia do simulador e matriz de responsividade.

## Chatbot Reforminha (LangChain + Vercel Functions)

A interface está disponível no canto inferior direito em todas as telas. O ícone e as expressões do mascote são arquivos locais em `public/images/mascot`. A tela `/404` é uma rota pública; rotas desconhecidas também exibem essa tela no React Router.

### Configuração local

1. Copie `.env.example` para `.env.local` e preencha **somente no servidor** `DEEPSEEK_API_KEY`. `.env.local` e demais arquivos `.env.*` são ignorados pelo Git. **Não use prefixo `VITE_` em segredos.**
2. `DEEPSEEK_MODEL` controla o modelo utilizado; o padrão é `deepseek-flash`.
3. `npm run dev` abre apenas o frontend. Para executar também a função `/api/chat` localmente, use `npm run dev:full` (a CLI pode solicitar login e vínculo com o projeto). Depois, abra o endereço indicado pelo comando.
4. Para testes sem chaves, execute `npm run test:api` e `npx playwright test tests/chat-notfound.spec.ts`. As respostas do E2E são interceptadas; nenhum custo de modelo é gerado.

### Configuração na Vercel

Em **Project → Settings → Environment Variables**, defina `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL`. Também é possível usar `APP_ORIGIN` para restringir a origem de requisições do navegador. Faça um novo deploy para as variáveis entrarem em vigor.

A função `api/chat.ts` delega ao agente LangChain `createAgent` em `server/agent/agent.ts`. A inicialização e as ferramentas ficam em módulos separados, documentados em `docs/chatbot-tools.md`.

### Limitações e segurança

- **Modelo e busca do DeepSeek são serviços de terceiros**, com quotas e possíveis cobranças independentes do plano gratuito de hospedagem.
- Não há streaming de tokens nesta versão: a interface indica "pensando" até o retorno completo, depois "respondendo".
- O histórico fica apenas na sessão React (não há banco de dados). Recarregar a página apaga a conversa.
- As buscas são restritas a fontes oficiais, mas os trechos retornados continuam sendo tratados como conteúdo não confiável.
- Origem e limites por requisição **não substituem proteção contra abuso automatizado**. Antes de habilitar a chave em um site público, configure controles de consumo e **rate limiting persistente** (Vercel Firewall ou serviço equivalente), além de alarmes de orçamento no provedor.
- Não foram executados testes com credenciais reais de IA ou de pesquisa. O pipeline local foi validado com mocks e configuração ausente.

Para arquitetura de Vercel Functions, consulte a [documentação da Vercel](https://vercel.com/docs/functions/runtimes/node-js).

### Conversa Markdown e continuidade

O Reforminha interpreta Markdown/GFM nas mensagens: parágrafos, listas,
tabelas, títulos, código e links. O campo de digitação agora é um editor
visual Tiptap com atalhos Markdown (por exemplo, digitar **palavra**
com delimitadores Markdown converte o trecho para negrito), além de botões
para negrito, itálico, título, listas e código. A formatação aparece
diretamente durante a edição, sem abrir uma prévia separada. O editor
converte o documento em Markdown antes do envio à API (não envia HTML).
O código do editor é carregado sob demanda, quando o chat é aberto, e
o rascunho é preservado quando o chat é recolhido. A tecla Enter insere
uma nova linha tanto no desktop quanto no celular; o envio é realizado
exclusivamente pelo botão de enviar.

HTML fornecido pelo modelo não é renderizado, imagens externas não são
carregadas e links clicáveis ficam restritos às rotas internas e às
fontes oficiais permitidas.

As últimas mensagens concluídas são enviadas como contexto do agente,
com limite de quantidade e tamanho do payload. Mensagens que falharam no
envio não são reenviadas; o botão **Nova conversa** reinicia o contexto.
As instruções evitam repetir apresentações e explicações antigas; um
pós-processamento remove saudações iniciais em turnos subsequentes e
parágrafos idênticos aos já respondidos, salvo solicitação para repetir.
O histórico fica em memória enquanto a página está aberta, não em banco.

### Ferramentas independentes e documentação

Veja [docs/chatbot-tools.md](docs/chatbot-tools.md) para os esquemas de entrada,
limitações, fontes e exemplos das sete ferramentas. Use `npm run demo:tool` para
testar o ciclo de `createAgent` com um modelo falso, sem credenciais nem custos.
Use `npm run test:api` para executar os testes das funções e do agente.

### Navegação e rotas de compatibilidade

A navegação pública utiliza cinco destinos principais. Regimes, anexos,
perfis, MEI e informações regionais integram Minha empresa. As calculadoras
integram Simular. Endereços antigos como /estados, /mei e /calculadoras/simples
redirecionam para as respectivas seções. Ver docs/navigation-audit.md.
