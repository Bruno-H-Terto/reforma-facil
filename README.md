# Reforma Clara
Portal educacional sobre a Reforma Tributária do Consumo, desenvolvido para o Grupo 1 de Princípios de Administração II.

## Executar
Requer Node.js 22.12+ e npm.
```sh
npm ci
npm run dev
npm run lint
npm run build
npm run test:e2e
```
Os testes E2E utilizam Google Chrome instalado (desktop e emulação móvel). O servidor de teste usa a porta 4175. O build estático fica em dist/; vercel.json configura fallback das rotas SPA. Não há backend, login, coleta de dados nem publicação automática.

## Organização
- src/components: layout, navegação, componentes visuais e FAQ (React Aria).
- src/pages: páginas independentes de início, guia, simulador, biblioteca e dúvidas.
- src/data/content.ts: conteúdo, links oficiais, cronograma e revisão editorial.
- src/lib/scenarios.ts: função pura do simulador.
- tests: testes de caixa-preta com Playwright e axe.
- docs/brainstorm.md: requisitos, personas, pesquisa e critérios de aceitação.

## Manutenção editorial
Revisar fontes oficiais, datas, prazos e legislação antes de publicar. Atualizar o conteúdo e a data de revisão em src/data/content.ts. O simulador é educativo, parametrizado e não realiza apuração fiscal: não pressupõe alíquotas oficiais, não calcula RBT12, anexos ou regimes especiais. O protótipo não tem IA generativa nem atualização automática. Uma integração futura deve usar backend, fontes verificadas e citações; nunca colocar chaves no navegador.

## Identidade
Poppins, azul petróleo, verde, fundo neutro. React + TypeScript + Vite + Tailwind CSS, React Router, React Aria, Untitled UI Icons e Oxlint, seguindo a referência Nordion.
