# Iteração 02 — identidade visual, responsividade e simulação
## Interface
- Ilustrações SVG locais de Storyset by Freepik: [Business analytics / Pana](https://storyset.com/illustration/business-analytics/pana) e [Finance / Pana](https://storyset.com/illustration/finance/pana). Licença gratuita com atribuição conforme https://storyset.com/terms. Cor principal adaptada para verde institucional. Atribuição visível junto a cada ilustração; confirmar condições de licenciamento antes de distribuição pública.
- Embla Carousel (mesma biblioteca do Nordion); botões, indicadores, gestos e preferência de movimento reduzido. Transições via Tailwind, sem CSS de layout adicional.
## Simulação
- LC 214/2025 (texto compilado com LC 227/2026): https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm — arts. 12, 14, 41, 45 e 47.
- LC 123/2006, art. 18: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm.
- Calculadora oficial: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/julho/receita-federal-libera-ferramenta-oficial-de-calculo-da-reforma-tributaria-sobre-o-consumo/.
- A entrada de alíquotas é manual e fictícia; não há enquadramento por CNAE, ano, localidade, tabelas de repartição ou regime especial. Base de operações IBS/CBS é independente da receita do DAS. Débitos, créditos e saldos de IBS/CBS são separados; excedentes não são compensados entre tributos. Resultados a centavos, memória de cálculo e fonte por operação, teste de sensibilidade ±20% e fórmula auxiliar da alíquota efetiva do DAS.
- As somas e diferenças da comparação são metodologia educacional, não fórmulas legais de apuração. Não usar para decidir enquadramento sem contador.
## Validação
- Playwright: desktop, Pixel 7, matriz adicional de 320, 600, 768, 1024 e 1440 px em cinco páginas. Verificação de overflow, imagens, carrossel com movimento reduzido, ausência de compensação cruzada, RBT12 inválido, cenários e navegação.
- Revisão visual de capturas reais em desktop, tablet e celular estreito. Testes automatizados de acessibilidade WCAG A/AA via axe; não substituem auditoria manual completa.
- Comandos: npm run format:check; npm run lint; npm run build; npm run test:e2e.

- Resultado final: 21 testes aprovados, um ignorado intencionalmente (matriz de tamanhos duplicada na configuração móvel), zero falhas.
