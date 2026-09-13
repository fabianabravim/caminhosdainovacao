import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  missoes as missoesBase,
  missoesColaborativas,
  registrosAprovadosIniciais,
} from "@/data/missoes";
import { niveis, pontosIniciais } from "@/data/jornada";
import { conexoes as conexoesBase } from "@/data/nucleos";
import type { Conexao, MissaoCalculada, RegistroMissao } from "@/types";

interface Celebracao {
  id: number;
  tipo: "missao" | "conexao";
  titulo: string;
  detalhe: string;
  pontos?: number;
}

interface JornadaState {
  pontos: number;
  missoes: MissaoCalculada[];
  concluidas: string[];
  registrosMissoes: RegistroMissao[];
  conexoes: Conexao[];
  celebracao: Celebracao | null;
  nivelAtual: typeof niveis[number];
  proximoNivel: typeof niveis[number] | null;
  faltamPontos: number;
  registrarAtividade: (
    missaoId: string,
    dados: Pick<RegistroMissao, "titulo" | "descricao" | "data" | "local" | "anexoNome">,
  ) => void;
  criarConexao: (deId: string, paraId: string, titulo: string) => void;
  fecharCelebracao: () => void;
}

const JornadaContext = createContext<JornadaState | null>(null);

export function JornadaProvider({ children }: { children: ReactNode }) {
  const [registrosMissoes, setRegistrosMissoes] = useState<RegistroMissao[]>(() =>
    missoesBase.flatMap((missao) =>
      Array.from({ length: registrosAprovadosIniciais[missao.id] ?? 0 }, (_, indice) => ({
        id: `mock-${missao.id}-${indice + 1}`,
        missaoId: missao.id,
        fonte: missao.fonteProgresso,
        titulo: `Registro válido ${indice + 1}`,
        descricao: "Registro demonstrativo aprovado e vinculado à missão.",
        data: "2026-08-01",
        local: "Núcleo Serra",
        statusValidacao: "aprovado" as const,
        criadoEm: "2026-08-01T12:00:00.000Z",
      })),
    ),
  );
  const [conexoes, setConexoes] = useState<Conexao[]>(conexoesBase);
  const [celebracao, setCelebracao] = useState<Celebracao | null>(null);

  const registrarAtividade = useCallback<JornadaState["registrarAtividade"]>((missaoId, dados) => {
    const missao = missoesBase.find((item) => item.id === missaoId);
    if (!missao) return;
    setRegistrosMissoes((atual) => [
      ...atual,
      {
        ...dados,
        id: `registro-${Date.now()}`,
        missaoId,
        fonte: missao.fonteProgresso,
        statusValidacao: missao.requerValidacao ? "em_validacao" : "aprovado",
        criadoEm: new Date().toISOString(),
      },
    ]);
  }, []);

  const criarConexao = useCallback((deId: string, paraId: string, titulo: string) => {
    setConexoes((atual) => {
      if (atual.some((c) => c.de === deId && c.para === paraId)) return atual;
      return [...atual, { de: deId, para: paraId, intensidade: 1, colaborativa: true, titulo }];
    });
    setCelebracao({
      id: Date.now(),
      tipo: "conexao",
      titulo: "Nova conexão acesa",
      detalhe: titulo,
      pontos: 120,
    });
  }, []);

  const fecharCelebracao = useCallback(() => setCelebracao(null), []);

  const value = useMemo<JornadaState>(() => {
    const missoes: MissaoCalculada[] = missoesBase.map((missao) => {
      const registros = registrosMissoes.filter(
        (registro) => registro.missaoId === missao.id && registro.fonte === missao.fonteProgresso,
      );
      const progresso_atual = Math.min(
        missao.meta_total,
        registros.filter((registro) => registro.statusValidacao === "aprovado").length,
      );
      const registrosEmValidacao = registros.filter(
        (registro) => registro.statusValidacao === "em_validacao",
      ).length;
      const ajustesSolicitados = registros.some(
        (registro) => registro.statusValidacao === "ajustes_solicitados",
      );
      const percentual_progresso = missao.meta_total > 0
        ? Math.min(100, Math.round((progresso_atual / missao.meta_total) * 100))
        : 0;
      const todasValidacoesAprovadas = registrosEmValidacao === 0 && !ajustesSolicitados;
      const status = progresso_atual >= missao.meta_total && todasValidacoesAprovadas
        ? "concluida"
        : ajustesSolicitados
          ? "ajustes_solicitados"
          : registrosEmValidacao > 0
            ? "em_validacao"
            : progresso_atual > 0
              ? "andamento"
              : "nao_iniciada";
      return { ...missao, progresso_atual, percentual_progresso, status, registrosEmValidacao };
    });
    const concluidas = missoes.filter((missao) => missao.status === "concluida").map((missao) => missao.id);
    const pontos = pontosIniciais + missoes
      .filter((missao) => missao.status === "concluida")
      .reduce((total, missao) => total + missao.pontos, 0);
    const alcancados = niveis.filter((n) => pontos >= n.pontosNecessarios);
    const nivelAtual = (alcancados[alcancados.length - 1] ?? niveis[0])!;
    const indice = niveis.indexOf(nivelAtual);
    const proximoNivel = niveis[indice + 1] ?? null;
    return {
      pontos,
      missoes,
      concluidas,
      registrosMissoes,
      conexoes,
      celebracao,
      nivelAtual,
      proximoNivel,
      faltamPontos: proximoNivel ? proximoNivel.pontosNecessarios - pontos : 0,
      registrarAtividade,
      criarConexao,
      fecharCelebracao,
    };
  }, [registrosMissoes, conexoes, celebracao, registrarAtividade, criarConexao, fecharCelebracao]);

  return <JornadaContext.Provider value={value}>{children}</JornadaContext.Provider>;
}

export function useJornada() {
  const ctx = useContext(JornadaContext);
  if (!ctx) throw new Error("useJornada precisa estar dentro de JornadaProvider");
  return ctx;
}

export { missoesColaborativas };
