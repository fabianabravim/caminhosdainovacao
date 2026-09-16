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
          <div className="space-y-5">
            <section className="relative overflow-hidden rounded-lg bg-brand-dark px-5 py-8 text-primary-foreground sm:px-8">
              <div className="topo-lines absolute inset-0 opacity-35" />
              <div className="relative max-w-2xl">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-energy">Acompanhamento de entregas</p>
                <h2 className="mt-2 font-brand-condensed text-4xl font-semibold">Relatórios do Conector</h2>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/68">Registre e acompanhe as entregas formais enviadas para análise da Coordenação.</p>
              </div>
            </section>
            <RelatoriosJornada />
          </div>
        </AppShell>
      </RegistroAtividadeProvider>
    </MeuNucleoProvider>
  );
}