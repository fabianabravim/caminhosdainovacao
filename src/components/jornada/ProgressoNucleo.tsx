import { Metrica, Progresso } from "@/components/ui/Progresso";
import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { dimensoes } from "@/data/dimensoes";

/**
 * Progresso coletivo do Núcleo Territorial. Não há competição individual
 * entre os dois conectores: tudo soma para o mesmo território.
 */
export function ProgressoNucleo() {
  const { xpTotal, missoesConcluidas, missoesEmValidacao, progressoPorDimensao } = useMeuNucleo();

  return (
    <div className="panel panel-glow h-full min-w-0 rounded-3xl p-4 sm:p-5">
      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">Progresso do Núcleo</p>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        O esforço dos dois conectores soma para o mesmo progresso territorial.
      </p>

      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Metrica valor={`${xpTotal} XP`} label="XP total" />
        <Metrica valor={missoesConcluidas} label="Concluídas" />
        <Metrica valor={missoesEmValidacao} label="Em validação" />
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
    </div>
  );
}
