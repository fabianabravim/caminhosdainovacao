import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPinned } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { nucleos } from "@/data/nucleos";
import { ES_PATHS, ES_VIEWBOX } from "@/lib/geoES";
import { cn } from "@/lib/utils";

/**
 * Camada de Núcleos Territoriais sobre a geometria oficial do Espírito Santo
 * (a mesma usada em toda a plataforma — nenhum contorno é redesenhado).
 * Ao selecionar um Núcleo, o acesso "Conhecer território" abre o Perfil Territorial.
 */
export function MapaNucleosTerritorios() {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const nucleo = nucleos.find((n) => n.id === selecionado) ?? null;

  return (
    <div className="absolute inset-0 z-20">
      <svg
        viewBox={ES_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Mapa oficial do Espírito Santo com os 14 Núcleos Territoriais"
        className="h-full w-full p-4 sm:p-6"
      >
        <defs>
          <filter id="brilhoNucleo" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="desfoque" />
            <feMerge>
              <feMergeNode in="desfoque" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {ES_PATHS.map((d, i) => (
          <path key={i} d={d} className="fill-primary/12 stroke-lilac/45" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
        {nucleos.map((n) => {
          const ativo = n.id === selecionado;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={ativo ? 6 : 4.2}
                role="button"
                tabIndex={0}
                aria-label={`Selecionar Núcleo ${n.nome}`}
                aria-pressed={ativo}
                onClick={() => setSelecionado(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelecionado(n.id);
                  }
                }}
                className={cn(
                  "cursor-pointer outline-none transition-all duration-200",
                  ativo ? "fill-energy stroke-brand-dark" : "fill-primary stroke-surface hover:fill-lilac",
                )}
                strokeWidth={1.4}
                filter={ativo ? "url(#brilhoNucleo)" : undefined}
              />
              <text
                x={n.x + (n.labelDx ?? 6)}
                y={n.y + (n.labelDy ?? -6)}
                textAnchor={n.labelAnchor ?? "start"}
                className={cn(
                  "pointer-events-none select-none text-[7px] font-semibold",
                  ativo ? "fill-brand-dark" : "fill-muted-foreground",
                )}
              >
                {n.nome}
              </text>
            </g>
          );
        })}
      </svg>

      {nucleo ? (
        <div className="absolute inset-x-4 bottom-10 rounded-md border border-lilac/30 bg-background/95 p-4 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:top-6 sm:bottom-auto sm:w-[19rem]">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-lilac">Núcleo Territorial</p>
          <p className="mt-1 font-brand-condensed text-2xl font-semibold leading-tight">{nucleo.nome}</p>
          <p className="mt-1 text-xs text-muted-foreground">Região {nucleo.regiao}</p>
          <Button asChild size="sm" className="mt-4 w-full">
            <Link to="/territorio/$nucleoId" params={{ nucleoId: nucleo.id }}>
              <MapPinned aria-hidden="true" /> Conhecer território <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <p className="pointer-events-none absolute left-4 top-4 max-w-[16rem] rounded-md border border-border/70 bg-background/90 px-3 py-2 text-xs leading-relaxed text-muted-foreground sm:left-6 sm:top-6">
          Selecione um Núcleo no mapa para conhecer o território.
        </p>
      )}
    </div>
  );
}
