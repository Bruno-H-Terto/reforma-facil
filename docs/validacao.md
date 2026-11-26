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

## Ampliação por regime, perfil e estado — 24/11/2026
- Três regimes, cinco anexos, seis perfis e seis casos regionais ilustrativos; seleção das 27 UFs, com orientação geral para as demais.
- Base legal: LC 123, LC 214 compilada, LC 227, Lei 9.718, Lei 13.267 e LC 224 (distinta da reforma do consumo); atualização CGSN 196/2026, divulgada em 23/11/2026. Critério regional: PIB de 2024, Contas Regionais do IBGE publicadas em novembro de 2026.
- Simulação regular com valores em BRL, alíquotas hipotéticas editáveis, créditos IBS e CBS separados e memória de cálculo. Não é apuração fiscal, não pressupõe alíquotas futuras e não utiliza dados fiscais reais de empresas.
- Build e lint aprovados; Playwright: 41 aprovados, 1 ignorado intencionalmente (matriz de viewport executada somente no projeto desktop). Matriz 320/600/768/1024/1440 px e testes de navegação, acessibilidade automatizada e simulação desktop/móvel.
- Limitações: não houve auditoria contábil, revisão de normas individualizadas das 27 UFs nem teste com empresários reais; casos são fictícios e regionalizados, sem apuração de alíquota real por produto/município. Visão técnica é um aprofundamento textual, não um parecer fiscal.

## Notícias, CBS e serviços — 25/11/2026
- Central editorial com 18 publicações (jan/2025–nov/2026), filtros de UF, ano, tema, texto e ordem, links originais e fontes oficiais de consulta. Cobertura regional inicial SP/RJ/MG/PR/RS/SC; demais UFs selecionáveis, sem prometer conteúdo local onde não foi localizado.
- Não existe ingestão automática: acervo revisado manualmente, separado em src/data/news.ts. Notícias históricas não equivalem a regras vigentes.
- CBS: 11,3% é referência técnica do TCU para 2027 (28/10/2026), não resolução definitiva do Senado; LC 214, art. 347 prevê redução de 0,1 ponto percentual em 2027–2028 no caso geral. Parâmetro comparativo editável, não projeção de alíquota definitiva de 2033.
- Seis exemplos hipotéticos de serviços com reduções condicionais de 30% (art. 127) e 60% (arts. 129/130), IBS hipotético, créditos segregados e valores monetários editáveis. Não constituem apuração do DAS ou comparação integral de carga tributária; o simulador separado permite comparar hipóteses de DAS e regime regular.
- Sem auditoria tributária independente ou dados fiscais de empresas reais.

## MEI — 25/11/2026
- Página própria /mei acessível a partir do menu, início, guia empresarial, Simples e simulador. Quatro notícias de fonte oficial, filtro MEI e links para serviços oficiais.
- LC 238/2026, arts. 1º–3º, 5º–6º e 10: teto geral de R$ 81 mil em 2026, R$ 110 mil em 2027 e R$ 140 mil em 2028 (ampliação condicionada à LOA), até dois empregados a partir de 2027. Simulador de limite proporcional conforme mês de início; não confere elegibilidade integral ou regras do MEI Caminhoneiro.
- DAS 2026 conforme Portal Simples Nacional (02/01/2026); não estima valores futuros. Receita Federal, Reforma de Fato: sem incidência direta de IBS/CBS nas vendas do MEI. Remissão previdenciária conforme LC 238, orientações RFB de 16/11/2026 e PGFN, efeitos em 01/01/2027; ICMS/ISS excluídos, condições de adimplência e exceções judiciais explicadas. Simulador não consulta débitos nem garante remissão.
- Limitações: exemplos fictícios, sem acesso às contas fiscais; manutenção editorial manual. Não houve auditoria contábil independente.

## Calculadoras tributárias — 25/11/2026
- Rotas /calculadoras/simples, /calculadoras/presumido e /calculadoras/real, links no menu, início, páginas de regime/anexo e simulador. Tabelas dos cinco anexos e seis faixas de 2026, fórmula da alíquota efetiva, fator R para atividades elegíveis, aviso de CPP fora do DAS (IV) e sublimite de ICMS/ISS (R$ 3,6 milhões). Faixa 6 exige confirmação de impedimento de ICMS/ISS no DAS; não apura o imposto estadual/municipal separado.
- Lucro Presumido: IRPJ/CSLL trimestrais, presunções gerais comércio/indústria 8%/12% e serviços 32%/32%; majoração LC 224/2025 sobre parcela informada pelo usuário, sem apuração automática acumulada ou ajustes de outros trimestres. Lucro Real: bases fiscais ajustadas informadas, IRPJ/CSLL de empresas não financeiras; não reconstrói bases contábeis nem calcula compensações. Tributos sobre consumo simulados separadamente.
- Fontes: LC 123, Resolução CGSN 140/2018, Portaria CGSN 54/2025, Lei 9.249/1995, Lei 9.430/1996, LC 224/2025, orientações Receita Federal. Não é apuração fiscal oficial; não inclui regimes especiais, segregações, início de atividade, regras futuras de repartição do DAS, créditos/retencões ou benefícios específicos.

