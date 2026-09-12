import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Progresso } from "@/components/ui/Progresso";
import { filtrosRanking, ordenarRanking, valorRanking } from "@/data/ranking";
import { nucleoAtualId } from "@/data/nucleos";
import type { RankingFiltro } from "@/types";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Movimento dos Territórios — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Ranking dos 14 núcleos regionais capixabas por pontos de impacto, evolução, colaboração, conexões e descobertas.",
      },
      { property: "og:title", content: "Movimento dos Territórios" },
      {
        property: "og:description",
        content: "Como os núcleos regionais do ES estão evoluindo na jornada da inovação.",
      },
    ],
  }),
  component: Ranking,
});

const medalhas = ["🥇", "🥈", "🥉"];

function Ranking() {
  const [filtro, setFiltro] = useState<RankingFiltro>("pontos");
  const lista = ordenarRanking(filtro);
  const sufixo = filtrosRanking.find((f) => f.id === filtro)?.sufixo ?? "";
  const maior = valorRanking(lista[0]!, filtro);
  const posicaoSerra = lista.findIndex((i) => i.nucleoId === nucleoAtualId) + 1;

  return (
    <AppShell titulo="Movimento dos Territórios" subtitulo={`Núcleo Serra em ${posicaoSerra}º lugar`}>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filtrosRanking.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`tap shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium ${
              filtro === f.id
                ? "panel-glow border-transparent bg-primary/40 text-foreground"
                : "border-border/70 bg-surface/60 text-muted-foreground"
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <section className="mt-4 grid grid-cols-3 gap-2">
        {lista.slice(0, 3).map((item, i) => (
          <div
            key={item.nucleoId}
            className={`panel rounded-2xl p-3 text-center ${i === 0 ? "panel-glow" : ""}`}
          >
            <p className="text-xl leading-none">{medalhas[i]}</p>
            <p className="mt-2 font-display text-xs font-semibold leading-tight">{item.nome}</p>
            <p className="mt-1 text-[0.7rem] font-semibold text-glow">
              {valorRanking(item, filtro).toLocaleString("pt-BR")}
            </p>
            <p className="text-[0.6rem] text-muted-foreground">{sufixo}</p>
          </div>
        ))}
      </section>

      <section className="panel mt-4 divide-y divide-border/60 rounded-3xl">
        {lista.map((item, i) => {
          const meu = item.nucleoId === nucleoAtualId;
          const v = valorRanking(item, filtro);
          return (
            <div
              key={item.nucleoId}
              className={`px-4 py-3 ${meu ? "bg-primary/15" : ""} ${
                i === 0 ? "rounded-t-3xl" : ""
              }`}
            >
              <div className="grid grid-cols-[1.6rem_minmax(0,1fr)_auto] items-center gap-3">
                <span className="font-display text-sm font-semibold text-muted-foreground">
                  {i + 1}º
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.nome}
                    {meu ? (
                      <span className="ml-2 rounded-full bg-glow/15 px-2 py-0.5 text-[0.6rem] font-semibold text-glow">
                        meu núcleo
                      </span>
                    ) : null}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {v.toLocaleString("pt-BR")}
                </span>
              </div>
              <Progresso
                valor={(v / maior) * 100}
                cor={meu ? "var(--glow)" : "var(--lilac)"}
                className="mt-2 h-1"
              />
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
