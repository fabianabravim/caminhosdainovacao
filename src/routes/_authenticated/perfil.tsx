import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, LockKeyhole, LogOut, Mail, MapPinned, UserRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { nucleoMap } from "@/data/nucleos";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [
    { title: "Meu Perfil — Caminhos da Inovação" },
    { name: "description", content: "Identificação do Conector e do Núcleo Territorial vinculado à sua Jornada." },
    { property: "og:title", content: "Meu Perfil — Caminhos da Inovação" },
    { property: "og:description", content: "Informações de acesso e vínculo territorial do Conector." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: PerfilPage,
});

function PerfilPage() { return <MeuNucleoProvider><PerfilConteudo /></MeuNucleoProvider>; }

function PerfilConteudo() {
  const { perfil, participante, nucleoId, conectoresNucleo } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId];
  const navigate = useNavigate({ from: "/perfil" });
  const queryClient = useQueryClient();
  if (!nucleo) return null;
  const linhas = [
    { Icon: UserRound, rotulo: "Nome", valor: perfil.nome },
    { Icon: Mail, rotulo: "E-mail", valor: perfil.email },
    { Icon: LockKeyhole, rotulo: "Perfil / função", valor: participante.papel },
    { Icon: MapPinned, rotulo: "Núcleo", valor: `Núcleo ${nucleo.nome}` },
    { Icon: CheckCircle2, rotulo: "Status", valor: perfil.ativo ? "Ativo" : "Inativo" },
  ];
  return (
    <AppShell titulo="Meu Perfil" subtitulo="Identificação e acesso" mostrarPontos={false} ampla jornadaResponsiva>
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <section className="relative overflow-hidden rounded-lg bg-brand-dark p-6 text-primary-foreground">
          <div className="topo-lines absolute inset-0 opacity-35" />
          <div className="relative">
            {perfil.demonstrativo ? <span className="inline-flex rounded-full border border-energy/35 bg-energy/15 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-energy">Ambiente de demonstração</span> : null}
            <span className="mt-6 grid h-20 w-20 place-items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-2xl font-semibold">{participante.iniciais}</span>
            <h2 className="mt-5 text-2xl font-semibold">{perfil.nome}</h2>
            <p className="mt-1 text-sm text-primary-foreground/65">{participante.papel}</p>
            <div className="mt-7 border-t border-primary-foreground/15 pt-5"><p className="text-[0.62rem] uppercase tracking-[0.15em] text-energy">Vínculo territorial</p><p className="mt-1 text-lg font-semibold">Núcleo {nucleo.nome}</p><p className="mt-2 text-xs leading-relaxed text-primary-foreground/58">O Núcleo é definido previamente pela Coordenação e não pode ser alterado pelo Conector.</p></div>
          </div>
        </section>
        <div className="space-y-5">
          <section className="panel overflow-hidden rounded-lg"><div className="border-b border-border px-5 py-4"><h3 className="text-lg font-semibold">Informações do acesso</h3><p className="mt-1 text-sm text-muted-foreground">Dados vinculados à sua identificação na plataforma.</p></div><dl className="divide-y divide-border/60">{linhas.map(({ Icon, rotulo, valor }) => <div key={rotulo} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-5 py-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><div className="min-w-0"><dt className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{rotulo}</dt><dd className="mt-1 break-words text-sm font-semibold">{valor}</dd></div></div>)}</dl></section>
          <section className="panel rounded-lg p-5"><h3 className="text-lg font-semibold">Equipe do Núcleo</h3><p className="mt-1 text-sm text-muted-foreground">Os Conectores colaboram nas metas coletivas sem competir entre si.</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{conectoresNucleo.map((c) => <div key={c.id} className="rounded-md border border-border bg-secondary/50 p-3"><p className="text-sm font-semibold">{c.nome}</p><p className="mt-1 text-xs text-muted-foreground">{c.email}</p></div>)}</div></section>
          <Button type="button" variant="outline" className="rounded-full" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/entrar", replace: true }); }}><LogOut /> Sair da plataforma</Button>
        </div>
      </div>
    </AppShell>
  );
}