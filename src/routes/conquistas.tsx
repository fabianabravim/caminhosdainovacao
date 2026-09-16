import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Chip, Progresso } from "@/components/ui/Progresso";
import { badges } from "@/data/jornada";
import { dimensaoMap } from "@/data/dimensoes";
import type { Badge } from "@/types";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas & Badges — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Badges conquistadas, em progresso e bloqueadas na jornada de inteligência territorial do Núcleo Serra.",
      },
      { property: "og:title", content: "Conquistas & Badges do território" },
      {
        property: "og:description",
        content: "Selos e conquistas da jornada da inovação capixaba.",
      },
    ],
  }),
  component: Conquistas,
});

const grupos: { estado: Badge["estado"]; titulo: string }[] = [
  { estado: "conquistada", titulo: "Conquistadas" },
  { estado: "progresso", titulo: "Em progresso" },
  { estado: "bloqueada", titulo: "Bloqueadas" },
];

function Conquistas() {
  return (
    <AppShell titulo="Conquistas & Badges" subtitulo="Reconhecimentos da jornada territorial">
      {grupos.map((g) => {
        const lista = badges.filter((b) => b.estado === g.estado);
        return (
          <section key={g.estado} className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-base font-semibold">{g.titulo}</h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.66rem] text-muted-foreground">
                {lista.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lista.map((b) => {
                const d = dimensaoMap[b.dimensao];
                const bloqueada = b.estado === "bloqueada";
                return (
                  <article
                    key={b.id}
                    className={`panel rounded-2xl p-4 ${
                      b.estado === "conquistada" ? "panel-glow" : ""
                    } ${bloqueada ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg ${
                          bloqueada ? "bg-secondary grayscale" : "border border-primary/20 bg-primary/10 text-primary"
                        }`}
                      >
                        {bloqueada ? "🔒" : b.icone}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{b.nome}</p>
                        <Chip cor={d.colorVar} className="mt-1">
                          {d.icone} {d.nome}
                        </Chip>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[0.72rem] leading-relaxed text-muted-foreground">
                      {b.descricao}
                    </p>
                    {b.estado === "progresso" && b.progresso !== undefined ? (
                      <div className="mt-3 flex items-center gap-3">
                        <Progresso valor={b.progresso} cor={d.colorVar} />
                        <span className="shrink-0 text-[0.7rem] text-muted-foreground">
                          {b.progresso}%
                        </span>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}
