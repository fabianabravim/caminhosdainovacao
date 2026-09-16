import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapaMunicipalES } from "@/components/MapaMunicipalES";

export const Route = createFileRoute("/_authenticated/mapa")({
  head: () => ({
    meta: [
      { title: "Territórios da Inovação — Espírito Santo" },
      {
        name: "description",
        content: "Explore os 78 municípios do Espírito Santo e acompanhe a construção dos Núcleos Territoriais do Caminhos da Inovação.",
      },
      { property: "og:title", content: "Territórios da Inovação — Caminhos da Inovação" },
      {
        property: "og:description",
        content: "Um mapa municipal interativo para descobrir como municípios, atores e iniciativas formam os Núcleos Territoriais capixabas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Territorios,
});

function Territorios() {
  return (
    <AppShell titulo="TERRITÓRIOS DA INOVAÇÃO" mostrarPontos={false} ampla>
      <header className="relative overflow-hidden rounded-lg bg-brand-dark px-5 py-8 text-primary-foreground sm:px-8">
        <div className="topo-lines absolute inset-0 opacity-35" />
        <div className="relative max-w-3xl"><p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-energy">Espírito Santo em detalhe</p>
        <h2 className="mt-3 font-brand-condensed text-4xl font-semibold sm:text-5xl">Territórios da Inovação</h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
          Explore o Espírito Santo e descubra como municípios, atores e iniciativas formam os Núcleos Territoriais do Caminhos da Inovação.
        </p>
        </div>
      </header>
      <MapaMunicipalES />
    </AppShell>
  );
}