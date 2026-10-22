import { Compass, Handshake, Headphones, Lightbulb } from "lucide-react";
import { nomeMovimento, ordemMovimentos, type MovimentoId } from "@/data/movimentos";

/** Presentation only; mission membership is defined exclusively in movimentos.ts. */
const apresentacao: Record<MovimentoId, {
  descricao: string;
  icone: string;
  Icon: typeof Compass;
  colorVar: string;
  textoClasse: string;
  bordaClasse: string;
  fundoClasse: string;
}> = {
  reconhecer: {
    descricao: "Identificar atores, iniciativas e ambientes que impulsionam a inovação no território.",
    icone: "🧭", Icon: Compass, colorVar: "var(--dim-explorar)",
    textoClasse: "text-explorar", bordaClasse: "border-t-explorar", fundoClasse: "bg-explorar/15",
  },
  ouvir: {
    descricao: "Escutar pessoas e identificar necessidades, desafios e oportunidades do território.",
    icone: "🎧", Icon: Headphones, colorVar: "var(--dim-descobrir)",
    textoClasse: "text-descobrir", bordaClasse: "border-t-descobrir", fundoClasse: "bg-descobrir/15",
  },
  traduzir: {
    descricao: "Transformar informações e experiências em conhecimento, análises e resultados.",
    icone: "💡", Icon: Lightbulb, colorVar: "var(--dim-transformar)",
    textoClasse: "text-transformar", bordaClasse: "border-t-transformar", fundoClasse: "bg-transformar/15",
  },
  articular: {
    descricao: "Conectar pessoas, instituições e iniciativas para construir soluções colaborativas.",
    icone: "🤝", Icon: Handshake, colorVar: "var(--dim-conectar)",
    textoClasse: "text-conectar", bordaClasse: "border-t-conectar", fundoClasse: "bg-conectar/15",
  },
};

export const movimentosApresentacao = ordemMovimentos.map((id) => ({
  id, nome: nomeMovimento[id], ...apresentacao[id],
}));