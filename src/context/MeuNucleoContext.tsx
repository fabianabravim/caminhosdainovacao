import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  indicadoresIndividuais,
  indicadoresNucleo,
  metaTotalDimensao,
  missaoTerritorialMap,
  missoesTerritorio,
  ordemDimensoes,
} from "@/data/missoes.config";
import { tipoAtividadeMap } from "@/data/atividades.config";
import { conectores } from "@/data/jornada";
import { nucleoAtualId } from "@/data/nucleos";
import { MeuNucleoContext, type MeuNucleoState } from "@/context/meuNucleoBase";
import type {
  AtividadeRegistrada,
  DimensaoId,
  FonteProgressoTerritorio,
  MissaoTerritorialCalculada,
  RegistroJornada,
  StatusValidacaoRegistro,
} from "@/types";

/**
 * Estado da jornada do Núcleo (MVP, em memória).
 *
 * ARQUITETURA: a única coisa que o Conector cria é ATIVIDADE REAL com
 * evidência. Progresso, status das missões, indicadores e pontuação são SEMPRE
 * derivados dessas atividades — nunca editáveis manualmente.
 *
 * O contexto, o hook e os tipos vivem em `meuNucleoBase.ts` para este arquivo
 * exportar apenas o provider (componente) — compatível com Fast Refresh.
 */
export { useMeuNucleo } from "@/context/meuNucleoBase";
export type { MeuNucleoState, ResultadoRegistro } from "@/context/meuNucleoBase";

/** Enquanto não houver cadastro real, nada é inventado: tudo começa zerado. */
const atividadesIniciais: AtividadeRegistrada[] = [];

function statusValidacaoDe(status: AtividadeRegistrada["status"]): StatusValidacaoRegistro {
  if (status === "aprovada") return "aprovado";
  if (status === "ajustes_solicitados") return "ajustes_solicitados";
  return "em_validacao";
}

/** Missões que uma atividade pode alimentar (hoje ou com regras futuras). */
function missoesDaAtividade(tipoId: string, missaoId?: string) {
  const fontes = tipoAtividadeMap[tipoId]?.fontes ?? [];
  const ids = missoesTerritorio
    .filter((m) => m.ativo && fontes.includes(m.fonteProgresso))
    .map((m) => m.id);
  if (missaoId && !ids.includes(missaoId)) ids.unshift(missaoId);
  return ids;
}

