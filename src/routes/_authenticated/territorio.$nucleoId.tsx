import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PerfilTerritorial } from "@/components/territorio/PerfilTerritorial";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";

export const Route = createFileRoute("/_authenticated/territorio/$nucleoId")({
  head: () => ({
    meta: [
      { title: "Perfil Territorial — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Conheça o território do Núcleo: vocações, potencialidades, desafios e o que os Conectores estão descobrindo em campo.",
      },
      { property: "og:title", content: "Perfil Territorial — Caminhos da Inovação" },
      {
        property: "og:description",
        content: "Inteligência territorial capixaba: conhecimento de referência e descobertas do trabalho de campo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PerfilTerritorialPage,
});

function PerfilTerritorialPage() {
  const { nucleoId } = Route.useParams();
  return (
    <MeuNucleoProvider>
      <AppShell titulo="PERFIL TERRITORIAL" mostrarPontos={false} ampla jornadaResponsiva>
        <PerfilTerritorial nucleoId={nucleoId} />
      </AppShell>
    </MeuNucleoProvider>
  );
}
