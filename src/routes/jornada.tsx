import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { JornadaDimensoes } from "@/components/jornada/JornadaDimensoes";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { ProgressoNucleo } from "@/components/jornada/ProgressoNucleo";
import { RankingNucleos } from "@/components/jornada/RankingNucleos";
import { MeuNucleoProvider, useMeuNucleo } from "@/context/MeuNucleoContext";
import { nucleoMap } from "@/data/nucleos";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Minha Jornada — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Área do Conector: missões do território, progresso do Núcleo e ranking dos 14 Núcleos Territoriais do Espírito Santo.",
      },
      { property: "og:title", content: "Minha Jornada — Caminhos da Inovação" },
      {
        property: "og:description",
        content: "Cada missão realizada contribui para o avanço do seu Núcleo Territorial.",
      },
    ],
  }),
  component: JornadaPage,
});

function JornadaPage() {
  return (
    <MeuNucleoProvider>
      <AppShell
        titulo="Jornada da Inovação Capixaba"
        subtitulo="Meu Núcleo"
        mostrarPontos={false}
        ampla
        jornadaResponsiva
      >
        <JornadaConteudo />
      </AppShell>
    </MeuNucleoProvider>
  );
}

function JornadaConteudo() {
  const { participante, nucleoId, conectoresNucleo } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId]!;

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* Identificação do participante */}
      <section className="anim-rise flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Olá, {participante.nome.split(" ")[0]}
          </h2>
          <p className="mt-0.5 break-words text-sm text-muted-foreground">
            Você faz parte do{" "}
            <span className="font-semibold uppercase tracking-wide text-glow">
              Núcleo {nucleo.nome}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="tap rounded-full border border-border/70 bg-surface/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            to="/entrar"
            aria-label="Sair"
            className="tap rounded-full border border-border/70 bg-surface/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Meu Núcleo */}
      <div className="anim-rise" style={{ animationDelay: "60ms" }}>
        <div className="panel panel-glow overflow-hidden rounded-3xl p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Meu Núcleo</p>
          <h3 className="mt-1 font-display text-lg font-bold">Núcleo {nucleo.nome}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            “Cada descoberta ajuda a revelar o ecossistema de inovação do seu território.”
          </p>

          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
            Conectores do Núcleo
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {conectoresNucleo.map((c) => (
              <div key={c.nome} className="min-w-0 rounded-2xl border border-border/70 bg-surface/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="panel-glow grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/40 font-display text-xs font-bold text-glow">
                    {c.iniciais}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold">{c.nome}</p>
                    <p className="break-words text-[0.68rem] text-muted-foreground">{c.papel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa do território */}
      <div className="anim-rise" style={{ animationDelay: "120ms" }}>
        <div className="panel overflow-hidden rounded-3xl">
          <div className="border-b border-border/60 px-5 py-3.5">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
              Mapa do território
            </p>
            <p className="mt-1 text-[0.72rem] text-muted-foreground">
              Seu núcleo em destaque. A estrutura está preparada para receber atores, iniciativas,
              ambientes de inovação, oportunidades e conexões reais.
            </p>
          </div>
          <div className="min-w-0 overflow-hidden px-2 pb-1 pt-2 sm:px-4">
            <MapaVivo
              destaque={nucleoId}
              conexoes={[]}
              pontosTerritoriais
              labels
              interativo={false}
              className="mx-auto block h-auto max-h-[44rem] w-full max-w-[30rem] overflow-hidden"
            />
          </div>
          <p className="px-5 pb-3.5 text-center text-[0.6rem] tracking-wide text-muted-foreground/70">
            Fonte cartográfica: GEOBASES / IDAF
          </p>
        </div>
      </div>

      {/* Jornada de progresso + Progresso do núcleo */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="anim-rise" style={{ animationDelay: "160ms" }}>
          <JornadaDimensoes />
        </div>
        <div className="anim-rise" style={{ animationDelay: "220ms" }}>
          <ProgressoNucleo />
        </div>
      </div>

      {/* Missões */}
      <div className="anim-rise" style={{ animationDelay: "260ms" }}>
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold">Missões do Território</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Realize missões, envie evidências e some progresso para o seu Núcleo.
          </p>
        </div>
        <MissoesTerritorio />
      </div>

      {/* Ranking */}
      <div className="anim-rise" style={{ animationDelay: "320ms" }}>
        <RankingNucleos />
      </div>
    </div>
  );
}
