import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { verificarAcessoAutorizado, vincularPerfilAutorizado } from "@/lib/acesso.functions";
import mestreAlvaro from "@/assets/mestre-alvaro-previa.png";
import { ChancelaInstitucional } from "@/components/ChancelaInstitucional";
import marcaRota from "@/assets/marca-rota.png";

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
  const [verSenha, setVerSenha] = useState(false);
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

  const campo = "mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-secondary focus:ring-2 focus:ring-brand-primary/25";
  const titulo = modo === "primeiro" ? "Primeiro acesso" : modo === "recuperar" ? "Esqueceu sua senha?" : "Acesso dos Conectores";
  const subtitulo = modo === "primeiro" ? "Use seu e-mail previamente autorizado e crie sua senha." : modo === "recuperar" ? "Informe seu e-mail para receber as instruções de recuperação." : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Fotografia em resolução reduzida — somente prévia, aguardando original e autorização de uso */}
      <img src={mestreAlvaro} alt="Mestre Álvaro, Serra — Espírito Santo" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,white_88%,transparent)_0%,color-mix(in_oklab,white_70%,transparent)_45%,color-mix(in_oklab,white_10%,transparent)_100%)] lg:bg-[linear-gradient(90deg,color-mix(in_oklab,white_90%,transparent)_0%,color-mix(in_oklab,white_68%,transparent)_38%,color-mix(in_oklab,white_0%,transparent)_70%)]" />

      {/* Formas orgânicas institucionais */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -right-20 -top-28 h-40 w-40 rounded-full bg-brand-primary/80 sm:h-72 sm:w-72" />
        <span className="absolute -right-6 top-8 hidden h-40 w-64 sm:block rounded-[50%] bg-energy/80 sm:top-12 sm:h-52 sm:w-80" />
        <span className="absolute -right-24 top-28 hidden h-48 w-48 sm:block rounded-full bg-brand-secondary/85 sm:top-36 sm:h-60 sm:w-60" />
        <span className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-brand-dark sm:h-80 sm:w-80" />
        <span className="absolute -bottom-6 left-16 hidden h-56 w-72 rounded-[50%] bg-energy/85 sm:block" />
        <span className="absolute -bottom-28 left-40 hidden h-64 w-64 rounded-full bg-brand-secondary sm:block" />
        <span className="absolute -left-16 bottom-40 hidden h-40 w-40 rounded-full bg-brand-primary/60 lg:block" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-5 pb-10 pt-10 sm:px-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_29rem] lg:gap-14 lg:py-10">
        <div className="text-center lg:text-left">
          <img src={marcaRota} alt="ROTA da Inovação" className="mx-auto h-auto w-56 sm:w-72 lg:mx-0 lg:w-[22rem]" draggable={false} />
          <h1 className="mt-6 font-brand text-3xl font-bold text-brand-dark sm:text-4xl lg:mt-8 lg:pl-6">Bem-vindo(a)!</h1>
          <p className="mx-auto mt-3 max-w-md text-lg leading-snug text-brand-dark/90 sm:text-xl lg:mx-0 lg:pl-6 lg:text-2xl">Conectando territórios, pessoas e oportunidades para um Espírito Santo mais inovador.</p>
        </div>

        <div className="w-full rounded-2xl bg-card p-6 text-card-foreground shadow-2xl sm:p-10 md:mx-auto md:max-w-md lg:max-w-none">
          <h2 className="font-brand text-2xl font-bold text-brand-dark sm:text-3xl">{titulo}</h2>
          {subtitulo ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitulo}</p> : null}

          <form className="mt-6 space-y-5" onSubmit={(event) => { event.preventDefault(); void (modo === "primeiro" ? primeiroAcesso() : modo === "recuperar" ? recuperarSenha() : entrar()); }}>
            <label className="block text-sm font-medium text-muted-foreground">E-mail
              <input type="email" autoComplete="email" required placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className={campo} />
            </label>
            {modo !== "recuperar" ? <label className="block text-sm font-medium text-muted-foreground">Senha
              <span className="relative block">
                <input type={verSenha ? "text" : "password"} autoComplete={modo === "primeiro" ? "new-password" : "current-password"} minLength={8} required placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} className={`${campo} pr-12`} />
                <button type="button" onClick={() => setVerSenha((v) => !v)} aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 mt-[3px] -translate-y-1/2 text-muted-foreground hover:text-brand-secondary">{verSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </span>
            </label> : null}
            {modo === "primeiro" ? (
              <label className="block text-sm font-medium text-muted-foreground">Confirmar senha
                <input type={verSenha ? "text" : "password"} autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className={campo} />
              </label>
            ) : null}
            {erro ? <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">{erro}</p> : null}
            {mensagem ? <p role="status" className="rounded-lg border border-energy/50 bg-energy-soft p-3 text-xs text-foreground">{mensagem}</p> : null}
            <Button type="submit" disabled={carregando || Boolean(mensagem)} className="h-auto w-full rounded-lg bg-brand-secondary px-5 py-3.5 text-base font-semibold text-primary-foreground hover:bg-brand-dark">
              {carregando ? "Aguarde…" : modo === "primeiro" ? "Criar acesso" : modo === "recuperar" ? "Enviar instruções" : <>Entrar na ROTA <ArrowRight /></>}
            </Button>
          </form>

          <div className="mt-5 space-y-3 text-center text-sm">
            {modo === "entrar" ? (
              <>
                <button type="button" onClick={() => mudarModo("recuperar")} className="font-medium text-brand-secondary underline underline-offset-4">Esqueceu sua senha?</button>
                <p className="border-t border-border pt-4 text-muted-foreground">Ainda não ativou sua conta? <button type="button" onClick={() => mudarModo("primeiro")} className="font-semibold text-brand-secondary underline decoration-energy decoration-2 underline-offset-4">Primeiro acesso</button></p>
              </>
            ) : (
              <button type="button" onClick={() => mudarModo("entrar")} className="font-medium text-muted-foreground hover:text-brand-secondary">Voltar para o acesso</button>
            )}
          </div>
          <Link to="/" className="tap mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-semibold text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Voltar à página inicial</Link>
        </div>
      </div>
      <footer className="relative flex justify-center px-5 pb-6 lg:-mt-20 lg:justify-start lg:px-8 lg:pb-8 xl:mx-auto xl:max-w-6xl">
        <div className="opacity-90"><ChancelaInstitucional /></div>
      </footer>
    </div>
  );
}