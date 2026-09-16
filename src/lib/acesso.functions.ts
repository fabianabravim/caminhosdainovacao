import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const emailSchema = z.string().trim().email().transform((email) => email.toLowerCase());

export const verificarAcessoAutorizado = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ email: emailSchema }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: autorizado } = await supabaseAdmin
      .from("conectores_autorizados")
      .select("nome")
      .eq("email", data.email)
      .eq("ativo", true)
      .maybeSingle();

    return { autorizado: Boolean(autorizado), nome: autorizado?.nome ?? null };
  });

export const vincularPerfilAutorizado = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: authData, error: authError } = await context.supabase.auth.getUser();
    const email = authData.user?.email?.trim().toLowerCase();
    if (authError || !email) throw new Error("Não foi possível confirmar a identidade do acesso.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existente } = await supabaseAdmin
      .from("perfis")
      .select("user_id, ativo")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (existente) {
      if (!existente.ativo) throw new Error("Este acesso está inativo.");
      return { vinculado: true };
    }

    const { data: autorizado, error: autorizadoError } = await supabaseAdmin
      .from("conectores_autorizados")
      .select("id, nome, email, nucleo_id, role, demonstrativo, claimed_by")
      .eq("email", email)
      .eq("ativo", true)
      .maybeSingle();

    if (autorizadoError || !autorizado) throw new Error("Este e-mail não está autorizado para a Jornada.");
    if (autorizado.claimed_by && autorizado.claimed_by !== context.userId) {
      throw new Error("Este acesso já está vinculado a outra conta.");
    }

    const { error: perfilError } = await supabaseAdmin.from("perfis").insert({
      user_id: context.userId,
      nome: autorizado.nome,
      email: autorizado.email,
      nucleo_id: autorizado.nucleo_id,
      demonstrativo: autorizado.demonstrativo,
    });
    if (perfilError) throw new Error("Não foi possível criar o perfil autorizado.");

    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: context.userId,
      role: autorizado.role,
    });
    if (roleError) {
      await supabaseAdmin.from("perfis").delete().eq("user_id", context.userId);
      throw new Error("Não foi possível concluir o vínculo do perfil.");
    }

    const { error: claimError } = await supabaseAdmin
      .from("conectores_autorizados")
      .update({ claimed_by: context.userId, claimed_at: new Date().toISOString() })
      .eq("id", autorizado.id)
      .is("claimed_by", null);
    if (claimError) throw new Error("Não foi possível concluir a ativação do acesso.");

    return { vinculado: true };
  });