import { useState } from "react";
import { ModalEvidencia } from "@/components/jornada/ModalEvidencia";
import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { dimensaoMap } from "@/data/dimensoes";
import { missoesPorDimensao, ordemDimensoes, statusMissaoLabel } from "@/data/missoes.config";
import type { StatusMissao } from "@/types";

const estiloStatus: Record<StatusMissao, string> = {
  disponivel: "border-border/70 bg-surface/60 text-muted-foreground",
  andamento: "border-lilac/50 bg-primary/15 text-lilac",
  enviada: "border-lilac/50 bg-primary/15 text-lilac",
  validacao: "border-glow/50 bg-glow/10 text-glow",
  concluida: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
};

export function MissoesTerritorio() {
  const { statusPorMissao, iniciarMissao, enviarEvidencia } = useMeuNucleo();
  const [missaoAberta, setMissaoAberta] = useState<string | null>(null);

  return (
    <div className="min-w-0 space-y-6">
      {ordemDimensoes.map((dimId) => {
        const dim = dimensaoMap[dimId]!;
        return (
          <div key={dimId}>
            <p
              className="mb-2.5 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: dim.colorVar }}
            >
              <span aria-hidden>{dim.icone}</span> {dim.nome}
            </p>
            <div className="grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {missoesPorDimensao(dimId).map((m) => {
                const status = statusPorMissao[m.id] ?? "disponivel";
                const bloqueada = status === "validacao" || status === "enviada" || status === "concluida";
                return (
                  <article key={m.id} className="panel min-w-0 rounded-2xl p-3.5">
                    <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base"
                        style={{ backgroundColor: `color-mix(in oklab, ${dim.colorVar} 16%, transparent)` }}
                        aria-hidden
                      >
                        {m.icone}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start gap-2">
                          <h3 className="min-w-0 flex-1 overflow-wrap-anywhere font-display text-sm font-semibold">
                            {m.titulo}
                          </h3>
                          <span className="shrink-0 rounded-full bg-glow/12 px-2 py-0.5 text-[0.68rem] font-bold text-glow">
                            {m.xp} XP
                          </span>
                        </div>
                        <p className="mt-1 break-words text-[0.74rem] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                          {m.descricao}
                        </p>
                        <div className="mt-2.5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span
                            className={`w-fit rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold ${estiloStatus[status]}`}
                          >
                            {statusMissaoLabel[status]}
                          </span>
                          <button
                            type="button"
                            disabled={bloqueada}
                            onClick={() => {
                              iniciarMissao(m.id);
                              setMissaoAberta(m.id);
                            }}
                            className="tap min-h-11 w-full rounded-xl bg-primary px-3.5 py-2 text-[0.72rem] font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-0 sm:w-auto"
                          >
                            {status === "concluida"
                              ? "Concluída ✓"
                              : bloqueada
                                ? "Aguardando validação"
                                : status === "andamento"
                                  ? "Continuar missão"
                                  : "REALIZAR MISSÃO"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}

      {missaoAberta ? (
        <ModalEvidencia
          missaoId={missaoAberta}
          onClose={() => setMissaoAberta(null)}
          onEnviar={(dados) => {
            enviarEvidencia(missaoAberta, dados);
            setMissaoAberta(null);
          }}
        />
      ) : null}
    </div>
  );
}
