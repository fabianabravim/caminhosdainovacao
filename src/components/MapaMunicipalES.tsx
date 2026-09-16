import { Database, Layers3, MapPinned, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  MUNICIPIOS_VIEWBOX,
  MUNICIPIOS_VIEW_HEIGHT,
  MUNICIPIOS_VIEW_WIDTH,
  municipiosES,
  normalizarBusca,
  type MunicipioES,
} from "@/lib/municipiosES";
import { cn } from "@/lib/utils";

type ModoMapa = "municipios" | "nucleos";

const camadasFuturas = [
  "Atores da inovação",
  "Universidades",
  "Empresas",
  "Startups",
  "Ambientes de inovação",
  "Iniciativas",
  "Oportunidades",
];

const indicadores = [
  "Atores mapeados",
  "Iniciativas",
  "Ambientes de inovação",
  "Oportunidades identificadas",
];

export function MapaMunicipalES() {
  const [modo, setModo] = useState<ModoMapa>("municipios");
  const [busca, setBusca] = useState("");
  const [hover, setHover] = useState<MunicipioES | null>(null);
  const [selecionado, setSelecionado] = useState<MunicipioES | null>(null);
  const [camadasAbertas, setCamadasAbertas] = useState(false);

  const sugestoes = useMemo(() => {
    const termo = normalizarBusca(busca.trim());
    if (!termo) return [];
    return municipiosES.filter((municipio) => normalizarBusca(municipio.nome).includes(termo)).slice(0, 7);
  }, [busca]);

  const foco = hover ?? selecionado;
  const viewBoxSelecionado = useMemo(() => {
    if (!selecionado) return MUNICIPIOS_VIEWBOX;
    const proporcao = MUNICIPIOS_VIEW_WIDTH / MUNICIPIOS_VIEW_HEIGHT;
    const largura = Math.max(selecionado.limites.largura * 3.2, 145);
    const altura = Math.max(selecionado.limites.altura * 3.2, largura / proporcao);
    const larguraAjustada = Math.max(largura, altura * proporcao);
    const centroX = selecionado.limites.x + selecionado.limites.largura / 2;
    const centroY = selecionado.limites.y + selecionado.limites.altura / 2;
    return `${centroX - larguraAjustada / 2} ${centroY - altura / 2} ${larguraAjustada} ${altura}`;
  }, [selecionado]);
  const selecionar = (municipio: MunicipioES) => {
    setSelecionado(municipio);
    setHover(null);
    setBusca(municipio.nome);
  };

  return (
    <section aria-label="Exploração dos territórios capixabas" className="relative mt-7">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid min-w-0 grid-cols-2 rounded-md border border-border/70 bg-surface/65 p-1" aria-label="Modo de visualização">
          <Button
            variant={modo === "municipios" ? "default" : "ghost"}
            onClick={() => setModo("municipios")}
            aria-pressed={modo === "municipios"}
            className="h-10 min-w-0 px-2 text-[0.65rem] uppercase tracking-[0.08em] sm:px-4 sm:text-xs"
          >
            Municípios
          </Button>
          <Button
            variant={modo === "nucleos" ? "default" : "ghost"}
            onClick={() => setModo("nucleos")}
            aria-pressed={modo === "nucleos"}
            className="h-10 min-w-0 whitespace-normal px-2 text-[0.62rem] uppercase leading-tight tracking-[0.06em] sm:px-4 sm:text-xs"
          >
            Núcleos Territoriais
          </Button>
        </div>

        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-2 lg:w-[34rem]">
          <div className="relative min-w-0">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              onFocus={() => setHover(null)}
              placeholder="Buscar município ou território..."
              aria-label="Buscar município ou território"
              autoComplete="off"
              className="h-12 bg-surface/70 pl-10 pr-9"
            />
            {busca ? (
              <Button variant="ghost" size="icon" onClick={() => setBusca("")} aria-label="Limpar busca" className="absolute right-1.5 top-1.5 h-9 w-9">
                <X aria-hidden="true" />
              </Button>
            ) : null}
            {busca && busca !== selecionado?.nome ? (
              <div className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-40 overflow-hidden rounded-md border border-border bg-surface shadow-2xl">
                {sugestoes.length ? sugestoes.map((municipio) => (
                  <Button
                    key={municipio.codigo}
                    variant="ghost"
                    onClick={() => selecionar(municipio)}
                    className="h-auto w-full justify-start rounded-none border-b border-border/40 px-4 py-3 text-left last:border-0"
                  >
                    <MapPinned aria-hidden="true" className="text-lilac" /> {municipio.nome}
                  </Button>
                )) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum município encontrado.</p>
                )}
              </div>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCamadasAbertas((aberto) => !aberto)}
            aria-label="Camadas do mapa"
            aria-expanded={camadasAbertas}
            className="h-12 w-12 bg-surface/70"
          >
            <Layers3 aria-hidden="true" />
          </Button>
          {camadasAbertas ? <PainelCamadas modo={modo} /> : null}
        </div>
      </div>

      <div className="relative mt-3 min-h-[36rem] overflow-hidden rounded-lg border border-primary/15 bg-surface/60 shadow-xl shadow-primary/5 lg:min-h-[43rem]">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_30%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_30%,transparent)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className={cn("relative h-[36rem] w-full transition-opacity duration-500 lg:h-[43rem]", modo === "nucleos" && "opacity-35")}>
          <svg
            viewBox={viewBoxSelecionado}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Mapa oficial dos 78 municípios do Espírito Santo"
            className="h-full w-full p-4 sm:p-6"
          >
            <defs>
              <filter id="brilhoMunicipal" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="desfoque" />
                <feMerge><feMergeNode in="desfoque" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g className="anim-mapa-fill">
              {municipiosES.map((municipio) => {
                const ativo = municipio.codigo === selecionado?.codigo;
                const sobre = municipio.codigo === hover?.codigo;
                return (
                  <path
                    key={municipio.codigo}
                    d={municipio.path}
                    fillRule="evenodd"
                    tabIndex={modo === "municipios" ? 0 : -1}
                    role={modo === "municipios" ? "button" : undefined}
                    aria-label={modo === "municipios" ? `Explorar município ${municipio.nome}` : undefined}
                    aria-pressed={modo === "municipios" ? ativo : undefined}
                    onMouseEnter={() => modo === "municipios" && setHover(municipio)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => modo === "municipios" && setHover(municipio)}
                    onBlur={() => setHover(null)}
                    onClick={() => modo === "municipios" && selecionar(municipio)}
                    onKeyDown={(evento) => {
                      if (modo === "municipios" && (evento.key === "Enter" || evento.key === " ")) {
                        evento.preventDefault();
                        selecionar(municipio);
                      }
                    }}
                    className={cn(
                      "cursor-pointer stroke-lilac/35 [vector-effect:non-scaling-stroke] outline-none transition-[fill,stroke,opacity] duration-200 focus:stroke-glow",
                      ativo ? "fill-primary/80 stroke-glow" : sobre ? "fill-lilac/60 stroke-glow" : "fill-primary/20 hover:fill-lilac/50",
                    )}
                    strokeWidth={ativo || sobre ? 1.5 : 0.65}
                    filter={ativo ? "url(#brilhoMunicipal)" : undefined}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {modo === "nucleos" ? (
          <div className="absolute inset-0 z-20 grid place-items-center px-5 text-center">
            <div className="max-w-md rounded-md border border-border bg-background/90 p-6 shadow-2xl backdrop-blur-xl">
              <Database aria-hidden="true" className="mx-auto h-6 w-6 text-lilac" />
              <h2 className="mt-4 font-display text-lg font-semibold">Camada preparada</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A composição oficial município → Núcleo Territorial ainda será incorporada. Nenhum agrupamento provisório é exibido.</p>
            </div>
          </div>
        ) : null}

        {foco && modo === "municipios" ? (
          <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-[calc(100%-2rem)] rounded-md border border-lilac/30 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-6 sm:top-6">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-lilac">Município</p>
            <p className="mt-0.5 font-display text-base font-semibold">{foco.nome}</p>
            <p className="mt-1 text-xs text-muted-foreground">Núcleo Territorial: Dados em construção</p>
          </div>
        ) : null}

        {selecionado && modo === "municipios" ? (
          <Button variant="outline" size="sm" onClick={() => { setSelecionado(null); setBusca(""); }} className="absolute bottom-9 right-4 z-20 bg-background/90 text-xs sm:right-6">
            Ver todo o Estado
          </Button>
        ) : null}

        <p className="absolute bottom-3 left-4 z-10 max-w-[calc(100%-2rem)] text-[0.55rem] uppercase leading-relaxed tracking-[0.08em] text-muted-foreground sm:left-6">
          Fonte cartográfica: IBGE — Malha Municipal 2024 · SIRGAS 2000
        </p>
      </div>

      {selecionado ? <PainelMunicipio municipio={selecionado} onFechar={() => setSelecionado(null)} /> : null}
    </section>
  );
}

function PainelCamadas({ modo }: { modo: ModoMapa }) {
  return (
    <div className="absolute right-0 top-[calc(100%+0.35rem)] z-40 w-[min(21rem,calc(100vw-2rem))] rounded-md border border-border bg-surface p-4 shadow-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]"><Layers3 className="h-4 w-4 text-lilac" /> Camadas</div>
      <div className="mt-4 space-y-3">
        <Camada label="Municípios" checked />
        <Camada label="Núcleos Territoriais" checked={modo === "nucleos"} nota="Aguardando composição oficial" />
        <div className="border-t border-border/60 pt-3">
          {camadasFuturas.map((camada) => <Camada key={camada} label={camada} />)}
        </div>
      </div>
    </div>
  );
}

function Camada({ label, checked = false, nota }: { label: string; checked?: boolean; nota?: string }) {
  return (
    <div className="mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5 last:mb-0">
      <Checkbox checked={checked} disabled aria-label={label} className="mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm leading-5 text-foreground">{label}</p>
        {nota ? <p className="text-[0.65rem] leading-4 text-muted-foreground">{nota}</p> : null}
      </div>
    </div>
  );
}

function PainelMunicipio({ municipio, onFechar }: { municipio: MunicipioES; onFechar: () => void }) {
  return (
    <aside aria-label={`Informações de ${municipio.nome}`} className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-y-auto border-t border-lilac/30 bg-background/95 p-5 pb-24 shadow-2xl backdrop-blur-xl lg:absolute lg:inset-x-auto lg:bottom-6 lg:right-6 lg:top-20 lg:z-30 lg:w-[22rem] lg:max-h-none lg:overflow-visible lg:rounded-md lg:border lg:p-6">
      <Button variant="ghost" size="icon" onClick={onFechar} aria-label="Fechar informações do município" className="absolute right-3 top-3">
        <X aria-hidden="true" />
      </Button>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-lilac">Município</p>
      <h2 className="mt-2 pr-10 font-display text-2xl font-semibold">{municipio.nome}</h2>
      <div className="mt-5 border-y border-border/60 py-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Núcleo Territorial</p>
        <p className="mt-1 text-sm font-medium">Dados em construção</p>
      </div>
      <dl className="mt-2 divide-y divide-border/50">
        {indicadores.map((indicador) => (
          <div key={indicador} className="py-4">
            <dt className="text-[0.6rem] font-semibold uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">{indicador}</dt>
            <dd className="mt-1 text-sm font-medium text-lilac">Dados em construção</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export const proporcaoMapaMunicipal = `${MUNICIPIOS_VIEW_WIDTH} / ${MUNICIPIOS_VIEW_HEIGHT}`;