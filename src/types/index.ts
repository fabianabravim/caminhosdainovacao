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
  /** Meta configurada; nunca é editada pelo conector. */
  meta_total: number;
  /** Fonte de registros que alimenta automaticamente a missão. */
  fonteProgresso: FonteProgressoMissao;
  cta: string;
  requerValidacao: boolean;
  recompensa: string;
  prazo?: string;
}

export type FonteProgressoMissao =
  | "ativos_inovacao"
  | "atividades_territoriais"
  | "vocacoes_territoriais"
  | "presencas_setoriais"
  | "atores_rede"
  | "escutas_ativas"
  | "descobertas_publicadas"
  | "prototipos_comunitarios"
  | "relatorios_aprovados";

export type StatusValidacaoRegistro =
  | "aprovado"
  | "em_validacao"
  | "ajustes_solicitados";

export interface RegistroMissao {
  id: string;
  missaoId: string;
  fonte: FonteProgressoMissao;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  anexoNome?: string;
  statusValidacao: StatusValidacaoRegistro;
  criadoEm: string;
}

export type StatusProgressoMissao =
  | "nao_iniciada"
  | "andamento"
  | "em_validacao"
  | "ajustes_solicitados"
  | "concluida";

export interface MissaoCalculada extends Missao {
  progresso_atual: number;
  percentual_progresso: number;
  status: StatusProgressoMissao;
  registrosEmValidacao: number;
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

/** Status possíveis de uma missão do território. */
export type StatusMissao =
  | "disponivel"
  | "andamento"
  | "enviada"
  | "validacao"
  | "concluida";

/**
 * Configuração centralizada de uma missão territorial.
 * Nome, descrição, XP, limite, categoria e necessidade de validação
 * são alterados aqui, sem reconstruir telas.
 */
export interface MissaoTerritorialConfig {
  id: string;
  dimensao: DimensaoId;
  titulo: string;
  descricao: string;
  /** XP PROVISÓRIO — ajustável neste arquivo. */
  xp: number;
  icone: string;
  /** Quantas vezes a missão pode ser realizada (0 = sem limite). */
  limite: number;
  /** Se true, a evidência enviada fica "Em validação" até análise. */
  requerValidacao: boolean;
}

/** Evidência enviada pelo conector ao realizar uma missão. */
export interface Evidencia {
  missaoId: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  atores: string;
  resultado: string;
  localizacao: string;
  anexoNome?: string | undefined;
  enviadaEm: string;
}
