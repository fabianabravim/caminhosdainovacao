import { dimensoes, progressoDimensoes } from "@/data/dimensoes";
import { Progresso } from "@/components/ui/Progresso";

export function DimensoesGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {dimensoes.map((d) => (
        <div key={d.id} className="panel tap rounded-2xl p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-base">{d.icone}</span>
            <span className="font-display text-sm font-semibold" style={{ color: d.colorVar }}>
              {d.nome}
            </span>
            <span className="ml-auto text-xs font-semibold text-muted-foreground">
              {progressoDimensoes[d.id]}%
            </span>
          </div>
          <Progresso valor={progressoDimensoes[d.id]} cor={d.colorVar} className="mt-2.5" />
          <p className="mt-2 text-[0.72rem] leading-relaxed text-muted-foreground">{d.descricao}</p>
        </div>
      ))}
    </div>
  );
}

export function DimensoesBarras() {
  const max = Math.max(...Object.values(progressoDimensoes));
  return (
    <div className="panel rounded-2xl p-4">
      <p className="font-display text-sm font-semibold">Equilíbrio das 4 dimensões</p>
      <div className="mt-4 flex h-36 items-end justify-between gap-3">
        {dimensoes.map((d) => {
          const v = progressoDimensoes[d.id];
          return (
            <div key={d.id} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[0.68rem] font-semibold" style={{ color: d.colorVar }}>
                {v}%
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg transition-[height] duration-700"
                  style={{
                    height: `${(v / max) * 100}%`,
                    background: `linear-gradient(180deg, ${d.colorVar}, color-mix(in oklab, ${d.colorVar} 25%, transparent))`,
                    boxShadow: `0 0 22px -8px ${d.colorVar}`,
                  }}
                />
              </div>
              <span className="text-base leading-none">{d.icone}</span>
              <span className="text-[0.62rem] text-muted-foreground">{d.nome}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
