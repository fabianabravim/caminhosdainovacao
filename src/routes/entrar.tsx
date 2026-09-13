import { createFileRoute, Link } from "@tanstack/react-router";
import { MapaVivo } from "@/components/MapaVivo";
import { conexoes } from "@/data/nucleos";
import { totaisEstado } from "@/data/ranking";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Acesso institucional dos conectores territoriais à plataforma Caminhos da Inovação do IJSN e do Governo do Espírito Santo.",
      },
      { property: "og:title", content: "Entrar na Jornada da Inovação Capixaba" },
      {
        property: "og:description",
        content: "Acesso dos conectores territoriais dos 14 núcleos regionais do ES.",
      },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <div className="absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2">
          <MapaVivo conexoes={conexoes} labels={false} interativo={false} particulas />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-lilac/80">
            IJSN · Governo do Espírito Santo
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05]">
            <span className="text-gradient">Caminhos</span>
            <br />
            da Inovação
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A jornada da inovação capixaba: inteligência territorial construída com escuta, conexões
            e transformação nos 14 núcleos regionais.
          </p>
        </div>

        <div className="panel panel-glow rounded-3xl p-5">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              [totaisEstado.nucleos, "núcleos"],
              [totaisEstado.escutas, "escutas"],
              [totaisEstado.inovacoes, "inovações"],
            ].map(([v, l]) => (
              <div key={l as string}>
                <p className="font-display text-lg font-semibold">{v}</p>
                <p className="text-[0.62rem] uppercase tracking-wide text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/60 p-3.5">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Vínculo territorial
            </p>
            <p className="mt-1 font-display text-lg font-semibold">Seu Núcleo Territorial</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Será identificado automaticamente após o acesso do Conector.
            </p>
          </div>

          <Link
            to="/jornada"
            className="tap panel-glow mt-5 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground"
          >
            Entrar na jornada
          </Link>
          <Link
            to="/jornada"
            className="tap mt-2 flex w-full items-center justify-center rounded-2xl border border-border/70 bg-surface/60 px-5 py-3 text-xs font-semibold text-lilac"
          >
            Primeiro acesso
          </Link>
          <Link
            to="/"
            className="tap mt-2 flex w-full items-center justify-center px-5 py-2 text-xs font-semibold text-muted-foreground"
          >
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
