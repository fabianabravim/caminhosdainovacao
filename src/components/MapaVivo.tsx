import { contornoES, nucleoMap, nucleos } from "@/data/nucleos";
import { cn } from "@/lib/utils";
import type { Conexao } from "@/types";

interface Props {
  conexoes: Conexao[];
  selecionado?: string | null;
  onSelecionar?: (id: string) => void;
  destaque?: string;
  className?: string;
  labels?: boolean;
  interativo?: boolean;
}

export function MapaVivo({
  conexoes,
  selecionado,
  onSelecionar,
  destaque = "serra",
  className,
  labels = true,
  interativo = true,
}: Props) {
  return (
    <svg
      viewBox="0 0 400 600"
      className={cn("h-full w-full select-none", className)}
      role="img"
      aria-label="Mapa vivo da inovação do Espírito Santo com os 14 núcleos regionais"
    >
      <defs>
        <linearGradient id="mapaFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.34 0.11 300)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="oklch(0.22 0.08 285)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.8 0.12 305)" />
          <stop offset="100%" stopColor="oklch(0.86 0.13 200)" />
        </linearGradient>
        <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={contornoES}
        fill="url(#mapaFill)"
        stroke="oklch(0.72 0.12 305 / 0.5)"
        strokeWidth="1.6"
      />
      <path
        d={contornoES}
        fill="none"
        stroke="oklch(0.86 0.13 200 / 0.25)"
        strokeWidth="6"
        filter="url(#softGlow)"
      />

      <g>
        {conexoes.map((c) => {
          const de = nucleoMap[c.de];
          const para = nucleoMap[c.para];
          if (!de || !para) return null;
          const mx = (de.x + para.x) / 2 + (para.y - de.y) * 0.16;
          const my = (de.y + para.y) / 2 - (para.x - de.x) * 0.16;
          return (
            <path
              key={`${c.de}-${c.para}`}
              d={`M${de.x} ${de.y} Q${mx} ${my} ${para.x} ${para.y}`}
              fill="none"
              stroke={c.colaborativa ? "url(#linkGrad)" : "oklch(0.78 0.1 305 / 0.35)"}
              strokeWidth={c.colaborativa ? 2.4 : 1.1}
              strokeLinecap="round"
              className={c.colaborativa ? "anim-flow" : undefined}
              filter={c.colaborativa ? "url(#softGlow)" : undefined}
              opacity={c.colaborativa ? 0.95 : 0.5 + c.intensidade * 0.3}
            />
          );
        })}
      </g>

      <g>
        {nucleos.map((n) => {
          const ativo = selecionado === n.id;
          const meu = n.id === destaque;
          const r = meu ? 8 : 5.5;
          return (
            <g
              key={n.id}
              onClick={interativo ? () => onSelecionar?.(n.id) : undefined}
              className={interativo ? "cursor-pointer" : undefined}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r + 8}
                fill={meu ? "oklch(0.86 0.13 200 / 0.28)" : "oklch(0.78 0.12 305 / 0.18)"}
                className="anim-node"
                style={{ animationDelay: `${(n.x + n.y) % 30 / 10}s`, transformOrigin: `${n.x}px ${n.y}px` }}
              />
              {(ativo || meu) && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 6}
                  fill="none"
                  stroke="oklch(0.9 0.12 200 / 0.8)"
                  strokeWidth="1.2"
                  className="anim-halo"
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={meu ? "oklch(0.9 0.11 200)" : "oklch(0.84 0.1 305)"}
                stroke="oklch(0.2 0.06 295)"
                strokeWidth="1.4"
              />
              {labels && (
                <text
                  x={n.x + r + 6}
                  y={n.y + 3.5}
                  fontSize="10.5"
                  fontWeight={meu || ativo ? 700 : 500}
                  fill={meu || ativo ? "oklch(0.97 0.02 300)" : "oklch(0.84 0.04 300 / 0.8)"}
                >
                  {n.nome.length > 16 ? `${n.nome.slice(0, 15)}…` : n.nome}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
