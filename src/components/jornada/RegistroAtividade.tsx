import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { criarEnvioUnico, errosFormulario, formularioAlterado, vinculoRegistro, type ErrosFormulario, type FormularioAtividade } from "./registroAtividadeFormulario";
import { Camera, Check, FileText, Link as LinkIcon, MapPin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tipoAtividadeMap, tiposAtividade } from "@/data/atividades.config";
import { AjudaInovacao } from "@/components/jornada/AjudaInovacao";
import { useMeuNucleo, type ResultadoRegistro } from "@/context/meuNucleoBase";
import { missaoTerritorialMap } from "@/data/missoes.config";
import {
  RegistroAtividadeContext as Ctx,
  useRegistroAtividade,
  type PresetRegistroAtividade as Preset,
} from "@/components/jornada/registroAtividadeBase";

// O hook e o contexto vivem em `registroAtividadeBase.ts` para este arquivo
// exportar apenas componentes — compatível com Fast Refresh.

/**
 * Porta de entrada única do trabalho real: um só sistema de registro de
 * atividade, usado pelo CTA principal e pelos CTAs contextuais das missões.
 */
export function RegistroAtividadeProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<Preset | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const abrir = useCallback((p?: Preset) => {
    origem.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPreset(p ?? {});
  }, []);
  const value = useMemo(() => ({ abrir }), [abrir]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {preset ? <ModalAtividade preset={preset} origem={origem.current} onClose={() => setPreset(null)} /> : null}
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
    <Button
      type="button"
      onClick={() => abrir()}
      className={`tap inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ${
        variante === "solido"
          ? "panel-glow bg-primary text-primary-foreground"
          : "border border-border/70 bg-surface/60 text-foreground"
      } ${className}`}
    >
      <Plus className="h-4 w-4" strokeWidth={2.4} />
      {rotulo}
    </Button>
  );
}

/** Atalho fixo no mobile, acima da navegação inferior (uso em campo). */
export function AcaoFlutuanteAtividade() {
  const { abrir } = useRegistroAtividade();
  return (
    <Button
      type="button"
      onClick={() => abrir()}
      aria-label="Registrar atividade"
      className="tap panel-glow fixed right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg lg:hidden"
      style={{ bottom: "calc(5.75rem + env(safe-area-inset-bottom))" }}
    >
      <Plus className="h-4 w-4" strokeWidth={2.6} />
      Registrar atividade
    </Button>
  );
}

const campo =
  "w-full rounded-md border border-border/80 bg-surface px-3.5 py-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10";
const rotuloCls = "mb-1 block text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground";

