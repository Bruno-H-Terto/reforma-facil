# Chatbot Reforminha — LangChain.js

Implementação baseada em `createAgent` e `tool` da documentação oficial:
- https://docs.langchain.com/oss/javascript/langchain/agents
- https://docs.langchain.com/oss/javascript/langchain/tools
- https://api-docs.deepseek.com/guides/tool_calls/
- https://api-docs.deepseek.com/guides/search/

## Organização dos arquivos

```text
api/
└── chat.ts                         # Function HTTP publicada na Vercel
server/
├── agent/
│   ├── model.ts                    # Modelo DeepSeek
│   └── agent.ts                    # createAgent e registro das tools
└── tools/
    ├── simulateTaxes.ts           # Cálculo determinístico
    ├── searchOfficialSources.ts   # Busca de fontes oficiais
    ├── agentCapabilities.ts       # Capacidades do agente
    └── regimes/
        ├── shared.ts
        ├── explainMei.ts
        ├── explainSimples.ts
        ├── explainPresumido.ts
        └── explainReal.ts
```

A pasta api/ contém apenas o endpoint HTTP. Os módulos internos ficam em server/, carregados após validar a requisição para evitar falhas na inicialização do endpoint.

Não existe um loop manual de tool calls. O LangChain cria o agente e gerencia as chamadas e suas respostas. O número de passos é limitado por `recursionLimit`; a execução tem um limite de tempo.

## Modelo DeepSeek

A função `createDeepSeekModel()` é definida em `server/agent/model.ts` e recebe a chave somente no servidor:

```env
DEEPSEEK_API_KEY=sua_chave
DEEPSEEK_MODEL=deepseek-flash
```

A classe `ChatOpenAI` do LangChain é usada com `baseURL=https://api.deepseek.com`. Isso utiliza a API e a cobrança do DeepSeek, não da OpenAI. Não use o prefixo `VITE_` em credenciais.

## Tool 1: simulate_taxes

**Arquivo:** `server/tools/simulateTaxes.ts`

**Objetivo:** executar as mesmas fórmulas do portal, sem o LLM calcular valores diretamente.

**Entrada:** objeto Zod com `regime`, `ano` e campos específicos do regime.

| Regime | Campos obrigatórios | O que retorna |
|---|---|---|
| Simples Nacional | `ano`, `anexo`, `receita12Meses`, `faturamentoMes` | DAS mensal e decomposição do DAS |
| Lucro Presumido | `ano: 2026`, `atividade`, `receitaTrimestre` | IRPJ/CSLL estimados para o trimestre |
| Lucro Real | `ano: 2026`, `baseIrpj`, `baseCsll` | IRPJ/CSLL estimados para o trimestre |

**Exemplo de chamada:**

```json
{
  "regime": "simples_nacional",
  "ano": 2026,
  "anexo": "I",
  "receita12Meses": 300000,
  "faturamentoMes": 25000
}
```

**Resultado esperado:** `dasEstimado: 1330`, `parcelaCbsNoDas: 0` e `parcelaIbsNoDas: 0` (2026). As parcelas IBS/CBS são informativas e não devem ser somadas novamente ao DAS.

Quando um parâmetro está faltando, retorna `status: "missing_inputs"` com a lista de campos. Quando o cenário excede o escopo da ferramenta, retorna `status: "not_supported"`. Não informa um tributo inventado.

**Limitações:** resultados demonstrativos, sem calcular todos os impostos ou tratar automaticamente segregação de receitas, início de atividade, regimes especiais, limite anual, créditos ou compensações. A demonstração de IRPJ/CSLL do Presumido/Real é simplificada e limitada a 2026. Consulte um contador para apuração efetiva.

## Tool 2: search_official_sources

**Arquivo:** `server/tools/searchOfficialSources.ts`

**Objetivo:** consultar fontes tributárias atuais com uma pesquisa na internet.

**Entrada:** `{"query": "Lei Complementar 214 IBS CBS 2027"}`

**API:** `POST https://api.deepseek.com/v1/tools/search`, com a mesma `DEEPSEEK_API_KEY` do modelo. Não utiliza Tavily ou Google.

**Saída:** JSON com `status` e resultados `[{ title, url, date, excerpt }]`.

**Proteções:** apenas domínios oficiais brasileiros permitidos, máximo de quatro resultados, timeout de 9 segundos, trechos limitados. Os resultados externos são dados, não instruções. A ferramenta não certifica a vigência de uma lei apenas por seu resumo; a fonte primária deve ser conferida antes de uma afirmação normativa.

Se a chave não estiver definida ou a consulta falhar, retorna `status: "unavailable"`, sem inventar resultados.

## Tool 3: agent_capabilities

