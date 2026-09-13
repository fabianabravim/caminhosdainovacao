import { useMeuNucleo } from "@/context/MeuNucleoContext";

/**
 * MEU DESEMPENHO — nível individual do Conector.
 * São INDICADORES (medem responsabilidades pessoais), não missões nem
 * pontuação, e nunca geram competição entre os dois conectores do Núcleo.
 * Valores começam zerados até haver cadastro real.
 */
export function MeuDesempenho() {
  const { participante, indicadoresIndividuais } = useMeuNucleo();

  return (
    <div className="panel h-full min-w-0 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
          👤 Meu desempenho
        </p>
        <span className="rounded-full border border-glow/40 bg-glow/10 px-2.5 py-0.5 text-[0.62rem] font-semibold text-glow">
          Dados demonstrativos
        </span>
      </div>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        Responsabilidades individuais de {participante.nome.split(" ")[0]} — sem comparação com o
        outro Conector.
      </p>

      <ul className="mt-3.5 space-y-2">
        {indicadoresIndividuais.map((i) => (
          <li
            key={i.id}
            className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="break-words text-[0.8rem] font-medium">
                <span aria-hidden>{i.icone}</span> {i.rotulo}
              </p>
              <p className="break-words text-[0.66rem] text-muted-foreground">{i.descricao}</p>
            </div>
            <span className="shrink-0 font-display text-base font-semibold">
              {i.valor}
              {i.meta ? <span className="text-muted-foreground">/{i.meta}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
