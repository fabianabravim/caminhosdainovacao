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
  id?: string;
  nome: string;
  papel: string;
  iniciais: string;
  foco: string;
  email?: string;
  nucleoId?: string;
  ativo?: boolean;
  demonstrativo?: boolean;
}

export type PerfilAcesso = "CONECTOR" | "COORDENACAO";

export interface PerfilConector {
  userId: string;
  nome: string;
  email: string;
  nucleoId: string | null;
  perfil: PerfilAcesso;
  ativo: boolean;
  demonstrativo: boolean;
}

/** Status possíveis de uma missão do território (calculados pelo sistema). */
export type StatusMissao =
  | "nao_iniciada"
  | "andamento"
  | "validacao"
  | "ajustes"
  | "concluida";

/**
 * TIPO A — "automatica": o registro válido já soma no progresso.
 * TIPO B — "validacao": o registro fica em validação e só soma após aprovação.
 */
export type TipoMissao = "automatica" | "validacao";

/**
 * Fonte de dados que alimenta o progresso de cada missão territorial.
 * Preparada para, futuramente, vir de cadastros reais vinculados a
 * município e Núcleo (integração com a página "Territórios").
 */
export type FonteProgressoTerritorio =
  | "ativos_inovacao"
  | "ambientes_inovacao"
  | "escutas_territoriais"
  | "articulacoes"
  | "conexoes_atores"
  | "colaboracoes_internucleos"
  | "iniciativas_reveladas"
  | "vocacoes_territoriais"
  | "oportunidades_identificadas"
  | "mobilizacoes"
  | "oficinas_realizadas"
  | "resultados_articulacao";

/**
 * Configuração centralizada de uma missão territorial.
 * Nome, descrição, meta, pontuação, tipo, limite e necessidade de
 * validação são alterados SOMENTE aqui — as telas se ajustam sozinhas.
 * Todos os valores são PROVISÓRIOS até validação da Coordenação.
 */
export interface MissaoTerritorialConfig {
  id: string;
  dimensao: DimensaoId;
  titulo: string;
  descricao: string;
  icone: string;
  tipoMissao: TipoMissao;
  /** Quantidade de registros válidos necessária para concluir. */
  metaTotal: number;
  /** Unidade exibida no progresso, ex.: "ativos identificados". */
  unidade: string;
  fonteProgresso: FonteProgressoTerritorio;
  /** Rótulo da ação real do Conector, ex.: "Cadastrar ativo". */
  cta: string;
  exigeValidacao: boolean;
  /** Pontuação PROVISÓRIA — camada de gamificação, não o objetivo. */
  pontuacao: number;
  /** Conquista apresentada quando a missão é concluída. */
  conquista: string;
  /** Quantas vezes a missão pode ser realizada (0 = sem limite). */
  limite: number;
  ativo: boolean;
}

/** Registro/evidência de trabalho real feito no território. */
export interface RegistroJornada {
  id: string;
  missaoId: string;
  fonte: FonteProgressoTerritorio;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  atores: string;
  resultado: string;
  localizacao: string;
  /** Preparado para vincular o registro ao mapa municipal. */
  municipio?: string | undefined;
  anexoNome?: string | undefined;
  statusValidacao: StatusValidacaoRegistro;
  criadoEm: string;
}

/** Dados do formulário de registro (o restante o sistema preenche). */
export type DadosRegistro = Pick<
  RegistroJornada,
  "titulo" | "descricao" | "data" | "local" | "atores" | "resultado" | "localizacao"
> & { anexoNome?: string | undefined };

/** Visão calculada de uma missão territorial. */
export interface MissaoTerritorialCalculada extends MissaoTerritorialConfig {
  progressoAtual: number;
  percentualProgresso: number;
  restante: number;
  registrosEmValidacao: number;
  registrosEmAjuste: number;
  status: StatusMissao;
}

/** Categoria configurável de atividade realizada no território. */
export interface TipoAtividadeConfig {
  id: string;
  rotulo: string;
  icone: string;
  /**
   * Fontes de progresso que este tipo PODE alimentar. A primeira é a
   * contribuição contabilizada; as demais ficam preparadas para regras futuras.
   */
  fontes: FonteProgressoTerritorio[];
}

/** Ciclo de vida de uma atividade registrada pelo Conector. */
export type StatusAtividade =
  | "rascunho"
  | "enviada"
  | "em_validacao"
  | "aprovada"
  | "ajustes_solicitados";

/** Campos preenchidos pelo Conector no formulário de atividade. */
export interface DadosAtividade {
  tipoId: string;
  data: string;
  municipio: string;
  local: string;
  titulo: string;
  descricao: string;
  atores: string;
  resultados: string;
  observacoes: string;
  /** Preparado para integração territorial futura (lat/long ou referência). */
  localizacao: string;
  evidenciaFoto?: string | undefined;
  evidenciaDocumento?: string | undefined;
  evidenciaLink?: string | undefined;
  /** Missão de origem quando o registro nasce do CTA de uma missão. */
  missaoId?: string | undefined;
}

/** Atividade real registrada — única coisa que o Conector cria. */
export interface AtividadeRegistrada extends DadosAtividade {
  id: string;
  conectorId?: string;
  nucleoId?: string;
  status: StatusAtividade;
  criadoEm: string;
  /** Fonte efetivamente contabilizada (sem duplicar contribuições). */
  fonteContribuicao?: FonteProgressoTerritorio | undefined;
  /** Missões que a atividade pode alimentar, hoje ou com regras futuras. */
  missoesRelacionadas: string[];
}

/** Indicador (individual ou coletivo) — mede o trabalho, não gamifica. */
export interface IndicadorConfig {
  id: string;
  rotulo: string;
  icone: string;
  meta?: number;
  fonte?: FonteProgressoTerritorio;
  descricao: string;
}