**Arquivo:** `server/tools/agentCapabilities.ts`

**Objetivo:** ferramenta demonstrativa para responder à pergunta “O que você consegue fazer?”.

**Entrada:** `{}` — nenhuma variável obrigatória.

**Saída:** JSON descrevendo as três tools, exemplos de perguntas, rotas úteis e limitações do chatbot.

Essa função não faz chamadas externas e não requer chave. É um exemplo verificável de Function Calling.

## Como o agente é iniciado

```typescript
// server/agent/agent.ts — visão simplificada
export const agentTools = [
  simulateTaxes,
  searchOfficialSources,
  agentCapabilities,
  explainMeiChanges,
  explainSimplesChanges,
  explainPresumedChanges,
  explainRealChanges,
];

return createAgent({
  model: createDeepSeekModel(),
  tools: [...agentTools],
  systemPrompt,
});
```

O arquivo `api/chat.ts` cuida somente da requisição HTTP e da validação. Não contém regras fiscais, busca ou inicialização do modelo.

## Demonstração e execução

```bash
npm run demo:tool       # exemplo de capacidades
npm run demo:tool -- mei       # explicar MEI
npm run demo:tool -- simples   # explicar Simples Nacional
npm run demo:tool -- presumido # explicar Lucro Presumido
npm run demo:tool -- real      # explicar Lucro Real
npm run test:api        # testes das 7 tools e da integração com o agente
npm run typecheck:api
npm run dev:full        # API Vercel e modelo DeepSeek com chave configurada
```

A demonstração imprime uma requisição de `agent_capabilities`, a resposta `ToolMessage` e a resposta final. **A decisão do modelo nessa demonstração é simulada; o LangChain e a execução da tool são reais.** Não consome tokens de IA.

Perguntas para testar com DeepSeek real:
- “O que você consegue fazer?”
- “Simule o DAS de um comércio Anexo I em 2026 com RBT12 de R$ 300 mil e faturamento mensal de R$ 25 mil.”
- “Pesquise as orientações oficiais sobre a transição da CBS em 2027.”

**Antes de publicar:** configurar rate limiting persistente, monitorar custo, adicionar autenticação se necessário e testar com uma chave real. O MVP ainda não possui histórico persistido em banco, streaming ou avaliação automatizada com o provedor.

## Tools 4 a 7 — explicar as mudanças por regime

Cada regime tem um módulo separado definido com LangChain tool(), uma descrição
para orientar o modelo e um schema Zod de entrada. O agente decide qual usar de
acordo com o regime informado, sem presumir que MEI e Simples ME/EPP são iguais.

| Tool | Arquivo | Pergunta de exemplo |
|---|---|---|
| `explain_mei_changes` | `server/tools/regimes/explainMei.ts` | O que muda para o MEI? |
| `explain_simples_changes` | `server/tools/regimes/explainSimples.ts` | O que muda no Simples Nacional? |
| `explain_presumed_changes` | `server/tools/regimes/explainPresumido.ts` | E o Lucro Presumido? |
| `explain_real_changes` | `server/tools/regimes/explainReal.ts` | Quais mudanças no Lucro Real? |

**Entrada comum:** `{"topico": "resumo"}`. O campo pode assumir `resumo`
(padrão), `exemplo`, `cuidados` ou `completo`.

**Exemplo:** `{"topico": "completo"}` retorna `regime`, `titulo`,
`antes`, `mudancas`, `impacto`, `exemplo`, `acoes`, `fontes`,
`paginaPortal` e `aviso`.

As respostas são obtidas do conteúdo editorial de **Minha empresa**, com
fonte e rota específicas. As três ferramentas de ME/EPP, Presumido e Real
reaproveitam `src/data/business.ts` para manter o conteúdo alinhado ao portal.
A ferramenta MEI considera `src/data/mei.ts` e o tratamento específico do SIMEI,
sem usar alíquotas do DAS dos Anexos I a V para o MEI.

**Limite de validade:** estas tools não fazem pesquisa em tempo real, não
confirmam legislação superveniente, não individualizam aconselhamento e não
realizam cálculos. Para questões de vigência ou alterações recentes, o agente
deve buscar fontes oficiais com `search_official_sources` e deixar explícito
quando não conseguir confirmar.

**Demonstração local (sem chave do DeepSeek):**

```bash
npm run demo:tool -- mei
npm run demo:tool -- simples
npm run demo:tool -- presumido
npm run demo:tool -- real
npm run test:api
```

O exemplo utiliza um modelo falso para escolher a tool, mas executa o
`createAgent` e a função selecionada de verdade. Para executar com o
DeepSeek real, configure `DEEPSEEK_API_KEY` no servidor e inicie
`npm run dev:full`.
