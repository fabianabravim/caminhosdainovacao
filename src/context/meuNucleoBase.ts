import { createContext, useContext } from "react";
import type { conectores } from "@/data/jornada";
import type {
  AtividadeRegistrada,
  DadosAtividade,
  DimensaoId,
  IndicadorConfig,
  MissaoTerritorialCalculada,
  RegistroJornada,
} from "@/types";

/** Resultado devolvido ao registrar uma atividade. */
export interface ResultadoRegistro {
  atividade: AtividadeRegistrada;
  missoesRelacionadas: { id: string; titulo: string; icone: string }[];
}

export interface MeuNucleoState {
  participante: { nome: string; papel: string; iniciais: string };
  nucleoId: string;
  conectoresNucleo: typeof conectores;
  atividades: AtividadeRegistrada[];
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
  atividadesEmValidacao: number;
  indicadoresTerritoriais: (IndicadorConfig & { valor: number })[];
  indicadoresIndividuais: (IndicadorConfig & { valor: number })[];
  /** Registra a atividade e devolve o que ela poderá alimentar. */
  registrarAtividade: (dados: DadosAtividade) => ResultadoRegistro;
}

export const MeuNucleoContext = createContext<MeuNucleoState | null>(null);

export function useMeuNucleo() {
  const ctx = useContext(MeuNucleoContext);
  if (!ctx) throw new Error("useMeuNucleo precisa estar dentro de MeuNucleoProvider");
  return ctx;
}
