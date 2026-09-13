import { Progresso } from "@/components/ui/Progresso";
import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { dimensoes } from "@/data/dimensoes";

/**
 * Jornada de progresso pelas 4 dimensões. Elas não são etapas bloqueadas:
 * evoluem simultaneamente conforme as missões do território avançam.
 */
export function JornadaDimensoes() {
  const { progressoPorDimensao } = useMeuNucleo();

  return (
    <div className="panel h-full min-w-0 rounded-3xl p-4 sm:p-5">
      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Jornada de progresso</p>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        As quatro dimensões evoluem simultaneamente — cada missão fortalece o território.
      </p>
      <ol className="mt-4 space-y-1">
        {dimensoes.map((d, i) => (
          <li key={d.id}>
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg"
                style={{
                  backgroundColor: `color-mix(in oklab, ${d.colorVar} 16%, transparent)`,
                  boxShadow: `0 0 18px -8px ${d.colorVar}`,
                }}
                aria-hidden
              >
                {d.icone}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-sm font-semibold" style={{ color: d.colorVar }}>
                    {d.nome}
                  </p>
                  <span className="text-[0.7rem] font-semibold text-muted-foreground">
                    {progressoPorDimensao[d.id]}%
                  </span>
                </div>
                <Progresso valor={progressoPorDimensao[d.id]} cor={d.colorVar} className="mt-1.5" />
              </div>
            </div>
            {i < dimensoes.length - 1 ? (
              <div className="flex w-10 justify-center py-1" aria-hidden>
                <span className="text-xs text-muted-foreground/50">↓</span>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
