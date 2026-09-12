import type { Atividade, Badge, Conector, NivelJornada } from "@/types";

export const niveis: NivelJornada[] = [
  {
    id: "explorador",
    nome: "Explorador",
    icone: "🧭",
    pontosNecessarios: 0,
    descricao: "Primeiros passos no reconhecimento do território",
  },
  {
    id: "investigador",
    nome: "Investigador",
    icone: "🔎",
    pontosNecessarios: 1000,
    descricao: "Escutas sistemáticas e leitura de dados locais",
  },
  {
    id: "conector",
    nome: "Conector",
    icone: "🤝",
    pontosNecessarios: 2000,
    descricao: "Articulação de atores e pontes entre territórios",
  },
  {
    id: "catalisador",
    nome: "Catalisador",
    icone: "🚀",
    pontosNecessarios: 3000,
    descricao: "Transformação de escuta em soluções testadas",
  },
  {
    id: "embaixador",
    nome: "Embaixador da Inovação",
    icone: "🏛️",
    pontosNecessarios: 4200,
    descricao: "Referência capixaba em inteligência territorial",
  },
];

export const pontosIniciais = 2450;

export const badges: Badge[] = [
  {
    id: "b-cartografo",
    nome: "Cartógrafo do Território",
    descricao: "Mapeou os primeiros 25 ativos de inovação da Serra",
    icone: "🗺️",
    estado: "conquistada",
    dimensao: "explorar",
  },
  {
    id: "b-escuta",
    nome: "Escuta Profunda",
    descricao: "Registrou 30 escutas ativas com atores locais",
    icone: "🎧",
    estado: "conquistada",
    dimensao: "descobrir",
  },
  {
    id: "b-ponte",
    nome: "Construtor de Pontes",
    descricao: "Criou a primeira conexão intermunicipal do núcleo",
    icone: "🌉",
    estado: "conquistada",
    dimensao: "conectar",
  },
  {
    id: "b-voz",
    nome: "Voz das Periferias",
    descricao: "Escutou inovações em 5 bairros periféricos",
    icone: "📣",
    estado: "conquistada",
    dimensao: "descobrir",
  },
  {
    id: "b-articulador",
    nome: "Articulador Regional",
    descricao: "Reúna três setores na mesma roda de conversa",
    icone: "🤝",
    estado: "progresso",
    progresso: 66,
    dimensao: "conectar",
  },
  {
    id: "b-atlas",
    nome: "Atlas Vivo",
    descricao: "Complete a classificação das vocações produtivas",
    icone: "📚",
    estado: "progresso",
    progresso: 40,
    dimensao: "explorar",
  },
  {
    id: "b-catalisador",
    nome: "Catalisador de Soluções",
    descricao: "Prototipe 3 soluções junto à comunidade",
    icone: "⚗️",
    estado: "progresso",
    progresso: 33,
    dimensao: "transformar",
  },
  {
    id: "b-embaixador",
    nome: "Embaixador da Inovação",
    descricao: "Alcance 4.200 pontos de impacto no território",
    icone: "🏛️",
    estado: "bloqueada",
    dimensao: "transformar",
  },
  {
    id: "b-guardia",
    nome: "Guardião dos Dados",
    descricao: "Publique um painel territorial validado pelo IJSN",
    icone: "🛡️",
    estado: "bloqueada",
    dimensao: "transformar",
  },
  {
    id: "b-rede",
    nome: "Tecelão da Rede",
    descricao: "Conecte-se a 10 núcleos regionais diferentes",
    icone: "🕸️",
    estado: "bloqueada",
    dimensao: "conectar",
  },
];

export const conectores: Conector[] = [
  {
    nome: "Marina Coutinho",
    papel: "Conectora Territorial",
    iniciais: "MC",
    foco: "Escutas comunitárias e economia criativa",
  },
  {
    nome: "Rafael Domingues",
    papel: "Conector Territorial",
    iniciais: "RD",
    foco: "Indústria, tecnologia e empreendedorismo",
  },
];

export const atividades: Atividade[] = [
  {
    id: "a1",
    texto: "Marina registrou 3 novas escutas em Jacaraípe",
    quando: "há 2 horas",
    dimensao: "descobrir",
  },
  {
    id: "a2",
    texto: "Conexão luminosa criada com o Núcleo Caparaó",
    quando: "há 8 horas",
    dimensao: "conectar",
  },
  {
    id: "a3",
    texto: "Rafael concluiu a missão Agenda com novos atores",
    quando: "ontem",
    dimensao: "conectar",
  },
  {
    id: "a4",
    texto: "Núcleo Serra subiu para o 4º lugar do Movimento dos Territórios",
    quando: "há 2 dias",
    dimensao: "transformar",
  },
  {
    id: "a5",
    texto: "Nova descoberta publicada: cooperativa de reuso em Carapina",
    quando: "há 3 dias",
    dimensao: "descobrir",
  },
  {
    id: "a6",
    texto: "6 ativos de inovação adicionados ao atlas do território",
    quando: "há 4 dias",
    dimensao: "explorar",
  },
];
