import { useState } from "react";
import {
  estiloStatusAtividade,
  statusAtividadeLabel,
  tipoAtividadeMap,
} from "@/data/atividades.config";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { missaoTerritorialMap } from "@/data/missoes.config";
import { BotaoRegistrarAtividade } from "@/components/jornada/RegistroAtividade";
import { Button } from "@/components/ui/button";
import type { StatusAtividade } from "@/types";

type Filtro = "todas" | Extract<StatusAtividade, "em_validacao" | "aprovada" | "ajustes_solicitados">;

const filtros: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "em_validacao", rotulo: "Em validação" },
  { id: "aprovada", rotulo: "Aprovadas" },
  { id: "ajustes_solicitados", rotulo: "Ajustes solicitados" },
];

/** "O que eu já fiz" — histórico do trabalho real registrado pelo Conector. */
export function MinhasAtividades() {
  const { atividades } = useMeuNucleo();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const atividadesVisiveis = filtro === "todas" ? atividades : atividades.filter((a) => a.status === filtro);

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold uppercase">Minhas atividades</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Registre e acompanhe as ações realizadas no território.
          </p>
        </div>
        <BotaoRegistrarAtividade className="w-full sm:w-auto" />
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:flex sm:flex-wrap" aria-label="Filtrar atividades por status">
        {filtros.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={filtro === item.id ? "default" : "outline"}
            size="sm"
            aria-pressed={filtro === item.id}
            onClick={() => setFiltro(item.id)}
            className="h-auto min-w-0 whitespace-normal rounded-full px-3 py-2 text-center leading-tight"
          >
            {item.rotulo}
          </Button>
        ))}
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
      ) : atividadesVisiveis.length === 0 ? (
        <div className="panel rounded-2xl border-dashed p-5 text-center text-sm text-muted-foreground">
          Nenhuma atividade encontrada neste status.
        </div>
      ) : (
        <div className="panel min-w-0 overflow-hidden rounded-2xl">
          <div className="hidden grid-cols-[6rem_9rem_minmax(10rem,1fr)_8rem_8rem_minmax(10rem,1fr)] gap-3 border-b border-border/60 bg-surface/60 px-4 py-2.5 text-[0.64rem] font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
            <span>Data</span><span>Tipo</span><span>Título</span><span>Município</span><span>Status</span><span>Missão relacionada</span>
          </div>
          <ul className="min-w-0 divide-y divide-border/50">
          {atividadesVisiveis.map((a) => {
            const tipo = tipoAtividadeMap[a.tipoId];
            const missao = a.missoesRelacionadas.map((id) => missaoTerritorialMap[id]).find(Boolean);
            return (
              <li key={a.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 lg:grid-cols-[6rem_9rem_minmax(10rem,1fr)_8rem_8rem_minmax(10rem,1fr)] lg:items-center">
                  <div className="min-w-0 lg:contents">
                    <p className="text-[0.68rem] text-muted-foreground lg:text-xs">
                      {a.data ? new Date(`${a.data}T12:00:00`).toLocaleDateString("pt-BR") : "—"}
                    </p>
                    <p className="mt-1 text-[0.72rem] text-muted-foreground lg:mt-0">
                      {tipo?.icone} {tipo?.rotulo}
                    </p>
                    <h4 className="mt-1 font-display text-sm font-semibold [overflow-wrap:anywhere] lg:mt-0">
                      {a.titulo}
                    </h4>
                    <p className="mt-1 text-[0.72rem] text-muted-foreground lg:mt-0">{a.municipio || "—"}</p>
                  </div>
                  <span
                    className={`h-fit shrink-0 rounded-full border px-2.5 py-0.5 text-[0.64rem] font-semibold ${estiloStatusAtividade[a.status]}`}
                  >
                    {statusAtividadeLabel[a.status]}
                  </span>
                  <p className="col-span-2 text-[0.72rem] text-muted-foreground [overflow-wrap:anywhere] lg:col-span-1">
                    {missao ? `${missao.icone} ${missao.titulo}` : "—"}
                  </p>
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </section>
  );
}
