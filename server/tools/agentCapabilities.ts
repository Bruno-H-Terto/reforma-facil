import { tool } from "langchain";
import { z } from "zod";

/**
 * TOOL DE EXEMPLO: agent_capabilities
 *
 * O que o agente consegue fazer? Retorna informações fixas e verificáveis
 * sobre suas ferramentas e limitações. Útil para explorar Function Calling.
 *
 * Entrada: {} (não exige argumentos).
 * Saída: JSON documentando operações disponíveis e exemplos de perguntas.
 * Efeitos colaterais: nenhum.
 */
export const agentCapabilities = tool(
  async () =>
    JSON.stringify({
      assistant: "Reforminha",
      purpose: "Apoio educacional à reforma tributária brasileira.",
      tools: [
        {
          name: "simulate_taxes",
          can: "Simular DAS do Simples ou IRPJ/CSLL básicos de Lucro Presumido e Lucro Real.",
          cannot:
            "Calcular automaticamente todas as obrigações de uma empresa ou confirmar valor devido.",
          example:
            "Simule DAS de comércio, ano 2026, RBT12 de R$ 300 mil e receita mensal de R$ 25 mil.",
        },
        {
          name: "search_official_sources",
          can: "Buscar informações recentes em domínios oficiais e retornar URLs.",
          cannot: "Certificar vigência legal apenas por um trecho de buscador.",
          example:
            "Pesquise fontes oficiais para as regras de transição da CBS em 2027.",
        },
        {
          name: "explain_mei_changes",
          can: "Explicar o que muda para MEI/SIMEI, com fontes, orientações de notas e DAS.",
          example: "Sou MEI: como a reforma afeta meu DAS e as notas fiscais?",
        },
        {
          name: "explain_simples_changes",
          can: "Explicar mudanças para empresas do Simples Nacional, incluindo IBS/CBS dentro e fora do DAS.",
          example: "Sou do Simples Nacional: o que muda com a reforma?",
        },
        {
          name: "explain_presumed_changes",
          can: "Explicar o impacto da reforma no Lucro Presumido, com distinção de IRPJ/CSLL.",
          example: "O que muda em uma empresa de Lucro Presumido?",
        },
        {
          name: "explain_real_changes",
          can: "Explicar a reforma para empresas de Lucro Real, créditos e obrigações operacionais.",
          example: "Quais mudanças atingem o Lucro Real?",
        },
        {
          name: "agent_capabilities",
          can: "Informar o que o assistente sabe fazer e quais são os limites.",
          example: "Quais ferramentas você tem disponíveis?",
        },
      ],
      links: {
        simulator: "/simulador",
        guide: "/entenda",
        officialSources: "/noticias",
      },
      constraints: [
        "Não presta consultoria fiscal individualizada.",
        "Não executa comandos no computador ou acessa contas.",
        "Não possui dados privados ou acesso direto à contabilidade do visitante.",
        "Não permite que o usuário envie arquivos ou dados sensíveis.",
        "Não substitui um contador ou advogado.",
        "Não garante que as informações estejam atualizadas ou corretas.",
        "Não se responsabiliza por decisões tomadas com base nas informações fornecidas.",
        "Não pode fornecer respostas sobre casos específicos de empresas ou pessoas.",
        "Não executa ações fora do escopo de assistente virtual.",
        "Não expõe dados pessoais ou confidenciais do usuário ou servidor.",
      ],
    }),
  {
    name: "agent_capabilities",
    description:
      "Descreve as ferramentas disponíveis, exemplos de perguntas e limitações do próprio assistente Reforminha. Use quando o usuário perguntar o que você consegue fazer ou pedir exemplos.",
    schema: z.object({}),
  },
);
