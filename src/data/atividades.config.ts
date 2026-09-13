import type { FonteProgressoTerritorio, StatusAtividade, TipoAtividadeConfig } from "@/types";

/**
 * TIPOS DE ATIVIDADE (configuráveis).
 * O Conector registra o trabalho real; a plataforma decide o que aquilo
 * alimenta. `fontes` lista os indicadores/missões que o tipo PODE alimentar.
 * A primeira fonte é a contribuição contabilizada nesta etapa — nunca há
 * pontuação duplicada automática; as demais ficam preparadas para as regras
 * que a Coordenação definir.
 */
export const tiposAtividade: TipoAtividadeConfig[] = [
  {
    id: "mapeamento_ativo",
    rotulo: "Mapeamento de ator/ativo",
    icone: "🧭",
    fontes: ["ativos_inovacao", "ambientes_inovacao"],
  },
  { id: "visita_territorial", rotulo: "Visita territorial", icone: "🚶", fontes: [] },
  { id: "escuta_territorial", rotulo: "Escuta territorial", icone: "🎧", fontes: ["escutas_territoriais"] },
  { id: "reuniao", rotulo: "Reunião", icone: "🗓️", fontes: [] },
  {
    id: "articulacao",
    rotulo: "Articulação",
    icone: "🤝",
    fontes: ["articulacoes", "conexoes_atores"],
  },
  {
    id: "evento_oficina",
    rotulo: "Evento / oficina",
    icone: "🛠️",
    fontes: ["oficinas_realizadas", "mobilizacoes"],
  },
  {
    id: "identificacao_iniciativa",
    rotulo: "Identificação de iniciativa",
    icone: "💡",
    fontes: ["iniciativas_reveladas"],
  },
  {
    id: "identificacao_oportunidade",
    rotulo: "Identificação de oportunidade",
    icone: "🔎",
    fontes: ["oportunidades_identificadas"],
  },
  {
    id: "identificacao_vocacao",
    rotulo: "Identificação de vocação",
    icone: "📚",
    fontes: ["vocacoes_territoriais"],
  },
  {
    id: "ambiente_inovacao",
    rotulo: "Mapeamento de ambiente de inovação",
    icone: "🏫",
    fontes: ["ambientes_inovacao"],
  },
  {
    id: "colaboracao_nucleos",
    rotulo: "Colaboração entre Núcleos",
    icone: "🌉",
    fontes: ["colaboracoes_internucleos"],
  },
  {
    id: "relatorio",
    rotulo: "Relatório / resultado de articulação",
    icone: "📄",
    fontes: ["resultados_articulacao"],
  },
  { id: "outro", rotulo: "Outro", icone: "✳️", fontes: [] },
];

export const tipoAtividadeMap = tiposAtividade.reduce<Record<string, TipoAtividadeConfig>>(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {},
);

/** Tipo de atividade sugerido para cada fonte de progresso das missões. */
export function tipoAtividadePorFonte(fonte: FonteProgressoTerritorio) {
  return tiposAtividade.find((t) => t.fontes[0] === fonte) ?? tiposAtividade.find((t) => t.fontes.includes(fonte));
}

export const statusAtividadeLabel: Record<StatusAtividade, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  em_validacao: "Em validação",
  aprovada: "Aprovada",
  ajustes_solicitados: "Ajustes solicitados",
};

export const estiloStatusAtividade: Record<StatusAtividade, string> = {
  rascunho: "border-border/70 bg-surface/60 text-muted-foreground",
  enviada: "border-lilac/50 bg-primary/15 text-lilac",
  em_validacao: "border-glow/50 bg-glow/10 text-glow",
  aprovada: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  ajustes_solicitados: "border-amber-300/40 bg-amber-400/10 text-amber-200",
};
