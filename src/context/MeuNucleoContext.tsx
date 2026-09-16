import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  indicadoresIndividuais,
  indicadoresNucleo,
  metaTotalDimensao,
  missaoTerritorialMap,
  missoesTerritorio,
  ordemDimensoes,
} from "@/data/missoes.config";
import { tipoAtividadeMap } from "@/data/atividades.config";
import { MeuNucleoContext, type MeuNucleoState } from "@/context/meuNucleoBase";
import { supabase } from "@/integrations/supabase/client";
import { vincularPerfilAutorizado } from "@/lib/acesso.functions";
import type {
  AtividadeRegistrada,
  Conector,
  DimensaoId,
  FonteProgressoTerritorio,
  MissaoTerritorialCalculada,
  PerfilConector,
  RegistroJornada,
  StatusAtividade,
  StatusValidacaoRegistro,
} from "@/types";

export type { MeuNucleoState, ResultadoRegistro } from "@/context/meuNucleoBase";

function iniciais(nome: string) {
  return nome.split(/\s+/).filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
}

function statusValidacaoDe(status: AtividadeRegistrada["status"]): StatusValidacaoRegistro {
  if (status === "aprovada") return "aprovado";
  if (status === "ajustes_solicitados") return "ajustes_solicitados";
  return "em_validacao";
}

function missoesDaAtividade(tipoId: string, missaoId?: string) {
  const fontes = tipoAtividadeMap[tipoId]?.fontes ?? [];
  const ids = missoesTerritorio.filter((m) => m.ativo && fontes.includes(m.fonteProgresso)).map((m) => m.id);
  if (missaoId && !ids.includes(missaoId)) ids.unshift(missaoId);
  return ids;
}

function mapearAtividade(row: {
  id: string; conector_id: string; nucleo_id: string; tipo_id: string; missao_id: string | null;
  data: string; municipio: string; local: string; titulo: string; descricao: string; atores: string;
  resultados: string; observacoes: string; localizacao: string; evidencia_foto: string | null;
  evidencia_documento: string | null; evidencia_link: string | null; fonte_contribuicao: string | null;
  missoes_relacionadas: string[]; status: string; created_at: string;
}): AtividadeRegistrada {
  return {
    id: row.id,
    conectorId: row.conector_id,
    nucleoId: row.nucleo_id,
    tipoId: row.tipo_id,
    missaoId: row.missao_id ?? undefined,
    data: row.data,
    municipio: row.municipio,
    local: row.local,
    titulo: row.titulo,
    descricao: row.descricao,
    atores: row.atores,
    resultados: row.resultados,
    observacoes: row.observacoes,
    localizacao: row.localizacao,
    evidenciaFoto: row.evidencia_foto ?? undefined,
    evidenciaDocumento: row.evidencia_documento ?? undefined,
    evidenciaLink: row.evidencia_link ?? undefined,
    fonteContribuicao: (row.fonte_contribuicao as FonteProgressoTerritorio | null) ?? undefined,
    missoesRelacionadas: row.missoes_relacionadas,
    status: row.status as StatusAtividade,
    criadoEm: row.created_at,
  };
}

