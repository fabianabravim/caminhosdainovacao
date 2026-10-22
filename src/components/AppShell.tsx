import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { LinkAdministracao } from "@/components/LinkAdministracao";
import { Celebracao } from "@/components/Celebracao";
import { useJornada } from "@/context/JornadaContext";
import { nucleoAtualId, nucleoMap } from "@/data/nucleos";
import marcaCaminhos from "@/assets/marca-horizontal-branco.png.asset.json";

export function AppShell({
  titulo,
  subtitulo,
  mostrarPontos = true,
  ampla = false,
  jornadaResponsiva = false,
  navegacao,
  children,
}: {
  titulo: string;
  subtitulo?: import("react").ReactNode;
  /** Mostra o selo individual de pontos/nível (false na Jornada territorial). */
  mostrarPontos?: boolean;
  /** Permite experiências territoriais amplas sem alterar as demais telas. */
  ampla?: boolean;
  /** Ativa somente os ajustes responsivos próprios da página Jornada. */
  jornadaResponsiva?: boolean;
  /** Navegação local fornecida pela página, separada do menu principal. */
  navegacao?: ReactNode;
  children: ReactNode;
}) {
  const { pontos, nivelAtual } = useJornada();
  const nucleo = nucleoMap[nucleoAtualId];

  return (
    <div className={jornadaResponsiva ? "topo-lines min-h-screen min-w-0 overflow-x-clip bg-background pb-24" : "topo-lines min-h-screen bg-background pb-24"}>
      <Celebracao />
      <header className={`sticky top-0 z-30 border-b border-primary-foreground/15 bg-brand-dark px-4 text-primary-foreground ${jornadaResponsiva ? "py-2 sm:py-3" : "py-3"}`}>
        <div className={`mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 ${jornadaResponsiva ? "gap-y-1 sm:gap-y-3" : "gap-y-3"} ${navegacao ? "xl:grid-cols-[auto_minmax(0,1fr)_auto]" : ""} ${ampla ? "max-w-7xl" : "max-w-3xl"}`}>
          <div className={`flex min-w-0 flex-col items-start sm:flex-row sm:items-center sm:gap-4 ${jornadaResponsiva ? "gap-0.5 sm:gap-4" : "gap-1.5"}`}>
            <div className={`${jornadaResponsiva ? "w-40 min-[375px]:w-[12.25rem]" : "w-[12.25rem]"} max-w-full shrink-0 sm:w-[14rem]`}>
              <img src={marcaCaminhos.url} alt="Caminhos da Inovação" width={1069} height={176} className="block h-auto w-full object-contain" />
            </div>
            <div className="min-w-0">
            <h1 className={`font-brand-condensed font-semibold ${jornadaResponsiva ? "text-base sm:text-xl text-balance leading-tight" : "text-xl truncate"}`}>
              {titulo}
            </h1>
            {subtitulo ? (
              <p className={`truncate text-primary-foreground/75 ${jornadaResponsiva ? "text-[0.625rem] sm:text-xs" : "text-xs"}`}>{subtitulo}</p>
            ) : null}
            </div>
          </div>
          {navegacao ? <div className="col-span-2 row-start-2 min-w-0 xl:col-span-1 xl:col-start-2 xl:row-start-1">{navegacao}</div> : null}
          <div className={`flex shrink-0 items-center gap-2 ${navegacao ? "col-start-2 row-start-1 xl:col-start-3" : ""}`}>
          <LinkAdministracao className={`border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground ${jornadaResponsiva ? "max-sm:h-11 max-sm:w-11 max-sm:justify-center max-sm:px-0 max-sm:[&_span]:hidden" : ""}`} />
          {mostrarPontos ? (
            <Link
              to="/perfil"
              className="tap flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-surface/70 py-1.5 pl-2 pr-3"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/30 text-xs font-bold">
                  {nucleo?.nome.slice(0, 2).toUpperCase() ?? "CI"}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[0.68rem] font-semibold">
                  {pontos.toLocaleString("pt-BR")} pts
                </span>
                <span className="block text-[0.6rem] text-muted-foreground">{nivelAtual.nome}</span>
              </span>
            </Link>
          ) : (
            <Link to="/perfil" aria-label="Meu perfil" className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">
              <UserRound className="h-4 w-4" />
            </Link>
          )}
          </div>
        </div>
      </header>
      <main className={`mx-auto ${jornadaResponsiva ? "w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7" : "px-4 py-5"} ${ampla ? "max-w-7xl" : "max-w-3xl"}`}>
        {children}
      </main>
      <BottomNav compacta={jornadaResponsiva} />
    </div>
  );
}
