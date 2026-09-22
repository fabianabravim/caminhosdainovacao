import { BookOpen, Compass } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FONTE_CAMINHOS, FONTE_REFERENCIA_PADRAO, type OrigemDado as Origem } from "@/data/territorios.config";

/** Selo discreto que identifica a origem da informação exibida. */
export function SeloOrigem({ origem, fonte, className }: { origem: Origem; fonte?: string; className?: string }) {
  const referencia = origem === "referencia";
  const Icone = referencia ? BookOpen : Compass;
  const texto = fonte ?? (referencia ? FONTE_REFERENCIA_PADRAO : FONTE_CAMINHOS);
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium leading-4 tracking-[0.04em]",
        referencia
          ? "border-border/70 bg-surface/70 text-muted-foreground"
          : "border-energy/45 bg-energy/10 text-brand-dark",
        className,
      )}
    >
      <Icone aria-hidden="true" className="h-3 w-3 shrink-0" />
      <span className="truncate">
        {referencia ? "Dado de referência" : "Produzido pelo Caminhos"} · {texto}
      </span>
    </span>
  );
}

/** Estado vazio — nunca usamos números fictícios. */
export function SemDados({
  texto = "Dados ainda não disponíveis",
  nota = "Em construção a partir do trabalho de campo.",
}: {
  texto?: string;
  nota?: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-border/80 bg-surface/50 px-4 py-5">
      <p className="text-sm font-medium text-foreground">{texto}</p>
      {nota ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{nota}</p> : null}
    </div>
  );
}

export function BlocoTerritorial({
  titulo,
  descricao,
  origem,
  fonte,
  children,
  className,
}: {
  titulo: string;
  descricao?: string;
  origem?: Origem;
  fonte?: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border/70 bg-surface/70 p-5 shadow-sm sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-brand-condensed text-2xl font-semibold leading-tight">{titulo}</h3>
          {descricao ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{descricao}</p> : null}
        </div>
        {origem ? <SeloOrigem origem={origem} fonte={fonte} /> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
