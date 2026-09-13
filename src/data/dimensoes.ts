import type { Dimensao, DimensaoId } from "@/types";

export const dimensoes: Dimensao[] = [
  {
    id: "explorar",
    nome: "Explorar",
    icone: "🧭",
    descricao: "Mapear o território e reconhecer seus ativos de inovação",
    colorVar: "var(--dim-explorar)",
  },
  {
    id: "conectar",
    nome: "Conectar",
    icone: "🤝",
    descricao: "Aproximar atores, criar pontes e articular redes",
    colorVar: "var(--dim-conectar)",
  },
  {
    id: "descobrir",
    nome: "Descobrir",
    icone: "💡",
    descricao: "Escutar histórias e revelar inovações invisíveis",
    colorVar: "var(--dim-descobrir)",
  },
  {
    id: "transformar",
    nome: "Transformar",
    icone: "🚀",
    descricao: "Transformar conhecimento e conexões em oportunidades de desenvolvimento territorial",
    colorVar: "var(--dim-transformar)",
  },
];

export const dimensaoMap: Record<DimensaoId, Dimensao> = dimensoes.reduce(
  (acc, d) => ({ ...acc, [d.id]: d }),
  {} as Record<DimensaoId, Dimensao>,
);

export const progressoDimensoes: Record<DimensaoId, number> = {
  explorar: 86,
  conectar: 72,
  descobrir: 64,
  transformar: 41,
};
