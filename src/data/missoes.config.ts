import type {
  DimensaoId,
  IndicadorConfig,
  MissaoTerritorialConfig,
  StatusMissao,
} from "@/types";

/**
 * CONFIGURAÇÃO CENTRAL DAS MISSÕES DO TERRITÓRIO
 * ---------------------------------------------
 * Todos os valores são PROVISÓRIOS e vivem apenas neste arquivo:
 * meta, unidade, tipo, fonte de progresso, CTA, exigência de validação,
 * pontuação, conquista, limite e ativo/inativo.
 * As telas (cards, progresso do Núcleo, jornada e ranking) se ajustam sozinhas.
 *
 * PRINCÍPIO: o Conector registra trabalho real; a plataforma calcula o
 * progresso. Nenhuma tela permite avançar a barra manualmente.
 */
export const missoesTerritorio: MissaoTerritorialConfig[] = [
  // EXPLORAR
  {
    id: "exp-mapear-ator",
    dimensao: "explorar",
    titulo: "Mapear ativos de inovação",
    descricao: "Identifique e cadastre pessoas, grupos ou organizações que movimentam a inovação no território.",
    icone: "🧭",
    tipoMissao: "automatica",
    metaTotal: 10,
    unidade: "ativos identificados",
    fonteProgresso: "ativos_inovacao",
    cta: "Cadastrar ativo",
    exigeValidacao: false,
    pontuacao: 180,
    conquista: "Cartógrafo do Território",
    limite: 0,
    ativo: true,
  },
  {
    id: "exp-ambiente",
    dimensao: "explorar",
    titulo: "Identificar ambientes de inovação",
    descricao: "Mapeie espaços de inovação: laboratórios, hubs, escolas técnicas, coworkings ou coletivos.",
    icone: "🏫",
    tipoMissao: "automatica",
    metaTotal: 5,
    unidade: "ambientes mapeados",
    fonteProgresso: "ambientes_inovacao",
    cta: "Cadastrar ambiente",
    exigeValidacao: false,
    pontuacao: 120,
    conquista: "Guia dos Ambientes",
    limite: 0,
    ativo: true,
  },
  {
    id: "exp-escuta",
    dimensao: "explorar",
    titulo: "Realizar escuta territorial",
    descricao: "Converse com atores do território e registre percepções, desafios e sonhos locais.",
    icone: "🎧",
    tipoMissao: "validacao",
    metaTotal: 6,
    unidade: "escutas registradas",
    fonteProgresso: "escutas_territoriais",
    cta: "Registrar escuta",
    exigeValidacao: true,
    pontuacao: 160,
    conquista: "Escuta Profunda",
    limite: 0,
    ativo: true,
  },
  // CONECTAR
  {
    id: "con-articulacao",
    dimensao: "conectar",
    titulo: "Registrar nova articulação",
    descricao: "Formalize articulações entre atores do território em torno de um tema comum.",
    icone: "🤝",
    tipoMissao: "validacao",
    metaTotal: 4,
    unidade: "articulações registradas",
    fonteProgresso: "articulacoes",
    cta: "Registrar articulação",
    exigeValidacao: true,
    pontuacao: 200,
    conquista: "Articulador Regional",
    limite: 0,
    ativo: true,
  },
  {
    id: "con-conexao-atores",
    dimensao: "conectar",
    titulo: "Promover conexão entre atores",
    descricao: "Aproxime atores que ainda não se conheciam e registre o encontro.",
    icone: "🔗",
    tipoMissao: "validacao",
    metaTotal: 3,
    unidade: "conexões promovidas",
    fonteProgresso: "conexoes_atores",
    cta: "Registrar conexão",
    exigeValidacao: true,
    pontuacao: 220,
    conquista: "Construtor de Pontes",
    limite: 0,
    ativo: true,
  },
  {
    id: "con-outro-nucleo",
    dimensao: "conectar",
    titulo: "Colaborar com outro Núcleo Territorial",
    descricao: "Realize ações conjuntas com conectores de outro Núcleo Territorial do Caminhos da Inovação.",
    icone: "🌉",
    tipoMissao: "validacao",
    metaTotal: 2,
    unidade: "colaborações realizadas",
    fonteProgresso: "colaboracoes_internucleos",
    cta: "Registrar colaboração",
    exigeValidacao: true,
    pontuacao: 260,
    conquista: "Tecelão da Rede",
    limite: 0,
    ativo: true,
  },
  // DESCOBRIR
  {
    id: "des-iniciativa",
    dimensao: "descobrir",
    titulo: "Revelar iniciativa inovadora",
    descricao: "Documente soluções criativas que nasceram no território e ainda não eram conhecidas.",
    icone: "💡",
    tipoMissao: "validacao",
    metaTotal: 5,
    unidade: "iniciativas reveladas",
    fonteProgresso: "iniciativas_reveladas",
    cta: "Registrar iniciativa",
    exigeValidacao: true,
    pontuacao: 200,
    conquista: "Revelador de Inovações",
    limite: 0,
    ativo: true,
  },
  {
    id: "des-vocacao",
    dimensao: "descobrir",
    titulo: "Atualizar atlas de vocações",
    descricao: "Reconheça e registre vocações produtivas, culturais ou ambientais do território.",
    icone: "📚",
    tipoMissao: "validacao",
    metaTotal: 4,
    unidade: "análises registradas",
    fonteProgresso: "vocacoes_territoriais",
    cta: "Registrar análise",
    exigeValidacao: true,
    pontuacao: 240,
    conquista: "Atlas Vivo",
    limite: 0,
    ativo: true,
  },
  {
    id: "des-oportunidade",
    dimensao: "descobrir",
    titulo: "Identificar oportunidade ou lacuna",
    descricao: "Aponte oportunidades de desenvolvimento ou lacunas que o território precisa preencher.",
    icone: "🔎",
    tipoMissao: "validacao",
    metaTotal: 4,
    unidade: "oportunidades identificadas",
    fonteProgresso: "oportunidades_identificadas",
    cta: "Registrar oportunidade",
    exigeValidacao: true,
    pontuacao: 240,
    conquista: "Olhar de Oportunidade",
    limite: 0,
    ativo: true,
  },
  // TRANSFORMAR
  {
    id: "tra-mobilizar",
    dimensao: "transformar",
    titulo: "Mobilizar atores do território",
    descricao: "Organize a participação de atores locais em ações coletivas de inovação.",
    icone: "📣",
    tipoMissao: "validacao",
    metaTotal: 3,
    unidade: "mobilizações realizadas",
    fonteProgresso: "mobilizacoes",
    cta: "Registrar mobilização",
    exigeValidacao: true,
    pontuacao: 280,
    conquista: "Voz do Território",
    limite: 0,
    ativo: true,
  },
  {
    id: "tra-oficina",
    dimensao: "transformar",
    titulo: "Realizar oficina ou encontro",
    descricao: "Planeje e realize oficinas, encontros ou jornadas de aprendizagem no território.",
    icone: "🛠️",
    tipoMissao: "validacao",
    metaTotal: 2,
    unidade: "oficinas realizadas",
    fonteProgresso: "oficinas_realizadas",
    cta: "Registrar atividade",
    exigeValidacao: true,
    pontuacao: 320,
    conquista: "Catalisador de Soluções",
    limite: 0,
    ativo: true,
  },
  {
    id: "tra-resultado",
    dimensao: "transformar",
    titulo: "Registrar resultado de uma articulação",
    descricao: "Documente resultados concretos gerados por articulações do território.",
    icone: "🚀",
    tipoMissao: "validacao",
    metaTotal: 2,
    unidade: "relatórios aprovados",
    fonteProgresso: "resultados_articulacao",
    cta: "Enviar relatório",
    exigeValidacao: true,
    pontuacao: 360,
    conquista: "Guardião dos Resultados",
    limite: 0,
    ativo: true,
  },
];

