import type { MissaoTerritorialConfig } from "@/types";

/**
 * MOVIMENTOS OFICIAIS DA ROTA DA INOVAÇÃO
 * Camada de compatibilidade: os IDs das missões (missao_id) são imutáveis e
 * persistidos; o movimento é derivado SOMENTE desta tabela explícita —
 * nunca do prefixo do identificador. O campo legado `dimensao` permanece
 * intacto para os componentes que ainda o utilizam.
 */
export type MovimentoId = "reconhecer" | "ouvir" | "traduzir" | "articular";

export const ordemMovimentos: MovimentoId[] = ["reconhecer", "ouvir", "traduzir", "articular"];

export const nomeMovimento: Record<MovimentoId, string> = {
  reconhecer: "Reconhecer",
  ouvir: "Ouvir",
  traduzir: "Traduzir",
  articular: "Articular",
};

export const movimentoPorMissao: Readonly<Record<string, MovimentoId>> = Object.freeze({
  "exp-mapear-ator": "reconhecer",
  "exp-ambiente": "reconhecer",
  "des-iniciativa": "reconhecer",
  "exp-escuta": "ouvir",
  "des-oportunidade": "ouvir",
  "des-vocacao": "traduzir",
  "tra-oficina": "traduzir",
  "tra-resultado": "traduzir",
  "con-articulacao": "articular",
  "con-conexao-atores": "articular",
  "con-outro-nucleo": "articular",
  "tra-mobilizar": "articular",
});

export function movimentoDaMissao(missaoId: string): MovimentoId | undefined {
  return movimentoPorMissao[missaoId];
}

export function missoesDoMovimento<T extends Pick<MissaoTerritorialConfig, "id" | "ativo">>(
  missoes: T[],
  movimento: MovimentoId,
): T[] {
  return missoes.filter((m) => m.ativo && movimentoPorMissao[m.id] === movimento);
}

/** % de progresso por movimento, a partir do progresso já calculado (aprovados). */
export function calcularProgressoPorMovimento(
  missoes: (Pick<MissaoTerritorialConfig, "id" | "ativo" | "metaTotal"> & { progressoAtual: number })[],
): Record<MovimentoId, number> {
  return Object.fromEntries(
    ordemMovimentos.map((mov) => {
      const lista = missoesDoMovimento(missoes, mov);
      const meta = lista.reduce((s, m) => s + m.metaTotal, 0);
      const feito = lista.reduce((s, m) => s + Math.min(m.progressoAtual, m.metaTotal), 0);
      return [mov, meta > 0 ? Math.round((feito / meta) * 100) : 0];
    }),
  ) as Record<MovimentoId, number>;
}

export function pontuacaoTotalMovimento(
  missoes: Pick<MissaoTerritorialConfig, "id" | "ativo" | "pontuacao">[],
  movimento: MovimentoId,
): number {
  return missoesDoMovimento(missoes, movimento).reduce((s, m) => s + m.pontuacao, 0);
}
