import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MapaVivo } from "@/components/MapaVivo";
import { JornadaDimensoes } from "@/components/jornada/JornadaDimensoes";
import { MeuDesempenho } from "@/components/jornada/MeuDesempenho";
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
import { MeuNucleoProvider } from "@/context/MeuNucleoContext";
import { useMeuNucleo } from "@/context/meuNucleoBase";
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
      {/* Identificação + ação principal */}
      <section className="anim-rise flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Olá, {participante.nome.split(" ")[0]}
          </h2>
          <p className="mt-0.5 break-words text-sm text-muted-foreground">
            Você faz parte do{" "}
            <span className="font-semibold uppercase tracking-wide text-glow">
              Núcleo {nucleo.nome}
            </span>
          </p>
        </div>
        <div className="flex w-full shrink-0 items-center gap-1.5 sm:w-auto">
          <BotaoRegistrarAtividade className="flex-1 sm:flex-none" />
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
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max items-center gap-1.5 sm:min-w-0 sm:flex-wrap">
            {abas.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setAba(a.id)}
                  aria-current={aba === a.id ? "page" : undefined}
                  className={`tap min-h-10 whitespace-nowrap rounded-full border px-3.5 py-2 text-[0.76rem] font-semibold transition-colors ${
                    aba === a.id
                      ? "panel-glow border-lilac/50 bg-primary/25 text-foreground"
                      : "border-border/70 bg-surface/60 text-muted-foreground"
                  }`}
                >
                  {a.rotulo}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-[0.72rem] text-muted-foreground">{abaAtual.pergunta}</p>
      </nav>

      {aba === "visao" ? <SecaoVisaoGeral /> : null}
      {aba === "atividades" ? <MinhasAtividades /> : null}
      {aba === "missoes" ? <SecaoMissoes /> : null}
      {aba === "relatorios" ? <RelatoriosJornada /> : null}
      {aba === "nucleo" ? <SecaoNucleo /> : null}
    </div>
  );
}

function SecaoVisaoGeral() {
  const { atividades, atividadesEmValidacao, missoesConcluidas, progressoNucleo } = useMeuNucleo();

  return (
    <div className="min-w-0 space-y-5">
      {/* Como funciona: o fluxo do trabalho real */}
      <div className="panel panel-glow anim-rise min-w-0 rounded-3xl p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Como funciona</p>
        <h3 className="mt-1 font-display text-lg font-bold">
          Você registra o que fez. A plataforma faz o resto.
        </h3>
        <ol className="mt-3 grid min-w-0 grid-cols-1 gap-2 text-[0.76rem] text-muted-foreground sm:grid-cols-3">
          <li className="rounded-2xl border border-border/60 bg-surface/60 p-3">
            <span className="font-semibold text-foreground">1. Registro</span>
            <br />
            atividade realizada no território, com evidência
          </li>
          <li className="rounded-2xl border border-border/60 bg-surface/60 p-3">
            <span className="font-semibold text-foreground">2. Validação</span>
            <br />
            a Coordenação confere o registro
          </li>
          <li className="rounded-2xl border border-border/60 bg-surface/60 p-3">
            <span className="font-semibold text-foreground">3. Progresso</span>
            <br />
            missão, Núcleo, conquista e pontos avançam sozinhos
          </li>
        </ol>
        <div className="mt-4">
          <BotaoRegistrarAtividade className="w-full sm:w-auto" />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { rotulo: "Atividades registradas", valor: atividades.length },
          { rotulo: "Em validação", valor: atividadesEmValidacao },
          { rotulo: "Missões concluídas", valor: missoesConcluidas },
          { rotulo: "Progresso do Núcleo", valor: `${progressoNucleo}%` },
        ].map((c) => (
          <div key={c.rotulo} className="panel min-w-0 rounded-2xl p-3.5">
            <p className="font-display text-xl font-bold">{c.valor}</p>
            <p className="mt-0.5 text-[0.68rem] text-muted-foreground [overflow-wrap:anywhere]">
              {c.rotulo}
            </p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <MeuDesempenho />
        <JornadaDimensoes />
      </div>
    </div>
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
  const { nucleoId, conectoresNucleo } = useMeuNucleo();
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
      <RankingNucleos />
    </div>
  );
}
