import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Maximize2, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { HomeSections } from "@/components/home/HomeSections";
import { MapaVivo } from "@/components/MapaVivo";
import { ModoApresentacao } from "@/components/ModoApresentacao";
import { Button } from "@/components/ui/button";
import { useJornada } from "@/context/JornadaContext";
import { nucleoMap } from "@/data/nucleos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inovação no Espírito Santo — Caminhos da Inovação" },
      {
        name: "description",
        content: "Explore o território capixaba e descubra os atores, iniciativas e conexões que formam a rede de inovação do Espírito Santo.",
      },
      { property: "og:title", content: "Caminhos da Inovação — A inovação capixaba está em movimento" },
      { property: "og:description", content: "Uma plataforma que revela a inovação acontecendo no território do Espírito Santo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { conexoes } = useJornada();
  const exploracaoRef = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [apresentacao, setApresentacao] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const focado = nucleoMap[hover ?? selecionado ?? ""] ?? null;

  function explorarMapa() {
    setZoom(true);
    window.setTimeout(() => {
      exploracaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => setZoom(false), 650);
    }, 500);
  }

  function iniciarJornada() {
    setEntrando(true);
    setSelecionado("serra");
    window.setTimeout(() => navigate({ to: "/mapa" }), 950);
  }

  if (apresentacao) return <ModoApresentacao onSair={() => setApresentacao(false)} />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="absolute inset-x-0 top-0 z-40 border-b border-border/40 bg-background/65 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5">
          <a href="#inicio" className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Caminhos da Inovação</a>
          <nav aria-label="Navegação principal" className="ml-auto hidden items-center gap-6 lg:flex">
            <a href="#sobre" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Sobre</a>
            <a href="#inovacao" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Inovação</a>
            <a href="#territorios" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Territórios</a>
            <a href="#conectores" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Conectores</a>
          </nav>
          <Button variant="ghost" size="sm" onClick={() => setApresentacao(true)} className="ml-auto hidden text-[0.62rem] uppercase tracking-[0.14em] text-lilac sm:inline-flex lg:ml-2">
            <Maximize2 aria-hidden="true" /> Modo apresentação
          </Button>
          <Button asChild size="sm" className="hidden rounded-full px-5 text-[0.65rem] uppercase tracking-[0.14em] sm:inline-flex"><Link to="/entrar">Entrar <ArrowRight aria-hidden="true" /></Link></Button>
          <Button variant="ghost" size="icon" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuAberto((atual) => !atual)} className="lg:hidden">
            {menuAberto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        {menuAberto ? (
          <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Navegação móvel">
            {[["#sobre", "Sobre"], ["#inovacao", "Inovação"], ["#territorios", "Territórios"], ["#conectores", "Conectores"]].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuAberto(false)} className="block border-b border-border/40 py-3 text-sm">{label}</a>
            ))}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setApresentacao(true)} className="flex-1">Apresentação</Button>
              <Button asChild className="flex-1"><Link to="/entrar">Entrar</Link></Button>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section id="inicio" className="relative min-h-[780px] pt-20 lg:min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_38%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-4 px-5 pb-14 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">
            <div className="order-1 max-w-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-lilac">Caminhos da Inovação</p>
              <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">A inovação capixaba<br /><span className="text-gradient">está em movimento.</span></h1>
            </div>

            <div className="relative order-2 mx-auto aspect-[3/4] w-full max-w-[600px] lg:row-span-2 lg:ml-auto">
              <div className={`h-full w-full origin-[67%_62%] transition-transform duration-[900ms] ease-out ${zoom || entrando ? "scale-[1.28]" : "scale-100"}`}>
                <MapaVivo conexoes={[]} selecionado={selecionado} onSelecionar={setSelecionado} onHover={setHover} pontosTerritoriais labels destaque="serra" />
              </div>
              <p className="absolute bottom-2 right-2 text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">Contorno geográfico: IBGE</p>
              {focado ? <NucleoTooltip nucleoId={focado.id} /> : null}
            </div>

            <div className="order-3 max-w-xl lg:order-2">
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <p>A inovação acontece quando pessoas, ideias, conhecimento e territórios se conectam.</p>
                <p>O Caminhos da Inovação percorre o Espírito Santo para revelar atores, iniciativas, vocações e oportunidades que fortalecem o ecossistema capixaba de inovação.</p>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-4 border-y border-border/60 py-5 sm:gap-7">
                <Stat valor="14" label="Núcleos Territoriais" /><Stat valor="28" label="Conectores" />
              </div>
              <p className="mt-5 max-w-lg text-sm text-lilac">Cada ponto é uma descoberta.<br />Cada conexão abre um novo caminho.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={explorarMapa} size="lg" className="panel-glow h-12 rounded-md px-7 text-xs font-semibold uppercase tracking-[0.15em]">Explorar o mapa <ArrowDown aria-hidden="true" /></Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-7 text-xs font-semibold uppercase tracking-[0.15em]"><a href="#sobre">Conheça o projeto</a></Button>
              </div>
            </div>
          </div>
        </section>

        <section ref={exploracaoRef} id="territorios" className="scroll-mt-0 bg-paper text-paper-foreground">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-violet">Mapa da Inovação Capixaba</p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">Todo território guarda possibilidades.</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-muted">Explore o Espírito Santo e descubra como diferentes atores, iniciativas e conexões formam o nosso ecossistema de inovação.</p>
              <p className="mt-6 text-sm font-medium text-primary">Passe, toque ou use o teclado para conhecer os núcleos.</p>
            </div>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xl rounded-md border border-primary/15 bg-background p-4 shadow-2xl shadow-primary/10 sm:p-7">
              <MapaVivo conexoes={[]} selecionado={selecionado} onSelecionar={setSelecionar} onHover={setHover} pontosTerritoriais destaque="serra" />
              {focado ? <NucleoTooltip nucleoId={focado.id} light /> : null}
              <p className="absolute bottom-3 right-4 text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">Fonte do contorno: IBGE</p>
            </div>
          </div>
        </section>

        <HomeSections onIniciar={iniciarJornada} />
      </main>
    </div>
  );
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return <div><strong className="font-display text-3xl font-semibold text-foreground">{valor}</strong><span className="mt-1 block max-w-36 text-[0.58rem] font-semibold uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">{label}</span></div>;
}

function NucleoTooltip({ nucleoId, light = false }: { nucleoId: string; light?: boolean }) {
  const nucleo = nucleoMap[nucleoId];
  if (!nucleo) return null;
  return (
    <div className={`absolute bottom-5 left-5 z-20 w-[min(16rem,calc(100%-2.5rem))] animate-scale-in rounded-md border p-4 shadow-2xl backdrop-blur-xl ${light ? "border-primary/20 bg-paper/95 text-paper-foreground" : "border-border bg-surface/95 text-foreground"}`}>
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-violet">Núcleo {nucleo.nome}</p>
      <div className={`mt-3 space-y-1.5 text-xs ${light ? "text-paper-muted" : "text-muted-foreground"}`}>
        <p><strong className="text-current">{nucleo.atores}</strong> atores mapeados</p>
        <p><strong className="text-current">{nucleo.escutas}</strong> escutas realizadas</p>
        <p><strong className="text-current">{nucleo.conexoes}</strong> conexões criadas</p>
        <p><strong className="text-current">{nucleo.inovacoes}</strong> inovações identificadas</p>
      </div>
      <Link to="/mapa" className="mt-4 flex items-center justify-between border-t border-current/10 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-primary">Explorar território <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>
  );
}