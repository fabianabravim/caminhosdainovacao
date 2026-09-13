import { useState } from "react";

/**
 * Chancela institucional — exibe as marcas oficiais do IJSN e do
 * Governo do Estado do Espírito Santo.
 *
 * Os arquivos oficiais devem ser colocados em:
 *   public/marcas/logo-ijsn.png
 *   public/marcas/marca-governo-es.png
 * Enquanto os arquivos não existem, um espaço reservado discreto é exibido.
 */

type MarcaProps = {
  src: string;
  alt: string;
  altura: string;
};

function Marca({ src, alt, altura }: MarcaProps) {
  const [ausente, setAusente] = useState(false);

  if (ausente) {
    return (
      <span
        role="img"
        aria-label={`${alt} (aguardando arquivo oficial)`}
        className={`inline-flex items-center rounded-sm border border-dashed border-border/70 px-3 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground ${altura}`}
      >
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setAusente(true)}
      className={`w-auto object-contain ${altura}`}
      draggable={false}
    />
  );
}

export function ChancelaInstitucional({ tamanho = "header" }: { tamanho?: "header" | "footer" }) {
  const altura = tamanho === "footer" ? "h-9 sm:h-10" : "h-6 sm:h-7";
  return (
    <div className="flex items-center gap-3 sm:gap-4" aria-label="Marcas institucionais">
      <Marca src="/marcas/logo-ijsn.png" alt="IJSN" altura={altura} />
      <span aria-hidden="true" className={`w-px bg-border/70 ${tamanho === "footer" ? "h-8" : "h-5"}`} />
      <Marca src="/marcas/marca-governo-es.png" alt="Governo do Espírito Santo" altura={altura} />
    </div>
  );
}
