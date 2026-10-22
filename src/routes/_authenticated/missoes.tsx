import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { AcaoFlutuanteAtividade, RegistroAtividadeProvider } from "@/components/jornada/RegistroAtividade";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";

export const Route = createFileRoute("/_authenticated/missoes")({
  head: () => ({ meta: [
    { title: "Missões do Território — ROTA da Inovação" },
    { name: "description", content: "Acompanhe as 12 missões nos movimentos Reconhecer, Ouvir, Traduzir e Articular e o progresso validado do seu Núcleo." },
    { property: "og:title", content: "Missões do Território — ROTA da Inovação" },
    { property: "og:description", content: "Metas territoriais nos quatro movimentos oficiais: Reconhecer, Ouvir, Traduzir e Articular." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: MissoesPage,
});

function MissoesPage() {
  return (
    <MeuNucleoProvider>
      <RegistroAtividadeProvider>
        <AppShell titulo="Missões do Território" subtitulo="O que precisamos alcançar" mostrarPontos={false} ampla jornadaResponsiva>
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-lg bg-brand-dark px-5 py-8 text-primary-foreground sm:px-8">
              <div className="topo-lines absolute inset-0 opacity-35" />
              <div className="relative max-w-3xl">
                <span className="mb-5 inline-flex rounded-full border border-energy/35 bg-energy/15 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-energy">Metas e pontuação demonstrativas</span>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-energy">O território em movimento</p>
                <h2 className="mt-2 font-brand-condensed text-4xl font-semibold sm:text-5xl">Missões que orientam a Jornada</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/68">Reconhecer, Ouvir, Traduzir e Articular orientam as missões do território. O progresso acontece somente quando atividades reais e suas evidências são validadas.</p>
              </div>
            </section>
            <MissoesTerritorio />
          </div>
        </AppShell>
        <AcaoFlutuanteAtividade />
      </RegistroAtividadeProvider>
    </MeuNucleoProvider>
  );
}