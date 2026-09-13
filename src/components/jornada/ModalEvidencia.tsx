import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { missaoTerritorialMap } from "@/data/missoes.config";
import type { DadosRegistro } from "@/types";

interface Props {
  missaoId: string;
  onClose: () => void;
  onEnviar: (dados: DadosRegistro) => void;
}

const campo =
  "w-full rounded-xl border border-border/70 bg-surface/70 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-glow/60";
const rotulo = "mb-1 block text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground";

/**
 * Formulário de registro do trabalho real. O envio nunca altera a barra
 * diretamente: o sistema recalcula o progresso a partir do registro.
 */
export function ModalEvidencia({ missaoId, onClose, onEnviar }: Props) {
  const missao = missaoTerritorialMap[missaoId];
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data: "",
    local: "",
    atores: "",
    resultado: "",
    localizacao: "",
  });
  const [anexoNome, setAnexoNome] = useState<string | undefined>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!missao) return null;

  const set = (campoNome: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [campoNome]: e.target.value }));

  const valido = form.titulo.trim() && form.descricao.trim() && form.data;

  return (
    <div
      className="fixed inset-0 z-50 flex min-w-0 items-end justify-center overflow-hidden bg-background/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${missao.cta}: ${missao.titulo}`}
      onClick={onClose}
    >
      <div
        className="panel panel-glow max-h-[calc(100dvh-env(safe-area-inset-top))] w-full min-w-0 max-w-lg overflow-x-hidden overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:max-h-[92dvh] sm:rounded-3xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">{missao.cta}</p>
            <h3 className="break-words font-display text-lg font-semibold [overflow-wrap:anywhere]">
              {missao.icone} {missao.titulo}
            </h3>
            <p className="mt-1 text-[0.7rem] text-muted-foreground">
              Meta da missão: {missao.metaTotal} {missao.unidade}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="tap rounded-full border border-border/70 p-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-4 space-y-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valido) return;
            onEnviar({ ...form, anexoNome });
          }}
        >
          <div>
            <label className={rotulo} htmlFor="ev-titulo">Título</label>
            <input id="ev-titulo" className={campo} value={form.titulo} onChange={set("titulo")} required />
          </div>
          <div>
            <label className={rotulo} htmlFor="ev-descricao">Descrição</label>
            <textarea id="ev-descricao" className={campo} rows={3} value={form.descricao} onChange={set("descricao")} required />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={rotulo} htmlFor="ev-data">Data</label>
              <input id="ev-data" type="date" className={campo} value={form.data} onChange={set("data")} required />
            </div>
            <div>
              <label className={rotulo} htmlFor="ev-local">Local</label>
              <input id="ev-local" className={campo} value={form.local} onChange={set("local")} placeholder="Município / bairro" />
            </div>
          </div>
          <div>
            <label className={rotulo} htmlFor="ev-atores">Atores envolvidos</label>
            <input id="ev-atores" className={campo} value={form.atores} onChange={set("atores")} placeholder="Quem participou" />
          </div>
          <div>
            <label className={rotulo} htmlFor="ev-resultado">Resultado / observações</label>
            <textarea id="ev-resultado" className={campo} rows={2} value={form.resultado} onChange={set("resultado")} />
          </div>
          <div>
            <label className={rotulo} htmlFor="ev-localizacao">Localização</label>
            <input id="ev-localizacao" className={campo} value={form.localizacao} onChange={set("localizacao")} placeholder="Coordenadas ou ponto de referência" />
          </div>
          <div>
            <span className={rotulo}>Foto / documento</span>
            <label className="tap flex min-w-0 cursor-pointer items-center justify-center gap-2 break-words rounded-xl border border-dashed border-border/80 bg-surface/50 px-3.5 py-3 text-center text-sm text-muted-foreground [overflow-wrap:anywhere]">
              <input
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => setAnexoNome(e.target.files?.[0]?.name)}
              />
              {anexoNome ? `📎 ${anexoNome}` : "📷 Anexar foto ou documento"}
            </label>
          </div>

          <button
            type="submit"
            disabled={!valido}
            className="tap panel-glow w-full rounded-2xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {missao.cta.toUpperCase()}
          </button>
          <p className="text-center text-[0.68rem] text-muted-foreground">
            {missao.exigeValidacao ? (
              <>
                O registro ficará <strong>Em validação</strong> e só somará no progresso após
                aprovação.
              </>
            ) : (
              <>O progresso da missão será atualizado automaticamente pelo sistema.</>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
