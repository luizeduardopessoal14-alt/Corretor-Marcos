/**
 * Definição das perguntas do quiz de pré-qualificação.
 * Cada pergunta contém identificador, rótulo no resumo, título, texto de apoio e opções.
 */

export const QUESTIONS = [
  {
    id: "profissao",
    label: "Ocupação",
    title: "Qual é sua profissão ou ocupação hoje?",
    helpText: "Selecione a opção que mais se aproxima da sua atividade atual.",
    icon: "briefcase",
    options: [
      "Empregado(a) de empresa privada",
      "Servidor(a) público(a)",
      "Autônomo(a) / profissional liberal",
      "Empresário(a) / empreendedor(a)",
      "Aposentado(a) / pensionista",
      "Atualmente sem trabalho",
      "Outra ocupação"
    ]
  },
  {
    id: "restricao",
    label: "Restrição no nome",
    title: "Você possui alguma restrição no nome?",
    helpText: "Essa informação ajuda o Marcos a entender seu momento.",
    icon: "shield-check",
    options: [
      "Não",
      "Sim",
      "Não sei informar",
      "Prefiro conversar com o corretor"
    ]
  },
  {
    id: "renda",
    label: "Renda mensal individual",
    title: "Qual é sua renda mensal aproximada?",
    helpText: "Considere sua renda individual. Se for somar renda com alguém, você poderá explicar isso ao Marcos na conversa.",
    icon: "dollar-sign",
    options: [
      "Atualmente sem renda",
      "Até R$ 2.000",
      "Mais de R$ 2.000 até R$ 3.000",
      "Mais de R$ 3.000 até R$ 4.000",
      "Mais de R$ 4.000 até R$ 5.000",
      "Mais de R$ 5.000 até R$ 8.000",
      "Acima de R$ 8.000",
      "Prefiro informar ao corretor"
    ]
  },
  {
    id: "casa_propria",
    label: "Já possui casa própria",
    title: "Você já possui casa própria?",
    helpText: "",
    icon: "home",
    options: [
      "Sim",
      "Não"
    ]
  },
  {
    id: "estado_civil",
    label: "Estado civil",
    title: "Qual é seu estado civil?",
    helpText: "",
    icon: "users",
    options: [
      "Solteiro(a)",
      "Casado(a)",
      "Divorciado(a)",
      "Separado(a)",
      "Viúvo(a)",
      "Vivo em união estável",
      "Prefiro informar ao corretor"
    ]
  }
];
