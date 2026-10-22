import { z } from "zod";
import { tipoAtividadeMap } from "@/data/atividades.config";
import { missaoTerritorialMap } from "@/data/missoes.config";
import { movimentoDaMissao, nomeMovimento } from "@/data/movimentos";
import type { AtividadeRegistrada } from "@/types";

const texto = (limite: number) => z.string().max(limite, `Use até ${limite} caracteres.`);
const obrigatorio = (mensagem: string, limite: number) => texto(limite).refine((v) => v.trim().length > 0, mensagem);

export const registroFormularioSchema = z.object({
  tipoId: z.string().refine((id) => Boolean(tipoAtividadeMap[id]), "Selecione um tipo de atividade."),
  data: z.string().refine((v) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const data = new Date(`${v}T00:00:00Z`);
    return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === v;
  }, "Informe uma data válida."),
  titulo: obrigatorio("Informe o título da atividade.", 500),
  descricao: obrigatorio("Descreva o que foi realizado.", 10000),
  municipio: texto(500),
  local: texto(1000),
  atores: texto(5000),
  resultados: texto(10000),
  observacoes: texto(10000),
  localizacao: texto(1000),
  evidenciaLink: texto(2048).refine((v) => {
    if (!v) return true;
    try { return ["http:", "https:"].includes(new URL(v).protocol); } catch { return false; }
  }, "Informe um link completo iniciado por https:// ou http://."),
});

export type FormularioAtividade = z.infer<typeof registroFormularioSchema>;
export type ErrosFormulario = Partial<Record<keyof FormularioAtividade, string>>;

export function errosFormulario(form: FormularioAtividade): ErrosFormulario {
  const resultado = registroFormularioSchema.safeParse(form);
  if (resultado.success) return {};
  return Object.fromEntries(resultado.error.issues.map((erro) => [erro.path[0], erro.message]));
}

export function formularioAlterado(form: FormularioAtividade, inicial: FormularioAtividade, foto?: string, documento?: string) {
  return Boolean(foto || documento || Object.keys(inicial).some((chave) => {
    const campo = chave as keyof FormularioAtividade;
    return form[campo] !== inicial[campo];
  }));
}

/** Apenas apresenta o vínculo consumido pelo progresso existente; não associa missões. */
export function vinculoRegistro(atividade: Pick<AtividadeRegistrada, "missaoId" | "missoesRelacionadas" | "fonteContribuicao">) {
  if (!atividade.fonteContribuicao) return undefined;
  const id = atividade.missaoId ?? atividade.missoesRelacionadas[0];
  const missao = id ? missaoTerritorialMap[id] : undefined;
  const movimento = id ? movimentoDaMissao(id) : undefined;
  if (!missao || !movimento) return undefined;
  return { missao, movimento: nomeMovimento[movimento] };
}

/** Trava síncrona da interface, liberada também após falha. */
export function criarEnvioUnico() {
  let ocupado = false;
  return async function executar<T>(enviar: () => Promise<T>): Promise<T | undefined> {
    if (ocupado) return undefined;
    ocupado = true;
    try { return await enviar(); } finally { ocupado = false; }
  };
}