import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { missoesTerritorio, missaoTerritorialMap, ordemDimensoes, xpTotalDimensao } from "@/data/missoes.config";
import { conectores } from "@/data/jornada";
import { nucleoAtualId } from "@/data/nucleos";
import type { DimensaoId, Evidencia, StatusMissao } from "@/types";

/**
 * Estado da jornada do participante (MVP, em memória).
 * Futuramente os dados virão do banco: participante autenticado,
 * conectores do núcleo, status das missões e evidências.
 */
interface MeuNucleoState {
  participante: { nome: string; papel: string; iniciais: string };
  nucleoId: string;
  conectoresNucleo: typeof conectores;
  statusPorMissao: Record<string, StatusMissao>;
  evidencias: Evidencia[];
  xpTotal: number;
  missoesConcluidas: number;
  missoesEmValidacao: number;
  progressoPorDimensao: Record<DimensaoId, number>;
  iniciarMissao: (id: string) => void;
  enviarEvidencia: (missaoId: string, dados: Omit<Evidencia, "missaoId" | "enviadaEm">) => void;
}

const MeuNucleoContext = createContext<MeuNucleoState | null>(null);

const statusInicial = (): Record<string, StatusMissao> =>
  Object.fromEntries(missoesTerritorio.map((m) => [m.id, "disponivel" as StatusMissao]));

export function MeuNucleoProvider({ children }: { children: ReactNode }) {
  const [statusPorMissao, setStatusPorMissao] =
    useState<Record<string, StatusMissao>>(statusInicial);
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);

  const iniciarMissao = useCallback((id: string) => {
    setStatusPorMissao((atual) =>
      atual[id] === "disponivel" ? { ...atual, [id]: "andamento" } : atual,
    );
  }, []);

  const enviarEvidencia = useCallback<MeuNucleoState["enviarEvidencia"]>(
    (missaoId, dados) => {
      const config = missaoTerritorialMap[missaoId];
      if (!config) return;
      setEvidencias((atual) => [
        ...atual,
        { ...dados, missaoId, enviadaEm: new Date().toISOString() },
      ]);
      // Toda missão exige validação: após o envio fica "Em validação",
      // nunca é aprovada automaticamente.
      setStatusPorMissao((atual) => ({
        ...atual,
        [missaoId]: config.requerValidacao ? "validacao" : "enviada",
      }));
    },
    [],
  );

  const value = useMemo<MeuNucleoState>(() => {
    const xpTotal = missoesTerritorio.reduce(
      (s, m) => s + (statusPorMissao[m.id] === "concluida" ? m.xp : 0),
      0,
    );
    const progressoPorDimensao = Object.fromEntries(
      ordemDimensoes.map((d) => {
        const conquistado = missoesTerritorio
          .filter((m) => m.dimensao === d && statusPorMissao[m.id] === "concluida")
          .reduce((s, m) => s + m.xp, 0);
        const total = xpTotalDimensao(d);
        return [d, total > 0 ? Math.round((conquistado / total) * 100) : 0];
      }),
    ) as Record<DimensaoId, number>;

    return {
      participante: {
        nome: conectores[0]!.nome,
        papel: conectores[0]!.papel,
        iniciais: conectores[0]!.iniciais,
      },
      nucleoId: nucleoAtualId,
      conectoresNucleo: conectores,
      statusPorMissao,
      evidencias,
      xpTotal,
      missoesConcluidas: Object.values(statusPorMissao).filter((s) => s === "concluida").length,
      missoesEmValidacao: Object.values(statusPorMissao).filter(
        (s) => s === "validacao" || s === "enviada",
      ).length,
      progressoPorDimensao,
      iniciarMissao,
      enviarEvidencia,
    };
  }, [statusPorMissao, evidencias, iniciarMissao, enviarEvidencia]);

  return <MeuNucleoContext.Provider value={value}>{children}</MeuNucleoContext.Provider>;
}

export function useMeuNucleo() {
  const ctx = useContext(MeuNucleoContext);
  if (!ctx) throw new Error("useMeuNucleo precisa estar dentro de MeuNucleoProvider");
  return ctx;
}
