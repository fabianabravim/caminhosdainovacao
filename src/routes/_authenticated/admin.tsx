import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { KeyRound, Pencil, Plus, Power, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { alterarStatusUsuario, definirSenhaCoordenacao, enviarRedefinicaoSenha, listarUsuarios, salvarUsuario, souAdministrador } from "@/lib/admin.functions";

const EMAIL_COORDENACAO = "projeto.caminhosdainovacao@gmail.com";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: "Administração de usuários — Caminhos da Inovação" },
    { name: "description", content: "Gestão de acessos, papéis e Núcleos Territoriais dos usuários da plataforma." },
    { property: "og:title", content: "Administração de usuários — Caminhos da Inovação" },
    { property: "og:description", content: "Área restrita para gestão de usuários da Jornada da Inovação Capixaba." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AdminPage,
});

type Papel = "CONECTOR" | "COORDENACAO" | "ADMINISTRADOR";
const papeis: Record<Papel, string> = { CONECTOR: "Conector", COORDENACAO: "Coordenação", ADMINISTRADOR: "Administrador" };
type Usuario = Awaited<ReturnType<typeof listarUsuarios>>["usuarios"][number];
const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

function AdminPage() {
  const checar = useServerFn(souAdministrador);
  const acesso = useQuery({ queryKey: ["admin", "acesso"], queryFn: () => checar() });
  if (acesso.isLoading) return <AppShell titulo="Administração" mostrarPontos={false} ampla><p className="py-16 text-center text-sm text-muted-foreground">Verificando permissões…</p></AppShell>;
  if (!acesso.data?.admin) return (
    <AppShell titulo="Administração" mostrarPontos={false} ampla>
      <div className="panel mx-auto mt-10 max-w-md rounded-lg p-6 text-center"><h2 className="text-lg font-semibold">Acesso restrito</h2><p className="mt-2 text-sm text-muted-foreground">Esta área é exclusiva para Administradores.</p><Button asChild className="mt-5 rounded-full"><Link to="/jornada">Voltar à Jornada</Link></Button></div>
    </AppShell>
  );
  return <AdminConteudo />;
}