export function MeuNucleoProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<PerfilConector | null>(null);
  const [conectoresNucleo, setConectoresNucleo] = useState<Conector[]>([]);
  const [atividades, setAtividades] = useState<AtividadeRegistrada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const user = userData.user;
        if (userError || !user) throw new Error("Sua sessão não está disponível.");

        let perfilResult = await supabase.from("perfis").select("*").eq("user_id", user.id).maybeSingle();
        if (!perfilResult.data) {
          await vincularPerfilAutorizado();
          perfilResult = await supabase.from("perfis").select("*").eq("user_id", user.id).maybeSingle();
        }
        if (perfilResult.error || !perfilResult.data || !perfilResult.data.ativo) {
          throw new Error("Seu perfil não está autorizado para acessar a Jornada.");
        }

        const [roleResult, equipeResult, atividadesResult] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
          perfilResult.data.nucleo_id
            ? supabase.from("perfis").select("user_id,nome,email,nucleo_id,ativo,demonstrativo").eq("nucleo_id", perfilResult.data.nucleo_id).eq("ativo", true)
            : Promise.resolve({ data: [], error: null }),
          perfilResult.data.nucleo_id
            ? supabase.from("atividades_conectores").select("*").eq("nucleo_id", perfilResult.data.nucleo_id).order("created_at", { ascending: false })
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (roleResult.error || !roleResult.data) throw new Error("O papel deste perfil não foi encontrado.");
        if (equipeResult.error || atividadesResult.error) throw new Error("Não foi possível carregar os dados do Núcleo.");
        if (!ativo) return;

        setPerfil({
          userId: user.id,
          nome: perfilResult.data.nome,
          email: perfilResult.data.email,
          nucleoId: perfilResult.data.nucleo_id,
          perfil: roleResult.data.role,
          ativo: perfilResult.data.ativo,
          demonstrativo: perfilResult.data.demonstrativo,
        });
        setConectoresNucleo((equipeResult.data ?? []).map((membro) => ({
          id: membro.user_id,
          nome: membro.nome,
          papel: "Conector Territorial",
          iniciais: iniciais(membro.nome),
          foco: "Atuação territorial",
          email: membro.email,
          nucleoId: membro.nucleo_id ?? undefined,
          ativo: membro.ativo,
          demonstrativo: membro.demonstrativo,
        })));
        setAtividades((atividadesResult.data ?? []).map(mapearAtividade));
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : "Não foi possível carregar a Jornada.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, []);

  const registrarAtividade = useCallback<MeuNucleoState["registrarAtividade"]>(async (dados) => {
    if (!perfil?.nucleoId) throw new Error("Este perfil não possui um Núcleo vinculado.");
    const relacionadas = missoesDaAtividade(dados.tipoId, dados.missaoId);
    const missaoPrincipalId = dados.missaoId ?? relacionadas[0];
    const missaoPrincipal = missaoPrincipalId ? missaoTerritorialMap[missaoPrincipalId] : undefined;
    const status: StatusAtividade = missaoPrincipal?.exigeValidacao ?? true ? "em_validacao" : "aprovada";
    const { data, error } = await supabase.from("atividades_conectores").insert({
      conector_id: perfil.userId,
      nucleo_id: perfil.nucleoId,
      tipo_id: dados.tipoId,
      missao_id: dados.missaoId ?? null,
      data: dados.data,
      municipio: dados.municipio,
      local: dados.local,
      titulo: dados.titulo,
      descricao: dados.descricao,
      atores: dados.atores,
      resultados: dados.resultados,
      observacoes: dados.observacoes,
      localizacao: dados.localizacao,
      evidencia_foto: dados.evidenciaFoto ?? null,
      evidencia_documento: dados.evidenciaDocumento ?? null,
      evidencia_link: dados.evidenciaLink ?? null,
      fonte_contribuicao: missaoPrincipal?.fonteProgresso ?? null,
      missoes_relacionadas: relacionadas,
      status,
      demonstrativo: perfil.demonstrativo,
    }).select("*").single();
    if (error || !data) throw new Error("Não foi possível registrar a atividade.");
    const atividade = mapearAtividade(data);
    setAtividades((atual) => [atividade, ...atual]);
    return {
      atividade,
      missoesRelacionadas: relacionadas.map((id) => missaoTerritorialMap[id]).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, titulo: m.titulo, icone: m.icone })),
    };
  }, [perfil]);

  const value = useMemo<MeuNucleoState | null>(() => {
    if (!perfil?.nucleoId) return null;
    const registros: RegistroJornada[] = atividades.flatMap((a) => {
      const missaoId = a.missaoId ?? a.missoesRelacionadas[0];
      if (!missaoId || !a.fonteContribuicao) return [];
      return [{ id: `reg-${a.id}`, missaoId, fonte: a.fonteContribuicao, titulo: a.titulo, descricao: a.descricao, data: a.data, local: a.local, atores: a.atores, resultado: a.resultados, localizacao: a.localizacao, municipio: a.municipio || undefined, anexoNome: a.evidenciaFoto ?? a.evidenciaDocumento, statusValidacao: statusValidacaoDe(a.status), criadoEm: a.criadoEm }];
    });
    const missoes: MissaoTerritorialCalculada[] = missoesTerritorio.filter((m) => m.ativo).map((m) => {
      const daMissao = registros.filter((r) => r.missaoId === m.id);
      const aprovados = daMissao.filter((r) => r.statusValidacao === "aprovado").length;
      const emValidacao = daMissao.filter((r) => r.statusValidacao === "em_validacao").length;
      const emAjuste = daMissao.filter((r) => r.statusValidacao === "ajustes_solicitados").length;
      const progressoAtual = Math.min(aprovados, m.metaTotal);
      const percentual = m.metaTotal > 0 ? Math.min(100, Math.round((progressoAtual / m.metaTotal) * 100)) : 0;
      const status: MissaoTerritorialCalculada["status"] = progressoAtual >= m.metaTotal && emValidacao === 0 && emAjuste === 0 ? "concluida" : emAjuste > 0 ? "ajustes" : emValidacao > 0 ? "validacao" : progressoAtual > 0 ? "andamento" : "nao_iniciada";
      return { ...m, progressoAtual, percentualProgresso: percentual, restante: Math.max(0, m.metaTotal - progressoAtual), registrosEmValidacao: emValidacao, registrosEmAjuste: emAjuste, status };
    });
    const progressoPorDimensao = Object.fromEntries(ordemDimensoes.map((d) => {
      const feito = missoes.filter((m) => m.dimensao === d).reduce((s, m) => s + m.progressoAtual, 0);
      const meta = metaTotalDimensao(d);
      return [d, meta > 0 ? Math.round((feito / meta) * 100) : 0];
    })) as Record<DimensaoId, number>;
    const contarPorFonte = (fonte?: FonteProgressoTerritorio) => fonte ? registros.filter((r) => r.fonte === fonte && r.statusValidacao === "aprovado").length : 0;
    const metaGeral = missoes.reduce((s, m) => s + m.metaTotal, 0);
    const feitoGeral = missoes.reduce((s, m) => s + m.progressoAtual, 0);
    const individuais = atividades.filter((a) => a.conectorId === perfil.userId);
    return {
      perfil,
      participante: { nome: perfil.nome, papel: perfil.perfil === "COORDENACAO" ? "Coordenação" : "Conector Territorial", iniciais: iniciais(perfil.nome) },
      nucleoId: perfil.nucleoId,
      conectoresNucleo,
      atividades,
      registros,
      missoes,
      missoesPorDimensao: (d) => missoes.filter((m) => m.dimensao === d),
      missaoPorId: (id) => missoes.find((m) => m.id === id),
      progressoNucleo: metaGeral > 0 ? Math.round((feitoGeral / metaGeral) * 100) : 0,
      progressoPorDimensao,
      pontuacaoTotal: missoes.reduce((s, m) => s + (m.status === "concluida" ? m.pontuacao : 0), 0),
      missoesConcluidas: missoes.filter((m) => m.status === "concluida").length,
      missoesEmValidacao: missoes.filter((m) => m.status === "validacao").length,
      atividadesEmValidacao: atividades.filter((a) => a.status === "em_validacao").length,
      indicadoresTerritoriais: indicadoresNucleo.map((i) => ({ ...i, valor: contarPorFonte(i.fonte) })),
      indicadoresIndividuais: indicadoresIndividuais.map((i) => ({ ...i, valor: i.fonte ? individuais.filter((a) => a.fonteContribuicao === i.fonte && a.status === "aprovada").length : 0 })),
      registrarAtividade,
    };
  }, [atividades, conectoresNucleo, perfil, registrarAtividade]);

  if (carregando) return <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Carregando sua Jornada…</div>;
  if (erro || !value) return <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-surface p-6 text-center"><h2 className="font-display text-lg font-semibold">Acesso não disponível</h2><p className="mt-2 text-sm text-muted-foreground">{erro ?? "Este perfil não possui um Núcleo Territorial vinculado."}</p></div>;
  return <MeuNucleoContext.Provider value={value}>{children}</MeuNucleoContext.Provider>;
}