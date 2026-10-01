import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, ListChecks, MapPinned, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { nucleos } from "@/data/nucleos";
import { statusAtividadeLabel } from "@/data/atividades.config";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/coordenacao")({
  head: () => ({
    meta: [
      { title: "Área da Coordenação — Caminhos da Inovação" },
      { name: "description", content: "Visão geral do projeto Caminhos da Inovação nos 14 Núcleos Territoriais." },
      { property: "og:title", content: "Área da Coordenação — Caminhos da Inovação" },
      { property: "og:description", content: "Acompanhamento transversal dos Núcleos, Conectores, atividades e relatórios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <MeuNucleoProvider>
      <AppShell titulo="Caminhos da Inovação" subtitulo="Área da Coordenação" mostrarPontos={false} ampla>
        <PainelCoordenacao />
      </AppShell>
    </MeuNucleoProvider>
  ),
});

function PainelCoordenacao() {
  const { perfil, atividades } = useMeuNucleo();
  const equipe = useQuery({
    queryKey: ["coordenacao", "perfis"],
    queryFn: async () => {
      const { data, error } = await supabase.from("perfis").select("user_id,nucleo_id,ativo").eq("ativo", true).not("nucleo_id", "is", null);
      if (error) throw error;
      return data;
    },
  });
  if (perfil.perfil !== "COORDENACAO" && perfil.perfil !== "ADMINISTRADOR") return <Navigate to="/jornada" replace />;

  const relatorios = atividades.filter((a) => a.tipoId.includes("relatorio"));
  const registros = atividades.filter((a) => !a.tipoId.includes("relatorio"));
  const porNucleo = (id: string) => (equipe.data ?? []).filter((p) => p.nucleo_id === id).length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg bg-brand-dark px-5 py-8 text-primary-foreground sm:px-8">
        <div className="topo-lines absolute inset-0 opacity-35" />
        <div className="relative max-w-2xl">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-energy">Área da Coordenação</p>
          <h2 className="mt-2 font-brand text-3xl font-semibold">Olá, {perfil.nome.split(" ")[0]}!</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">Acompanhe o Caminhos da Inovação em todo o Espírito Santo: os 14 Núcleos Territoriais, as pessoas vinculadas, as atividades e os relatórios registrados pelos Conectores.</p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Atalho to="/mapa" Icon={MapPinned} titulo="Territórios" texto="Perfis territoriais e informações de referência." />
        <Atalho href="#atividades" Icon={ListChecks} titulo="Atividades" texto={`${registros.length} registro(s) nos Núcleos.`} />
        <Atalho href="#relatorios" Icon={FileText} titulo="Relatórios" texto={`${relatorios.length} relatório(s) enviado(s).`} />
      </div>

      <section>
        <h3 className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-primary" /> Núcleos Territoriais</h3>
        <p className="mt-1 text-sm text-muted-foreground">Perfis ativos vinculados a cada Núcleo e atividades registradas.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {nucleos.map((n) => (
            <li key={n.id}>
              <Link to="/territorio/$nucleoId" params={{ nucleoId: n.id }} className="panel tap block rounded-lg p-4">
                <p className="text-sm font-semibold">Núcleo {n.nome}</p>
                <p className="mt-1 text-xs text-muted-foreground">{equipe.isLoading ? "Carregando…" : `${porNucleo(n.id)} perfil(is) vinculado(s)`} · {atividades.filter((a) => a.nucleoId === n.id).length} atividade(s)</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Lista id="atividades" titulo="Atividades recentes" vazio="Nenhuma atividade registrada até o momento." itens={registros} />
      <Lista id="relatorios" titulo="Relatórios" vazio="Nenhum relatório disponível." itens={relatorios} />

      <section className="panel rounded-lg p-5">
        <h3 className="font-semibold">Progresso da Jornada</h3>
        <p className="mt-1 text-sm text-muted-foreground">Dados serão apresentados conforme os registros dos Conectores forem realizados e validados.</p>
      </section>
    </div>
  );
}

function Atalho({ to, href, Icon, titulo, texto }: { to?: "/mapa"; href?: string; Icon: typeof MapPinned; titulo: string; texto: string }) {
  const corpo = <><Icon className="h-5 w-5 text-primary" /><p className="mt-2 text-sm font-semibold">{titulo}</p><p className="mt-1 text-xs text-muted-foreground">{texto}</p></>;
  return to ? <Link to={to} className="panel tap block rounded-lg p-4">{corpo}</Link> : <a href={href} className="panel tap block rounded-lg p-4">{corpo}</a>;
}

function Lista({ id, titulo, vazio, itens }: { id: string; titulo: string; vazio: string; itens: ReturnType<typeof useMeuNucleo>["atividades"] }) {
  return (
    <section id={id}>
      <h3 className="font-semibold">{titulo}</h3>
      {itens.length ? (
        <ul className="panel mt-3 divide-y divide-border rounded-lg">
          {itens.slice(0, 20).map((a) => (
            <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
              <span className="min-w-0"><span className="block truncate text-sm font-medium">{a.titulo}</span><span className="text-xs text-muted-foreground">Núcleo {nucleos.find((n) => n.id === a.nucleoId)?.nome ?? a.nucleoId} · {a.data}</span></span>
              <span className="text-xs text-muted-foreground">{statusAtividadeLabel[a.status]}</span>
            </li>
          ))}
        </ul>
      ) : <p className="panel mt-3 rounded-lg p-5 text-sm text-muted-foreground">{vazio}</p>}
    </section>
  );
}
