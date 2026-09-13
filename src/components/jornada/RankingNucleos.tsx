import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { ordenarRanking } from "@/data/ranking";

const medalhas = ["🥇", "🥈", "🥉"];

/**
 * Ranking dos 14 Núcleos Territoriais.
 * Os valores são fictícios e existem apenas para prototipação —
 * por isso o bloco é identificado como "Dados demonstrativos".
 */
export function RankingNucleos() {
  const { nucleoId } = useMeuNucleo();
  const ranking = ordenarRanking("pontos");

  return (
    <div className="panel rounded-3xl p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-lilac/80">
          Ranking dos Núcleos
        </p>
        <span className="rounded-full border border-glow/40 bg-glow/10 px-2.5 py-0.5 text-[0.62rem] font-semibold text-glow">
          Dados demonstrativos
        </span>
      </div>
      <p className="mt-1 text-[0.72rem] text-muted-foreground">
        Os 14 Núcleos Territoriais da rede capixaba. Valores fictícios para prototipação.
      </p>

      <ol className="mt-3.5 space-y-1.5">
        {ranking.map((item, i) => {
          const meu = item.nucleoId === nucleoId;
          return (
            <li
              key={item.nucleoId}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                meu
                  ? "panel-glow border-glow/50 bg-primary/20"
                  : i < 3
                    ? "border-border/70 bg-surface/70"
                    : "border-transparent bg-surface/40"
              }`}
            >
              <span className="w-7 shrink-0 text-center text-sm font-bold">
                {i < 3 ? medalhas[i] : `${i + 1}º`}
              </span>
              <span className={`min-w-0 flex-1 truncate text-sm ${meu ? "font-semibold" : ""}`}>
                {item.nome}
                {meu ? (
                  <span className="ml-2 rounded-full bg-glow/15 px-2 py-0.5 text-[0.6rem] font-semibold text-glow">
                    seu núcleo
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {item.pontos.toLocaleString("pt-BR")} XP
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
