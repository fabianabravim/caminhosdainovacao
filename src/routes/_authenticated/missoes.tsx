import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ModalRegistroMissao } from "@/components/missoes/ModalRegistroMissao";
import { Button } from "@/components/ui/button";
import { Chip, Progresso } from "@/components/ui/Progresso";
import { useJornada } from "@/context/JornadaContext";
import { dimensaoMap, dimensoes } from "@/data/dimensoes";
import { desafioDoMes, missoesColaborativas } from "@/data/missoes";
import { nucleoMap } from "@/data/nucleos";
import type { DimensaoId, StatusProgressoMissao } from "@/types";

const statusLabel: Record<StatusProgressoMissao, string> = {
  nao_iniciada: "Não iniciada",
  andamento: "Em andamento",
  em_validacao: "Em validação",
  ajustes_solicitados: "Ajustes solicitados",
  concluida: "Concluída",
};

const statusStyle: Record<StatusProgressoMissao, string> = {
  nao_iniciada: "border-border/70 bg-surface/60 text-muted-foreground",
  andamento: "border-lilac/50 bg-primary/15 text-lilac",
  em_validacao: "border-glow/50 bg-glow/10 text-glow",
  ajustes_solicitados: "border-destructive/50 bg-destructive/10 text-destructive",
  concluida: "border-emerald-400/40 bg-emerald-50 text-emerald-700",
};

export const Route = createFileRoute("/missoes")({
  head: () => ({
    meta: [
      { title: "Missões do Território — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Missões territoriais organizadas nos caminhos Explorar, Conectar, Descobrir e Transformar, com pontos de impacto e desafio do mês.",
      },
      { property: "og:title", content: "Missões do Território Capixaba" },
      {
        property: "og:description",
        content: "Cumpra missões nos 4 caminhos da jornada e some pontos de impacto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Missoes,
});

function useContagem(fim: string) {
  const [restante, setRestante] = useState("");
  useEffect(() => {
    const alvo = new Date(fim).getTime();
    const tick = () => {
      const dif = Math.max(0, alvo - Date.now());
      const d = Math.floor(dif / 86400000);
      const h = Math.floor((dif % 86400000) / 3600000);
      const m = Math.floor((dif % 3600000) / 60000);
      const s = Math.floor((dif % 60000) / 1000);
      setRestante(`${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [fim]);
  return restante;
}

function Missoes() {
  const { missoes, registrarAtividade, criarConexao, conexoes } = useJornada();
  const [filtro, setFiltro] = useState<DimensaoId | "todas">("todas");
  const [missaoAberta, setMissaoAberta] = useState<string | null>(null);
  const contagem = useContagem(desafioDoMes.fim);

  const lista = filtro === "todas" ? missoes : missoes.filter((m) => m.dimensao === filtro);

  return (
    <AppShell titulo="Missões do Território" subtitulo="Os 4 caminhos da jornada capixaba">
      <section className="panel relative overflow-hidden rounded-3xl border-primary/20 p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-glow">Desafio do mês</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-gradient">
          {desafioDoMes.titulo}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {desafioDoMes.descricao}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-xl border border-glow/40 bg-glow/10 px-3 py-2 font-display text-sm font-semibold tabular-nums text-glow">
            {contagem}
          </span>
          <Chip cor="var(--lilac)">+{desafioDoMes.pontos} pontos</Chip>
          <Chip cor="var(--dim-conectar)">{desafioDoMes.participantes} núcleos participando</Chip>
        </div>
      </section>

      <div className="mt-5 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[{ id: "todas", nome: "Todas", icone: "✦" }, ...dimensoes].map((d) => {
          const ativo = filtro === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setFiltro(d.id as DimensaoId | "todas")}
              className={`tap shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium ${
                ativo
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/70 bg-surface/60 text-muted-foreground"
              }`}
            >
              {d.icone} {d.nome}
            </button>
          );
        })}
      </div>

      <section className="mt-4 space-y-3">
        {lista.map((m) => {
          const d = dimensaoMap[m.dimensao];
          const completa = m.status === "concluida";
          return (
            <article key={m.id} className={`panel rounded-2xl p-4 ${completa ? "panel-glow" : ""}`}>
              <div className="flex items-start gap-2">
                <Chip cor={d.colorVar}>
                  {d.icone} {d.nome}
                </Chip>
                <span className="ml-auto shrink-0 text-xs font-semibold text-glow">
                  +{m.pontos} pts
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold">{m.titulo}</h3>
              <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                {m.descricao}
              </p>
              <div className="mt-3 flex items-center gap-3" aria-label={`Progresso: ${m.progresso_atual} de ${m.meta_total}, ${m.percentual_progresso}%`}>
                <Progresso valor={m.percentual_progresso} cor={d.colorVar} />
                <span className="shrink-0 text-[0.7rem] tabular-nums text-muted-foreground">
                  {m.progresso_atual}/{m.meta_total} · {m.percentual_progresso}%
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className={`rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold ${statusStyle[m.status]}`}>
                  {statusLabel[m.status]}
                </span>
                {m.registrosEmValidacao > 0 ? (
                  <span className="text-[0.66rem] text-muted-foreground">
                    {m.registrosEmValidacao} {m.registrosEmValidacao === 1 ? "registro pendente" : "registros pendentes"}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 text-[0.7rem] text-muted-foreground">
                  🎁 {m.recompensa}
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setMissaoAberta(m.id)}
                  disabled={completa}
                  className="tap h-auto shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold"
                >
                  {completa ? "Concluída ✓" : m.cta}
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold">Missões colaborativas</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Cada colaboração acende uma conexão luminosa entre territórios no Mapa Vivo.
        </p>
        <div className="mt-3 space-y-3">
          {missoesColaborativas.map((mc) => {
            const d = dimensaoMap[mc.dimensao];
            const [a, b] = mc.nucleos;
            const jaConectado = conexoes.some(
              (c) => (c.de === a && c.para === b) || (c.de === b && c.para === a),
            );
            return (
              <article key={mc.id} className="panel rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Chip cor={d.colorVar}>
                    {d.icone} {d.nome}
                  </Chip>
                  <span className="ml-auto text-xs font-semibold text-glow">+{mc.pontos} pts</span>
                </div>
                <h3 className="mt-2 text-base font-semibold">{mc.titulo}</h3>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {mc.descricao}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {mc.nucleos.map((id) => (
                    <span
                      key={id}
                      className="rounded-full border border-glow/40 bg-glow/10 px-2.5 py-1 text-[0.68rem] text-glow"
                    >
                      {nucleoMap[id]?.nome ?? id}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progresso valor={mc.progresso} cor={d.colorVar} />
                  <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                    {mc.progresso}%
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => a && b && criarConexao(a, b, mc.titulo)}
                  disabled={jaConectado}
                  className="tap mt-3 h-auto w-full rounded-xl border-glow/40 bg-glow/10 px-3 py-2 text-xs font-semibold text-glow"
                >
                  {jaConectado ? "Conexão já acesa no mapa" : "Acender conexão no Mapa Vivo"}
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      {missaoAberta ? (() => {
        const missao = missoes.find((item) => item.id === missaoAberta);
        return missao ? (
          <ModalRegistroMissao
            missao={missao}
            onClose={() => setMissaoAberta(null)}
            onEnviar={(dados) => {
              registrarAtividade(missao.id, dados);
              setMissaoAberta(null);
            }}
          />
        ) : null;
      })() : null}
    </AppShell>
  );
}
