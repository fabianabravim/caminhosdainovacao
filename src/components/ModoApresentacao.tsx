import { useEffect, useMemo, useRef, useState } from "react";
import { MapaVivo } from "@/components/MapaVivo";
import { conexoes as conexoesBase, nucleos } from "@/data/nucleos";
import { descobertas } from "@/data/descobertas";

const etapas = [
  { id: 0, dur: 3200 },
  { id: 1, dur: 2800 },
  { id: 2, dur: 2800 },
  { id: 3, dur: 6000 },
  { id: 4, dur: 5000 },
  { id: 5, dur: 3600 },
  { id: 6, dur: 6000 },
  { id: 7, dur: 5200 },
] as const;

export function ModoApresentacao({ onSair }: { onSair: () => void }) {
  const [etapa, setEtapa] = useState(0);
  const [revelados, setRevelados] = useState(0);
  const [ciclo, setCiclo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSair();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSair]);

  useEffect(() => {
    if (etapa >= etapas.length) return;
    const t = setTimeout(() => setEtapa((e) => e + 1), etapas[etapa]!.dur);
    return () => clearTimeout(t);
  }, [etapa, ciclo]);

  useEffect(() => {
    if (etapa < 3) {
      setRevelados(0);
      return;
    }
    if (etapa > 3) {
      setRevelados(nucleos.length);
      return;
    }
    const i = setInterval(() => {
      setRevelados((r) => (r >= nucleos.length ? r : r + 1));
    }, 380);
    return () => clearInterval(i);
  }, [etapa]);

  const visiveis = useMemo(() => nucleos.slice(0, revelados).map((n) => n.id), [revelados]);
  const mostrarConexoes = etapa >= 4;
  const zoom = etapa >= 3 ? 1.06 : 1;

  const reiniciar = () => {
    setEtapa(0);
    setRevelados(0);
    setCiclo((c) => c + 1);
  };

  const legenda = (() => {
    switch (etapa) {
      case 0:
        return { titulo: "CAMINHOS DA INOVAÇÃO", sub: "Jornada da Inovação Capixaba" };
      case 1:
        return { titulo: "14 TERRITÓRIOS", sub: "Núcleos regionais do Espírito Santo" };
      case 2:
        return { titulo: "28 CONECTORES", sub: "Pessoas que escutam e articulam o território" };
      case 3:
        return { titulo: "", sub: "Cada ponto é uma descoberta." };
      case 4:
        return { titulo: "", sub: "Cada linha é uma conexão." };
      case 5:
        return { titulo: "Uma rede de inovação está sendo revelada.", sub: "" };
      case 6:
        return { titulo: "", sub: "Núcleos e descobertas do território" };
      default:
        return {
          titulo: "EXPLORE. CONECTE. DESCUBRA. TRANSFORME.",
          sub: "• CAMINHOS DA INOVAÇÃO •",
        };
    }
  })();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      role="dialog"
      aria-label="Modo apresentação"
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-[2500ms] ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="h-[92vh] w-[92vh] max-w-[95vw]">
          <MapaVivo
            conexoes={conexoesBase}
            labels={etapa >= 6}
            interativo={false}
            particulas={etapa >= 4}
            visiveis={visiveis}
            conexoesVisiveis={mostrarConexoes}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/70" />

      <div
        className={`absolute inset-x-0 bottom-0 top-0 flex flex-col items-center px-8 text-center ${
          etapa >= 3 && etapa <= 6 ? "justify-end pb-24" : "justify-center"
        }`}
      >
        <div key={`${ciclo}-${etapa}`} className="animate-fade-in">
          {legenda.titulo ? (
            <h2 className="font-display text-4xl font-semibold leading-tight text-gradient sm:text-6xl">
              {legenda.titulo}
            </h2>
          ) : null}
          {legenda.sub ? (
            <p className="mt-4 text-base tracking-[0.18em] text-lilac/90 sm:text-xl">
              {legenda.sub}
            </p>
          ) : null}
        </div>

        {etapa === 6 ? (
          <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
            {descobertas.slice(0, 3).map((d) => (
              <div key={d.id} className="panel animate-fade-in rounded-2xl p-3 text-left">
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-lilac/80">
                  {d.nucleo}
                </p>
                <p className="mt-1 font-display text-sm font-semibold leading-snug">{d.titulo}</p>
              </div>
            ))}
          </div>
        ) : null}

        {etapa >= etapas.length ? (
          <div className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={reiniciar}
              className="tap panel-glow rounded-2xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground"
            >
              Reiniciar sequência
            </button>
            <button
              onClick={onSair}
              className="tap rounded-2xl border border-border/70 bg-surface/60 px-6 py-3 font-display text-sm font-semibold"
            >
              Sair do modo apresentação
            </button>
          </div>
        ) : null}
      </div>

      <button
        onClick={onSair}
        className="tap absolute right-5 top-5 rounded-full border border-border/70 bg-surface/60 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground"
      >
        SAIR (ESC)
      </button>

      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1.5">
        {[...etapas, { id: 8, dur: 0 }].map((e, i) => (
          <span
            key={e.id}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= etapa ? "w-8 bg-glow/80" : "w-4 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
