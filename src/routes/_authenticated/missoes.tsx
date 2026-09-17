import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { AcaoFlutuanteAtividade, RegistroAtividadeProvider } from "@/components/jornada/RegistroAtividade";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";

export const Route = createFileRoute("/_authenticated/missoes")({
  head: () => ({ meta: [
    { title: "Missões do Território — Caminhos da Inovação" },
    { name: "description", content: "Acompanhe as missões territoriais e o progresso gerado pelas atividades validadas do seu Núcleo." },
    { property: "og:title", content: "Missões do Território — Caminhos da Inovação" },
    { property: "og:description", content: "O que o Núcleo precisa alcançar nos caminhos Explorar, Conectar, Descobrir e Transformar." },
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
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-energy">O território em movimento</p>
                <h2 className="mt-2 font-brand-condensed text-4xl font-semibold sm:text-5xl">Missões que orientam a Jornada</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/68">Missão é o que precisa ser alcançado. O progresso acontece somente quando atividades reais e suas evidências são validadas.</p>
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