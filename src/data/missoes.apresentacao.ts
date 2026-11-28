import type { MovimentoId } from "@/data/movimentos";

/**
 * APRESENTAÇÃO DAS MISSÕES — camada somente visual.
 *
 * Define o subtítulo do movimento e os cartões exibidos para a usuária.
 * Não altera o banco de dados, os identificadores persistidos (`missao_id`),
 * as metas, a pontuação real nem as regras de progresso: a associação
 * missão → movimento continua exclusiva de `movimentos.ts`.
 *
 * Quando um cartão representa uma missão já existente, ele referencia o ID
 * legado dessa missão. Quando ainda não existe missão correspondente no banco,
 * o cartão não referencia nenhuma: o registro segue sem vínculo de missão e
 * sem contabilizar pontuação, até que a regra seja aprovada e ativada à parte.
 */
export interface CartaoMissao {
  chave: string;
  titulo: string;
  descricao: string;
  categorias: string[];
  cta: string;
  /** Texto informativo de pontuação; não ativa regra de cálculo. */
  pontuacao: string;
  /** ID legado persistido, quando o cartão representa uma missão já existente. */
  missaoId?: string;
  /** Ícone exibido quando o cartão não tem missão vinculada. */
  icone?: string;
}

export interface BlocoMovimento {
  subtitulo: string;
  cartoes: CartaoMissao[];
}

export const apresentacaoMissoes: Partial<Record<MovimentoId, BlocoMovimento>> = {
  reconhecer: {
    subtitulo: "Dados Secundários",
    cartoes: [
      {
        chave: "ambientes",
        titulo: "Mapeamento de ambientes",
        descricao: "Identifique e registre ambientes que promovem a inovação no território.",
        categorias: ["Incubadora", "Aceleradora", "Parque Tecnológico", "NIT", "Outros (especificar)"],
        cta: "Cadastrar ambiente",
        pontuacao: "50 pontos após aprovação",
        missaoId: "exp-ambiente",
      },
      {
        chave: "suporte",
        titulo: "Mapeamento de suporte",
        descricao: "Identifique e registre mecanismos de apoio e incentivo à inovação no território.",
        categorias: [
          "Leis",
          "Programas de Inovação",
          "Editais de Fomento",
          "Órgãos Públicos",
          "Feiras e Eventos de Inovação",
          "Pesquisa",
          "Outros (especificar)",
        ],
        cta: "Cadastrar suporte",
        pontuacao: "40 pontos após aprovação",
        icone: "🛠️",
      },
    ],
  },
};
