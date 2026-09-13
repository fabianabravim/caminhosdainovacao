import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Chip, Metrica } from "@/components/ui/Progresso";
import { DimensoesBarras } from "@/components/Dimensoes";
import { insights, totaisEstado } from "@/data/ranking";
import { dimensaoMap } from "@/data/dimensoes";

export const Route = createFileRoute("/inteligencia")({
  head: () => ({
    meta: [
      { title: "Inteligência do Território — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Insights e tendências territoriais gerados a partir das escutas, conexões e missões dos 14 núcleos regionais capixabas.",
      },
      { property: "og:title", content: "Inteligência do Território Capixaba" },
      {
        property: "og:description",
        content: "Tendências e leituras territoriais da jornada da inovação capixaba.",
      },
    ],
  }),
  component: Inteligencia,
});

const tendencia = {
  alta: { rotulo: "Em alta", icone: "▲", cor: "var(--dim-explorar)" },
  estavel: { rotulo: "Estável", icone: "▬", cor: "var(--lilac)" },
  atencao: { rotulo: "Atenção", icone: "▼", cor: "var(--dim-transformar)" },
} as const;

function Inteligencia() {
  return (
    <AppShell titulo="Inteligência do Território" subtitulo="Leituras simuladas a partir das escutas">
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metrica valor={totaisEstado.nucleos} label="Núcleos" />
        <Metrica valor={totaisEstado.atores} label="Atores" />
        <Metrica valor={totaisEstado.escutas} label="Escutas" />
        <Metrica valor={totaisEstado.inovacoes} label="Inovações" />
      </section>

      <section className="mt-4">
        <DimensoesBarras />
      </section>

      <section className="mt-5 space-y-3">
        {insights.map((i) => {
          const d = dimensaoMap[i.dimensao];
          const t = tendencia[i.tendencia];
          return (
            <article key={i.id} className="panel rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Chip cor={d.colorVar}>
                  {d.icone} {d.nome}
                </Chip>
                <Chip cor={t.cor}>
                  {t.icone} {t.rotulo}
                </Chip>
                <span className="ml-auto text-[0.7rem] font-semibold text-glow">{i.variacao}</span>
              </div>
              <h2 className="mt-2.5 font-display text-base font-semibold leading-snug">
                {i.titulo}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{i.texto}</p>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
