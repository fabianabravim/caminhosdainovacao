import {
  estiloStatusAtividade,
  statusAtividadeLabel,
  tipoAtividadeMap,
} from "@/data/atividades.config";
import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { missaoTerritorialMap } from "@/data/missoes.config";
import { BotaoRegistrarAtividade } from "@/components/jornada/RegistroAtividade";

/** "O que eu já fiz" — histórico do trabalho real registrado pelo Conector. */
export function MinhasAtividades() {
  const { atividades } = useMeuNucleo();

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold">Minhas atividades</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tudo o que você registrou no território, com evidências e status.
          </p>
        </div>
        <BotaoRegistrarAtividade className="w-full sm:w-auto" />
      </div>

      {atividades.length === 0 ? (
        <div className="panel rounded-2xl border-dashed p-6 text-center">
          <p className="font-display text-sm font-semibold">Nenhuma atividade registrada ainda</p>
          <p className="mx-auto mt-1.5 max-w-md text-[0.78rem] leading-relaxed text-muted-foreground">
            Registre uma visita, escuta, articulação ou mapeamento. A plataforma calcula sozinha o
            progresso das missões e do seu Núcleo.
          </p>
          <div className="mt-4 flex justify-center">
            <BotaoRegistrarAtividade />
          </div>
        </div>
      ) : (
        <ul className="grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-2">
          {atividades.map((a) => {
            const tipo = tipoAtividadeMap[a.tipoId];
            return (
              <li key={a.id} className="panel flex min-w-0 flex-col rounded-2xl p-3.5">
                <div className="flex min-w-0 items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] text-muted-foreground">
                      {a.data ? new Date(`${a.data}T12:00:00`).toLocaleDateString("pt-BR") : "—"}
                      {a.municipio ? ` · ${a.municipio}` : ""}
                    </p>
                    <h4 className="font-display text-sm font-semibold [overflow-wrap:anywhere]">
                      {a.titulo}
                    </h4>
                    <p className="mt-0.5 text-[0.72rem] text-muted-foreground [overflow-wrap:anywhere]">
                      {tipo?.icone} {tipo?.rotulo}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.64rem] font-semibold ${estiloStatusAtividade[a.status]}`}
                  >
                    {statusAtividadeLabel[a.status]}
                  </span>
                </div>

                {a.missoesRelacionadas.length > 0 ? (
                  <div className="mt-3 border-t border-border/50 pt-2.5">
                    <p className="text-[0.66rem] uppercase tracking-wide text-muted-foreground">
                      Missões relacionadas
                    </p>
                    <p className="mt-1 text-[0.72rem] [overflow-wrap:anywhere]">
                      {a.missoesRelacionadas
                        .map((id) => {
                          const m = missaoTerritorialMap[id];
                          return m ? `${m.icone} ${m.titulo}` : null;
                        })
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
