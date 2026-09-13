import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { DimensoesGrid } from "@/components/Dimensoes";
import { Metrica, Progresso } from "@/components/ui/Progresso";
import { useJornada } from "@/context/JornadaContext";
import { nucleoAtualId, nucleoMap } from "@/data/nucleos";
import { ES_VIEW_HEIGHT, ES_VIEW_WIDTH } from "@/lib/geoES";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa Vivo da Inovação — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Mapa interativo do Espírito Santo com os 14 núcleos regionais e as conexões luminosas da rede capixaba de inovação.",
      },
      { property: "og:title", content: "Mapa Vivo da Inovação Capixaba" },
      {
        property: "og:description",
        content: "Explore os 14 núcleos regionais do ES e as conexões vivas entre territórios.",
      },
    ],
  }),
  component: Mapa,
});

const atalhos = [
  { to: "/descobertas", label: "Descobertas", icone: "💡" },
  { to: "/ranking", label: "Ranking", icone: "🏆" },
  { to: "/inteligencia", label: "Inteligência", icone: "📊" },
  { to: "/conquistas", label: "Conquistas", icone: "🎖️" },
] as const;

function Mapa() {
  const { conexoes, nivelAtual, proximoNivel } = useJornada();
  const [selecionado, setSelecionado] = useState<string>(nucleoAtualId);
  const nucleo = nucleoMap[selecionado] ?? nucleoMap[nucleoAtualId]!;
  const ehMeuNucleo = nucleo.id === nucleoAtualId;

  return (
    <AppShell titulo="Mapa Vivo da Inovação" subtitulo="14 núcleos regionais em rede viva">
      <section className="panel relative overflow-hidden rounded-3xl">
        <div
          className="mx-auto w-full max-w-md"
          style={{ aspectRatio: `${ES_VIEW_WIDTH} / ${ES_VIEW_HEIGHT}` }}
        >
          <MapaVivo
            conexoes={conexoes}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
            destaque={nucleoAtualId}
          />
        </div>
        <p className="absolute bottom-3 left-4 text-[0.65rem] text-muted-foreground">
          Toque em um núcleo para ver o painel do território
        </p>
      </section>

      <section className="panel panel-glow mt-4 rounded-3xl p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
              {ehMeuNucleo ? "Meu núcleo" : "Núcleo regional"} · {nucleo.regiao}
            </p>
            <h2 className="font-display text-2xl font-semibold">{nucleo.nome}</h2>
            <p className="text-xs text-muted-foreground">{nucleo.destaque}</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/25 px-3 py-1 text-xs font-semibold text-lilac">
            {nucleo.progresso}% concluído
          </span>
        </div>

        <Progresso valor={nucleo.progresso} className="mt-3" />

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metrica valor={nucleo.atores} label="Atores" />
          <Metrica valor={nucleo.escutas} label="Escutas" />
          <Metrica valor={nucleo.conexoes} label="Conexões" />
          <Metrica valor={nucleo.inovacoes} label="Inovações" />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-surface/60 px-3.5 py-3">
          <div>
            <p className="text-[0.62rem] uppercase tracking-wide text-muted-foreground">Nível</p>
            <p className="font-display text-sm font-semibold">
              {ehMeuNucleo ? nivelAtual.nome : nucleo.nivel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.62rem] uppercase tracking-wide text-muted-foreground">Próximo</p>
            <p className="font-display text-sm font-semibold text-glow">
              {ehMeuNucleo ? (proximoNivel?.nome ?? "Nível máximo") : "Catalisador"}
            </p>
          </div>
        </div>

        <Link
          to={ehMeuNucleo ? "/jornada" : "/rede"}
          className="tap panel-glow mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground"
        >
          {ehMeuNucleo ? "Continuar Minha Jornada" : `Conectar com ${nucleo.nome}`}
        </Link>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-display text-base font-semibold">Dimensões da jornada</h2>
        <DimensoesGrid />
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {atalhos.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="panel tap flex items-center gap-2 rounded-2xl px-3.5 py-3 text-sm font-medium"
          >
            <span>{a.icone}</span>
            {a.label}
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
