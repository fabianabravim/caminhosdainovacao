import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CheckCircle2, Compass, FileClock, FileUp, Handshake, Lightbulb, LogOut, MapPinned, Rocket, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { MinhasAtividades } from "@/components/jornada/MinhasAtividades";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { ProgressoNucleo } from "@/components/jornada/ProgressoNucleo";
import { RankingNucleos } from "@/components/jornada/RankingNucleos";
import { RelatoriosJornada } from "@/components/jornada/RelatoriosJornada";
import { AcaoFlutuanteAtividade, BotaoRegistrarAtividade, RegistroAtividadeProvider } from "@/components/jornada/RegistroAtividade";
import { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";
import { Progresso } from "@/components/ui/Progresso";
import { Button } from "@/components/ui/button";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { dimensoes } from "@/data/dimensoes";
import { tipoAtividadeMap, statusAtividadeLabel, estiloStatusAtividade } from "@/data/atividades.config";
import { nucleoMap } from "@/data/nucleos";
import { supabase } from "@/integrations/supabase/client";
import rioDoce from "@/assets/rio-doce.jpg";

export const Route = createFileRoute("/_authenticated/jornada")({
  head: () => ({ meta: [
    { title: "Minha Jornada — Caminhos da Inovação" },
    { name: "description", content: "Área do Conector para registrar atividades, acompanhar missões, entregas e o progresso do Núcleo Territorial." },
    { property: "og:title", content: "Minha Jornada — Caminhos da Inovação" },
    { property: "og:description", content: "Cada atividade registrada faz o território avançar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: JornadaPage,
});

type AbaId = "visao" | "atividades" | "missoes" | "relatorios" | "nucleo";
const abas: { id: AbaId; rotulo: string }[] = [
  { id: "visao", rotulo: "Visão geral" }, { id: "atividades", rotulo: "Atividades" },
  { id: "missoes", rotulo: "Missões" }, { id: "relatorios", rotulo: "Relatórios" },
  { id: "nucleo", rotulo: "Meu Núcleo" },
];

function JornadaPage() {
  return (
    <MeuNucleoProvider>
      <RegistroAtividadeProvider>
        <AppShell titulo="Jornada da Inovação Capixaba" subtitulo="Área do Conector" mostrarPontos={false} ampla jornadaResponsiva>
          <JornadaConteudo />
        </AppShell>
        <AcaoFlutuanteAtividade />
      </RegistroAtividadeProvider>
    </MeuNucleoProvider>
  );
}

function JornadaConteudo() {
  const [aba, setAba] = useState<AbaId>("visao");
  const { participante, nucleoId, perfil } = useMeuNucleo();
  const navigate = useNavigate({ from: "/jornada" });
  const queryClient = useQueryClient();
  const nucleo = nucleoMap[nucleoId];
  if (!nucleo) return null;

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <section className="relative min-h-60 overflow-hidden rounded-lg bg-brand-dark text-primary-foreground shadow-xl shadow-primary/10 sm:min-h-64">
        <img src={rioDoce} alt="Paisagem do território capixaba" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--brand-dark)_0%,color-mix(in_oklab,var(--brand-dark)_84%,transparent)_52%,color-mix(in_oklab,var(--brand-dark)_25%,transparent))]" />
        <div className="topo-lines absolute inset-0 opacity-40" />
        <div className="relative grid min-h-60 grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-5 sm:min-h-64 sm:p-7">
          <div className="min-w-0 self-center">
            {perfil.demonstrativo ? <span className="mb-4 inline-flex rounded-full border border-energy/35 bg-energy/15 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-energy">Ambiente de demonstração</span> : null}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-energy">Sua Jornada continua por aqui</p>
            <h2 className="mt-2 font-brand text-3xl font-semibold sm:text-4xl">Olá, {participante.nome.split(" ")[0]}!</h2>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-foreground/75">
              <span className="inline-flex items-center gap-1.5"><MapPinned className="h-4 w-4 text-energy" /> Núcleo {nucleo.nome}</span>
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4 text-energy" /> {participante.papel}</span>
            </div>
            <p className="mt-5 max-w-md text-sm italic leading-relaxed text-primary-foreground/68">“Cada registro ajuda a revelar o que move a inovação no seu território.”</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <Link to="/perfil" aria-label="Meu perfil" className="tap rounded-full border border-primary-foreground/20 bg-primary-foreground/10 p-2.5 text-primary-foreground"><User className="h-4 w-4" /></Link>
            <Button type="button" variant="ghost" size="icon" aria-label="Sair" className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/entrar", replace: true }); }}><LogOut className="h-4 w-4" /></Button>
          </div>
          <div className="col-span-2 self-end"><BotaoRegistrarAtividade rotulo="Registrar atividade" className="bg-energy text-brand-dark shadow-lg shadow-brand-dark/20 hover:bg-energy/90" /></div>
        </div>
      </section>

      <nav aria-label="Seções da área do Conector" className="min-w-0 border-b border-border">
        <ul className="flex min-w-max gap-1 overflow-x-auto">
          {abas.map((item) => <li key={item.id}><Button type="button" variant="ghost" onClick={() => setAba(item.id)} aria-current={aba === item.id ? "page" : undefined} className={`h-11 rounded-none border-b-2 px-3 text-xs font-semibold sm:px-5 ${aba === item.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{item.rotulo}</Button></li>)}
        </ul>
      </nav>

      {aba === "visao" ? <VisaoGeral irPara={setAba} /> : null}
      {aba === "atividades" ? <MinhasAtividades /> : null}
      {aba === "missoes" ? <section><CabecalhoSecao titulo="Missões do Território" texto="O que o Núcleo precisa alcançar. O progresso acontece a partir de atividades validadas." /><MissoesTerritorio /></section> : null}
      {aba === "relatorios" ? <RelatoriosJornada /> : null}
      {aba === "nucleo" ? <MeuNucleo /> : null}
    </div>
  );
}

function VisaoGeral({ irPara }: { irPara: (aba: AbaId) => void }) {
  const { atividades, atividadesEmValidacao, conectoresNucleo, indicadoresTerritoriais, missoes, missoesEmValidacao, nucleoId, perfil, progressoNucleo, progressoPorDimensao } = useMeuNucleo();
  const { abrir } = useRegistroAtividade();
  const minhas = atividades.filter((a) => a.conectorId === perfil.userId);
  const proximas = missoes.filter((m) => m.status !== "concluida").slice(0, 3);
  const relatorios = minhas.filter((a) => a.tipoId === "relatorio");
  const pendencias = minhas.filter((a) => a.status === "em_validacao" || a.status === "ajustes_solicitados");

  return (
    <div className="min-w-0 space-y-7">
      <TrilhaJornada progresso={progressoPorDimensao} />

      <section>
        <CabecalhoSecao titulo="Resumo do período" texto="Indicadores atualizados a partir dos registros disponíveis." />
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ResumoItem valor={missoes.filter((m) => m.status === "andamento" || m.status === "validacao").length} rotulo="Missões em andamento" Icon={Compass} />
          <ResumoItem valor={minhas.length} rotulo="Atividades realizadas" Icon={CheckCircle2} />
          <ResumoItem valor={relatorios.length} rotulo="Relatórios" Icon={FileClock} />
          <ResumoItem valor={pendencias.length} rotulo="Pendências" Icon={AlertCircle} destaque={pendencias.length > 0} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel overflow-hidden rounded-lg">
          <div className="flex items-end justify-between gap-3 border-b border-border px-5 py-4">
            <CabecalhoSecao titulo="Continue sua Jornada" texto="Missões que pedem atenção agora." compacto />
            <Button variant="ghost" onClick={() => irPara("missoes")} className="h-auto shrink-0 p-0 text-xs text-primary">Ver todas <ArrowRight /></Button>
          </div>
          <div className="divide-y divide-border/60">
            {proximas.map((missao) => <button key={missao.id} type="button" onClick={() => irPara("missoes")} className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/50"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-lg">{missao.icone}</span><span className="min-w-0"><strong className="block truncate text-sm font-semibold">{missao.titulo}</strong><span className="mt-1 block text-xs text-muted-foreground">{missao.progressoAtual} de {missao.metaTotal} {missao.unidade}</span></span><span className="text-xs font-semibold text-primary">{missao.percentualProgresso}%</span></button>)}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-lg bg-brand-dark p-5 text-primary-foreground">
          <div className="topo-lines absolute inset-0 opacity-35" />
          <div className="relative">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-energy">Meu Núcleo</p>
            <div className="mt-2 flex items-end justify-between gap-4"><h3 className="text-xl font-semibold">Núcleo {nucleoMap[nucleoId]?.nome}</h3><strong className="font-brand-condensed text-4xl">{progressoNucleo}%</strong></div>
            <Progresso valor={progressoNucleo} cor="var(--energy)" className="mt-4 h-2" />
            <p className="mt-4 text-xs text-primary-foreground/62">{conectoresNucleo.length} {conectoresNucleo.length === 1 ? "Conector" : "Conectores"} atuando neste território</p>
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-primary-foreground/15">
              {indicadoresTerritoriais.slice(0, 4).map((item) => <div key={item.id} className="bg-brand-dark/90 p-3"><strong className="text-xl">{item.valor}</strong><span className="mt-1 block text-[0.65rem] text-primary-foreground/60">{item.rotulo}</span></div>)}
            </div>
            <Button variant="ghost" onClick={() => irPara("nucleo")} className="mt-4 h-auto p-0 text-xs text-energy hover:bg-transparent hover:text-primary-foreground">Ver meu Núcleo <ArrowRight /></Button>
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel overflow-hidden rounded-lg">
          <div className="flex items-end justify-between gap-3 border-b border-border px-5 py-4"><CabecalhoSecao titulo="Atividades recentes" texto="Seus últimos registros no território." compacto /><Button variant="ghost" onClick={() => irPara("atividades")} className="h-auto shrink-0 p-0 text-xs text-primary">Ver todas <ArrowRight /></Button></div>
          {minhas.length ? <ul className="divide-y divide-border/60">{minhas.slice(0, 4).map((atividade) => <li key={atividade.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{atividade.titulo}</p><p className="mt-1 text-xs text-muted-foreground">{tipoAtividadeMap[atividade.tipoId]?.rotulo ?? "Atividade"} · {atividade.data ? new Date(`${atividade.data}T12:00:00`).toLocaleDateString("pt-BR") : "—"}</p></div><span className={`h-fit rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold ${estiloStatusAtividade[atividade.status]}`}>{statusAtividadeLabel[atividade.status]}</span></li>)}</ul> : <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>}
        </section>

        <section className="panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3"><CabecalhoSecao titulo="Pendências" texto="Itens que precisam de acompanhamento." compacto /><AlertCircle className="h-5 w-5 text-energy" /></div>
          <div className="mt-4 space-y-2">
            <Pendencia valor={atividadesEmValidacao} texto="atividades em validação" />
            <Pendencia valor={missoesEmValidacao} texto="missões aguardando validação" />
            <Pendencia valor={minhas.filter((a) => a.status === "ajustes_solicitados").length} texto="ajustes solicitados" />
          </div>
          <Button type="button" variant="outline" onClick={() => abrir({ tipoId: "relatorio" })} className="mt-5 w-full rounded-full"><FileUp /> Novo relatório</Button>
        </section>
      </div>
    </div>
  );
}

function TrilhaJornada({ progresso }: { progresso: Record<(typeof dimensoes)[number]["id"], number> }) {
  const icones = { explorar: Compass, conectar: Handshake, descobrir: Lightbulb, transformar: Rocket };
  return <section className="panel relative overflow-hidden rounded-lg p-5 sm:p-6"><div className="topo-lines absolute inset-0 opacity-35" /><div className="relative"><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">Sua Jornada</p><h3 className="mt-1 text-xl font-semibold">Quatro dimensões. Muitos caminhos.</h3><div className="relative mt-7 grid gap-4 md:grid-cols-4"><div className="route-line absolute left-[11%] right-[11%] top-6 hidden h-0.5 md:block" />{dimensoes.map((dimensao, index) => { const Icon = icones[dimensao.id]; const transformar = dimensao.id === "transformar"; return <div key={dimensao.id} className="relative grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3 md:block"><span className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border ${transformar ? "border-energy bg-energy-soft text-brand-dark" : "border-primary/25 bg-surface text-primary"}`}><Icon className="h-5 w-5" /></span><div className="md:mt-3"><p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">0{index + 1}</p><p className="text-xs font-semibold uppercase">{dimensao.nome}</p><div className="mt-2 flex items-center gap-2"><Progresso valor={progresso[dimensao.id]} cor={transformar ? "var(--energy)" : dimensao.colorVar} /><span className="text-[0.65rem] text-muted-foreground">{progresso[dimensao.id]}%</span></div></div></div>; })}</div></div></section>;
}

function ResumoItem({ valor, rotulo, Icon, destaque = false }: { valor: number; rotulo: string; Icon: typeof Compass; destaque?: boolean }) { return <div className={`panel min-w-0 rounded-lg border-l-4 p-4 ${destaque ? "border-l-energy" : "border-l-primary/35"}`}><Icon className={`h-5 w-5 ${destaque ? "text-energy" : "text-primary"}`} /><strong className="mt-5 block font-brand-condensed text-3xl">{valor}</strong><span className="text-xs text-muted-foreground">{rotulo}</span></div>; }
function Pendencia({ valor, texto }: { valor: number; texto: string }) { return <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-md bg-secondary/70 px-3 py-2.5"><strong className="grid h-8 w-8 place-items-center rounded-full bg-surface text-sm text-primary">{valor}</strong><span className="text-xs text-muted-foreground">{texto}</span></div>; }
function CabecalhoSecao({ titulo, texto, compacto = false }: { titulo: string; texto: string; compacto?: boolean }) { return <div className="min-w-0"><h3 className={`${compacto ? "text-base" : "text-lg"} font-semibold`}>{titulo}</h3><p className="mt-0.5 text-sm text-muted-foreground">{texto}</p></div>; }

function MeuNucleo() {
  const { atividades, missoes, nucleoId, conectoresNucleo } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId];
  if (!nucleo) return null;
  return <div className="space-y-5"><section className="relative overflow-hidden rounded-lg bg-brand-dark p-5 text-primary-foreground"><div className="topo-lines absolute inset-0 opacity-35" /><div className="relative"><p className="text-[0.62rem] uppercase tracking-[0.18em] text-energy">Meu Núcleo</p><h3 className="mt-2 text-2xl font-semibold">Núcleo {nucleo.nome}</h3><p className="mt-2 max-w-xl text-sm text-primary-foreground/65">O trabalho dos Conectores contribui para as mesmas metas territoriais. Cada atividade mantém a rastreabilidade do responsável.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{conectoresNucleo.map((c) => <div key={c.nome} className="flex items-center gap-3 rounded-md border border-primary-foreground/15 bg-primary-foreground/8 p-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-energy/15 text-sm font-semibold text-energy">{c.iniciais}</span><div><p className="text-sm font-semibold">{c.nome}</p><p className="text-xs text-primary-foreground/60">{c.papel}</p></div></div>)}</div></div></section><div className="panel overflow-hidden rounded-lg"><div className="border-b border-border px-5 py-4"><h3 className="font-semibold">Mapa do território</h3><p className="mt-1 text-sm text-muted-foreground">Seu Núcleo em destaque sobre a geometria oficial do Espírito Santo.</p></div><MapaVivo destaque={nucleoId} conexoes={[]} pontosTerritoriais labels interativo={false} className="mx-auto block h-auto max-h-[42rem] w-full max-w-[30rem]" /><p className="pb-4 text-center text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">Fonte cartográfica: GEOBASES / IDAF</p></div><ProgressoNucleo /><section><CabecalhoSecao titulo="Metas coletivas" texto="Missões territoriais compartilhadas pela dupla." /><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{missoes.slice(0, 6).map((m) => <div key={m.id} className="panel rounded-lg p-4"><p className="text-sm font-semibold">{m.icone} {m.titulo}</p><p className="mt-2 text-xs text-muted-foreground">{m.progressoAtual}/{m.metaTotal} {m.unidade}</p></div>)}</div></section><section><CabecalhoSecao titulo="Atividades recentes do Núcleo" texto="Registros dos Conectores deste território." />{atividades.length ? <ul className="panel mt-3 divide-y divide-border rounded-lg">{atividades.slice(0, 5).map((a) => <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4"><span className="truncate text-sm font-medium">{a.titulo}</span><span className="text-xs text-muted-foreground">{a.municipio || "Território"}</span></li>)}</ul> : <p className="panel mt-3 rounded-lg p-5 text-sm text-muted-foreground">As atividades registradas aparecerão aqui.</p>}</section><RankingNucleos /></div>;
}