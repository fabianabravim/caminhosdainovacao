import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapaMunicipalES } from "@/components/MapaMunicipalES";

export const Route = createFileRoute("/mapa")({
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
    <AppShell titulo="Territórios da Inovação" mostrarPontos={false} ampla>
      <header className="max-w-3xl pt-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-lilac">Espírito Santo em detalhe</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore o Espírito Santo e descubra como municípios, atores e iniciativas formam os Núcleos Territoriais do Caminhos da Inovação.
        </p>
      </header>
      <MapaMunicipalES />
    </AppShell>
  );
}