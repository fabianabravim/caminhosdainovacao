import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole, MapPinned } from "lucide-react";
import { z } from "zod";
import { ChancelaInstitucional } from "@/components/ChancelaInstitucional";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { verificarAcessoAutorizado, vincularPerfilAutorizado } from "@/lib/acesso.functions";
import mestreAlvaro from "@/assets/mestre-alvaro-previa.png";

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
  const [modo, setModo] = useState<Modo>("entrar");
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
    if (["projeto.caminhosdainovacao@gmail.com", "conector.caminhosdainovacao@gmail.com"].includes(email.trim().toLowerCase())) {
      setErro("Esta é uma conta institucional de teste. A senha é definida pela Administração — use a opção Entrar na Jornada com a senha recebida.");
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

  const campo = "mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-2 focus:ring-brand-primary/25";
  const titulo = modo === "primeiro" ? "Primeiro acesso" : modo === "recuperar" ? "Esqueci minha senha" : "Acesso dos Conectores";
  const subtitulo = modo === "primeiro" ? "Use seu e-mail previamente autorizado e crie sua senha." : modo === "recuperar" ? "Informe seu e-mail para receber as instruções de recuperação." : "Use o e-mail e a senha cadastrados. Seu perfil e seu Núcleo são identificados automaticamente.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark">
      {/* Fotografia em resolução reduzida — uso apenas como prévia, aguardando autorização e versão definitiva */}
      <img src={mestreAlvaro} alt="Mestre Álvaro, Serra — Espírito Santo" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--brand-dark)_94%,transparent)_0%,color-mix(in_oklab,var(--brand-secondary)_78%,transparent)_45%,color-mix(in_oklab,var(--brand-dark)_35%,transparent)_100%)] lg:bg-[linear-gradient(90deg,color-mix(in_oklab,var(--brand-dark)_92%,transparent)_0%,color-mix(in_oklab,var(--brand-secondary)_62%,transparent)_50%,color-mix(in_oklab,var(--brand-dark)_25%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-energy" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-16">
        <div className="text-primary-foreground">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-energy text-energy sm:h-14 sm:w-14"><MapPinned className="h-6 w-6 sm:h-7 sm:w-7" /></span>
            <div className="leading-none">
              <p className="font-brand-condensed text-3xl font-bold tracking-wide sm:text-4xl">ROTA</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.28em] text-energy sm:text-sm">da Inovação</p>
            </div>
          </div>
          <span aria-hidden="true" className="mt-8 block h-1 w-14 rounded-full bg-energy sm:mt-12" />
          <h1 className="mt-5 font-brand-condensed text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">Bem-vindo(a)!</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">Conectando territórios, pessoas e oportunidades para um Espírito Santo mais inovador.</p>
          <div className="mt-10 hidden w-fit lg:block"><ChancelaInstitucional /></div>
        </div>

        <div className="w-full rounded-2xl bg-card p-6 text-card-foreground shadow-2xl sm:p-8 md:mx-auto md:max-w-md lg:max-w-none">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-brand-secondary" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-secondary">ROTA da Inovação</p>
          </div>
          <h2 className="mt-2 font-brand-condensed text-3xl font-semibold text-brand-dark">{titulo}</h2>
          <span aria-hidden="true" className="mt-2 block h-0.5 w-10 bg-energy" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{subtitulo}</p>

          <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); void (modo === "primeiro" ? primeiroAcesso() : modo === "recuperar" ? recuperarSenha() : entrar()); }}>
            <label className="block text-xs font-semibold text-foreground">E-mail
              <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={campo} />
            </label>
            {modo !== "recuperar" ? <label className="block text-xs font-semibold text-foreground">Senha
              <input type="password" autoComplete={modo === "primeiro" ? "new-password" : "current-password"} minLength={8} required value={senha} onChange={(event) => setSenha(event.target.value)} className={campo} />
            </label> : null}
            {modo === "primeiro" ? (
              <label className="block text-xs font-semibold text-foreground">Confirmar senha
                <input type="password" autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className={campo} />
              </label>
            ) : null}
            {modo !== "primeiro" && modo !== "recuperar" ? <div className="-mt-1 text-right"><button type="button" onClick={() => mudarModo("recuperar")} className="text-xs font-semibold text-brand-secondary hover:underline">Esqueci minha senha</button></div> : null}
            {erro ? <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">{erro}</p> : null}
            {mensagem ? <p role="status" className="rounded-lg border border-energy/50 bg-energy-soft p-3 text-xs text-foreground">{mensagem}</p> : null}
            <Button type="submit" disabled={carregando || Boolean(mensagem)} className="h-auto w-full rounded-lg bg-brand-secondary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-brand-dark">
              {carregando ? "Aguarde…" : modo === "primeiro" ? "Criar acesso" : modo === "recuperar" ? "Enviar instruções" : <>Entrar na ROTA <ArrowRight /></>}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-4 text-center">
            {modo === "primeiro" || modo === "recuperar" ? (
              <button type="button" onClick={() => mudarModo("entrar")} className="text-xs font-semibold text-muted-foreground hover:text-brand-secondary">Voltar para o acesso</button>
            ) : (
              <p className="text-xs text-muted-foreground">Ainda não ativou sua conta? <button type="button" onClick={() => mudarModo("primeiro")} className="font-semibold text-brand-secondary underline decoration-energy decoration-2 underline-offset-4">Primeiro acesso</button></p>
            )}
          </div>
          <Link to="/" className="tap mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-semibold text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Voltar à página inicial</Link>
        </div>
        <div className="w-fit lg:hidden"><ChancelaInstitucional /></div>
      </div>
    </div>
  );
}