import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { MapaVivo } from "@/components/MapaVivo";
import { Button } from "@/components/ui/button";
import { conexoes } from "@/data/nucleos";
import { totaisEstado } from "@/data/ranking";
import { supabase } from "@/integrations/supabase/client";
import { verificarAcessoAutorizado, vincularPerfilAutorizado } from "@/lib/acesso.functions";

const searchSchema = z.object({ retorno: z.string().optional().catch(undefined) });

export const Route = createFileRoute("/entrar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar — Caminhos da Inovação" },
      { name: "description", content: "Acesso institucional dos conectores territoriais à plataforma Caminhos da Inovação do IJSN e do Governo do Espírito Santo." },
      { property: "og:title", content: "Entrar na Jornada da Inovação Capixaba" },
      { property: "og:description", content: "Acesso dos conectores territoriais dos 14 Núcleos Territoriais do ES." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Entrar,
});

type Modo = "escolha" | "entrar" | "primeiro" | "recuperar";

function caminhoSeguro(retorno?: string) {
  if (!retorno || !retorno.startsWith("/") || retorno.startsWith("//")) return "/jornada";
  return retorno;
}

function mensagemErroPrimeiroAcesso(error: { code: unknown; message: string }) {
  if (error.code === "weak_password" || error.message?.toLowerCase().includes("weak")) {
    return "Esta senha é muito comum e foi bloqueada por segurança. Crie outra senha, combinando letras maiúsculas e minúsculas, números e símbolos.";
  }
  if (error.code === "user_already_exists") {
    return "Este e-mail já possui acesso. Volte e use a opção Entrar na jornada.";
  }
  return "Não foi possível concluir o primeiro acesso. Verifique os dados informados.";
}

function Entrar() {
  const navigate = useNavigate({ from: "/entrar" });
  const { retorno } = Route.useSearch();
  const [modo, setModo] = useState<Modo>("escolha");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: caminhoSeguro(retorno) });
    });
  }, [navigate, retorno]);

  function mudarModo(novo: Modo) {
    setModo(novo);
    setSenha("");
    setConfirmacao("");
    setErro(null);
    setMensagem(null);
  }

  async function entrar() {
    setCarregando(true);
    setErro(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) throw new Error("E-mail ou senha inválidos, ou acesso ainda não confirmado.");
      await vincularPerfilAutorizado();
      await navigate({ to: caminhoSeguro(retorno), replace: true });
    } catch (error) {
      await supabase.auth.signOut();
      setErro(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  }

  async function primeiroAcesso() {
    if (senha.length < 8) {
      setErro("Crie uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As senhas informadas não coincidem.");
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const acesso = await verificarAcessoAutorizado({ data: { email } });
      if (!acesso.autorizado) throw new Error("Este e-mail ainda não foi autorizado para a Jornada.");
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: { emailRedirectTo: `${window.location.origin}/entrar` },
      });
      if (error) throw new Error(mensagemErroPrimeiroAcesso(error));
      if (!data.session) {
        setMensagem("Confira seu e-mail e confirme o acesso. Depois, volte para entrar na Jornada.");
        return;
      }
      await vincularPerfilAutorizado();
      await navigate({ to: "/jornada", replace: true });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível concluir o primeiro acesso.");
    } finally {
      setCarregando(false);
    }
  }

  async function recuperarSenha() {
    setCarregando(true);
    setErro(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMensagem("Se o e-mail estiver cadastrado, você receberá as instruções para criar uma nova senha.");
    } catch {
      setErro("Não foi possível solicitar a recuperação agora.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <div className="absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2">
          <MapaVivo conexoes={conexoes} labels={false} interativo={false} particulas />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-lilac/80">IJSN · Governo do Espírito Santo</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05]"><span className="text-gradient">Caminhos</span><br />da Inovação</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">A jornada da inovação capixaba: inteligência territorial construída com escuta, conexões e transformação nos 14 Núcleos Territoriais.</p>
        </div>

        <div className="panel panel-glow rounded-3xl p-5">
          {modo === "escolha" ? (
            <>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[[totaisEstado.nucleos, "núcleos"], [totaisEstado.escutas, "escutas"], [totaisEstado.inovacoes, "inovações"]].map(([v, l]) => (
                  <div key={l as string}><p className="font-display text-lg font-semibold">{v}</p><p className="text-[0.62rem] uppercase tracking-wide text-muted-foreground">{l}</p></div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-border/60 bg-surface/60 p-3.5">
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Vínculo territorial</p>
                <p className="mt-1 font-display text-lg font-semibold">Seu Núcleo Territorial</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Será identificado automaticamente após o acesso do Conector.</p>
              </div>
              <Button type="button" onClick={() => mudarModo("entrar")} className="panel-glow mt-5 h-auto w-full rounded-2xl px-5 py-3.5 font-display text-sm font-semibold">Entrar na jornada</Button>
              <Button type="button" variant="outline" onClick={() => mudarModo("primeiro")} className="mt-2 h-auto w-full rounded-2xl border-border/70 bg-surface/60 px-5 py-3 text-xs font-semibold text-lilac">Primeiro acesso</Button>
            </>
          ) : (
            <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void (modo === "entrar" ? entrar() : modo === "primeiro" ? primeiroAcesso() : recuperarSenha()); }}>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">{modo === "entrar" ? "Acesso do Conector" : modo === "primeiro" ? "Ativar acesso" : "Recuperar acesso"}</p>
                <h2 className="mt-1 font-display text-xl font-semibold">{modo === "entrar" ? "Entrar na Jornada" : modo === "primeiro" ? "Primeiro acesso" : "Esqueci minha senha"}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{modo === "entrar" ? "Use o e-mail e a senha cadastrados." : modo === "primeiro" ? "Use seu e-mail previamente autorizado e crie sua senha." : "Informe seu e-mail para receber as instruções de recuperação."}</p>
              </div>
              <label className="block text-xs font-semibold text-muted-foreground">E-mail
                <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
              </label>
              {modo !== "recuperar" ? <label className="block text-xs font-semibold text-muted-foreground">Senha
                <input type="password" autoComplete={modo === "entrar" ? "current-password" : "new-password"} minLength={8} required value={senha} onChange={(event) => setSenha(event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
              </label> : null}
              {modo === "primeiro" ? (
                <label className="block text-xs font-semibold text-muted-foreground">Confirmar senha
                  <input type="password" autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
                </label>
              ) : null}
              {erro ? <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">{erro}</p> : null}
              {mensagem ? <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">{mensagem}</p> : null}
              <Button type="submit" disabled={carregando || Boolean(mensagem)} className="panel-glow h-auto w-full rounded-2xl px-5 py-3.5 font-display text-sm font-semibold">{carregando ? "Aguarde…" : modo === "entrar" ? "Entrar" : modo === "primeiro" ? "Criar acesso" : "Enviar instruções"}</Button>
              {modo === "entrar" ? <Button type="button" variant="link" onClick={() => mudarModo("recuperar")} className="h-auto w-full py-1 text-xs">Esqueci minha senha</Button> : null}
              <Button type="button" variant="ghost" onClick={() => mudarModo("escolha")} className="h-auto w-full py-2 text-xs text-muted-foreground">Voltar</Button>
            </form>
          )}
          <Link to="/" className="tap mt-2 flex w-full items-center justify-center px-5 py-2 text-xs font-semibold text-muted-foreground">Voltar à página inicial</Link>
        </div>
      </div>
    </div>
  );
}