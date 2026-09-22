import { nucleos } from "@/data/nucleos";

/**
 * TERRITÓRIOS 2.0 — Inteligência Territorial
 *
 * Camada de CONHECIMENTO DE REFERÊNCIA do Perfil Territorial.
 * Tudo aqui vem (ou virá) de documentos oficiais — DRS/IJSN, PDUI/IJSN e afins.
 * NADA nesta configuração é produzido pelo Caminhos da Inovação: os dados de
 * campo vivem nas atividades dos Conectores (aba "Descobertas").
 *
 * REGRA: nenhum valor é inventado. Enquanto a coordenação não fornecer o
 * conteúdo oficial de cada Núcleo, as listas permanecem vazias e a interface
 * exibe "Dados ainda não disponíveis".
 *
 * Para incorporar um território, basta preencher a entrada correspondente:
 *
 *   serra: {
 *     apresentacao: "...",
 *     municipios: ["Serra"],
 *     vocacoes: ["Indústria", "Logística"],
 *     potencialidades: ["..."],
 *     desafios: ["..."],
 *     inovacaoPontosFortes: ["..."],
 *     inovacaoPontosAInvestigar: ["..."],
 *     fonte: "DRS/IJSN",
 *   }
 */

/** Origem da informação apresentada na interface. */
export type OrigemDado = "referencia" | "caminhos";

export interface PerfilTerritorialReferencia {
  /** Breve apresentação territorial (documento de referência). */
  apresentacao?: string;
  /** Municípios vinculados ao Núcleo, conforme composição oficial. */
  municipios: string[];
  /** Vocações econômicas e territoriais previamente identificadas. */
  vocacoes: string[];
  potencialidades: string[];
  desafios: string[];
  /** Pontos fortes de inovação apontados pelos estudos de referência. */
  inovacaoPontosFortes: string[];
  /** Temas a investigar em campo — não são diagnóstico do Caminhos. */
  inovacaoPontosAInvestigar: string[];
  /** Fonte a ser exibida de forma discreta, ex.: "DRS/IJSN". */
  fonte?: string;
}

const vazio: PerfilTerritorialReferencia = {
  municipios: [],
  vocacoes: [],
  potencialidades: [],
  desafios: [],
  inovacaoPontosFortes: [],
  inovacaoPontosAInvestigar: [],
};

/** Conteúdo de referência por Núcleo — preenchido à medida que for validado. */
export const referenciaTerritorial: Record<string, PerfilTerritorialReferencia> =
  nucleos.reduce<Record<string, PerfilTerritorialReferencia>>(
    (acc, n) => ({ ...acc, [n.id]: { ...vazio } }),
    {},
  );

export function referenciaDoNucleo(nucleoId: string): PerfilTerritorialReferencia {
  return referenciaTerritorial[nucleoId] ?? { ...vazio };
}

/** Rótulo padrão das fontes de referência quando o documento não foi definido. */
export const FONTE_REFERENCIA_PADRAO = "Estudos de referência — IJSN";
export const FONTE_CAMINHOS = "Caminhos da Inovação — coleta de campo";

export type AreaPerfilTerritorial =
  | "visao-geral"
  | "vocacoes"
  | "potencialidades"
  | "inovacao"
  | "descobertas";

export const areasPerfilTerritorial: {
  id: AreaPerfilTerritorial;
  rotulo: string;
  origem: OrigemDado;
}[] = [
  { id: "visao-geral", rotulo: "Visão geral", origem: "referencia" },
  { id: "vocacoes", rotulo: "Vocações", origem: "referencia" },
  { id: "potencialidades", rotulo: "Potencialidades e desafios", origem: "referencia" },
  { id: "inovacao", rotulo: "Inovação", origem: "referencia" },
  { id: "descobertas", rotulo: "Descobertas", origem: "caminhos" },
];

/** Categorias de descoberta produzidas em campo pelos Conectores. */
export const categoriasDescoberta = [
  {
    id: "atores",
    rotulo: "Atores",
    icone: "🤝",
    descricao: "Pessoas, grupos e instituições identificados no território.",
    fontes: ["conexoes_atores", "articulacoes"],
  },
  {
    id: "ativos",
    rotulo: "Ativos",
    icone: "🧭",
    descricao: "Ativos e ambientes de inovação mapeados.",
    fontes: ["ativos_inovacao", "ambientes_inovacao"],
  },
  {
    id: "iniciativas",
    rotulo: "Iniciativas",
    icone: "💡",
    descricao: "Inovações e práticas reveladas pelo trabalho de campo.",
    fontes: ["iniciativas_reveladas"],
  },
  {
    id: "oportunidades",
    rotulo: "Oportunidades",
    icone: "🔎",
    descricao: "Caminhos possíveis percebidos pelos Conectores.",
    fontes: ["oportunidades_identificadas"],
  },
  {
    id: "lacunas",
    rotulo: "Lacunas",
    icone: "🕳️",
    descricao: "Ausências percebidas em campo — registro qualitativo, em construção.",
    fontes: [],
  },
] as const;
