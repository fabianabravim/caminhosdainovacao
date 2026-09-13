import { contornoES, nucleoMap, nucleos, pontosTerritoriais } from "@/data/nucleos";
import { cn } from "@/lib/utils";
import type { Conexao } from "@/types";

interface Props {
  conexoes: Conexao[];
  selecionado?: string | null;
  selecionados?: string[];
  onSelecionar?: (id: string) => void;
  onHover?: (id: string | null) => void;
  destaque?: string;
  className?: string;
  labels?: boolean;
  interativo?: boolean;
  particulas?: boolean;
  /** Núcleos visíveis (para a sequência do Modo Apresentação). */
  visiveis?: string[];
  /** Conexões visíveis; quando ausente, todas aparecem. */
  conexoesVisiveis?: boolean;
  /**
   * Pontos de luz espalhados pelo território representando atores,
   * iniciativas, conhecimento, oportunidades e inovação. Sem linhas.
   */
  pontosTerritoriais?: boolean;
}

function curva(de: { x: number; y: number }, para: { x: number; y: number }) {
  const mx = (de.x + para.x) / 2 + (para.y - de.y) * 0.16;
  const my = (de.y + para.y) / 2 - (para.x - de.x) * 0.16;
  return `M${de.x} ${de.y} Q${mx} ${my} ${para.x} ${para.y}`;
}

export function MapaVivo({
  conexoes,
  selecionado,
  selecionados,
  onSelecionar,
  onHover,
  destaque = "serra",
  className,
  labels = true,
  interativo = true,
  particulas = false,
  visiveis,
  conexoesVisiveis = true,
  pontosTerritoriais: exibirPontos = false,
}: Props) {
  const estaSelecionado = (id: string) => selecionado === id || !!selecionados?.includes(id);

  return (
    <svg
      viewBox="0 0 400 600"
      className={cn("h-full w-full select-none overflow-visible", className)}
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

      {exibirPontos && (
        <g aria-hidden="true">
          {pontosTerritoriais.map((p, i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r + 2.4}
                fill="oklch(0.86 0.13 200 / 0.10)"
                className="anim-spark"
                style={{ animationDelay: p.delay, transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill="oklch(0.9 0.12 200 / 0.7)"
                className="anim-spark"
                style={{ animationDelay: p.delay, transformOrigin: `${p.x}px ${p.y}px` }}
              />
            </g>
          ))}
        </g>
      )}

      {conexoesVisiveis && (
        <g>
          {conexoes.map((c) => {
            const de = nucleoMap[c.de];
            const para = nucleoMap[c.para];
            if (!de || !para) return null;
            if (visiveis && (!visiveis.includes(c.de) || !visiveis.includes(c.para))) return null;
            return (
              <path
                key={`${c.de}-${c.para}`}
                d={curva(de, para)}
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
      )}

      {particulas && conexoesVisiveis && (
        <g>
          {conexoes.slice(0, 12).map((c, i) => {
            const de = nucleoMap[c.de];
            const para = nucleoMap[c.para];
            if (!de || !para) return null;
            if (visiveis && (!visiveis.includes(c.de) || !visiveis.includes(c.para))) return null;
            return (
              <circle key={`p-${c.de}-${c.para}`} r="1.9" fill="oklch(0.92 0.11 200 / 0.9)">
                <animateMotion
                  dur={`${9 + (i % 5) * 1.6}s`}
                  begin={`${(i % 6) * 1.2}s`}
                  repeatCount="indefinite"
                  path={curva(de, para)}
                  keyPoints="0;1"
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
            );
          })}
        </g>
      )}

      <g>
        {nucleos.map((n) => {
          if (visiveis && !visiveis.includes(n.id)) return null;
          const ativo = estaSelecionado(n.id);
          const meu = n.id === destaque;
          const r = meu ? 8 : 5.5;
          return (
            <g
              key={n.id}
              onClick={interativo ? () => onSelecionar?.(n.id) : undefined}
              onMouseEnter={interativo ? () => onHover?.(n.id) : undefined}
              onMouseLeave={interativo ? () => onHover?.(null) : undefined}
              onFocus={interativo ? () => onHover?.(n.id) : undefined}
              onBlur={interativo ? () => onHover?.(null) : undefined}
              onKeyDown={
                interativo
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelecionar?.(n.id);
                      }
                    }
                  : undefined
              }
              tabIndex={interativo ? 0 : undefined}
              role={interativo ? "button" : undefined}
              aria-label={interativo ? `Explorar núcleo ${n.nome}` : undefined}
              className={interativo ? "cursor-pointer" : undefined}
            >
              {interativo && <circle cx={n.x} cy={n.y} r={16} fill="transparent" />}
              <circle
                cx={n.x}
                cy={n.y}
                r={r + 8}
                fill={meu ? "oklch(0.86 0.13 200 / 0.28)" : "oklch(0.78 0.12 305 / 0.18)"}
                className="anim-node"
                style={{
                  animationDelay: `${((n.x + n.y) % 30) / 10}s`,
                  transformOrigin: `${n.x}px ${n.y}px`,
                }}
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
                r={ativo ? r + 2 : r}
                fill={meu ? "oklch(0.9 0.11 200)" : ativo ? "oklch(0.95 0.06 305)" : "oklch(0.84 0.1 305)"}
                stroke="oklch(0.2 0.06 295)"
                strokeWidth="1.4"
                className="transition-all duration-200"
              />
              {labels && (
                <text
                  x={n.x + (n.labelAnchor === "end" ? -(r + 6) : r + 6) + (n.labelDx ?? 0)}
                  y={n.y + 3.5 + (n.labelDy ?? 0)}
                  textAnchor={n.labelAnchor ?? "start"}
                  fontSize="10.5"
                  fontWeight={meu || ativo ? 700 : 500}
                  fill={meu || ativo ? "oklch(0.97 0.02 300)" : "oklch(0.84 0.04 300 / 0.8)"}
                  className="pointer-events-none"
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
