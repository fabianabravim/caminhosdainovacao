import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

/**
 * Ajuda contextual discreta sobre o que considerar uma inovação.
 * Funciona como orientação ao Conector (não obrigatória), expandindo
 * o conteúdo sem abrir um modal invasivo.
 */
export function AjudaInovacao({ className = "" }: { className?: string }) {
  const [aberta, setAberta] = useState(false);
  return (
    <div className={`min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setAberta((v) => !v)}
        aria-expanded={aberta}
        className="tap inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[0.72rem] font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <Info className="h-3.5 w-3.5" />
        O que considerar uma inovação?
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aberta ? "rotate-180" : ""}`} />
      </button>
      {aberta ? (
        <p className="mt-2 rounded-md border border-border/70 bg-surface/70 px-3.5 py-3 text-[0.74rem] leading-relaxed text-muted-foreground">
          Considere práticas, produtos, serviços, processos, soluções organizacionais,
          metodológicas, institucionais ou novos modelos de negócio que gerem valor para o
          território. <span className="font-semibold text-foreground">Inovação não se limita à tecnologia.</span>
        </p>
      ) : null}
    </div>
  );
}
