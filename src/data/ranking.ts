import type { Insight, RankingFiltro, RankingItem } from "@/types";
import { nucleos } from "./nucleos";

export const rankingBase: RankingItem[] = [
  { nucleoId: "rio-doce", nome: "Rio Doce", pontos: 3480, evolucao: 18, colaboracoes: 9, conexoes: 29, descobertas: 41 },
  { nucleoId: "caparao", nome: "Caparaó", pontos: 3240, evolucao: 24, colaboracoes: 11, conexoes: 24, descobertas: 38 },
  { nucleoId: "vitoria", nome: "Vitória", pontos: 3120, evolucao: 12, colaboracoes: 7, conexoes: 26, descobertas: 33 },
  { nucleoId: "serra", nome: "Serra", pontos: 2450, evolucao: 31, colaboracoes: 8, conexoes: 18, descobertas: 27 },
  { nucleoId: "vila-velha", nome: "Vila Velha", pontos: 2280, evolucao: 9, colaboracoes: 5, conexoes: 17, descobertas: 22 },
  { nucleoId: "cariacica", nome: "Cariacica", pontos: 1980, evolucao: 14, colaboracoes: 6, conexoes: 14, descobertas: 19 },
  { nucleoId: "central-serrana", nome: "Central Serrana", pontos: 1870, evolucao: 11, colaboracoes: 4, conexoes: 12, descobertas: 17 },
  { nucleoId: "litoral-sul", nome: "Litoral Sul", pontos: 1760, evolucao: 8, colaboracoes: 3, conexoes: 13, descobertas: 15 },
  { nucleoId: "centro-sul", nome: "Centro Sul", pontos: 1690, evolucao: 7, colaboracoes: 4, conexoes: 10, descobertas: 14 },
  { nucleoId: "viana-fundao-guarapari", nome: "Viana / Fundão / Guarapari", pontos: 1640, evolucao: 16, colaboracoes: 3, conexoes: 11, descobertas: 12 },
  { nucleoId: "centro-oeste", nome: "Centro-Oeste", pontos: 1510, evolucao: 6, colaboracoes: 2, conexoes: 10, descobertas: 11 },
  { nucleoId: "sudoeste-serrana", nome: "Sudoeste Serrana", pontos: 1420, evolucao: 13, colaboracoes: 4, conexoes: 9, descobertas: 10 },
  { nucleoId: "noroeste", nome: "Noroeste", pontos: 1350, evolucao: 10, colaboracoes: 2, conexoes: 9, descobertas: 9 },
  { nucleoId: "nordeste", nome: "Nordeste", pontos: 1280, evolucao: 21, colaboracoes: 3, conexoes: 8, descobertas: 8 },
];

export const filtrosRanking: { id: RankingFiltro; nome: string; sufixo: string }[] = [
  { id: "pontos", nome: "Pontos de impacto", sufixo: "pts" },
  { id: "evolucao", nome: "Maior evolução", sufixo: "% no mês" },
  { id: "colaborativo", nome: "Mais colaborativo", sufixo: "missões conjuntas" },
  { id: "conexoes", nome: "Mais conexões", sufixo: "conexões" },
  { id: "descobertas", nome: "Mais descobertas", sufixo: "descobertas" },
];

export function ordenarRanking(filtro: RankingFiltro): RankingItem[] {
  const chave = {
    pontos: "pontos",
    evolucao: "evolucao",
    colaborativo: "colaboracoes",
    conexoes: "conexoes",
    descobertas: "descobertas",
  }[filtro] as keyof RankingItem;
  return [...rankingBase].sort((a, b) => Number(b[chave]) - Number(a[chave]));
}

export function valorRanking(item: RankingItem, filtro: RankingFiltro): number {
  const chave = {
    pontos: "pontos",
    evolucao: "evolucao",
    colaborativo: "colaboracoes",
    conexoes: "conexoes",
    descobertas: "descobertas",
  }[filtro] as keyof RankingItem;
  return Number(item[chave]);
}

export const insights: Insight[] = [
  {
    id: "i1",
    titulo: "Periferias concentram inovação social",
    texto:
      "62% das escutas da Serra em bairros periféricos revelaram soluções de reuso, mobilidade e cuidado coletivo sem qualquer apoio institucional.",
    tendencia: "alta",
    variacao: "+18% no trimestre",
    dimensao: "descobrir",
  },
  {
    id: "i2",
    titulo: "Pontes intermunicipais aceleram pontos",
    texto:
      "Núcleos com pelo menos uma missão colaborativa ativa evoluem 2,3x mais rápido que núcleos isolados.",
    tendencia: "alta",
    variacao: "+2,3x de evolução",
    dimensao: "conectar",
  },
  {
    id: "i3",
    titulo: "Transformar é o gargalo capixaba",
    texto:
      "A dimensão Transformar tem a menor média estadual (41%). Prototipar com a comunidade é a etapa mais adiada pelos núcleos.",
    tendencia: "atencao",
    variacao: "média estadual 41%",
    dimensao: "transformar",
  },
  {
    id: "i4",
    titulo: "Agroinovação cresce nas montanhas",
    texto:
      "Cafés especiais e turismo comunitário puxam a inovação no Caparaó e nas regiões serranas, com forte protagonismo de jovens rurais.",
    tendencia: "alta",
    variacao: "+27 iniciativas mapeadas",
    dimensao: "explorar",
  },
  {
    id: "i5",
    titulo: "Escutas estáveis, registros irregulares",
    texto:
      "O volume de escutas se mantém, mas 1 em cada 4 não é convertida em registro estruturado no atlas territorial.",
    tendencia: "estavel",
    variacao: "24% sem registro",
    dimensao: "descobrir",
  },
  {
    id: "i6",
    titulo: "Rede estadual em adensamento",
    texto:
      "A malha capixaba passou de 118 para 189 conexões ativas entre os 14 núcleos regionais no último semestre.",
    tendencia: "alta",
    variacao: "+71 conexões",
    dimensao: "conectar",
  },
];

export const totaisEstado = {
  nucleos: nucleos.length,
  atores: nucleos.reduce((s, n) => s + n.atores, 0),
  escutas: nucleos.reduce((s, n) => s + n.escutas, 0),
  inovacoes: nucleos.reduce((s, n) => s + n.inovacoes, 0),
};
