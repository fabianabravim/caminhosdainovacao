import { useEffect, useRef, useState } from "react";

/**
 * Chancela institucional — assinatura oficial extraída do arquivo de
 * aplicações de marca fornecido (IJSN + Governo do Estado do Espírito
 * Santo), na versão oficial para fundo escuro, sem alterações de
 * proporção, cor ou tipografia.
 *
 * Arquivos oficiais em uso:
 *   public/marcas/assinatura-ijsn-governo.png  (versão para fundo escuro)
 *   public/marcas/logo-fapes.png               (versão colorida oficial)
 * Se um arquivo estiver ausente, um espaço reservado discreto é exibido.
 */

type MarcaProps = {
  src: string;
  alt: string;
  altura: string;
};

function Marca({ src, alt, altura }: MarcaProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ausente, setAusente] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setAusente(true);
  }, []);

  if (ausente) {
    return (
      <span
        role="img"
        aria-label={`${alt} (aguardando arquivo oficial)`}
        title={`${alt} — aguardando arquivo oficial`}
        className={`inline-flex items-center whitespace-nowrap rounded-sm border border-dashed border-border/70 px-3 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground ${altura}`}
      >
        {alt}
      </span>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setAusente(true)}
      className={`w-auto object-contain ${altura}`}
      draggable={false}
    />
  );
}

export function ChancelaInstitucional({ tamanho = "header" }: { tamanho?: "header" | "footer" }) {
  if (tamanho === "footer") {
    return (
      <div className="flex flex-wrap items-center gap-5 sm:gap-7" aria-label="Marcas institucionais">
        <Marca
          src="/marcas/assinatura-ijsn-governo.png"
          alt="Instituto Jones dos Santos Neves — IJSN | Governo do Estado do Espírito Santo"
          altura="h-12 sm:h-14"
        />
        <span aria-hidden="true" className="hidden h-10 w-px bg-border/70 sm:block" />
        <Marca
          src="/marcas/logo-fapes.png"
          alt="FAPES — Fundação de Amparo à Pesquisa e Inovação do Espírito Santo"
          altura="h-8 sm:h-9"
        />
      </div>
    );
  }

  return (
    <div className="institutional-dark flex items-center rounded-md px-2 py-1" aria-label="Marcas institucionais">
      <Marca
        src="/marcas/assinatura-ijsn-governo.png"
        alt="Instituto Jones dos Santos Neves — IJSN | Governo do Estado do Espírito Santo"
        altura="h-9 sm:h-10"
      />
    </div>
  );
}
