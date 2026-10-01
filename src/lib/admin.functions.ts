import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const papelSchema = z.enum(["CONECTOR", "COORDENACAO", "ADMINISTRADOR"]);
type Ctx = { supabase: { from: (t: "user_roles") => any }; userId: string };

/** Confirma no servidor que quem chama é Administrador (lido da tabela de papéis, com RLS). */
async function exigirAdministrador(context: Ctx) {
  const { data, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  if (error || !(data ?? []).some((r: { role: string }) => r.role === "ADMINISTRADOR")) {
    throw new Error("Acesso restrito à Administração.");
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const souAdministrador = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return { admin: (data ?? []).some((r) => r.role === "ADMINISTRADOR") };
  });

export const listarUsuarios = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await exigirAdministrador(context);
    const [aut, perfis, roles, nucleos] = await Promise.all([
      admin.from("conectores_autorizados").select("id,nome,email,nucleo_id,role,ativo,demonstrativo,claimed_by,claimed_at,created_at").order("nome"),
      admin.from("perfis").select("user_id,nome,email,nucleo_id,ativo,created_at"),
      admin.from("user_roles").select("user_id,role"),
      admin.from("nucleos_territoriais").select("id,nome").order("nome"),
    ]);
    if (aut.error || perfis.error || roles.error || nucleos.error) throw new Error("Não foi possível carregar os usuários.");
    const usuarios = (aut.data ?? []).map((a) => {
      const perfil = a.claimed_by ? perfis.data?.find((p) => p.user_id === a.claimed_by) : undefined;
      const role = a.claimed_by ? roles.data?.find((r) => r.user_id === a.claimed_by)?.role : undefined;
      return {
        id: a.id,
        userId: a.claimed_by,
        nome: perfil?.nome ?? a.nome,
        email: a.email,
        nucleoId: perfil ? perfil.nucleo_id : a.nucleo_id,
        papel: role ?? a.role,
        ativo: a.ativo && (perfil ? perfil.ativo : true),
        demonstrativo: a.demonstrativo,
        acessoCriado: Boolean(a.claimed_by),
        criadoEm: a.created_at,
        souEu: a.claimed_by === context.userId,
      };
    });
    return { usuarios, nucleos: nucleos.data ?? [] };
  });

export const salvarUsuario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    id: z.string().uuid().optional(),
    nome: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255).transform((e) => e.toLowerCase()),
    papel: papelSchema,
    nucleoId: z.string().max(60).nullable(),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await exigirAdministrador(context);
    if (data.nucleoId) {
      const { data: n } = await admin.from("nucleos_territoriais").select("id").eq("id", data.nucleoId).maybeSingle();
      if (!n) throw new Error("Núcleo Territorial inválido.");
    }
    if (!data.id) {
      const { data: existe } = await admin.from("conectores_autorizados").select("id").eq("email", data.email).maybeSingle();
      if (existe) throw new Error("Este e-mail já está cadastrado.");
      const { error } = await admin.from("conectores_autorizados").insert({ nome: data.nome, email: data.email, role: data.papel, nucleo_id: data.nucleoId, demonstrativo: false, ativo: true });
      if (error) throw new Error("Não foi possível autorizar o usuário.");
      return { ok: true };
    }
    const { data: atual } = await admin.from("conectores_autorizados").select("id,email,role,claimed_by").eq("id", data.id).maybeSingle();
    if (!atual) throw new Error("Usuário não encontrado.");
    if (atual.claimed_by === context.userId && data.papel !== "ADMINISTRADOR") {
      throw new Error("Você não pode alterar o seu próprio papel de Administrador.");
    }
    if (atual.claimed_by && data.email !== atual.email) throw new Error("O e-mail de um acesso já criado não pode ser alterado.");
    const { error } = await admin.from("conectores_autorizados").update({ nome: data.nome, email: data.email, role: data.papel, nucleo_id: data.nucleoId }).eq("id", data.id);
    if (error) throw new Error("Não foi possível salvar as alterações.");
    if (atual.claimed_by) {
      await admin.from("perfis").update({ nome: data.nome, nucleo_id: data.nucleoId }).eq("user_id", atual.claimed_by);
      await admin.from("user_roles").delete().eq("user_id", atual.claimed_by);
      const { error: rErr } = await admin.from("user_roles").insert({ user_id: atual.claimed_by, role: data.papel });
      if (rErr) throw new Error("Não foi possível atualizar o papel.");
    }
    return { ok: true };
  });

