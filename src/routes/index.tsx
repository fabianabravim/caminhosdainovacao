import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Compass, Maximize2, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { HomeSections } from "@/components/home/HomeSections";
import { ChancelaInstitucional } from "@/components/ChancelaInstitucional";
import { MapaVivo } from "@/components/MapaVivo";
import { ModoApresentacao } from "@/components/ModoApresentacao";
import { Button } from "@/components/ui/button";
import { nucleoMap } from "@/data/nucleos";
import litoral from "@/assets/litoral.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caminhos da Inovação — Território capixaba" },
      { name: "description", content: "Pessoas, inovação e território conectados em uma jornada por todo o Espírito Santo." },
      { property: "og:title", content: "Caminhos da Inovação — A inovação capixaba está em movimento" },
      { property: "og:description", content: "Uma jornada para explorar, conectar, descobrir e transformar o território capixaba." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const exploracaoRef = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [apresentacao, setApresentacao] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const focado = nucleoMap[hover ?? selecionado ?? ""] ?? null;

  function explorarMapa() {
    setZoom(true);
    window.setTimeout(() => {
      exploracaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => setZoom(false), 650);
    }, 450);
  }

  if (apresentacao) return <ModoApresentacao onSair={() => setApresentacao(false)} />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="absolute inset-x-0 top-0 z-40 border-b border-primary-foreground/15 bg-brand-dark/92 text-primary-foreground backdrop-blur-xl">
        <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 lg:flex">
          <ChancelaInstitucional />
          <span aria-hidden="true" className="hidden h-7 w-px bg-primary-foreground/20 lg:block" />
          <a href="#inicio" className="hidden text-xs font-semibold uppercase tracking-[0.14em] lg:block">Caminhos da Inovação</a>
          <nav aria-label="Navegação principal" className="ml-auto hidden items-center gap-6 lg:flex">
            <a href="#sobre" className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Sobre</a>
            <a href="#jornada" className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Como funciona</a>
            <a href="#territorios" className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Territórios</a>
            <a href="#conectores" className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground">Pessoas</a>
          </nav>
          <Button variant="ghost" size="sm" onClick={() => setApresentacao(true)} className="hidden text-[0.62rem] uppercase tracking-[0.12em] text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex lg:ml-1">
            <Maximize2 aria-hidden="true" /> Apresentação
          </Button>
          <Button asChild size="sm" className="hidden rounded-full bg-primary-foreground px-5 text-[0.68rem] font-semibold text-brand-dark hover:bg-primary-foreground/90 sm:inline-flex">
            <Link to="/entrar">Entrar na Jornada <ArrowRight aria-hidden="true" /></Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label={menuAberto ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuAberto((atual) => !atual)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden">
            {menuAberto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        {menuAberto ? (
          <nav className="border-t border-primary-foreground/15 bg-brand-dark px-5 py-5 lg:hidden" aria-label="Navegação móvel">
            {[["#sobre", "Sobre o projeto"], ["#jornada", "Como funciona"], ["#territorios", "Territórios"], ["#conectores", "Pessoas"]].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuAberto(false)} className="block border-b border-primary-foreground/15 py-3 text-sm text-primary-foreground/80">{label}</a>
            ))}
            <Button asChild className="mt-4 w-full bg-primary-foreground text-brand-dark hover:bg-primary-foreground/90"><Link to="/entrar">Entrar na Jornada</Link></Button>
          </nav>
        ) : null}
      </header>

      <main>
        <section id="inicio" className="relative min-h-[760px] overflow-hidden bg-brand-dark pt-[4.5rem] text-primary-foreground lg:min-h-[820px]">
          <img src={litoral} alt="Paisagem do litoral do Espírito Santo" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--brand-dark)_0%,color-mix(in_oklab,var(--brand-dark)_92%,transparent)_42%,color-mix(in_oklab,var(--brand-dark)_28%,transparent)_78%,var(--brand-dark)_115%)]" />
          <div className="topo-lines absolute inset-0 opacity-45" />
          <div className="relative mx-auto grid min-h-[688px] max-w-7xl items-center gap-4 px-5 py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,1.05fr)] lg:py-16">
            <div className="z-10 max-w-2xl">
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-energy"><span className="h-px w-8 bg-energy" /> Espírito Santo em movimento</p>
              <h1 className="mt-5 font-brand text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">Territórios que conectam pessoas, ideias e futuro.</h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/82 sm:text-lg">O Caminhos da Inovação percorre o Espírito Santo para revelar atores, iniciativas, vocações e oportunidades que fortalecem o ecossistema capixaba.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-energy px-7 font-semibold text-brand-dark hover:bg-energy/90"><Link to="/entrar">Entrar na Jornada <ArrowRight /></Link></Button>
                <Button onClick={explorarMapa} variant="outline" size="lg" className="h-12 rounded-full border-primary-foreground/35 bg-primary-foreground/8 px-7 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">Explorar os territórios <ArrowDown /></Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[610px]" style={{ aspectRatio: "0.79" }}>
              <div className="absolute inset-0 rounded-full bg-primary-foreground/5 blur-3xl" />
              <div className={`relative h-full w-full origin-center transition-transform duration-[900ms] ease-out ${zoom ? "scale-[1.16]" : "scale-100"}`}>
                <MapaVivo conexoes={[]} selecionado={selecionado} onSelecionar={setSelecionado} onHover={setHover} pontosTerritoriais labels destaque="serra" />
              </div>
              <p className="absolute bottom-2 right-2 text-[0.55rem] uppercase tracking-[0.12em] text-primary-foreground/55">Fonte cartográfica: GEOBASES / IDAF</p>
              {focado ? <NucleoTooltip nucleoId={focado.id} /> : null}
            </div>
          </div>
          <div className="relative mx-auto -mt-1 grid max-w-7xl grid-cols-2 border-y border-primary-foreground/15 bg-brand-dark/80 px-5 backdrop-blur-xl sm:grid-cols-4">
            <Stat valor="14" label="Núcleos de Inovação" />
            <Stat valor="28" label="Conectores" />
            <Stat valor="ES" label="Espírito Santo" />
            <Stat valor="+" label="Inteligência territorial" />
          </div>
        </section>

        <section ref={exploracaoRef} id="territorios" className="scroll-mt-0 bg-paper text-paper-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet"><Compass className="h-4 w-4" /> Espírito Santo em rede</p>
              <h2 className="mt-5 font-brand-condensed text-5xl font-semibold leading-[0.98] sm:text-6xl">Nosso território.<br />Muitos caminhos.</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-muted">Os 14 Núcleos de Inovação estão distribuídos pelo Espírito Santo. Explore o mapa oficial e conheça os territórios onde essa jornada acontece.</p>
              <Button asChild className="mt-7 rounded-full px-6"><Link to="/mapa">Explorar o mapa <ArrowRight /></Link></Button>
            </div>
            <div className="surface-territory relative mx-auto w-full overflow-hidden rounded-lg border border-primary/15 p-4 shadow-xl shadow-primary/10 sm:p-7" style={{ aspectRatio: "1.2" }}>
              <div className="absolute inset-0 topo-lines opacity-40" />
              <MapaVivo conexoes={[]} selecionado={selecionado} onSelecionar={setSelecionado} onHover={setHover} pontosTerritoriais destaque="serra" />
              {focado ? <NucleoTooltip nucleoId={focado.id} light /> : null}
              <p className="absolute bottom-3 right-4 text-[0.55rem] uppercase tracking-[0.1em] text-muted-foreground">Fonte cartográfica: GEOBASES / IDAF</p>
            </div>
          </div>
        </section>

        <HomeSections />
      </main>

      <footer className="institutional-dark border-t border-primary-foreground/15">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <ChancelaInstitucional tamanho="footer" />
          <div className="sm:justify-self-end sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">Caminhos da Inovação</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-primary-foreground/65">Uma iniciativa institucional do IJSN, da FAPES e do Governo do Estado do Espírito Santo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return <div className="border-primary-foreground/15 px-4 py-5 odd:border-r sm:border-r sm:last:border-r-0"><strong className="font-brand-condensed text-3xl font-semibold text-primary-foreground">{valor}</strong><span className="mt-1 block text-[0.6rem] font-semibold uppercase leading-relaxed tracking-[0.12em] text-primary-foreground/65">{label}</span></div>;
}

function NucleoTooltip({ nucleoId, light = false }: { nucleoId: string; light?: boolean }) {
  const nucleo = nucleoMap[nucleoId];
  if (!nucleo) return null;
  return (
    <div className={`absolute bottom-5 left-5 z-20 w-[min(16rem,calc(100%-2.5rem))] animate-scale-in rounded-md border p-4 shadow-2xl backdrop-blur-xl ${light ? "border-primary/20 bg-paper/95 text-paper-foreground" : "border-primary-foreground/20 bg-brand-dark/92 text-primary-foreground"}`}>
      <p className={`text-[0.58rem] font-semibold uppercase tracking-[0.18em] ${light ? "text-violet" : "text-energy"}`}>Núcleo {nucleo.nome}</p>
      <p className={`mt-2 text-xs leading-relaxed ${light ? "text-paper-muted" : "text-primary-foreground/70"}`}>{nucleo.destaque}</p>
      <Link to="/mapa" className={`mt-3 flex items-center justify-between border-t pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${light ? "border-primary/15 text-primary" : "border-primary-foreground/15 text-energy"}`}>Explorar território <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}