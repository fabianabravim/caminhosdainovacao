import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DimensoesBarras } from "@/components/Dimensoes";
import { Progresso } from "@/components/ui/Progresso";
import { useJornada } from "@/context/JornadaContext";
import { niveis } from "@/data/jornada";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Minha Jornada — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Trilha de progressão do conector territorial: de Explorador a Embaixador da Inovação, com pontos de impacto e progresso por dimensão.",
      },
      { property: "og:title", content: "Minha Jornada da Inovação Capixaba" },
      {
        property: "og:description",
        content: "Acompanhe sua evolução de Explorador a Embaixador da Inovação.",
      },
    ],
  }),
  component: Jornada,
});

function Jornada() {
  const { pontos, nivelAtual, proximoNivel, faltamPontos, concluidas } = useJornada();
  const base = nivelAtual.pontosNecessarios;
  const alvo = proximoNivel?.pontosNecessarios ?? pontos;
  const pct = proximoNivel ? ((pontos - base) / (alvo - base)) * 100 : 100;

  return (
    <AppShell titulo="Minha Jornada" subtitulo="Núcleo Serra · trilha de progressão">
      <section className="panel panel-glow rounded-3xl p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
              Pontos de impacto
            </p>
            <p className="font-display text-4xl font-semibold text-gradient">
              {pontos.toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Nível atual</p>
            <p className="font-display text-lg font-semibold">
              {nivelAtual.icone} {nivelAtual.nome}
            </p>
          </div>
        </div>
        <Progresso valor={pct} className="mt-4 h-2.5" />
        <p className="mt-2 text-xs text-muted-foreground">
          {proximoNivel
            ? `Faltam ${faltamPontos.toLocaleString("pt-BR")} pontos para ${proximoNivel.nome}`
            : "Você alcançou o nível máximo da jornada capixaba"}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-display text-base font-semibold">Trilha da inovação</h2>
        <ol className="relative space-y-3 pl-8">
          <span className="absolute bottom-4 left-[0.9rem] top-4 w-px bg-gradient-to-b from-glow/70 via-primary/60 to-border" />
          {niveis.map((n) => {
            const alcancado = pontos >= n.pontosNecessarios;
            const atual = n.id === nivelAtual.id;
            return (
              <li key={n.id} className="relative">
                <span
                  className={`absolute -left-8 top-3 grid h-8 w-8 place-items-center rounded-full border text-sm ${
                    atual
                      ? "panel-glow border-glow/70 bg-primary/40"
                      : alcancado
                        ? "border-lilac/50 bg-primary/25"
                        : "border-border bg-surface/70 opacity-60"
                  }`}
                >
                  {n.icone}
                </span>
                <div
                  className={`panel rounded-2xl p-3.5 ${atual ? "panel-glow" : ""} ${
                    alcancado ? "" : "opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold">{n.nome}</p>
                    {atual ? (
                      <span className="rounded-full bg-glow/15 px-2 py-0.5 text-[0.62rem] font-semibold text-glow">
                        você está aqui
                      </span>
                    ) : null}
                    <span className="ml-auto text-[0.68rem] text-muted-foreground">
                      {n.pontosNecessarios.toLocaleString("pt-BR")} pts
                    </span>
                  </div>
                  <p className="mt-1 text-[0.72rem] leading-relaxed text-muted-foreground">
                    {n.descricao}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-5">
        <DimensoesBarras />
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/missoes" className="panel tap rounded-2xl p-3.5">
          <p className="font-display text-sm font-semibold">Missões</p>
          <p className="text-[0.7rem] text-muted-foreground">
            {concluidas.length} concluídas nesta sessão
          </p>
        </Link>
        <Link to="/conquistas" className="panel tap rounded-2xl p-3.5">
          <p className="font-display text-sm font-semibold">Conquistas</p>
          <p className="text-[0.7rem] text-muted-foreground">Badges e selos do território</p>
        </Link>
      </section>
    </AppShell>
  );
}
