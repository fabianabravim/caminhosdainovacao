import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RedeCapixaba } from "@/components/RedeCapixaba";
import { Metrica } from "@/components/ui/Progresso";
import { useJornada } from "@/context/JornadaContext";
import { nucleoAtualId, nucleoMap } from "@/data/nucleos";
import { totaisEstado } from "@/data/ranking";

export const Route = createFileRoute("/rede")({
  head: () => ({
    meta: [
      { title: "Rede Capixaba de Inovação — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Visualização em rede dos 14 núcleos regionais do Espírito Santo e das conexões territoriais ativas da inovação capixaba.",
      },
      { property: "og:title", content: "Rede Capixaba de Inovação" },
      {
        property: "og:description",
        content: "Nós e conexões entre os territórios capixabas em uma malha viva de inovação.",
      },
    ],
  }),
  component: Rede,
});

function Rede() {
  const { conexoes } = useJornada();
  const [selecionado, setSelecionado] = useState<string>(nucleoAtualId);
  const nucleo = nucleoMap[selecionado] ?? nucleoMap[nucleoAtualId]!;
  const vizinhos = conexoes
    .filter((c) => c.de === nucleo.id || c.para === nucleo.id)
    .map((c) => ({
      id: c.de === nucleo.id ? c.para : c.de,
      colaborativa: !!c.colaborativa,
      titulo: c.titulo,
    }));

  return (
    <AppShell titulo="Rede Capixaba de Inovação" subtitulo="Nós, pontes e conexões territoriais">
      <section className="panel rounded-3xl p-2">
        <div className="aspect-square w-full">
          <RedeCapixaba
            conexoes={conexoes}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
            destaque={nucleoAtualId}
          />
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metrica valor={totaisEstado.nucleos} label="Núcleos" />
        <Metrica valor={conexoes.length} label="Conexões" />
        <Metrica valor={totaisEstado.atores} label="Atores" />
        <Metrica valor={totaisEstado.escutas} label="Escutas" />
      </section>

      <section className="panel panel-glow mt-4 rounded-3xl p-4">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Nó selecionado</p>
        <h2 className="font-display text-xl font-semibold">{nucleo.nome}</h2>
        <p className="text-xs text-muted-foreground">{nucleo.destaque}</p>
        <p className="mt-4 text-xs font-semibold text-muted-foreground">
          {vizinhos.length} conexões ativas
        </p>
        <ul className="mt-2 space-y-2">
          {vizinhos.map((v) => (
            <li
              key={`${v.id}-${v.titulo ?? ""}`}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-3 py-2"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  v.colaborativa ? "bg-glow" : "bg-lilac/70"
                }`}
              />
              <span className="min-w-0 truncate text-sm">{nucleoMap[v.id]?.nome ?? v.id}</span>
              {v.colaborativa ? (
                <span className="ml-auto shrink-0 rounded-full bg-glow/15 px-2 py-0.5 text-[0.62rem] font-semibold text-glow">
                  colaborativa
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
