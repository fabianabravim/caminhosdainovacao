import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileUp, LogOut, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { MinhasAtividades } from "@/components/jornada/MinhasAtividades";
import { MissoesTerritorio } from "@/components/jornada/MissoesTerritorio";
import { ProgressoNucleo } from "@/components/jornada/ProgressoNucleo";
import { RankingNucleos } from "@/components/jornada/RankingNucleos";
import { RelatoriosJornada } from "@/components/jornada/RelatoriosJornada";
import {
  AcaoFlutuanteAtividade,
  BotaoRegistrarAtividade,
  RegistroAtividadeProvider,
} from "@/components/jornada/RegistroAtividade";
import { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";
import { Progresso } from "@/components/ui/Progresso";
import { Button } from "@/components/ui/button";
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { dimensoes } from "@/data/dimensoes";
import { nucleoMap } from "@/data/nucleos";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Minha Jornada — Caminhos da Inovação" },
      {
        name: "description",
        content:
          "Área do Conector: registre atividades do território, acompanhe missões, entregas e o progresso do seu Núcleo Territorial.",
      },
      { property: "og:title", content: "Minha Jornada — Caminhos da Inovação" },
      {
        property: "og:description",
        content: "Cada atividade registrada faz o seu Núcleo Territorial avançar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JornadaPage,
});

type AbaId = "visao" | "atividades" | "missoes" | "relatorios" | "nucleo";

const abas: { id: AbaId; rotulo: string; pergunta: string }[] = [
  { id: "visao", rotulo: "Visão geral", pergunta: "Como estou" },
  { id: "atividades", rotulo: "Atividades", pergunta: "O que eu fiz" },
  { id: "missoes", rotulo: "Missões", pergunta: "O que preciso realizar" },
  { id: "relatorios", rotulo: "Relatórios", pergunta: "O que preciso entregar" },
  { id: "nucleo", rotulo: "Meu Núcleo", pergunta: "Como nosso território evolui" },
];

function JornadaPage() {
  return (
    <MeuNucleoProvider>
      <RegistroAtividadeProvider>
        <AppShell
          titulo="Jornada da Inovação Capixaba"
          subtitulo="Área do Conector"
          mostrarPontos={false}
          ampla
          jornadaResponsiva
        >
          <JornadaConteudo />
        </AppShell>
        <AcaoFlutuanteAtividade />
      </RegistroAtividadeProvider>
    </MeuNucleoProvider>
  );
}

function JornadaConteudo() {
  const [aba, setAba] = useState<AbaId>("visao");
  const { participante, nucleoId } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId]!;
  const abaAtual = abas.find((a) => a.id === aba)!;

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <section className="anim-rise grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-lilac/80">
            Jornada da Inovação Capixaba
          </p>
          <h2 className="mt-1 truncate font-display text-xl font-bold sm:text-2xl">
            Olá, {participante.nome.split(" ")[0]}
          </h2>
          <p className="mt-0.5 break-words text-sm text-muted-foreground">
            Você faz parte do{" "}
            <span className="font-semibold uppercase tracking-wide text-glow">
              Núcleo {nucleo.nome}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="tap rounded-full border border-border/70 bg-surface/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            to="/entrar"
            aria-label="Sair"
            className="tap rounded-full border border-border/70 bg-surface/60 p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Navegação da área do Conector */}
      <nav aria-label="Seções da área do Conector" className="anim-rise min-w-0">
        <div className="min-w-0">
          <ul className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-5">
            {abas.map((a) => (
              <li key={a.id} className={a.id === "nucleo" ? "col-span-2 sm:col-span-1" : "min-w-0"}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAba(a.id)}
                  aria-current={aba === a.id ? "page" : undefined}
                  className={`tap h-auto min-h-10 w-full min-w-0 whitespace-normal rounded-full px-2 py-2 text-center text-[0.7rem] font-semibold leading-tight transition-colors min-[390px]:text-[0.76rem] ${
                    aba === a.id
                      ? "panel-glow border-lilac/50 bg-primary/25 text-foreground"
                      : "border-border/70 bg-surface/60 text-muted-foreground"
                  }`}
                >
                  {a.rotulo}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-[0.72rem] text-muted-foreground">{abaAtual.pergunta}</p>
      </nav>

      {aba === "visao" ? <SecaoVisaoGeral irPara={setAba} /> : null}
      {aba === "atividades" ? <MinhasAtividades /> : null}
      {aba === "missoes" ? <SecaoMissoes /> : null}
      {aba === "relatorios" ? <RelatoriosJornada /> : null}
      {aba === "nucleo" ? <SecaoNucleo /> : null}
    </div>
  );
}

