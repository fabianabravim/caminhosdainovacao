import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { missoes as missoesBase, missoesColaborativas } from "@/data/missoes";
import { niveis, pontosIniciais } from "@/data/jornada";
import { conexoes as conexoesBase } from "@/data/nucleos";
import type { Conexao, Missao } from "@/types";

interface Celebracao {
  id: number;
  tipo: "missao" | "conexao";
  titulo: string;
  detalhe: string;
  pontos?: number;
}

interface JornadaState {
  pontos: number;
  missoes: Missao[];
  concluidas: string[];
  conexoes: Conexao[];
  celebracao: Celebracao | null;
  nivelAtual: typeof niveis[number];
  proximoNivel: typeof niveis[number] | null;
  faltamPontos: number;
  avancarMissao: (id: string) => void;
  criarConexao: (deId: string, paraId: string, titulo: string) => void;
  fecharCelebracao: () => void;
}

const JornadaContext = createContext<JornadaState | null>(null);

export function JornadaProvider({ children }: { children: ReactNode }) {
  const [pontos, setPontos] = useState(pontosIniciais);
  const [missoes, setMissoes] = useState<Missao[]>(missoesBase);
  const [concluidas, setConcluidas] = useState<string[]>([]);
  const [conexoes, setConexoes] = useState<Conexao[]>(conexoesBase);
  const [celebracao, setCelebracao] = useState<Celebracao | null>(null);

  const avancarMissao = useCallback((id: string) => {
    setMissoes((atual) =>
      atual.map((m) => {
        if (m.id !== id || m.progresso >= m.meta) return m;
        const progresso = m.progresso + 1;
        if (progresso >= m.meta) {
          setPontos((p) => p + m.pontos);
          setConcluidas((c) => (c.includes(m.id) ? c : [...c, m.id]));
          setCelebracao({
            id: Date.now(),
            tipo: "missao",
            titulo: "Missão concluída",
            detalhe: m.titulo,
            pontos: m.pontos,
          });
        }
        return { ...m, progresso };
      }),
    );
  }, []);

  const criarConexao = useCallback((deId: string, paraId: string, titulo: string) => {
    setConexoes((atual) => {
      if (atual.some((c) => c.de === deId && c.para === paraId)) return atual;
      return [...atual, { de: deId, para: paraId, intensidade: 1, colaborativa: true, titulo }];
    });
    setPontos((p) => p + 120);
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
    const alcancados = niveis.filter((n) => pontos >= n.pontosNecessarios);
    const nivelAtual = (alcancados[alcancados.length - 1] ?? niveis[0])!;
    const indice = niveis.indexOf(nivelAtual);
    const proximoNivel = niveis[indice + 1] ?? null;
    return {
      pontos,
      missoes,
      concluidas,
      conexoes,
      celebracao,
      nivelAtual,
      proximoNivel,
      faltamPontos: proximoNivel ? proximoNivel.pontosNecessarios - pontos : 0,
      avancarMissao,
      criarConexao,
      fecharCelebracao,
    };
  }, [pontos, missoes, concluidas, conexoes, celebracao, avancarMissao, criarConexao, fecharCelebracao]);

  return <JornadaContext.Provider value={value}>{children}</JornadaContext.Provider>;
}

export function useJornada() {
  const ctx = useContext(JornadaContext);
  if (!ctx) throw new Error("useJornada precisa estar dentro de JornadaProvider");
  return ctx;
}

export { missoesColaborativas };
