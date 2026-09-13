import type { DimensaoId, MissaoTerritorialConfig, StatusMissao } from "@/types";

/**
 * CONFIGURAÇÃO CENTRAL DAS MISSÕES DO TERRITÓRIO
 * ---------------------------------------------
 * Todos os valores são PROVISÓRIOS e vivem apenas neste arquivo.
 * Para alterar nome, descrição, XP, limite, categoria ou necessidade
 * de validação de uma missão, edite somente aqui — as telas
 * (cards, progresso do núcleo, jornada e ranking) se ajustam sozinhas.
 */
export const missoesTerritorio: MissaoTerritorialConfig[] = [
  // EXPLORAR
  {
    id: "exp-mapear-ator",
    dimensao: "explorar",
    titulo: "Mapear ator do ecossistema",
    descricao: "Identifique e registre uma pessoa, grupo ou organização que movimenta a inovação no território.",
    xp: 20,
    icone: "🧭",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "exp-ambiente",
    dimensao: "explorar",
    titulo: "Identificar ambiente de inovação",
    descricao: "Mapeie um espaço de inovação: laboratório, hub, escola técnica, coworking ou coletivo.",
    xp: 30,
    icone: "🏫",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "exp-escuta",
    dimensao: "explorar",
    titulo: "Realizar escuta territorial",
    descricao: "Converse com um ator do território e registre percepções, desafios e sonhos locais.",
    xp: 40,
    icone: "🎧",
    limite: 0,
    requerValidacao: true,
  },
  // CONECTAR
  {
    id: "con-articulacao",
    dimensao: "conectar",
    titulo: "Registrar nova articulação",
    descricao: "Formalize uma articulação entre atores do território em torno de um tema comum.",
    xp: 50,
    icone: "🤝",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "con-conexao-atores",
    dimensao: "conectar",
    titulo: "Promover conexão entre atores",
    descricao: "Aproxime dois atores que ainda não se conheciam e registre o encontro.",
    xp: 70,
    icone: "🔗",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "con-outro-nucleo",
    dimensao: "conectar",
    titulo: "Colaborar com outro Núcleo Territorial",
    descricao: "Realize uma ação conjunta com conectores de outro núcleo da rede capixaba.",
    xp: 100,
    icone: "🌉",
    limite: 0,
    requerValidacao: true,
  },
  // DESCOBRIR
  {
    id: "des-iniciativa",
    dimensao: "descobrir",
    titulo: "Revelar iniciativa inovadora",
    descricao: "Documente uma solução criativa que nasceu no território e ainda não era conhecida.",
    xp: 50,
    icone: "💡",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "des-vocacao",
    dimensao: "descobrir",
    titulo: "Identificar vocação territorial",
    descricao: "Reconheça e registre uma vocação produtiva, cultural ou ambiental do território.",
    xp: 80,
    icone: "🧭",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "des-oportunidade",
    dimensao: "descobrir",
    titulo: "Identificar oportunidade ou lacuna",
    descricao: "Aponte uma oportunidade de desenvolvimento ou uma lacuna que o território precisa preencher.",
    xp: 80,
    icone: "🔎",
    limite: 0,
    requerValidacao: true,
  },
  // TRANSFORMAR
  {
    id: "tra-mobilizar",
    dimensao: "transformar",
    titulo: "Mobilizar atores do território",
    descricao: "Organize a participação de atores locais em uma ação coletiva de inovação.",
    xp: 100,
    icone: "📣",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "tra-oficina",
    dimensao: "transformar",
    titulo: "Realizar oficina ou encontro",
    descricao: "Planeje e realize uma oficina, encontro ou jornada de aprendizagem no território.",
    xp: 150,
    icone: "🛠️",
    limite: 0,
    requerValidacao: true,
  },
  {
    id: "tra-resultado",
    dimensao: "transformar",
    titulo: "Registrar resultado de uma articulação",
    descricao: "Documente um resultado concreto gerado por uma articulação do território.",
    xp: 200,
    icone: "🚀",
    limite: 0,
    requerValidacao: true,
  },
];

export const missaoTerritorialMap = missoesTerritorio.reduce<
  Record<string, MissaoTerritorialConfig>
>((acc, m) => ({ ...acc, [m.id]: m }), {});

/** Rótulos amigáveis dos status, centralizados. */
export const statusMissaoLabel: Record<StatusMissao, string> = {
  disponivel: "Disponível",
  andamento: "Em andamento",
  enviada: "Enviada",
  validacao: "Em validação",
  concluida: "Concluída",
};

export const ordemDimensoes: DimensaoId[] = ["explorar", "conectar", "descobrir", "transformar"];

export function missoesPorDimensao(dimensao: DimensaoId) {
  return missoesTerritorio.filter((m) => m.dimensao === dimensao);
}

export function xpTotalDimensao(dimensao: DimensaoId) {
  return missoesPorDimensao(dimensao).reduce((s, m) => s + m.xp, 0);
}
