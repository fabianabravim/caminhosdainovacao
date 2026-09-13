import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  indicadoresIndividuais,
  indicadoresNucleo,
  metaTotalDimensao,
  missaoTerritorialMap,
  missoesPorDimensao,
  missoesTerritorio,
  ordemDimensoes,
} from "@/data/missoes.config";
import { conectores } from "@/data/jornada";
import { nucleoAtualId } from "@/data/nucleos";
import type {
  DadosRegistro,
  DimensaoId,
  FonteProgressoTerritorio,
  IndicadorConfig,
  MissaoTerritorialCalculada,
  RegistroJornada,
} from "@/types";

/**
 * Estado da jornada do Núcleo (MVP, em memória).
 *
 * ARQUITETURA: a única coisa que o Conector cria é REGISTRO DE TRABALHO REAL.
 * Progresso, percentual, status, indicadores e pontuação são SEMPRE derivados
 * desses registros — nunca editáveis manualmente. Futuramente os registros
 * virão do banco, já vinculados a município e Núcleo, alimentando também o
 * mapa da página "Territórios".
 */
interface MeuNucleoState {
  participante: { nome: string; papel: string; iniciais: string };
  nucleoId: string;
  conectoresNucleo: typeof conectores;
  registros: RegistroJornada[];
  missoes: MissaoTerritorialCalculada[];
  missoesPorDimensao: (d: DimensaoId) => MissaoTerritorialCalculada[];
  missaoPorId: (id: string) => MissaoTerritorialCalculada | undefined;
  /** Progresso territorial do Núcleo, em % das metas das missões ativas. */
  progressoNucleo: number;
  progressoPorDimensao: Record<DimensaoId, number>;
  pontuacaoTotal: number;
  missoesConcluidas: number;
  missoesEmValidacao: number;
  indicadoresTerritoriais: (IndicadorConfig & { valor: number })[];
  indicadoresIndividuais: (IndicadorConfig & { valor: number })[];
  registrarAtividade: (missaoId: string, dados: DadosRegistro) => void;
}

const MeuNucleoContext = createContext<MeuNucleoState | null>(null);

/**
 * Registros demonstrativos. Enquanto não houver cadastro real, a lista fica
 * vazia — nenhum número é inventado; tudo começa zerado.
 */
const registrosIniciais: RegistroJornada[] = [];

function contarPorFonte(registros: RegistroJornada[], fonte?: FonteProgressoTerritorio) {
  if (!fonte) return 0;
  return registros.filter((r) => r.fonte === fonte && r.statusValidacao === "aprovado").length;
}

export function MeuNucleoProvider({ children }: { children: ReactNode }) {
  const [registros, setRegistros] = useState<RegistroJornada[]>(registrosIniciais);

  const registrarAtividade = useCallback<MeuNucleoState["registrarAtividade"]>(
    (missaoId, dados) => {
      const config = missaoTerritorialMap[missaoId];
      if (!config) return;
      setRegistros((atual) => [
        ...atual,
        {
          ...dados,
          id: `reg-${missaoId}-${atual.length + 1}-${Date.now()}`,
          missaoId,
          fonte: config.fonteProgresso,
          municipio: undefined,
          // TIPO A soma direto; TIPO B fica em validação até aprovação.
          statusValidacao: config.exigeValidacao ? "em_validacao" : "aprovado",
          criadoEm: new Date().toISOString(),
        },
      ]);
    },
    [],
  );

  const value = useMemo<MeuNucleoState>(() => {
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

    return {
      participante: {
        nome: conectores[0]!.nome,
        papel: conectores[0]!.papel,
        iniciais: conectores[0]!.iniciais,
      },
      nucleoId: nucleoAtualId,
      conectoresNucleo: conectores,
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
      indicadoresTerritoriais: indicadoresNucleo.map((i) => ({
        ...i,
        valor: contarPorFonte(registros, i.fonte),
      })),
      // Indicadores individuais ainda não possuem fonte de cadastro: zerados.
      indicadoresIndividuais: indicadoresIndividuais.map((i) => ({ ...i, valor: 0 })),
      registrarAtividade,
    };
  }, [registros, registrarAtividade]);

  return <MeuNucleoContext.Provider value={value}>{children}</MeuNucleoContext.Provider>;
}

export function useMeuNucleo() {
  const ctx = useContext(MeuNucleoContext);
  if (!ctx) throw new Error("useMeuNucleo precisa estar dentro de MeuNucleoProvider");
  return ctx;
}

export { missoesPorDimensao as missoesConfigPorDimensao };
