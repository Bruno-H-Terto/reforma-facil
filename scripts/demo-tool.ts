/**
 * Demonstração de Function Calling: LangChain createAgent e ferramentas reais,
 * usando um modelo de teste para não consumir crédito de IA.
 *
 * npm run demo:tool              -> capacidades
 * npm run demo:tool -- mei       -> explicação MEI
 * npm run demo:tool -- simples   -> Simples Nacional
 * npm run demo:tool -- presumido -> Lucro Presumido
 * npm run demo:tool -- real      -> Lucro Real
 */
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { fakeModel } from "@langchain/core/testing";
import { agentTools, createReforminhaAgent } from "../api/agent/agent.ts";

const options = {
  capabilities: {
    name: "agent_capabilities",
    args: {},
    question: "O que você consegue fazer?",
  },
  mei: {
    name: "explain_mei_changes",
    args: { topico: "resumo" },
    question: "O que muda para o MEI?",
  },
  simples: {
    name: "explain_simples_changes",
    args: { topico: "resumo" },
    question: "O que muda no Simples Nacional?",
  },
  presumido: {
    name: "explain_presumed_changes",
    args: { topico: "resumo" },
    question: "O que muda no Lucro Presumido?",
  },
  real: {
    name: "explain_real_changes",
    args: { topico: "resumo" },
    question: "O que muda no Lucro Real?",
  },
} as const;

const selected = process.argv[2] ?? "capabilities";
if (!(selected in options)) {
  console.error("Escolha: capabilities, mei, simples, presumido ou real");
  process.exit(1);
}
const selection = options[selected as keyof typeof options];
console.log(
  "Ferramentas disponíveis:",
  agentTools.map((item) => item.name).join(", "),
);
console.log("\nUsuário:", selection.question);
console.log(
  "Modelo de teste solicita:",
  selection.name,
  JSON.stringify(selection.args),
);

const model = fakeModel()
  .respondWithTools([
    { name: selection.name, args: selection.args, id: "demo-tool-01" },
  ])
  .respond((messages) => {
    const response = messages.find((message) => message instanceof ToolMessage);
    if (!response) throw new Error("O agente não executou a ferramenta");
    const data = JSON.parse(String(response.content));
    console.log(
      "\nResultado da ferramenta (ToolMessage):\n",
      JSON.stringify(data, null, 2),
    );
    return new AIMessage(
      data.mudancas
        ? data.mudancas + "\nSaiba mais: " + data.paginaPortal
        : "Posso simular impostos, consultar fontes oficiais e explicar as mudanças para cada regime.",
    );
  });

const agent = createReforminhaAgent(model);
if (!agent) throw new Error("O agente de demonstração não foi criado");
const result = await agent.invoke({
  messages: [{ role: "user", content: selection.question }],
});
console.log("\nResposta final:\n", result.messages.at(-1)?.content);
console.log("Rodadas do modelo falso:", model.callCount);
console.log(
  "\nPara usar o DeepSeek de verdade, configure DEEPSEEK_API_KEY e execute npm run dev:full.",
);
