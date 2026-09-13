import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Plus, X } from "lucide-react";
import { tipoAtividadeMap, tiposAtividade } from "@/data/atividades.config";
import { useMeuNucleo, type ResultadoRegistro } from "@/context/MeuNucleoContext";
import { missaoTerritorialMap } from "@/data/missoes.config";
import {
  RegistroAtividadeContext as Ctx,
  useRegistroAtividade,
  type PresetRegistroAtividade as Preset,
} from "@/components/jornada/registroAtividadeBase";

// O hook e o contexto vivem em `registroAtividadeBase.ts` para este arquivo
// exportar apenas componentes — compatível com Fast Refresh.
export { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";

/**
 * Porta de entrada única do trabalho real: um só sistema de registro de
 * atividade, usado pelo CTA principal e pelos CTAs contextuais das missões.
 */
export function RegistroAtividadeProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<Preset | null>(null);
  const abrir = useCallback((p?: Preset) => setPreset(p ?? {}), []);
  const value = useMemo(() => ({ abrir }), [abrir]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {preset ? <ModalAtividade preset={preset} onClose={() => setPreset(null)} /> : null}
    </Ctx.Provider>
  );
}

/** Botão principal operacional do Conector. */
export function BotaoRegistrarAtividade({
  variante = "solido",
  className = "",
  rotulo = "Registrar atividade",
}: {
  variante?: "solido" | "discreto";
  className?: string;
  rotulo?: string;
}) {
  const { abrir } = useRegistroAtividade();
  return (
    <button
      type="button"
      onClick={() => abrir()}
      className={`tap inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 font-display text-sm font-semibold ${
        variante === "solido"
          ? "panel-glow bg-primary text-primary-foreground"
          : "border border-border/70 bg-surface/60 text-foreground"
      } ${className}`}
    >
      <Plus className="h-4 w-4" strokeWidth={2.4} />
      {rotulo}
    </button>
  );
}

/** Atalho fixo no mobile, acima da navegação inferior (uso em campo). */
export function AcaoFlutuanteAtividade() {
  const { abrir } = useRegistroAtividade();
  return (
    <button
      type="button"
      onClick={() => abrir()}
      aria-label="Registrar atividade"
      className="tap panel-glow fixed right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lg lg:hidden"
      style={{ bottom: "calc(5.75rem + env(safe-area-inset-bottom))" }}
    >
      <Plus className="h-4 w-4" strokeWidth={2.6} />
      Registrar atividade
    </button>
  );
}

const campo =
  "w-full rounded-xl border border-border/70 bg-surface/70 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-glow/60";
const rotuloCls = "mb-1 block text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground";