export function MeuNucleoProvider({ children }: { children: ReactNode }) {
  const [atividades, setAtividades] = useState<AtividadeRegistrada[]>(atividadesIniciais);

  const registrarAtividade = useCallback<MeuNucleoState["registrarAtividade"]>((dados) => {
    const relacionadas = missoesDaAtividade(dados.tipoId, dados.missaoId);
    // Contribuição contabilizada: a missão de origem ou a primeira compatível.
    const missaoPrincipalId = dados.missaoId ?? relacionadas[0];
    const missaoPrincipal = missaoPrincipalId ? missaoTerritorialMap[missaoPrincipalId] : undefined;
    const exigeValidacao = missaoPrincipal?.exigeValidacao ?? true;

    const atividade: AtividadeRegistrada = {
      ...dados,
      id: `atv-${Date.now()}`,
      status: exigeValidacao ? "em_validacao" : "aprovada",
      criadoEm: new Date().toISOString(),
      fonteContribuicao: missaoPrincipal?.fonteProgresso,
      missoesRelacionadas: relacionadas,
    };

    setAtividades((atual) => [atividade, ...atual]);

    return {
      atividade,
      missoesRelacionadas: relacionadas
        .map((id) => missaoTerritorialMap[id])
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .map((m) => ({ id: m.id, titulo: m.titulo, icone: m.icone })),
    };
  }, []);

  const value = useMemo<MeuNucleoState>(() => {
    // Registros de progresso derivados das atividades (1 contribuição cada).
    const registros: RegistroJornada[] = atividades.flatMap((a) => {
      const missaoId = a.missaoId ?? a.missoesRelacionadas[0];
      if (!missaoId || !a.fonteContribuicao) return [];
      return [
        {
          id: `reg-${a.id}`,
          missaoId,
          fonte: a.fonteContribuicao,
          titulo: a.titulo,
          descricao: a.descricao,
          data: a.data,
          local: a.local,
          atores: a.atores,
          resultado: a.resultados,
          localizacao: a.localizacao,
          municipio: a.municipio || undefined,
          anexoNome: a.evidenciaFoto ?? a.evidenciaDocumento,
          statusValidacao: statusValidacaoDe(a.status),
          criadoEm: a.criadoEm,
        },
      ];
    });

    const missoes: MissaoTerritorialCalculada[] = missoesTerritorio
      .filter((m) => m.ativo)
      .map((m) => {
        const daMissao = registros.filter((r) => r.missaoId === m.id);
        const aprovados = daMissao.filter((r) => r.statusValidacao === "aprovado").length;
        const emValidacao = daMissao.filter((r) => r.statusValidacao === "em_validacao").length;
        const emAjuste = daMissao.filter((r) => r.statusValidacao === "ajustes_solicitados").length;

        const progressoAtual = Math.min(aprovados, m.metaTotal);
        const percentual =
          m.metaTotal > 0 ? Math.min(100, Math.round((progressoAtual / m.metaTotal) * 100)) : 0;

        const status: MissaoTerritorialCalculada["status"] =
          progressoAtual >= m.metaTotal && emValidacao === 0 && emAjuste === 0
            ? "concluida"
            : emAjuste > 0
              ? "ajustes"
              : emValidacao > 0
                ? "validacao"
                : progressoAtual > 0
                  ? "andamento"
                  : "nao_iniciada";

        return {
          ...m,
          progressoAtual,
          percentualProgresso: percentual,
          restante: Math.max(0, m.metaTotal - progressoAtual),
          registrosEmValidacao: emValidacao,
          registrosEmAjuste: emAjuste,
          status,
        };
      });

    const progressoPorDimensao = Object.fromEntries(
      ordemDimensoes.map((d) => {
        const doGrupo = missoes.filter((m) => m.dimensao === d);
        const feito = doGrupo.reduce((s, m) => s + m.progressoAtual, 0);
        const meta = metaTotalDimensao(d);
        return [d, meta > 0 ? Math.round((feito / meta) * 100) : 0];
      }),
    ) as Record<DimensaoId, number>;

    const metaGeral = missoes.reduce((s, m) => s + m.metaTotal, 0);
    const feitoGeral = missoes.reduce((s, m) => s + m.progressoAtual, 0);

    const contarPorFonte = (fonte?: FonteProgressoTerritorio) =>
      fonte
        ? registros.filter((r) => r.fonte === fonte && r.statusValidacao === "aprovado").length
        : 0;

    return {
      participante: {
        nome: conectores[0]!.nome,
        papel: conectores[0]!.papel,
        iniciais: conectores[0]!.iniciais,
      },
      nucleoId: nucleoAtualId,
      conectoresNucleo: conectores,
      atividades,
      registros,
      missoes,
      missoesPorDimensao: (d) => missoes.filter((m) => m.dimensao === d),
      missaoPorId: (id) => missoes.find((m) => m.id === id),
      progressoNucleo: metaGeral > 0 ? Math.round((feitoGeral / metaGeral) * 100) : 0,
      progressoPorDimensao,
      // Pontuação é CONSEQUÊNCIA: só entra quando a missão é concluída.
      pontuacaoTotal: missoes.reduce((s, m) => s + (m.status === "concluida" ? m.pontuacao : 0), 0),
      missoesConcluidas: missoes.filter((m) => m.status === "concluida").length,
      missoesEmValidacao: missoes.filter((m) => m.status === "validacao").length,
      atividadesEmValidacao: atividades.filter((a) => a.status === "em_validacao").length,
      indicadoresTerritoriais: indicadoresNucleo.map((i) => ({
        ...i,
        valor: contarPorFonte(i.fonte),
      })),
      // Indicadores individuais ainda não possuem fonte de cadastro: zerados.
      indicadoresIndividuais: indicadoresIndividuais.map((i) => ({ ...i, valor: 0 })),
      registrarAtividade,
    };
  }, [atividades, registrarAtividade]);

  return <MeuNucleoContext.Provider value={value}>{children}</MeuNucleoContext.Provider>;
}
