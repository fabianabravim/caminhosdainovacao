import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Chip } from "@/components/ui/Progresso";
import { descobertas } from "@/data/descobertas";
import { dimensaoMap } from "@/data/dimensoes";

export const Route = createFileRoute("/descobertas")({
  head: () => ({
    meta: [
      { title: "Descobertas do Território — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Histórias de inovação reveladas nas escutas dos núcleos regionais capixabas: Caparaó, Serra, Litoral Sul e Rio Doce.",
      },
      { property: "og:title", content: "Descobertas do Território Capixaba" },
      {
        property: "og:description",
        content: "Inovações invisíveis reveladas pelas escutas dos núcleos regionais do ES.",
      },
    ],
  }),
  component: Descobertas,
});

function Descobertas() {
  const [aberta, setAberta] = useState<string | null>(descobertas[0]?.id ?? null);

  return (
    <AppShell titulo="Descobertas" subtitulo="Histórias e inovações reveladas nas escutas">
      <div className="space-y-4">
        {descobertas.map((d, i) => {
          const dim = dimensaoMap[d.dimensao];
          const abertaAgora = aberta === d.id;
          return (
            <article key={d.id} className="panel overflow-hidden rounded-3xl">
              <img
                src={d.imagem}
                alt={`${d.titulo} — ${d.nucleo}`}
                width={1200}
                height={800}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-44 w-full object-cover sm:h-56"
              />
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip cor={dim.colorVar}>
                    {dim.icone} {dim.nome}
                  </Chip>
                  <Chip cor="var(--lilac)">Núcleo {d.nucleo}</Chip>
                </div>
                <h2 className="mt-2.5 font-display text-xl font-semibold leading-tight">
                  {d.titulo}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.resumo}</p>
                {abertaAgora ? (
                  <p className="mt-3 border-l-2 border-glow/50 pl-3 text-sm leading-relaxed">
                    {d.historia}
                  </p>
                ) : null}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-[0.68rem] text-muted-foreground">
                    {d.autor} · {d.data}
                  </p>
                  <button
                    onClick={() => setAberta(abertaAgora ? null : d.id)}
                    className="tap shrink-0 rounded-xl border border-border/70 bg-surface/60 px-3 py-1.5 text-xs font-semibold"
                  >
                    {abertaAgora ? "Recolher" : "Ler a história"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
