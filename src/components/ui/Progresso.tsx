import { cn } from "@/lib/utils";

export function Progresso({
  valor,
  cor = "var(--lilac)",
  className,
}: {
  valor: number;
  cor?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary/70", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, valor))}%`,
          background: `linear-gradient(90deg, ${cor}, var(--glow))`,
          boxShadow: `0 0 12px -2px ${cor}`,
        }}
      />
    </div>
  );
}

export function Metrica({
  valor,
  label,
}: {
  valor: string | number;
  label: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5 last:col-span-2 sm:last:col-span-1">
      <p className="break-words font-display text-xl font-semibold leading-none">{valor}</p>
      <p className="mt-1 break-words text-[0.7rem] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

export function Chip({
  children,
  cor,
  className,
}: {
  children: React.ReactNode;
  cor?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
        className,
      )}
      style={
        cor
          ? { backgroundColor: `color-mix(in oklab, ${cor} 18%, transparent)`, color: cor }
          : undefined
      }
    >
      {children}
    </span>
  );
}
