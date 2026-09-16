import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RelatoriosJornada } from "@/components/jornada/RelatoriosJornada";
import { RegistroAtividadeProvider } from "@/components/jornada/RegistroAtividade";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Meus Relatórios — Caminhos da Inovação" },
      {
        name: "description",
        content: "Registre e acompanhe as entregas formais do Conector na Jornada da Inovação Capixaba.",
      },
      { property: "og:title", content: "Meus Relatórios — Caminhos da Inovação" },
      {
        property: "og:description",
        content: "Acompanhamento das entregas formais do Conector e seus respectivos status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  return (
    <MeuNucleoProvider>
      <RegistroAtividadeProvider>
        <AppShell
          titulo="Relatórios"
          subtitulo="Entregas formais do Conector"
          mostrarPontos={false}
          ampla
          jornadaResponsiva
        >
          <RelatoriosJornada />
        </AppShell>
      </RegistroAtividadeProvider>
    </MeuNucleoProvider>
  );
}