function ModalAtividade({ preset, origem, onClose }: { preset: Preset; origem: HTMLElement | null; onClose: () => void }) {
  const { registrarAtividade } = useMeuNucleo();
  const missaoOrigem = preset.missaoId ? missaoTerritorialMap[preset.missaoId] : undefined;
  const novoRelatorio = preset.tipoId === "relatorio";
  const [resultado, setResultado] = useState<ResultadoRegistro | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const [inicial] = useState<FormularioAtividade>(() => ({
    tipoId: preset.tipoId ?? tiposAtividade[0]?.id ?? "",
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
  }));
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [confirmarDescarte, setConfirmarDescarte] = useState(false);
  const [opcionaisAbertos, setOpcionaisAbertos] = useState(false);
  const formularioRef = useRef<HTMLFormElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const envioUnico = useRef(criarEnvioUnico());
  const processando = useRef(false);
  const [foto, setFoto] = useState<string | undefined>();
  const [documento, setDocumento] = useState<string | undefined>();

  const solicitarFechamento = () => {
    if (processando.current) return;
    if (!resultado && formularioAlterado(form, inicial, foto, documento)) {
      setConfirmarDescarte(true);
    } else onClose();
  };

  useEffect(() => {
    if (resultado) tituloRef.current?.focus();
  }, [resultado]);

  const set = (nome: keyof FormularioAtividade) => (e: { target: { value: string } }) => {
    const proximo = { ...form, [nome]: e.target.value };
    setForm(proximo);
    if (erros[nome]) setErros((anteriores) => ({ ...anteriores, [nome]: errosFormulario(proximo)[nome] }));
  };
  const atributos = (nome: keyof FormularioAtividade) => ({
    "aria-invalid": Boolean(erros[nome]),
    "aria-describedby": erros[nome] ? `atv-${nome}-erro` : undefined,
    onBlur: () => setErros((anteriores) => ({ ...anteriores, [nome]: errosFormulario(form)[nome] })),
  });
  const erroCampo = (nome: keyof FormularioAtividade) => erros[nome]
    ? <p id={`atv-${nome}-erro`} role="alert" className="mt-1 text-sm text-destructive">{erros[nome]}</p> : null;

  const tipo = tipoAtividadeMap[form.tipoId];

  return (
    <Dialog open onOpenChange={(aberto) => { if (!aberto) solicitarFechamento(); }}>
      <DialogPortal>
        <DialogOverlay className="bg-brand-dark/65 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="panel panel-glow fixed bottom-0 left-0 z-50 max-h-[calc(100dvh-env(safe-area-inset-top))] w-full min-w-0 overflow-x-hidden overflow-y-auto rounded-t-lg px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[92dvh] sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6"
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => { e.preventDefault(); formularioRef.current?.querySelector<HTMLElement>("select")?.focus(); }}
          onCloseAutoFocus={(e) => { e.preventDefault(); origem?.focus(); }}
          onEscapeKeyDown={(e) => { e.preventDefault(); solicitarFechamento(); }}
          onPointerDownOutside={(e) => { e.preventDefault(); solicitarFechamento(); }}
        >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
              {resultado ? "Registro enviado" : novoRelatorio ? "Entrega formal do Conector" : "Trabalho realizado no território"}
            </p>
            <DialogPrimitive.Title ref={tituloRef} tabIndex={-1} className="break-words font-display text-lg font-semibold [overflow-wrap:anywhere]">
              {resultado ? (novoRelatorio ? "Relatório enviado" : "Atividade registrada") : novoRelatorio ? "Novo Relatório" : "Registrar atividade"}
            </DialogPrimitive.Title>
            {missaoOrigem && !resultado ? (
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                A partir da missão: {missaoOrigem.icone} {missaoOrigem.titulo}
              </p>
            ) : null}
          </div>
           <Button
            type="button"
            onClick={solicitarFechamento}
            disabled={enviando}
            aria-label="Fechar"
             variant="outline"
             size="icon"
             className="tap rounded-full text-muted-foreground"
          >
            <X className="h-4 w-4" />
           </Button>
        </div>

        {resultado ? (
          <FeedbackRegistro resultado={resultado} onClose={onClose} />
        ) : (
          <form ref={formularioRef} noValidate aria-busy={enviando}
            className="mt-4 space-y-3.5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (processando.current) return;
              const atuais = errosFormulario(form);
              setErros(atuais);
              if (Object.keys(atuais).length) {
                if (Object.keys(atuais).some((campo) => !["tipoId", "data", "titulo", "descricao"].includes(campo))) setOpcionaisAbertos(true);
                requestAnimationFrame(() => formularioRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
                return;
              }
              processando.current = true;
              setEnviando(true);
              setErroEnvio(null);
              try {
                const salvo = await envioUnico.current(() => registrarAtividade({
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
                }));
                if (salvo) setResultado(salvo);
              } catch (error) {
                setErroEnvio(error instanceof Error ? error.message : "Não foi possível enviar o registro.");
              } finally {
                processando.current = false;
                setEnviando(false);
              }
            }}
          >
            <div>
              <label className={rotuloCls} htmlFor="atv-tipo">Tipo de atividade (obrigatório)</label>
              <select id="atv-tipo" className={campo} value={form.tipoId} onChange={set("tipoId")} {...atributos("tipoId")}>
                {tiposAtividade.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icone} {t.rotulo}
                  </option>
                ))}
              </select>{erroCampo("tipoId")}
            </div>
            {form.tipoId === "identificacao_iniciativa" ? <AjudaInovacao className="pt-0.5" /> : null}
              <div>
                <label className={rotuloCls} htmlFor="atv-data">Data (obrigatório)</label>
                <input id="atv-data" type="date" className={campo} value={form.data} onChange={set("data")} {...atributos("data")} required />{erroCampo("data")}
              </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-titulo">Título da atividade (obrigatório)</label>
              <input id="atv-titulo" className={campo} maxLength={500} value={form.titulo} onChange={set("titulo")} {...atributos("titulo")} required />{erroCampo("titulo")}
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-descricao">O que foi realizado? (obrigatório)</label>
              <textarea id="atv-descricao" className={campo} rows={3} maxLength={10000} value={form.descricao} onChange={set("descricao")} {...atributos("descricao")} required />{erroCampo("descricao")}
            </div>
            <details open={opcionaisAbertos} onToggle={(e) => setOpcionaisAbertos(e.currentTarget.open)} className="border-y border-border py-3">
              <summary className="cursor-pointer py-2 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-ring">Informações adicionais (opcionais)</summary>
              <div className="mt-3 space-y-3.5">
              <div>
                <label className={rotuloCls} htmlFor="atv-municipio">Município (opcional)</label>
                <input id="atv-municipio" className={campo} maxLength={500} value={form.municipio} onChange={set("municipio")} {...atributos("municipio")} placeholder="Ex.: Serra" />{erroCampo("municipio")}
              </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-local">Local (opcional)</label>
              <input id="atv-local" className={campo} maxLength={1000} value={form.local} onChange={set("local")} {...atributos("local")} placeholder="Bairro, instituição ou ponto de encontro" />{erroCampo("local")}
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-atores">Atores envolvidos (opcional)</label>
              <input id="atv-atores" className={campo} maxLength={5000} value={form.atores} onChange={set("atores")} {...atributos("atores")} placeholder="Quem participou" />{erroCampo("atores")}
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-resultados">O que essa atividade revelou ou produziu? (opcional)</label>
              <textarea id="atv-resultados" className={campo} rows={2} maxLength={10000} value={form.resultados} onChange={set("resultados")} {...atributos("resultados")} />{erroCampo("resultados")}
            </div>
            <div>
              <span className={rotuloCls}>Referências de evidências (opcionais)</span>
              <p id="atv-arquivos-aviso" className="text-sm text-muted-foreground">Somente o nome do arquivo será registrado. O conteúdo da foto ou documento não será enviado nem armazenado.</p>
              <div className="space-y-2">
                <label className="tap flex min-w-0 focus-within:ring-2 focus-within:ring-ring cursor-pointer items-center justify-center gap-2 break-words rounded-md border border-dashed border-primary/30 bg-primary/5 px-3.5 py-4 text-center text-sm text-muted-foreground [overflow-wrap:anywhere]">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-describedby="atv-arquivos-aviso"
                    onChange={(e) => setFoto(e.target.files?.[0]?.name)}
                  />
                   <Camera className="h-4 w-4 text-primary" /> {foto ? foto : "Selecionar nome de foto (opcional)"}
                </label>
                <label className="tap flex min-w-0 focus-within:ring-2 focus-within:ring-ring cursor-pointer items-center justify-center gap-2 break-words rounded-md border border-dashed border-primary/30 bg-primary/5 px-3.5 py-4 text-center text-sm text-muted-foreground [overflow-wrap:anywhere]">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    aria-describedby="atv-arquivos-aviso"
                    onChange={(e) => setDocumento(e.target.files?.[0]?.name)}
                  />
                   <FileText className="h-4 w-4 text-primary" /> {documento ? documento : "Selecionar nome de documento (opcional)"}
                </label>
                <label className={rotuloCls} htmlFor="atv-link">Link de evidência (opcional)</label>
                <input id="atv-link"
                  className={campo}
                  maxLength={2048} value={form.evidenciaLink}
                  onChange={set("evidenciaLink")} {...atributos("evidenciaLink")}
                   placeholder="Link de notícia, publicação ou vídeo"
                  aria-label="Link de evidência"
                />{erroCampo("evidenciaLink")}
              </div>
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-observacoes">Observações (opcional)</label>
              <textarea id="atv-observacoes" className={campo} rows={2} maxLength={10000} value={form.observacoes} onChange={set("observacoes")} {...atributos("observacoes")} />{erroCampo("observacoes")}
            </div>
            <div>
              <label className={rotuloCls} htmlFor="atv-localizacao">Localização geográfica (opcional)</label>
               <div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-primary" /><input id="atv-localizacao" className={`${campo} pl-9`} maxLength={1000} value={form.localizacao} onChange={set("localizacao")} {...atributos("localizacao")} placeholder="Coordenadas ou ponto de referência" />{erroCampo("localizacao")}</div>
              <p className="mt-1 text-[0.66rem] text-muted-foreground">
                Coordenadas ou referência geográfica do local da atividade.
              </p>
            </div>

              </div>
            </details>

            <Button
              type="submit"
              disabled={enviando}
              className="tap panel-glow h-auto w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? "ENVIANDO…" : novoRelatorio ? "ENVIAR RELATÓRIO" : "ENVIAR REGISTRO"}
            </Button>
            {erroEnvio ? <p role="alert" className="text-center text-sm text-destructive">{erroEnvio}</p> : null}
            <p className="text-center text-[0.68rem] text-muted-foreground">
              {tipo && tipo.fontes.length > 0
                ? "O sistema calcula sozinho o progresso das missões a partir deste registro."
                : "O registro fica no seu histórico; sem contribuição configurada para uma missão."}
            </p>
          </form>
        )}
        </DialogPrimitive.Content>
      </DialogPortal>
      <AlertDialog open={confirmarDescarte} onOpenChange={setConfirmarDescarte}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-lg sm:max-w-md">
          <AlertDialogTitle>Descartar preenchimento?</AlertDialogTitle>
          <AlertDialogDescription>Os dados preenchidos serão perdidos. Nenhuma atividade foi enviada.</AlertDialogDescription>
          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialogCancel>Continuar preenchendo</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>Descartar</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
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
  const { atividade } = resultado;
  const vinculo = vinculoRegistro(atividade);
  const tipo = tipoAtividadeMap[atividade.tipoId];
  const emValidacao = atividade.status === "em_validacao";

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
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

      {vinculo ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Missão vinculada: <strong className="text-foreground">{vinculo.missao.icone} {vinculo.missao.titulo}</strong></p>
          <p className="text-sm text-muted-foreground">Movimento: <strong className="text-foreground">{vinculo.movimento}</strong></p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhuma missão contabilizada neste registro. A atividade permanece no seu histórico.</p>
      )}
      {atividade.evidenciaFoto || atividade.evidenciaDocumento ? <p className="text-sm text-muted-foreground">Apenas os nomes dos arquivos foram registrados; seus conteúdos não foram enviados.</p> : null}

      <div className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 text-[0.74rem] text-muted-foreground">
        <p>
          Status:{" "}
          <span className={emValidacao ? "font-semibold text-glow" : "font-semibold text-emerald-700"}>
            {emValidacao ? "Em validação" : "Aprovada"}
          </span>
        </p>
        <p className="mt-1">
          {!vinculo ? "Sem contribuição contabilizada para o progresso das missões." : emValidacao
            ? "Quando validada, a missão e o progresso do Núcleo são atualizados automaticamente."
            : "O progresso da missão e do Núcleo já foi atualizado automaticamente."}
        </p>
      </div>

      <Button
        type="button"
        onClick={onClose}
        variant="outline"
        className="tap h-auto w-full rounded-full px-5 py-3 text-sm font-semibold"
      >
        Fechar
      </Button>
    </div>
  );
}