function SecaoVisaoGeral({ irPara }: { irPara: (aba: AbaId) => void }) {
  const {
    conectoresNucleo,
    indicadoresTerritoriais,
    missoes,
    progressoNucleo,
    progressoPorDimensao,
  } = useMeuNucleo();
  const { abrir } = useRegistroAtividade();
  const proximas = missoes.filter((m) => m.status !== "concluida").slice(0, 3);

  return (
    <div className="min-w-0 space-y-5">
      <section className="panel panel-glow anim-rise min-w-0 rounded-3xl p-4 sm:p-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-lilac/80">
          O que você quer fazer hoje?
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <BotaoRegistrarAtividade rotulo="Registrar atividade" />
          <Button
            type="button"
            variant="outline"
            onClick={() => abrir({ tipoId: "relatorio" })}
            className="h-11 rounded-full border-border/70 bg-surface/60 font-display font-semibold"
          >
            <FileUp /> Enviar relatório
          </Button>
        </div>
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <ResumoDesempenho onAbrir={() => irPara("atividades")} />
        <section className="panel min-w-0 rounded-3xl p-4 sm:p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Meu Núcleo</p>
              <h3 className="mt-1 font-display text-lg font-bold">Núcleo Serra</h3>
              <p className="mt-1 text-[0.72rem] text-muted-foreground">
                {conectoresNucleo.map((c) => c.nome).join(" e ")}
              </p>
            </div>
            <span className="shrink-0 font-display text-2xl font-bold">{progressoNucleo}%</span>
          </div>
          <Progresso valor={progressoNucleo} className="mt-3 h-2" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {indicadoresTerritoriais.map((i) => (
              <div key={i.id} className="min-w-0 rounded-xl border border-border/60 bg-surface/60 p-2.5">
                <p className="font-display text-lg font-bold">{i.valor}</p>
                <p className="text-[0.66rem] text-muted-foreground [overflow-wrap:anywhere]">{i.rotulo}</p>
              </div>
            ))}
          </div>
          <BotaoLink rotulo="Ver Meu Núcleo" onClick={() => irPara("nucleo")} />
        </section>
      </div>

      <section className="panel min-w-0 rounded-3xl p-4 sm:p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Continuar minha jornada</p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dimensoes.map((d) => (
            <div key={d.id} className="min-w-0 rounded-2xl border border-border/60 bg-surface/60 p-3">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                <span className="shrink-0" aria-hidden>{d.icone}</span>
                <span className="truncate text-sm font-semibold">{d.nome}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{progressoPorDimensao[d.id]}%</span>
              </div>
              <Progresso valor={progressoPorDimensao[d.id]} cor={d.colorVar} className="mt-2" />
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold uppercase">Próximas missões</h3>
            <p className="text-sm text-muted-foreground">Prioridades para continuar avançando no território.</p>
          </div>
          <BotaoLink rotulo="Ver todas" onClick={() => irPara("missoes")} />
        </div>
        <div className="mt-3 grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-3">
          {proximas.map((m) => (
            <article key={m.id} className="panel min-w-0 rounded-2xl p-3.5">
              <p className="font-display text-sm font-semibold [overflow-wrap:anywhere]">{m.icone} {m.titulo}</p>
              <p className="mt-2 text-[0.7rem] text-muted-foreground">{m.progressoAtual} de {m.metaTotal} {m.unidade}</p>
              <Progresso valor={m.percentualProgresso} className="mt-2" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResumoDesempenho({ onAbrir }: { onAbrir: () => void }) {
  const metricas = [
    { rotulo: "Reuniões", valor: "4/5" },
    { rotulo: "Relatórios", valor: "2/3" },
    { rotulo: "Metas individuais", valor: "75%" },
    { rotulo: "Pendências", valor: "2" },
  ];
  return (
    <section className="panel min-w-0 rounded-3xl p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Meu desempenho</p>
        <span className="rounded-full border border-border/70 px-2 py-0.5 text-[0.58rem] text-muted-foreground">Demonstrativo</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {metricas.map((m) => (
          <div key={m.rotulo} className="min-w-0 rounded-xl border border-border/60 bg-surface/60 p-3">
            <p className="font-display text-xl font-bold">{m.valor}</p>
            <p className="text-[0.68rem] text-muted-foreground [overflow-wrap:anywhere]">{m.rotulo}</p>
          </div>
        ))}
      </div>
      <BotaoLink rotulo="Ver meu desempenho" onClick={onAbrir} />
    </section>
  );
}

function BotaoLink({ rotulo, onClick }: { rotulo: string; onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" onClick={onClick} className="mt-3 h-auto p-0 text-xs text-lilac hover:bg-transparent hover:text-foreground">
      {rotulo} <ArrowRight />
    </Button>
  );
}

function SecaoMissoes() {
  return (
    <div className="min-w-0 space-y-3">
      <div>
        <h3 className="font-display text-lg font-bold">Missões do Território</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          O que o Núcleo precisa alcançar. Cada missão avança quando suas atividades são validadas.
        </p>
      </div>
      <MissoesTerritorio />
    </div>
  );
}

function SecaoNucleo() {
  const { atividades, missoes, nucleoId, conectoresNucleo } = useMeuNucleo();
  const nucleo = nucleoMap[nucleoId]!;

  return (
    <div className="min-w-0 space-y-5">
      <div className="panel panel-glow overflow-hidden rounded-3xl p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Meu Núcleo</p>
        <h3 className="mt-1 font-display text-lg font-bold">Núcleo {nucleo.nome}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          “Cada descoberta ajuda a revelar o ecossistema de inovação do seu território.”
        </p>

        <p className="mt-4 text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
          Conectores do Núcleo
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {conectoresNucleo.map((c) => (
            <div key={c.nome} className="min-w-0 rounded-2xl border border-border/70 bg-surface/60 p-3">
              <div className="flex items-center gap-2.5">
                <span className="panel-glow grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/40 font-display text-xs font-bold text-glow">
                  {c.iniciais}
                </span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold">{c.nome}</p>
                  <p className="break-words text-[0.68rem] text-muted-foreground">{c.papel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel overflow-hidden rounded-3xl">
        <div className="border-b border-border/60 px-5 py-3.5">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
            Mapa do território
          </p>
          <p className="mt-1 text-[0.72rem] text-muted-foreground">
            Seu núcleo em destaque. A estrutura está preparada para receber atores, iniciativas,
            ambientes de inovação, oportunidades e conexões reais.
          </p>
        </div>
        <div className="min-w-0 overflow-hidden px-2 pb-1 pt-2 sm:px-4">
          <MapaVivo
            destaque={nucleoId}
            conexoes={[]}
            pontosTerritoriais
            labels
            interativo={false}
            className="mx-auto block h-auto max-h-[44rem] w-full max-w-[30rem] overflow-hidden"
          />
        </div>
        <p className="px-5 pb-3.5 text-center text-[0.6rem] tracking-wide text-muted-foreground/70">
          Fonte cartográfica: GEOBASES / IDAF
        </p>
      </div>

      <ProgressoNucleo />
      <section className="panel min-w-0 rounded-3xl p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold">Metas e missões da dupla</h3>
        <p className="mt-1 text-sm text-muted-foreground">O trabalho dos dois Conectores contribui para as mesmas metas territoriais.</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {missoes.slice(0, 6).map((m) => (
            <div key={m.id} className="min-w-0 rounded-xl border border-border/60 bg-surface/60 p-3">
              <p className="text-sm font-semibold [overflow-wrap:anywhere]">{m.icone} {m.titulo}</p>
              <p className="mt-1 text-[0.68rem] text-muted-foreground">{m.progressoAtual}/{m.metaTotal} {m.unidade}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel min-w-0 rounded-3xl p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold">Atividades recentes do Núcleo</h3>
        {atividades.length > 0 ? (
          <ul className="mt-3 divide-y divide-border/50">
            {atividades.slice(0, 5).map((a) => (
              <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3">
                <span className="min-w-0 break-words text-sm font-medium">{a.titulo}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{a.municipio || "Território"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">As atividades registradas pela dupla aparecerão aqui.</p>
        )}
      </section>
      <RankingNucleos />
    </div>
  );
}
