import { useEffect } from "react";
import { useJornada } from "@/context/JornadaContext";

export function Celebracao() {
  const { celebracao, fecharCelebracao } = useJornada();

  useEffect(() => {
    if (!celebracao) return;
    const t = setTimeout(fecharCelebracao, 2600);
    return () => clearTimeout(t);
  }, [celebracao, fecharCelebracao]);

  if (!celebracao) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        key={celebracao.id}
        className="anim-celebrate panel panel-glow relative flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3"
      >
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-lg">
          {celebracao.tipo === "missao" ? "🏅" : "✨"}
          <span className="anim-halo absolute inset-0 rounded-full border border-glow/60" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-gradient">{celebracao.titulo}</p>
          <p className="truncate text-xs text-muted-foreground">{celebracao.detalhe}</p>
        </div>
        {celebracao.pontos ? (
          <span className="ml-auto shrink-0 rounded-full bg-glow/15 px-2.5 py-1 text-xs font-semibold text-glow">
            +{celebracao.pontos}
          </span>
        ) : null}
      </div>
    </div>
  );
}
