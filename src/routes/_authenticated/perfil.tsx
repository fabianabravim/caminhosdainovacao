import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Chip, Metrica, Progresso } from "@/components/ui/Progresso";
import { useJornada } from "@/context/JornadaContext";
import { atividades, conectores } from "@/data/jornada";
import { dimensaoMap } from "@/data/dimensoes";
import { nucleoAtualId, nucleoMap } from "@/data/nucleos";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do Núcleo Serra — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Perfil do Núcleo Regional Serra: conectores territoriais, indicadores de inovação e feed de atividades recentes.",
      },
      { property: "og:title", content: "Perfil do Núcleo Serra" },
      {
        property: "og:description",
        content: "Indicadores, conectores e atividades recentes do Núcleo Regional Serra.",
      },
    ],
  }),
  component: Perfil,
});

const atalhos = [
  { to: "/conquistas", label: "Conquistas & Badges" },
  { to: "/descobertas", label: "Descobertas do território" },
  { to: "/ranking", label: "Movimento dos Territórios" },
  { to: "/inteligencia", label: "Inteligência do Território" },
] as const;

function Perfil() {
  const { pontos, nivelAtual, proximoNivel, faltamPontos } = useJornada();
  const nucleo = nucleoMap[nucleoAtualId]!;

  return (
    <AppShell titulo="Núcleo Serra" subtitulo="Região Metropolitana · Espírito Santo">
      <section className="panel rounded-3xl border-primary/20 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-semibold text-primary">
            SE
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Núcleo Regional Serra</h2>
            <p className="text-xs text-muted-foreground">{nucleo.destaque}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip cor="var(--lilac)">{nivelAtual.icone} {nivelAtual.nome}</Chip>
          <Chip cor="var(--glow)">{pontos.toLocaleString("pt-BR")} pontos</Chip>
          <Chip cor="var(--dim-explorar)">{nucleo.progresso}% da jornada</Chip>
        </div>
        <Progresso valor={nucleo.progresso} className="mt-4" />
        <p className="mt-2 text-xs text-muted-foreground">
          {proximoNivel
            ? `Faltam ${faltamPontos.toLocaleString("pt-BR")} pontos para ${proximoNivel.nome}`
            : "Nível máximo alcançado"}
        </p>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metrica valor={nucleo.atores} label="Atores" />
        <Metrica valor={nucleo.escutas} label="Escutas" />
        <Metrica valor={nucleo.conexoes} label="Conexões" />
        <Metrica valor={nucleo.inovacoes} label="Inovações" />
      </section>

      <section className="mt-5">
        <h2 className="mb-3 text-base font-semibold">Conectores do núcleo</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {conectores.map((c) => (
            <div key={c.nome} className="panel rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                  {c.iniciais}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.nome}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{c.papel}</p>
                </div>
              </div>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-muted-foreground">{c.foco}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 text-base font-semibold">Atividades recentes</h2>
        <ul className="panel divide-y divide-border/60 rounded-2xl">
          {atividades.map((a) => {
            const d = dimensaoMap[a.dimensao];
            return (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 text-base leading-none">{d.icone}</span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug">{a.texto}</p>
                  <p className="text-[0.68rem] text-muted-foreground">{a.quando}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-5 space-y-2">
        {atalhos.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="panel tap flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium"
          >
            {a.label}
            <span className="text-muted-foreground">›</span>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