export const alterarStatusUsuario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), ativo: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await exigirAdministrador(context);
    const { data: atual } = await admin.from("conectores_autorizados").select("claimed_by").eq("id", data.id).maybeSingle();
    if (!atual) throw new Error("Usuário não encontrado.");
    if (atual.claimed_by === context.userId) throw new Error("Você não pode desativar o seu próprio acesso.");
    await admin.from("conectores_autorizados").update({ ativo: data.ativo }).eq("id", data.id);
    if (atual.claimed_by) {
      await admin.from("perfis").update({ ativo: data.ativo }).eq("user_id", atual.claimed_by);
      await admin.auth.admin.updateUserById(atual.claimed_by, { ban_duration: data.ativo ? "none" : "876000h" });
    }
    return { ok: true };
  });

export const enviarRedefinicaoSenha = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), origem: z.string().url() }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await exigirAdministrador(context);
    const { data: atual } = await admin.from("conectores_autorizados").select("email,claimed_by,ativo").eq("id", data.id).maybeSingle();
    if (!atual) throw new Error("Usuário não encontrado.");
    if (!atual.ativo) throw new Error("Ative o acesso antes de enviar a redefinição.");
    if (!atual.claimed_by) return { tipo: "primeiro_acesso" as const };
    const origem = new URL(data.origem).origin;
    const { error } = await admin.auth.resetPasswordForEmail(atual.email, { redirectTo: `${origem}/reset-password` });
    if (error) throw new Error("Não foi possível enviar o e-mail de redefinição.");
    return { tipo: "redefinicao" as const };
  });

/** Exceções: contas de teste/institucionais cuja senha é definida pelo Administrador. */
const CONTAS_SENHA_ADMIN: Record<string, "COORDENACAO" | "CONECTOR"> = {
  "projeto.caminhosdainovacao@gmail.com": "COORDENACAO",
  "conector.caminhosdainovacao@gmail.com": "CONECTOR",
};

export const definirSenhaCoordenacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), senha: z.string().min(10).max(72) }).parse(d))
  .handler(async ({ data, context }) => {
    const admin = await exigirAdministrador(context);
    const { data: a } = await admin.from("conectores_autorizados").select("id,nome,email,nucleo_id,role,ativo,demonstrativo,claimed_by").eq("id", data.id).maybeSingle();
    const papelPermitido = a ? CONTAS_SENHA_ADMIN[a.email] : undefined;
    if (!a || !papelPermitido || a.role !== papelPermitido) {
      throw new Error("Esta ação é permitida somente para as contas institucionais de teste.");
    }
    if (!a.ativo) throw new Error("Ative o acesso antes de definir a senha.");

    let userId = a.claimed_by as string | null;
    if (!userId) {
      for (let page = 1; page <= 10 && !userId; page++) {
        const { data: lista, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) throw new Error("Não foi possível consultar as contas de acesso.");
        userId = lista.users.find((u) => u.email?.toLowerCase() === a.email)?.id ?? null;
        if (lista.users.length < 200) break;
      }
    }

    if (userId) {
      // Também sincroniza o e-mail de autenticação com o cadastro autorizado.
      const { error } = await admin.auth.admin.updateUserById(userId, { email: a.email, password: data.senha, email_confirm: true });
      if (error) throw new Error(error.message?.toLowerCase().includes("weak") ? "Senha muito fraca. Use letras, números e símbolos." : "Não foi possível definir a senha.");
    } else {
      const { data: criado, error } = await admin.auth.admin.createUser({ email: a.email, password: data.senha, email_confirm: true });
      if (error || !criado.user) throw new Error(error?.message?.toLowerCase().includes("weak") ? "Senha muito fraca. Use letras, números e símbolos." : "Não foi possível criar o acesso.");
      userId = criado.user.id;
    }

    if (!a.claimed_by) {
      const { data: perfil } = await admin.from("perfis").select("user_id").eq("user_id", userId).maybeSingle();
      if (!perfil) {
        const { error } = await admin.from("perfis").insert({ user_id: userId, nome: a.nome, email: a.email, nucleo_id: a.nucleo_id, demonstrativo: a.demonstrativo });
        if (error) throw new Error("Não foi possível criar o perfil.");
      }
      await admin.from("user_roles").delete().eq("user_id", userId);
      const { error: rErr } = await admin.from("user_roles").insert({ user_id: userId, role: papelPermitido });
      if (rErr) throw new Error("Não foi possível atribuir o papel.");
      await admin.from("conectores_autorizados").update({ claimed_by: userId, claimed_at: new Date().toISOString() }).eq("id", a.id);
    } else {
      await admin.from("perfis").update({ email: a.email }).eq("user_id", userId);
    }
    return { ok: true };
  });
