import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Factory,
  FlaskConical,
  GraduationCap,
  Landmark,
  Lightbulb,
  Network,
  Rocket,
  Sprout,
  Users,
} from "lucide-react";
import { MapaVivo } from "@/components/MapaVivo";
import { Button } from "@/components/ui/button";
import { dimensoes } from "@/data/dimensoes";
import { conexoes } from "@/data/nucleos";
import { ES_VIEW_HEIGHT, ES_VIEW_WIDTH } from "@/lib/geoES";

const conceitos = [
  { titulo: "Novas soluções", texto: "Ideias que resolvem problemas de novas maneiras.", Icon: Lightbulb },
  { titulo: "Melhores processos", texto: "Novas formas de produzir, organizar e prestar serviços.", Icon: Sprout },
  { titulo: "Conexões", texto: "Pessoas e organizações trabalhando juntas.", Icon: Network },
  { titulo: "Território", texto: "Soluções conectadas às necessidades e oportunidades locais.", Icon: Landmark },
  { titulo: "Impacto", texto: "Conhecimento transformado em desenvolvimento.", Icon: Rocket },
] as const;

const atores = [
  { nome: "Universidades", Icon: GraduationCap },
  { nome: "Empresas", Icon: Factory },
  { nome: "Startups", Icon: Rocket },
  { nome: "Governos", Icon: Landmark },
  { nome: "Ensino e pesquisa", Icon: FlaskConical },
  { nome: "Ambientes de inovação", Icon: Building2 },
  { nome: "Empreendedores", Icon: Sprout },
  { nome: "Comunidades", Icon: Users },
] as const;

export function HomeSections({ onIniciar }: { onIniciar: () => void }) {
  return (
    <>
      <section id="inovacao" className="bg-paper text-paper-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-violet">Inovação</p>
          <div className="mt-5 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">O que é inovação?</h2>
              <p className="mt-6 max-w-lg text-xl leading-relaxed text-paper-muted">
                Inovação é transformar conhecimento, ideias e necessidades em novas possibilidades.
              </p>
            </div>
            <div className="relative grid gap-0 sm:grid-cols-2">
              <div className="absolute bottom-8 left-8 top-8 hidden w-px bg-primary/25 sm:block" />
              {conceitos.map(({ titulo, texto, Icon }, index) => (
                <article
                  key={titulo}
                  className={`relative border-primary/15 py-5 pl-16 pr-5 ${index < conceitos.length - 1 ? "border-b" : ""} ${index === conceitos.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""}`}
                >
                  <span className="absolute left-5 top-6 grid h-8 w-8 place-items-center rounded-full border border-primary/30 bg-paper text-primary shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">{titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-paper-muted">{texto}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="conectores" className="relative overflow-hidden bg-surface text-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div
            className="relative mx-auto w-full max-w-md"
            style={{ aspectRatio: `${ES_VIEW_WIDTH} / ${ES_VIEW_HEIGHT}` }}
            aria-hidden="true"
          >
            <MapaVivo conexoes={conexoes} labels={false} interativo={false} particulas />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-glow">Ecossistema capixaba</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Onde a inovação acontece?</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              A inovação não acontece de forma isolada. Ela surge quando diferentes atores compartilham conhecimento, identificam oportunidades e constroem soluções juntos.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-3 gap-y-4">
              {atores.map(({ nome, Icon }, index) => (
                <div key={nome} className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/50 text-lilac">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium">{nome}</span>
                  {index < atores.length - 1 ? <span className="hidden h-px w-5 bg-glow/30 sm:block" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-paper text-paper-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-violet">Caminhos da Inovação</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Uma jornada para revelar, conectar e fortalecer a inovação capixaba.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 border-y border-primary/15 py-8 sm:grid-cols-3">
            {[['14', 'Núcleos Territoriais'], ['28', 'Conectores'], ['1', 'Rede Capixaba de Inovação']].map(([valor, label]) => (
              <div key={label} className="flex items-end gap-3">
                <strong className="font-display text-5xl text-primary">{valor}</strong>
                <span className="pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-paper-muted">{label}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-14 grid gap-8 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-primary/25 md:block" />
            {dimensoes.map((dimensao, index) => (
              <article key={dimensao.id} className="relative">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-primary/30 bg-paper text-lg shadow-sm">{dimensao.icone}</span>
                <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold uppercase">{dimensao.nome}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-muted">{dimensao.descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background text-foreground">
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-25" aria-hidden="true">
          <MapaVivo conexoes={conexoes} labels={false} interativo={false} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-glow">Sua jornada começa aqui</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Cada missão revela uma nova parte do ecossistema capixaba.</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">Comece pelo Núcleo Serra e transforme descobertas e conexões em impacto para o território.</p>
          <Button onClick={onIniciar} size="lg" className="panel-glow mt-9 h-12 rounded-md px-7 font-display text-xs font-semibold uppercase tracking-[0.16em]">
            Iniciar minha jornada <ArrowRight aria-hidden="true" />
          </Button>
          <Button asChild variant="ghost" size="lg" className="mt-9 h-12 text-lilac">
            <Link to="/entrar">Já participo do projeto</Link>
          </Button>
        </div>
      </section>
    </>
  );
}