# Validação do protótipo — 24/11/2026
## Resultado
A suíte de caixa-preta Playwright executou 16 testes (8 desktop + 8 emulação Pixel 7), todos aprovados em 15,2 s, Google Chrome real. Os testes acessam apenas interface e URLs públicas, sem importar código da aplicação.
- Jornada da empresária: início → cronograma → simulador, cálculo padrão de R$ 4.000 e R$ 6.000, alteração de entradas, rejeição de valor negativo.
- Jornada do contador: biblioteca, filtro legislação, busca por 227, link de fonte, busca vazia e limpeza dos filtros.
- FAQ: abertura por teclado, rota inexistente e retorno ao início.
- Cinco rotas: título visível, ausência de overflow horizontal, ausência de erros JS capturados e zero violações detectadas pelo axe nas tags WCAG 2.0/2.1 A/AA, nas duas resoluções.
- Capturas reais em test-results/ (ignoradas no Git). Revisão visual das capturas de início desktop, guia desktop, biblioteca desktop e simulador móvel: hierarquia, contraste, cards alinhados, conteúdo legível e formulário responsivo; navegação móvel em duas linhas.
## Rastreabilidade
| Requisito | Evidência | Estado |
|---|---|---|
| Centralização e fontes | biblioteca, fontes em guia e simulador | entregue |
| Atualização e transparência | revisão editorial, links e notícia datada | manual |
| Comparativos e cronograma | página Entenda | entregue |
| Simulação parametrizada | página Simulador, função pura | educativo |
| Linguagem e acessibilidade | FAQ, glossário, testes de teclado e axe | entregue no escopo testado |
| Gestão e custo | stack aberta, sem servidor obrigatório, dados separados | entregue |
| IA generativa do 5W1H | sem serviço/modelo integrado | pendente |
## Limitações
Não houve avaliação de um agente LLM independente: a validação de caixa-preta foi automatizada e a revisão visual conduzida pelo implementador. Não houve teste com usuários reais, revisão tributária por contador, verificação exaustiva de leitores de tela, nem auditoria jurídica. Links apontam para fontes públicas, não há monitoramento automático. A simulação não é uma calculadora fiscal completa. Não publicar como orientação profissional.
## Reproduzir
npm ci; npm run lint; npm run build; npm run test:e2e
