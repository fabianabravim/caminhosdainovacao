import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Criar nova senha — Caminhos da Inovação" },
      { name: "description", content: "Crie uma nova senha para acessar a Jornada da Inovação Capixaba." },
      { property: "og:title", content: "Criar nova senha — Caminhos da Inovação" },
      { property: "og:description", content: "Recuperação segura do acesso à Jornada da Inovação Capixaba." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate({ from: "/reset-password" });
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [recuperacaoValida, setRecuperacaoValida] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const validar = async () => {
      const { data } = await supabase.auth.getSession();
      setRecuperacaoValida(hash.get("type") === "recovery" || Boolean(data.session));
      setCarregando(false);
    };
    void validar();
  }, []);

  async function salvar() {
    if (senha.length < 8) return setErro("Crie uma senha com pelo menos 8 caracteres.");
    if (senha !== confirmacao) return setErro("As senhas informadas não coincidem.");
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);
    if (error) return setErro("Não foi possível atualizar a senha. Solicite um novo link.");
    await navigate({ to: "/jornada", replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-10">
      <section className="panel panel-glow w-full max-w-md rounded-3xl p-6">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-lilac/80">Caminhos da Inovação</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Criar nova senha</h1>
        {carregando ? <p className="mt-4 text-sm text-muted-foreground">Verificando o acesso…</p> : recuperacaoValida ? (
          <form className="mt-5 space-y-3" onSubmit={(event) => { event.preventDefault(); void salvar(); }}>
            <label className="block text-xs font-semibold text-muted-foreground">Nova senha<input type="password" autoComplete="new-password" required minLength={8} value={senha} onChange={(event) => setSenha(event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></label>
            <label className="block text-xs font-semibold text-muted-foreground">Confirmar nova senha<input type="password" autoComplete="new-password" required minLength={8} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" /></label>
            {erro ? <p role="alert" className="text-sm text-destructive">{erro}</p> : null}
            <Button type="submit" className="h-auto w-full rounded-2xl py-3">Salvar nova senha</Button>
          </form>
        ) : <><p className="mt-4 text-sm text-muted-foreground">Este link de recuperação não é válido ou expirou.</p><Link to="/entrar" className="mt-4 inline-flex text-sm font-semibold text-primary">Voltar para entrar</Link></>}
      </section>
    </main>
  );
}