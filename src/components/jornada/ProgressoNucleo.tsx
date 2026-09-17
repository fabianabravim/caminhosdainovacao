import { Progresso } from "@/components/ui/Progresso";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { dimensoes } from "@/data/dimensoes";

/**
 * Progresso coletivo do Núcleo Territorial. Não há competição individual
 * entre os dois conectores: tudo soma para o mesmo território.
 * IMPACTO TERRITORIAL vem primeiro; a pontuação aparece em segundo plano.
 */
export function ProgressoNucleo() {
  const {
    progressoNucleo,
    missoesConcluidas,
    missoesEmValidacao,
    progressoPorDimensao,
    indicadoresTerritoriais,
  } = useMeuNucleo();

  return (
    <div className="panel panel-glow h-full min-w-0 rounded-lg p-4 sm:p-5">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
          👥 Meu Núcleo · Progresso territorial
        </p>
        <span className="rounded-full border border-glow/40 bg-glow/10 px-2.5 py-0.5 text-[0.62rem] font-semibold text-glow">
          Dados demonstrativos
        </span>
      </div>

      <p className="mt-3 font-display text-3xl font-bold leading-none">{progressoNucleo}%</p>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        O esforço dos dois conectores soma para o mesmo progresso territorial.
      </p>
      <Progresso valor={progressoNucleo} className="mt-2.5 h-2" />

      {/* Indicadores territoriais — medem o trabalho realizado */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {indicadoresTerritoriais.map((i) => (
          <div key={i.id} className="min-w-0 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5">
            <p className="text-xl font-semibold leading-none">{i.valor}</p>
            <p className="mt-1 break-words text-[0.68rem] uppercase tracking-wide text-muted-foreground">
              <span aria-hidden>{i.icone}</span> {i.rotulo}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {dimensoes.map((d) => (
          <div key={d.id}>
            <div className="mb-1 flex items-center justify-between text-[0.72rem]">
              <span className="flex items-center gap-1.5 font-medium">
                <span aria-hidden>{d.icone}</span> {d.nome}
              </span>
              <span className="font-semibold text-muted-foreground">
                {progressoPorDimensao[d.id]}%
              </span>
            </div>
            <Progresso valor={progressoPorDimensao[d.id]} cor={d.colorVar} />
          </div>
        ))}
      </div>

       {/* Estado operacional derivado dos registros; pontuação segue em validação. */}
      <p className="mt-4 border-t border-border/50 pt-2.5 text-[0.7rem] text-muted-foreground">
         {missoesConcluidas} missões concluídas · {missoesEmValidacao} em validação
      </p>
    </div>
  );
}
