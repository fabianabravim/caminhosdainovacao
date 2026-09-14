import { contornoES, nucleoMap, nucleos, pontosTerritoriais } from "@/data/nucleos";
import { ES_VIEWBOX } from "@/lib/geoES";
import { cn } from "@/lib/utils";
import type { Conexao, Nucleo } from "@/types";

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

  /**
   * Seleção por proximidade: o clique em qualquer ponto próximo a um núcleo
   * seleciona o núcleo mais próximo. Isso evita que brilhos/halos animados
   * ou a sobreposição de pontos na região metropolitana capturem o clique
   * do núcleo errado.
   */
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!interativo || !onSelecionar) return;
    const svg = event.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
    let melhor: Nucleo | null = null;
    let melhorDist = Infinity;
    for (const n of nucleos) {
      if (visiveis && !visiveis.includes(n.id)) continue;
      const d = Math.hypot(n.x - pt.x, n.y - pt.y);
      if (d < melhorDist) {
        melhorDist = d;
        melhor = n;
      }
    }
    // Só seleciona quando o clique está razoavelmente próximo de um núcleo.
    if (melhor && melhorDist <= 26) onSelecionar(melhor.id);
  };

  return (
    <svg
      viewBox={ES_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full select-none overflow-visible", className)}
      role="img"
      aria-label="Mapa vivo da inovação do Espírito Santo com os 14 núcleos regionais"
      onClick={handleMapClick}
    >
      <defs>
        <linearGradient id="mapaFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-secondary)" stopOpacity="0.72" />
          <stop offset="100%" stopColor="var(--brand-dark)" stopOpacity="0.94" />
        </linearGradient>
        <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-secondary)" />
        </linearGradient>
        <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. contorno é traçado, 2. preenchimento surge suavemente */}
      <path d={contornoES} fill="url(#mapaFill)" stroke="none" className="anim-mapa-fill" />
      <path
        d={contornoES}
        fill="none"
        stroke="var(--brand-primary)"
        strokeOpacity="0.22"
        strokeWidth="6"
        filter="url(#softGlow)"
        className="anim-mapa-fill"
      />
      <path
        d={contornoES}
        fill="none"
        stroke="var(--brand-primary)"
        strokeOpacity="0.78"
        strokeWidth="1.4"
        className="anim-mapa-traco"
      />

      {exibirPontos && (
        <g aria-hidden="true" className="anim-mapa-pontos">
          {pontosTerritoriais.map((p, i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r + 2.4}
                fill="var(--brand-primary)"
                fillOpacity="0.1"
                className="anim-spark"
                style={{ animationDelay: p.delay, transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill="var(--brand-primary)"
                fillOpacity="0.7"
                className="anim-spark"
                style={{ animationDelay: p.delay, transformOrigin: `${p.x}px ${p.y}px` }}
              />
            </g>
          ))}
        </g>
      )}

      {conexoesVisiveis && (
        <g className="anim-mapa-conexoes">
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
                stroke={c.colaborativa ? "url(#linkGrad)" : "var(--brand-primary)"}
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
              <circle key={`p-${c.de}-${c.para}`} r="1.9" fill="var(--brand-primary)" fillOpacity="0.9">
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

      <g className="anim-mapa-pontos">
        {nucleos.map((n) => {
          if (visiveis && !visiveis.includes(n.id)) return null;
          const ativo = estaSelecionado(n.id);
          const meu = n.id === destaque;
          const r = meu ? 8 : 5.5;
          return (
            <g
              key={n.id}
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
                fill="var(--brand-primary)"
                fillOpacity={meu ? 0.28 : 0.18}
                className="anim-node pointer-events-none"
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
                  stroke="var(--brand-primary)"
                  strokeOpacity="0.8"
                  strokeWidth="1.2"
                  className="anim-halo pointer-events-none"
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={ativo ? r + 2 : r}
                fill={meu ? "var(--brand-primary)" : ativo ? "var(--brand-secondary)" : "var(--brand-primary)"}
                stroke="var(--brand-dark)"
                strokeWidth="1.4"
                className="pointer-events-none transition-all duration-200"
              />
              {labels && (
                <text
                  x={n.x + (n.labelAnchor === "end" ? -(r + 6) : r + 6) + (n.labelDx ?? 0)}
                  y={n.y + 3.5 + (n.labelDy ?? 0)}
                  textAnchor={n.labelAnchor ?? "start"}
                  fontSize="10.5"
                  fontWeight={meu || ativo ? 700 : 500}
                  fill={meu || ativo ? "var(--foreground)" : "var(--muted-foreground)"}
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