export const missaoTerritorialMap = missoesTerritorio.reduce<
  Record<string, MissaoTerritorialConfig>
>((acc, m) => ({ ...acc, [m.id]: m }), {});

/** Rótulos amigáveis dos status automáticos, centralizados. */
export const statusMissaoLabel: Record<StatusMissao, string> = {
  nao_iniciada: "Não iniciada",
  andamento: "Em andamento",
  validacao: "Em validação",
  ajustes: "Ajustes solicitados",
  concluida: "Concluída",
};

export const ordemDimensoes: DimensaoId[] = ["explorar", "conectar", "descobrir", "transformar"];

export function missoesPorDimensao(dimensao: DimensaoId) {
  return missoesTerritorio.filter((m) => m.dimensao === dimensao && m.ativo);
}

export function pontuacaoTotalDimensao(dimensao: DimensaoId) {
  return missoesPorDimensao(dimensao).reduce((s, m) => s + m.pontuacao, 0);
}

export function metaTotalDimensao(dimensao: DimensaoId) {
  return missoesPorDimensao(dimensao).reduce((s, m) => s + m.metaTotal, 0);
}

/**
 * INDICADORES TERRITORIAIS DO NÚCLEO (resultado coletivo dos dois Conectores).
 * Alimentados pelos registros aprovados — não são pontuação.
 */
export const indicadoresNucleo: IndicadorConfig[] = [
  {
    id: "ind-ativos",
    rotulo: "Ativos mapeados",
    icone: "🧭",
    fonte: "ativos_inovacao",
    descricao: "Ativos de inovação cadastrados e vinculados ao Núcleo",
  },
  {
    id: "ind-articulacoes",
    rotulo: "Articulações realizadas",
    icone: "🤝",
    fonte: "articulacoes",
    descricao: "Articulações registradas e validadas",
  },
  {
    id: "ind-iniciativas",
    rotulo: "Iniciativas identificadas",
    icone: "💡",
    fonte: "iniciativas_reveladas",
    descricao: "Iniciativas inovadoras reveladas no território",
  },
  {
    id: "ind-oportunidades",
    rotulo: "Oportunidades identificadas",
    icone: "🔎",
    fonte: "oportunidades_identificadas",
    descricao: "Oportunidades e lacunas apontadas pelo Núcleo",
  },
];

/**
 * INDICADORES INDIVIDUAIS DO CONECTOR (responsabilidades pessoais).
 * Metas PROVISÓRIAS; valores começam zerados até haver cadastro real.
 */
export const indicadoresIndividuais: IndicadorConfig[] = [
  {
    id: "ind-reunioes",
    rotulo: "Participação em reuniões",
    icone: "🗓️",
    meta: 12,
    descricao: "Reuniões da rede com presença registrada",
  },
  {
    id: "ind-relatorios",
    rotulo: "Relatórios enviados",
    icone: "📄",
    meta: 12,
    descricao: "Relatórios mensais entregues e aceitos",
  },
  {
    id: "ind-metas",
    rotulo: "Metas individuais cumpridas",
    icone: "🎯",
    meta: 6,
    descricao: "Metas individuais acordadas com a Coordenação",
  },
  {
    id: "ind-pendencias",
    rotulo: "Pendências individuais",
    icone: "⏳",
    descricao: "Itens que aguardam ação do Conector",
  },
];
