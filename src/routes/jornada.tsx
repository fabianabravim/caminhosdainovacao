import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { AppShell, Secao } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { JornadaDimensoes } from "@/components/jornada/JornadaDimensoes";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { ProgressoNucleo } from "@/components/jornada/ProgressoNucleo";
import { RankingNucleos } from "@/components/jornada/RankingNucleos";
import { MeuNucleoProvider, useMeuNucleo } from "@/context/MeuNucleoContext";
import { nucleoMap, pontosTerritoriais } from "@/data/nucleos";

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
      <AppShell titulo="Jornada da Inovação Capixaba" subtitulo="Meu Núcleo">
        <JornadaConteudo />
      </AppShell>
    </MeuNucleoProvider>
  );
}

function JornadaConteudo() {
  const { participante, nucleoId, conectoresNucleo } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId]!;

  return (
    <>
      {/* Identificação do participante */}
      <section className="anim-rise flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">
            Olá, {participante.nome.split(" ")[0]}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Você faz parte do{" "}
            <span className="font-semibold uppercase tracking-wide text-glow">
              Núcleo {nucleo.nome}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
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
      <Secao delay={60}>
        <div className="panel panel-glow overflow-hidden rounded-3xl p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Meu Núcleo</p>
          <h3 className="mt-1 font-display text-lg font-bold">Núcleo {nucleo.nome}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            “Cada descoberta ajuda a revelar o ecossistema de inovação do seu território.”
          </p>

          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
            Conectores do Núcleo
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {conectoresNucleo.map((c) => (
              <div key={c.nome} className="rounded-2xl border border-border/70 bg-surface/60 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="panel-glow grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/40 font-display text-xs font-bold text-glow">
                    {c.iniciais}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.nome}</p>
                    <p className="truncate text-[0.68rem] text-muted-foreground">{c.papel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Secao>

      {/* Mapa do território */}
      <Secao delay={120}>
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
          <div className="px-2 pb-1 pt-2">
            <MapaVivo
              destaque={nucleoId}
              conexoes={[]}
              pontosTerritoriais={pontosTerritoriais}
              labels
              interativo={false}
            />
          </div>
          <p className="px-5 pb-3.5 text-center text-[0.6rem] tracking-wide text-muted-foreground/70">
            Fonte cartográfica: GEOBASES / IDAF
          </p>
        </div>
      </Secao>

      {/* Jornada de progresso + Progresso do núcleo */}
      <div className="grid gap-4 md:grid-cols-2">
        <Secao delay={160}>
          <JornadaDimensoes />
        </Secao>
        <Secao delay={220}>
          <ProgressoNucleo />
        </Secao>
      </div>

      {/* Missões */}
      <Secao delay={260}>
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold">Missões do Território</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Realize missões, envie evidências e some progresso para o seu Núcleo.
          </p>
        </div>
        <MissoesTerritorio />
      </Secao>

      {/* Ranking */}
      <Secao delay={320}>
        <RankingNucleos />
      </Secao>
    </>
  );
}
