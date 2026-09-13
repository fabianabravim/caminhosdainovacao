import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Missao, RegistroMissao } from "@/types";

interface Props {
  missao: Missao;
  onClose: () => void;
  onEnviar: (dados: Pick<RegistroMissao, "titulo" | "descricao" | "data" | "local" | "anexoNome">) => void;
}

const campo =
  "w-full rounded-xl border border-border/70 bg-surface/70 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-glow/60";
const rotulo = "mb-1 block text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground";

export function ModalRegistroMissao({ missao, onClose, onEnviar }: Props) {
  const [form, setForm] = useState({ titulo: "", descricao: "", data: "", local: "" });
  const [anexoNome, setAnexoNome] = useState<string | undefined>();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (nome: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((atual) => ({ ...atual, [nome]: event.target.value }));
  const valido = Boolean(form.titulo.trim() && form.descricao.trim() && form.data);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-background/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${missao.cta}: ${missao.titulo}`}
      onClick={onClose}
    >
      <div
        className="panel panel-glow max-h-[calc(100dvh-env(safe-area-inset-top))] w-full max-w-lg overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:max-h-[92dvh] sm:rounded-3xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">{missao.cta}</p>
            <h3 className="break-words font-display text-lg font-semibold">{missao.titulo}</h3>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={onClose} aria-label="Fechar" className="shrink-0 rounded-full">
            <X />
          </Button>
        </div>

        <form
          className="mt-4 space-y-3.5"
          onSubmit={(event) => {
            event.preventDefault();
            if (valido) onEnviar({ ...form, anexoNome });
          }}
        >
          <div>
            <label className={rotulo} htmlFor="registro-titulo">Título</label>
            <input id="registro-titulo" className={campo} value={form.titulo} onChange={set("titulo")} required />
          </div>
          <div>
            <label className={rotulo} htmlFor="registro-descricao">Descrição</label>
            <textarea id="registro-descricao" className={campo} rows={3} value={form.descricao} onChange={set("descricao")} required />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={rotulo} htmlFor="registro-data">Data</label>
              <input id="registro-data" type="date" className={campo} value={form.data} onChange={set("data")} required />
            </div>
            <div>
              <label className={rotulo} htmlFor="registro-local">Local</label>
              <input id="registro-local" className={campo} value={form.local} onChange={set("local")} placeholder="Município / bairro" />
            </div>
          </div>
          <div>
            <span className={rotulo}>Evidência</span>
            <label className="tap flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-border/80 bg-surface/50 px-3.5 py-3 text-center text-sm text-muted-foreground">
              <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(event) => setAnexoNome(event.target.files?.[0]?.name)} />
              {anexoNome ? `📎 ${anexoNome}` : "📷 Anexar foto ou documento"}
            </label>
          </div>
          <Button type="submit" disabled={!valido} className="panel-glow h-auto w-full rounded-2xl px-5 py-3.5 font-display font-semibold">
            ENVIAR PARA VALIDAÇÃO
          </Button>
          <p className="text-center text-[0.68rem] text-muted-foreground">
            O progresso será atualizado automaticamente após a aprovação.
          </p>
        </form>
      </div>
    </div>
  );
}