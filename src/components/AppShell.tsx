import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Celebracao } from "@/components/Celebracao";
import { useJornada } from "@/context/JornadaContext";
import { nucleoAtualId, nucleoMap } from "@/data/nucleos";

export function AppShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}) {
  const { pontos, nivelAtual } = useJornada();
  const nucleo = nucleoMap[nucleoAtualId]!;

  return (
    <div className="min-h-screen pb-24">
      <Celebracao />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 pb-3 pt-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-lilac/80">
              Caminhos da Inovação
            </p>
            <h1 className="truncate font-display text-xl font-semibold">{titulo}</h1>
            {subtitulo ? (
              <p className="truncate text-xs text-muted-foreground">{subtitulo}</p>
            ) : null}
          </div>
          <Link
            to="/perfil"
            className="tap flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-surface/70 py-1.5 pl-2 pr-3"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/30 text-xs font-bold">
              {nucleo.nome.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[0.68rem] font-semibold">
                {pontos.toLocaleString("pt-BR")} pts
              </span>
              <span className="block text-[0.6rem] text-muted-foreground">{nivelAtual.nome}</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}