function AdminConteudo() {
  const listar = useServerFn(listarUsuarios);
  const salvar = useServerFn(salvarUsuario);
  const alterarStatus = useServerFn(alterarStatusUsuario);
  const redefinir = useServerFn(enviarRedefinicaoSenha);
  const definirSenha = useServerFn(definirSenhaCoordenacao);
  const [senhaCoord, setSenhaCoord] = useState<Usuario | null>(null);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "usuarios"], queryFn: () => listar() });
  const [busca, setBusca] = useState("");
  const [fPapel, setFPapel] = useState("");
  const [fNucleo, setFNucleo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [editando, setEditando] = useState<Usuario | "novo" | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const nucleos = data?.nucleos ?? [];
  const nomeNucleo = (id: string | null) => nucleos.find((n) => n.id === id)?.nome ?? "Sem Núcleo";

  const filtrados = useMemo(() => (data?.usuarios ?? []).filter((u) => {
    const q = busca.trim().toLowerCase();
    return (!q || u.nome.toLowerCase().includes(q) || u.email.includes(q))
      && (!fPapel || u.papel === fPapel)
      && (!fNucleo || (fNucleo === "_sem" ? !u.nucleoId : u.nucleoId === fNucleo))
      && (!fStatus || (fStatus === "ativo") === u.ativo);
  }), [data, busca, fPapel, fNucleo, fStatus]);

  const porNucleo = useMemo(() => nucleos.map((n) => ({ ...n, total: (data?.usuarios ?? []).filter((u) => u.nucleoId === n.id && u.papel === "CONECTOR" && u.ativo).length })), [data, nucleos]);

  async function executar(fn: () => Promise<unknown>, ok: string) {
    setAviso(null);
    try { await fn(); setAviso({ tipo: "ok", texto: ok }); await qc.invalidateQueries({ queryKey: ["admin", "usuarios"] }); return true; }
    catch (e) { setAviso({ tipo: "erro", texto: e instanceof Error ? e.message : "Não foi possível concluir a ação." }); return false; }
  }

  async function onRedefinir(u: Usuario) {
    setAviso(null);
    try {
      const r = await redefinir({ data: { id: u.id, origem: window.location.origin } });
      setAviso({ tipo: "ok", texto: r.tipo === "primeiro_acesso" ? `${u.email} ainda não criou senha. Oriente a pessoa a usar “Primeiro acesso” na tela Entrar.` : `E-mail de redefinição de senha enviado para ${u.email}.` });
    } catch (e) { setAviso({ tipo: "erro", texto: e instanceof Error ? e.message : "Falha ao enviar." }); }
  }

  return (
    <AppShell titulo="Administração" subtitulo="Gestão de usuários" mostrarPontos={false} ampla jornadaResponsiva>
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-lg bg-brand-dark p-5 text-primary-foreground sm:p-6">
          <div className="topo-lines absolute inset-0 opacity-30" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-energy"><ShieldCheck className="h-4 w-4" /> Área restrita</p><h2 className="mt-2 text-2xl font-semibold">Usuários da plataforma</h2><p className="mt-1 max-w-xl text-sm text-primary-foreground/70">Autorize e-mails, defina papel e Núcleo. A própria pessoa cria a senha no Primeiro acesso.</p></div>
            <Button className="rounded-full bg-energy text-brand-dark hover:bg-energy/90" onClick={() => setEditando("novo")}><Plus /> Autorizar usuário</Button>
          </div>
        </section>

        {aviso ? <p role="status" className={`rounded-md border px-4 py-3 text-sm ${aviso.tipo === "ok" ? "border-primary/30 bg-primary/5" : "border-destructive/40 bg-destructive/5 text-destructive"}`}>{aviso.texto}</p> : null}

        <section className="panel rounded-lg p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Buscar por nome ou e-mail" placeholder="Buscar por nome ou e-mail" className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
            <select aria-label="Filtrar por papel" className={selectCls} value={fPapel} onChange={(e) => setFPapel(e.target.value)}><option value="">Todos os papéis</option>{Object.entries(papeis).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            <select aria-label="Filtrar por Núcleo" className={selectCls} value={fNucleo} onChange={(e) => setFNucleo(e.target.value)}><option value="">Todos os Núcleos</option><option value="_sem">Sem Núcleo</option>{nucleos.map((n) => <option key={n.id} value={n.id}>{n.nome}</option>)}</select>
            <select aria-label="Filtrar por status" className={selectCls} value={fStatus} onChange={(e) => setFStatus(e.target.value)}><option value="">Ativos e inativos</option><option value="ativo">Ativos</option><option value="inativo">Inativos</option></select>
          </div>
        </section>

        {isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Carregando usuários…</p> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : (
          <section className="panel overflow-hidden rounded-lg">
            <div className="border-b border-border px-4 py-3 text-sm text-muted-foreground">{filtrados.length} usuário(s)</div>
            <ul className="divide-y divide-border/60">
              {filtrados.map((u) => (
                <li key={u.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.5fr_0.8fr_1fr_0.9fr_auto] md:items-center">
                  <div className="min-w-0"><p className="truncate font-semibold">{u.nome}{u.souEu ? <span className="ml-2 text-xs font-normal text-muted-foreground">(você)</span> : null}</p><p className="truncate text-xs text-muted-foreground">{u.email}</p></div>
                  <p className="text-sm"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{papeis[u.papel as Papel] ?? u.papel}</span></p>
                  <p className="text-sm">{nomeNucleo(u.nucleoId)}</p>
                  <div className="text-xs"><p className={u.ativo ? "font-semibold text-primary" : "font-semibold text-destructive"}>{u.ativo ? "Ativo" : "Inativo"}</p><p className="text-muted-foreground">{u.acessoCriado ? "Senha criada" : "Aguardando 1º acesso"} · {new Date(u.criadoEm).toLocaleDateString("pt-BR")}</p></div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => setEditando(u)}><Pencil /> Editar</Button>
                    {u.email === EMAIL_COORDENACAO && u.papel === "COORDENACAO"
                      ? <Button size="sm" variant="outline" onClick={() => setSenhaCoord(u)}><KeyRound /> Definir senha da Coordenação</Button>
                      : <Button size="sm" variant="outline" onClick={() => onRedefinir(u)} title="Primeiro acesso / redefinir senha"><KeyRound /> Senha</Button>}
                    {!u.souEu ? <Button size="sm" variant="outline" onClick={() => executar(() => alterarStatus({ data: { id: u.id, ativo: !u.ativo } }), u.ativo ? "Acesso desativado." : "Acesso reativado.")}><Power /> {u.ativo ? "Desativar" : "Ativar"}</Button> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="panel rounded-lg p-4"><h3 className="font-semibold">Conectores ativos por Núcleo</h3><p className="mt-1 text-xs text-muted-foreground">Referência: 2 Conectores por Núcleo (sem bloqueio).</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{porNucleo.map((n) => <div key={n.id} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm"><span className="truncate">{n.nome}</span><span className={`font-semibold ${n.total >= 2 ? "text-primary" : "text-muted-foreground"}`}>{n.total}/2</span></div>)}</div></section>
      </div>

      <Dialog open={editando !== null} onOpenChange={(o) => !o && setEditando(null)}>
        <DialogContent>
          {editando !== null ? <FormUsuario key={editando === "novo" ? "novo" : editando.id} usuario={editando === "novo" ? null : editando} nucleos={nucleos} onSalvar={async (v) => { const ok = await executar(() => salvar({ data: v }), editando === "novo" ? "Usuário autorizado. Ele já pode fazer o Primeiro acesso." : "Alterações salvas."); if (ok) setEditando(null); }} /> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={senhaCoord !== null} onOpenChange={(o) => !o && setSenhaCoord(null)}>
        <DialogContent>
          {senhaCoord ? <FormSenhaCoordenacao onSalvar={async (senha) => { const ok = await executar(() => definirSenha({ data: { id: senhaCoord.id, senha } }), `Senha da Coordenação definida. ${senhaCoord.email} já pode entrar.`); if (ok) setSenhaCoord(null); }} /> : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function FormSenhaCoordenacao({ onSalvar }: { onSalvar: (senha: string) => Promise<void> }) {
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (senha.length < 10) return setErro("Use pelo menos 10 caracteres.");
    if (senha !== conf) return setErro("As senhas não coincidem.");
    setErro(null); setEnviando(true);
    await onSalvar(senha);
    setEnviando(false);
  }
  return (
    <form onSubmit={submit} className="space-y-4" autoComplete="off">
      <DialogHeader><DialogTitle>Definir senha da Coordenação</DialogTitle><DialogDescription>Conta institucional compartilhada. A senha vai direto para o sistema de autenticação e não é guardada nem exibida pela plataforma. A senha anterior deixa de funcionar.</DialogDescription></DialogHeader>
      <div className="space-y-1.5"><Label htmlFor="nova-senha">Nova senha</Label><Input id="nova-senha" type="password" autoComplete="new-password" required minLength={10} value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
      <div className="space-y-1.5"><Label htmlFor="conf-senha">Confirmar senha</Label><Input id="conf-senha" type="password" autoComplete="new-password" required minLength={10} value={conf} onChange={(e) => setConf(e.target.value)} /></div>
      {erro ? <p className="text-xs text-destructive">{erro}</p> : null}
      <Button type="submit" className="w-full rounded-full" disabled={enviando}>{enviando ? "Salvando…" : "Definir senha"}</Button>
    </form>
  );
}

function FormUsuario({ usuario, nucleos, onSalvar }: { usuario: Usuario | null; nucleos: { id: string; nome: string }[]; onSalvar: (v: { id?: string; nome: string; email: string; papel: Papel; nucleoId: string | null }) => Promise<void> }) {
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [papel, setPapel] = useState<Papel>((usuario?.papel as Papel) ?? "CONECTOR");
  const [nucleoId, setNucleoId] = useState(usuario?.nucleoId ?? "");
  const [enviando, setEnviando] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setEnviando(true);
    await onSalvar({ ...(usuario ? { id: usuario.id } : {}), nome, email, papel, nucleoId: nucleoId || null });
    setEnviando(false);
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader><DialogTitle>{usuario ? "Editar usuário" : "Autorizar novo usuário"}</DialogTitle><DialogDescription>Nenhuma senha é definida aqui — a pessoa cria a própria senha no Primeiro acesso.</DialogDescription></DialogHeader>
      <div className="space-y-1.5"><Label htmlFor="nome">Nome completo</Label><Input id="nome" required minLength={2} value={nome} onChange={(e) => setNome(e.target.value)} /></div>
      <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required disabled={usuario?.acessoCriado} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-1.5"><Label htmlFor="papel">Papel</Label><select id="papel" className={selectCls} disabled={usuario?.souEu} value={papel} onChange={(e) => setPapel(e.target.value as Papel)}>{Object.entries(papeis).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>{usuario?.souEu ? <p className="text-xs text-muted-foreground">Você não pode alterar o seu próprio papel.</p> : null}</div>
      <div className="space-y-1.5"><Label htmlFor="nucleo">Núcleo Territorial</Label><select id="nucleo" className={selectCls} required={papel === "CONECTOR"} value={nucleoId} onChange={(e) => setNucleoId(e.target.value)}><option value="">Sem Núcleo</option>{nucleos.map((n) => <option key={n.id} value={n.id}>{n.nome}</option>)}</select></div>
      <Button type="submit" className="w-full rounded-full" disabled={enviando}>{enviando ? "Salvando…" : "Salvar"}</Button>
    </form>
  );
}
