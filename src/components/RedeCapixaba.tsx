import { useMemo } from "react";
import { nucleos } from "@/data/nucleos";
import type { Conexao } from "@/types";

interface Props {
  conexoes: Conexao[];
  selecionado?: string | null;
  onSelecionar?: (id: string) => void;
  destaque?: string;
}

export function RedeCapixaba({ conexoes, selecionado, onSelecionar, destaque = "serra" }: Props) {
  const pos = useMemo(() => {
    const centro = nucleos.find((n) => n.id === destaque);
    const outros = nucleos.filter((n) => n.id !== destaque);
    const mapa: Record<string, { x: number; y: number }> = {};
    if (centro) mapa[centro.id] = { x: 200, y: 200 };
    const round = (v: number) => Math.round(v * 100) / 100;
    outros.forEach((n, i) => {
      const anel = i % 2 === 0 ? 150 : 105;
      const ang = (i / outros.length) * Math.PI * 2 - Math.PI / 2;
      mapa[n.id] = {
        x: round(200 + Math.cos(ang) * anel),
        y: round(200 + Math.sin(ang) * anel),
      };
    });
    return mapa;
  }, [destaque]);

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Rede capixaba de inovação">
      <defs>
        <radialGradient id="redeBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--brand-secondary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#redeBg)" />
      {[105, 150].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="var(--brand-primary)"
          strokeOpacity="0.15"
          strokeDasharray="3 7"
        />
      ))}
      {conexoes.map((c) => {
        const a = pos[c.de];
        const b = pos[c.para];
        if (!a || !b) return null;
        return (
          <line
            key={`${c.de}-${c.para}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={c.colaborativa ? "var(--brand-secondary)" : "var(--brand-primary)"}
            strokeOpacity={c.colaborativa ? 0.9 : 0.3}
            strokeWidth={c.colaborativa ? 2 : 1}
            className={c.colaborativa ? "anim-flow" : undefined}
          />
        );
      })}
      {nucleos.map((n) => {
        const p = pos[n.id];
        if (!p) return null;
        const meu = n.id === destaque;
        const ativo = selecionado === n.id;
        const r = meu ? 13 : 7 + n.conexoes / 8;
        return (
          <g key={n.id} className="cursor-pointer" onClick={() => onSelecionar?.(n.id)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r + 7}
              fill="var(--brand-primary)"
              fillOpacity={meu ? 0.2 : 0.14}
              className="anim-node"
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={meu ? "var(--brand-primary)" : ativo ? "var(--brand-secondary)" : "var(--brand-primary)"}
              stroke="var(--brand-dark)"
              strokeWidth="1.4"
            />
            <text
              x={p.x}
              y={p.y + r + 12}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={meu ? 700 : 500}
              fill={meu || ativo ? "var(--foreground)" : "var(--muted-foreground)"}
            >
              {n.nome.length > 14 ? `${n.nome.slice(0, 13)}…` : n.nome}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
