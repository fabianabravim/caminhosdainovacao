export type DimensaoId = "explorar" | "conectar" | "descobrir" | "transformar";

export interface Dimensao {
  id: DimensaoId;
  nome: string;
  icone: string;
  descricao: string;
  colorVar: string;
}

export interface Nucleo {
  id: string;
  nome: string;
  regiao: string;
  x: number;
  y: number;
  progresso: number;
  atores: number;
  escutas: number;
  conexoes: number;
  inovacoes: number;
  nivel: string;
  pontos: number;
  destaque?: string;
  labelDx?: number;
  labelDy?: number;
  labelAnchor?: "start" | "end";
}

export interface Conexao {
  de: string;
  para: string;
  intensidade: number;
  colaborativa?: boolean;
  titulo?: string;
}

export interface Missao {
  id: string;
  titulo: string;
  descricao: string;
  dimensao: DimensaoId;
  pontos: number;
  progresso: number;
  meta: number;
  recompensa: string;
  prazo?: string;
}

export interface MissaoColaborativa {
  id: string;
  titulo: string;
  descricao: string;
  nucleos: string[];
  progresso: number;
  pontos: number;
  dimensao: DimensaoId;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  estado: "conquistada" | "progresso" | "bloqueada";
  progresso?: number;
  dimensao: DimensaoId;
}

export interface NivelJornada {
  id: string;
  nome: string;
  icone: string;
  pontosNecessarios: number;
  descricao: string;
}

export interface Descoberta {
  id: string;
  titulo: string;
  resumo: string;
  historia: string;
  nucleo: string;
  autor: string;
  data: string;
  imagem: string;
  dimensao: DimensaoId;
}

export interface Insight {
  id: string;
  titulo: string;
  texto: string;
  tendencia: "alta" | "estavel" | "atencao";
  variacao: string;
  dimensao: DimensaoId;
}

export interface Atividade {
  id: string;
  texto: string;
  quando: string;
  dimensao: DimensaoId;
}

export type RankingFiltro =
  | "pontos"
  | "evolucao"
  | "colaborativo"
  | "conexoes"
  | "descobertas";

export interface RankingItem {
  nucleoId: string;
  nome: string;
  pontos: number;
  evolucao: number;
  colaboracoes: number;
  conexoes: number;
  descobertas: number;
}

export interface Conector {
  nome: string;
  papel: string;
  iniciais: string;
  foco: string;
}
