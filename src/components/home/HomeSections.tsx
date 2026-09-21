import { ArrowRight, Building2, Factory, FlaskConical, GraduationCap, Landmark, Lightbulb, Network, Rocket, Sprout, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { dimensoes } from "@/data/dimensoes";
import comunidade from "@/assets/comunidade.jpg";
import caparao from "@/assets/caparao.jpg";
import rioDoce from "@/assets/rio-doce.jpg";

const conceitos = [
  { titulo: "Novas soluções", texto: "Ideias que resolvem problemas de novas maneiras.", Icon: Lightbulb },
  { titulo: "Melhores processos", texto: "Novas formas de produzir, organizar e prestar serviços.", Icon: Sprout },
  { titulo: "Conexões", texto: "Pessoas e organizações trabalhando juntas.", Icon: Network },
  { titulo: "Território", texto: "Soluções conectadas às necessidades e oportunidades locais.", Icon: Landmark },
  { titulo: "Impacto", texto: "Conhecimento transformado em desenvolvimento.", Icon: Rocket },
] as const;

const atores = [
  { nome: "Universidades", Icon: GraduationCap }, { nome: "Empresas", Icon: Factory },
  { nome: "Startups", Icon: Rocket }, { nome: "Governos", Icon: Landmark },
  { nome: "Ensino e pesquisa", Icon: FlaskConical }, { nome: "Ambientes de inovação", Icon: Building2 },
  { nome: "Empreendedores", Icon: Sprout }, { nome: "Comunidades", Icon: Users },
] as const;

const textosDimensao = [
  ["Conhecer e mapear o território.", "Atores, ativos, visitas e escutas."],
  ["Aproximar atores e instituições.", "Reuniões, articulações e colaboração."],
  ["Identificar o que o território revela.", "Iniciativas, vocações, oportunidades e lacunas."],
  ["Converter conhecimento e articulação em ação.", "Mobilização, oficinas e resultados."],
] as const;

/** Destaque aplicado às expressões-chave da definição institucional de inovação. */
const destaque = "font-semibold text-foreground underline decoration-energy decoration-2 underline-offset-[5px]";

export function HomeSections() {
  return (
    <>
      <section id="inovacao" className="relative overflow-hidden bg-surface text-foreground">
        <div className="topo-lines absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet">Inovação com propósito</p>
              <h2 className="mt-5 font-brand-condensed text-5xl font-semibold leading-[0.98] sm:text-6xl">O que entendemos por inovação?</h2>
              <div className="mt-7 max-w-xl space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>Para o Caminhos da Inovação, inovar é <span className={destaque}>transformar ou incorporar conhecimentos</span> em práticas, produtos, serviços e processos capazes de gerar valor para os territórios.</p>
                <p>A inovação, <span className={destaque}>além da tecnologia</span>, abrange soluções organizacionais, metodológicas, institucionais e novos modelos de negócio, com potencial de produzir <span className={destaque}>impactos sociais, econômicos, culturais e/ou ambientais</span>.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <img src={comunidade} alt="Pessoas colaborando em um ambiente de inovação" className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,color-mix(in_oklab,var(--brand-dark)_88%,transparent))]" />
              <p className="absolute bottom-5 left-5 max-w-xs text-xl font-semibold leading-tight text-primary-foreground">A inovação ganha forma quando pessoas e territórios trabalham juntos.</p>
            </div>
          </div>

          <div className="mt-14">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Desdobramentos do conceito</p>
            <div className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-5">
              {conceitos.map(({ titulo, texto, Icon }) => (
                <div key={titulo} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-border py-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                  <div><h3 className="text-sm font-semibold">{titulo}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{texto}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="jornada" className="relative overflow-hidden bg-brand-dark text-primary-foreground">
        <div className="topo-lines absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-energy">Caminhos da Inovação</p>
            <h2 className="mt-5 font-brand-condensed text-5xl font-semibold leading-none sm:text-6xl">Uma Jornada em quatro dimensões</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/72">Do mapeamento à transformação, conectando territórios e gerando oportunidades reais.</p>
          </div>
          <div className="relative mt-14 grid gap-7 md:grid-cols-4">
            <div className="route-line absolute left-[10%] right-[10%] top-7 hidden h-0.5 md:block" />
            {dimensoes.map((dimensao, index) => {
              const transformar = dimensao.id === "transformar";
              return (
                <article key={dimensao.id} className="relative grid grid-cols-[3.75rem_minmax(0,1fr)] gap-4 md:block">
                  <span className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border text-xl shadow-xl ${transformar ? "border-energy bg-energy text-brand-dark" : "border-primary-foreground/25 bg-brand-dark text-primary-foreground"}`}>{dimensao.icone}</span>
                  <div className="md:mt-6">
                    <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${transformar ? "text-energy" : "text-primary-foreground/55"}`}>0{index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold uppercase">{dimensao.nome}</h3>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-primary-foreground/90">{textosDimensao[index]?.[0]}</p>
                    <p className="mt-1 text-sm leading-relaxed text-primary-foreground/60">{textosDimensao[index]?.[1]}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <Button asChild className="mt-12 rounded-full bg-energy px-7 text-brand-dark hover:bg-energy/90"><Link to="/entrar">Entrar na Jornada <ArrowRight /></Link></Button>
        </div>
      </section>

      <section id="conectores" className="bg-paper text-paper-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet">Ecossistema capixaba</p>
            <h2 className="mt-5 font-brand-condensed text-5xl font-semibold leading-none sm:text-6xl">Onde a inovação acontece?</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-muted">Ela surge quando diferentes atores compartilham conhecimento, identificam oportunidades e constroem soluções juntos.</p>
            <div className="mt-8 grid grid-cols-2 gap-x-5 sm:grid-cols-4 lg:grid-cols-2">
              {atores.map(({ nome, Icon }) => (
                <div key={nome} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2 border-t border-primary/15 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                  <span className="text-sm font-medium leading-5">{nome}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={caparao} alt="Paisagem do território capixaba" className="h-full min-h-80 w-full rounded-lg object-cover" loading="lazy" />
            <img src={rioDoce} alt="Cidade e território no Espírito Santo" className="mt-10 h-full min-h-80 w-full rounded-lg object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section id="sobre" className="relative overflow-hidden bg-surface py-20 text-foreground sm:py-28">
        <div className="topo-lines absolute inset-0 opacity-55" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet">Uma jornada coletiva</p>
              <h2 className="mt-5 max-w-3xl font-brand-condensed text-5xl font-semibold leading-none sm:text-6xl">Explorar. Conectar. Descobrir. Transformar.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Entre na Jornada da Inovação Capixaba e ajude a revelar, fortalecer e transformar o ecossistema de inovação do seu território.</p>
            </div>
            <div className="lg:justify-self-end"><Button asChild size="lg" className="h-12 rounded-full px-7"><Link to="/entrar">Entrar na Jornada <ArrowRight /></Link></Button></div>
          </div>
        </div>
      </section>
    </>
  );
}