## Definições rápidas dos tributos — 25/11/2026
- Componente TaxBasics com conteúdo centralizado: IBS, CBS e Imposto Seletivo, significado, competência, substituição e exemplo. Cards na página inicial e guia; versão compacta nas páginas de empresa, estado, MEI, notícias e calculadoras/simulador. Glossário ampliado com ICMS, ISS, PIS/Cofins e IPI.
- Fonte revisada: https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/entenda . As definições são educativas, não alteram as regras de cálculo.

## Simulador rápido — 25/11/2026
- /simulador passa a mostrar DAS mensal e composição de IBS/CBS sem exigir alíquotas ou créditos. Modo anterior preservado em /simulador/avancado. Seleção por anexo, mês, RBT12 e ano de 2026 a 2028; aproximação opcional mensal × 12 identificada. Atalhos para MEI, Lucro Presumido e Real.
- Fonte: Resolução CGSN nº 196 de 16/11/2026, publicada em 24/11/2026, art. 3º e anexos I–V (https://www.in.gov.br/web/dou/-/resolucao-cgsn-n-196-de-16-de-novembro-de-2026-745832719). Anexo III, faixas 3/4: 16,41% de CBS conforme a resolução; regra do teto efetivo de ISS aplicada nos anexos III/IV. Não aplica a alíquota de referência do regime regular ao DAS. A fonte oficial de notícia confirma vigência a partir de 2027; página do DOU retornou 502 na consulta, texto conferido em duas reproduções da resolução (Contadores.cnt.br e Okai).
- Escopo: cinco primeiras faixas, empresa estabelecida há pelo menos 13 meses, receita doméstica, uma atividade, sem segregações, benefícios ou impedimentos, IBS/CBS dentro do DAS. Casos especiais sinalizados interrompem estimativa. Acima de R$ 3,6 milhões, cálculo não exibido. Ano-calendário e elegibilidade não verificados automaticamente; não contempla transição após 2028 nem substitui PGDAS-D. Valores arredondados a centavos, saldo de demais tributos por diferença. Sem auditoria contábil independente.

## Auditoria de versionamento e regressão — 26/11/2026

- Revisão de todos os arquivos modificados e não rastreados. Commits separados
  por responsabilidade: sistema visual, mascote, guia, regimes empresariais,
  simuladores, notícias, home, integração IA, rotas/chat/404, acessibilidade,
  correções tributárias, testes e documentação.
- Scripts temporários de extração de imagem, fotos/poses/logos substituídos,
  componentes protótipos sem uso e anotações intermediárias das etapas não
  foram versionados; permanecem no computador e foram excluídos localmente
  via .git/info/exclude. Apenas ícones do cronograma efetivamente referenciados
  pelo CSS, com README e licenças, foram incluídos.
- Chaves e arquivos de ambiente locais não entram no Git. Foi versionado
  somente .env.example sem credenciais.
- A primeira execução abrangente de Playwright sinalizou 29 falhas, muitas
  originadas por testes antigos que buscavam controles e contagens removidos
  da interface. Os testes foram revisados para o fluxo atual, sem eliminar as
  verificações de acessibilidade ou cálculos.
- Falha real corrigida: carrossel de logotipos precisava ser navegável por
  teclado (regra de acessibilidade de região com rolagem).
- Erro de coerência corrigido: a memória do Simples Híbrido ainda exibia
  alíquotas de um cenário anterior; passou a mostrar as mesmas alíquotas do
  período selecionado usadas no resultado.
- Regressão completa Playwright, desktop + mobile: 170 casos, **157 aprovados,
  13 ignorados pelas condições da suíte, zero falhas** (26/11/2026).
- API Node.js: **15 testes aprovados** usando modelo DeepSeek simulado,
  incluindo execução de tools do LangChain, schemas e limites; nenhum teste
  real com credenciais de provedor foi executado.
- Prettier (src/tests/api/scripts e JSON), typecheck da API, build Vite e
  Oxlint: aprovados. O bundler apontou aviso não bloqueante sobre chunk
  JavaScript acima de 500 kB, recomendando futura divisão de módulos.

**Limitações remanescentes:** não foi feita publicação na Vercel nem teste
com uma chave real do DeepSeek. Os testes automatizados não substituem revisão
jurídica/contábil, testes de uso com empresários ou validação por leitor de
tela. O uso público da API deve ser precedido de limites persistentes de
requisições e cotas de custos.