function ModalAtividade({ preset, onClose }: { preset: Preset; onClose: () => void }) {
  const { registrarAtividade } = useMeuNucleo();
  const missaoOrigem = preset.missaoId ? missaoTerritorialMap[preset.missaoId] : undefined;
  const [resultado, setResultado] = useState<ResultadoRegistro | null>(null);

  const [form, setForm] = useState({
    tipoId: preset.tipoId ?? tiposAtividade[0]!.id,
    data: "",
    municipio: "",
    local: "",
    titulo: "",
    descricao: "",
    atores: "",
    resultados: "",
    observacoes: "",
    localizacao: "",
    evidenciaLink: "",
  });
  const [foto, setFoto] = useState<string | undefined>();
  const [documento, setDocumento] = useState<string | undefined>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set =
    (nome: keyof typeof form) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [nome]: e.target.value }));

  const valido = form.tipoId && form.data && form.titulo.trim() && form.descricao.trim();
  const tipo = tipoAtividadeMap[form.tipoId];

  return (
    <div
      className="fixed inset-0 z-50 flex min-w-0 items-end justify-center overflow-hidden bg-background/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Registrar atividade"
      onClick={onClose}
    >
      <div
        className="panel panel-glow max-h-[calc(100dvh-env(safe-area-inset-top))] w-full min-w-0 max-w-lg overflow-x-hidden overflow-y-auto rounded-t-3xl px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:max-h-[92dvh] sm:rounded-3xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
              {resultado ? "Registro enviado" : "Trabalho realizado no território"}
            </p>
            <h3 className="break-words font-display text-lg font-semibold [overflow-wrap:anywhere]">
              {resultado ? "Atividade registrada" : "Registrar atividade"}
            </h3>
            {missaoOrigem && !resultado ? (
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                A partir da missão: {missaoOrigem.icone} {missaoOrigem.titulo}
              </p>
            ) : null}
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

        {resultado ? (
          <FeedbackRegistro resultado={resultado} onClose={onClose} />
        ) : (
          <form
            className="mt-4 space-y-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!valido) return;
              setResultado(
                registrarAtividade({
                  tipoId: form.tipoId,
                  data: form.data,
                  municipio: form.municipio,
                  local: form.local,
                  titulo: form.titulo,
                  descricao: form.descricao,
                  atores: form.atores,
                  resultados: form.resultados,
                  observacoes: form.observacoes,
                  localizacao: form.localizacao,
                  evidenciaFoto: foto,
                  evidenciaDocumento: documento,
                  evidenciaLink: form.evidenciaLink || undefined,
                  missaoId: preset.missaoId,
                }),
              );
            }}
          >
            <div>
              <label className={rotuloCls} htmlFor="atv-tipo">Tipo de atividade</label>
              <select id="atv-tipo" className={campo} value={form.tipoId} onChange={set("tipoId")}>
                {tiposAtividade.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icone} {t.rotulo}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={rotuloCls} htmlFor="atv-data">Data</label>
                <input id="atv-data" type="date" className={campo} value={form.data} onChange={set("data")} required />
              </div>
              <div>
                <label className={rotuloCls} htmlFor="atv-municipio">Município</label>
                <input id="atv-municipio" className={campo} value={form.municipio} onChange={set("municipio")} placeholder="Ex.: Serra" />
              </div>
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-local">Local</label>
              <input id="atv-local" className={campo} value={form.local} onChange={set("local")} placeholder="Bairro, instituição ou ponto de encontro" />
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-titulo">Título da atividade</label>
              <input id="atv-titulo" className={campo} value={form.titulo} onChange={set("titulo")} required />
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-descricao">O que foi realizado?</label>
              <textarea id="atv-descricao" className={campo} rows={3} value={form.descricao} onChange={set("descricao")} required />
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-atores">Atores envolvidos</label>
              <input id="atv-atores" className={campo} value={form.atores} onChange={set("atores")} placeholder="Quem participou" />
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-resultados">
                O que essa atividade revelou ou produziu?
              </label>
              <textarea id="atv-resultados" className={campo} rows={2} value={form.resultados} onChange={set("resultados")} />
            </div>
            <div>
              <span className={rotuloCls}>Evidências</span>
              <div className="space-y-2">
                <label className="tap flex min-w-0 cursor-pointer items-center justify-center gap-2 break-words rounded-xl border border-dashed border-border/80 bg-surface/50 px-3.5 py-3 text-center text-sm text-muted-foreground [overflow-wrap:anywhere]">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFoto(e.target.files?.[0]?.name)}
                  />
                  {foto ? `📷 ${foto}` : "📷 Anexar foto"}
                </label>
                <label className="tap flex min-w-0 cursor-pointer items-center justify-center gap-2 break-words rounded-xl border border-dashed border-border/80 bg-surface/50 px-3.5 py-3 text-center text-sm text-muted-foreground [overflow-wrap:anywhere]">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => setDocumento(e.target.files?.[0]?.name)}
                  />
                  {documento ? `📎 ${documento}` : "📎 Anexar documento"}
                </label>
                <input
                  className={campo}
                  value={form.evidenciaLink}
                  onChange={set("evidenciaLink")}
                  placeholder="🔗 Link (notícia, publicação, vídeo)"
                  aria-label="Link de evidência"
                />
              </div>
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-observacoes">Observações</label>
              <textarea id="atv-observacoes" className={campo} rows={2} value={form.observacoes} onChange={set("observacoes")} />
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-localizacao">
                Localização geográfica (opcional)
              </label>
              <input
                id="atv-localizacao"
                className={campo}
                value={form.localizacao}
                onChange={set("localizacao")}
                placeholder="Coordenadas ou ponto de referência"
              />
              <p className="mt-1 text-[0.66rem] text-muted-foreground">
                Preparado para integração territorial futura com o mapa.
              </p>
            </div>

            <button
              type="submit"
              disabled={!valido}
              className="tap panel-glow w-full rounded-2xl bg-primary px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              ENVIAR REGISTRO
            </button>
            <p className="text-center text-[0.68rem] text-muted-foreground">
              {tipo && tipo.fontes.length > 0
                ? "O sistema calcula sozinho o progresso das missões a partir deste registro."
                : "O registro fica no seu histórico; a Coordenação define quais indicadores ele alimenta."}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/** Feedback útil: o que o registro poderá alimentar e em que status está. */
function FeedbackRegistro({
  resultado,
  onClose,
}: {
  resultado: ResultadoRegistro;
  onClose: () => void;
}) {
  const { atividade, missoesRelacionadas } = resultado;
  const tipo = tipoAtividadeMap[atividade.tipoId];
  const emValidacao = atividade.status === "em_validacao";

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4">
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-emerald-200">
          <Check className="h-4 w-4" /> ATIVIDADE REGISTRADA
        </p>
        <p className="mt-2 text-sm font-semibold">
          {tipo?.icone} {tipo?.rotulo}
        </p>
        <p className="break-words text-sm [overflow-wrap:anywhere]">{atividade.titulo}</p>
        {atividade.municipio ? (
          <p className="text-[0.72rem] text-muted-foreground">{atividade.municipio}</p>
        ) : null}
      </div>

      {missoesRelacionadas.length > 0 ? (
        <div>
          <p className="text-[0.68rem] uppercase tracking-wide text-muted-foreground">
            Esta atividade poderá contribuir para:
          </p>
          <ul className="mt-2 space-y-1.5">
            {missoesRelacionadas.map((m) => (
              <li key={m.id} className="break-words rounded-xl border border-border/60 bg-surface/60 px-3 py-2 text-sm [overflow-wrap:anywhere]">
                {m.icone} {m.titulo}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[0.72rem] text-muted-foreground">
          Registro guardado no seu histórico de atividades do território.
        </p>
      )}

      <div className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 text-[0.74rem] text-muted-foreground">
        <p>
          Status:{" "}
          <span className={emValidacao ? "font-semibold text-glow" : "font-semibold text-emerald-200"}>
            {emValidacao ? "Em validação" : "Aprovada"}
          </span>
        </p>
        <p className="mt-1">
          {emValidacao
            ? "Quando validada, a missão e o progresso do Núcleo são atualizados automaticamente."
            : "O progresso da missão e do Núcleo já foi atualizado automaticamente."}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="tap w-full rounded-2xl border border-border/70 bg-surface/60 px-5 py-3 font-display text-sm font-semibold"
      >
        Fechar
      </button>
    </div>
  );
}
