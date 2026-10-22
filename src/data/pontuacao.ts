import { missoesTerritorio } from "@/data/missoes.config";
import type { MissaoTerritorialCalculada, RegistroJornada } from "@/types";

export type ContribuicaoMissao = Pick<RegistroJornada, "missaoId" | "statusValidacao">;

/** Mesma condição de conclusão da Jornada: meta aprovada, sem pendências vinculadas. */
export function calcularMissoes(registros: readonly ContribuicaoMissao[]): MissaoTerritorialCalculada[] {
  return missoesTerritorio.filter((m) => m.ativo).map((m) => {
    const daMissao = registros.filter((r) => r.missaoId === m.id);
    const aprovados = daMissao.filter((r) => r.statusValidacao === "aprovado").length;
    const emValidacao = daMissao.filter((r) => r.statusValidacao === "em_validacao").length;
    const emAjuste = daMissao.filter((r) => r.statusValidacao === "ajustes_solicitados").length;
    const progressoAtual = Math.min(aprovados, m.metaTotal);
    const percentual = m.metaTotal > 0 ? Math.min(100, Math.round((progressoAtual / m.metaTotal) * 100)) : 0;
    const status: MissaoTerritorialCalculada["status"] = progressoAtual >= m.metaTotal && emValidacao === 0 && emAjuste === 0 ? "concluida" : emAjuste > 0 ? "ajustes" : emValidacao > 0 ? "validacao" : progressoAtual > 0 ? "andamento" : "nao_iniciada";
    return { ...m, progressoAtual, percentualProgresso: percentual, restante: Math.max(0, m.metaTotal - progressoAtual), registrosEmValidacao: emValidacao, registrosEmAjuste: emAjuste, status };
  });
}

export function somarPontuacao(missoes: readonly MissaoTerritorialCalculada[]): number {
  return missoes.reduce((s, m) => s + (m.status === "concluida" ? m.pontuacao : 0), 0);
}