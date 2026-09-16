import { useMeuNucleo } from "@/context/meuNucleoBase";
import { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";
import { Button } from "@/components/ui/button";
import { estiloStatusAtividade } from "@/data/atividades.config";
import type { StatusAtividade } from "@/types";

const statusRelatorioLabel: Record<StatusAtividade, string> = {
  rascunho: "Pendente",
  enviada: "Enviado",
  em_validacao: "Em análise",
  aprovada: "Aprovado",
  ajustes_solicitados: "Ajustes solicitados",
};

/**
 * "O que preciso entregar" — entregas do Conector.
 * Valores demonstrativos: nada é inventado, tudo começa zerado e é alimentado
 * pelos registros de atividade do tipo relatório.
 */
export function RelatoriosJornada() {
  const { atividades, indicadoresIndividuais, perfil } = useMeuNucleo();
  const { abrir } = useRegistroAtividade();
  const relatorios = atividades.filter((a) => a.conectorId === perfil.userId && a.tipoId === "relatorio");

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-primary">Entregas formais</p>
          <h3 className="mt-1 text-xl font-semibold">Relatórios e entregas</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            O que precisa ser entregue à Coordenação. As entregas seguem o mesmo fluxo de validação.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => abrir({ tipoId: "relatorio" })}
          className="tap panel-glow h-auto w-full rounded-full px-4 py-2.5 text-sm font-semibold sm:w-auto"
        >
          + Novo Relatório
        </Button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {indicadoresIndividuais.slice(0, 3).map((i) => (
          <div key={i.id} className="panel min-w-0 rounded-lg border-l-4 border-l-primary/30 p-3.5">
            <p className="text-[0.72rem] text-muted-foreground [overflow-wrap:anywhere]">
              {i.icone} {i.rotulo}
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {i.valor}
              {i.meta ? <span className="text-sm text-muted-foreground"> / {i.meta}</span> : null}
            </p>
          </div>
        ))}
      </div>

      {relatorios.length === 0 ? (
        <div className="panel topo-lines rounded-lg border-dashed p-8 text-center">
          <p className="font-display text-sm font-semibold">Nenhuma entrega registrada ainda</p>
          <p className="mx-auto mt-1.5 max-w-md text-[0.78rem] leading-relaxed text-muted-foreground">
            Ao enviar um relatório, ele fica em validação e, quando aprovado, atualiza sozinho as
            missões e o progresso do Núcleo.
          </p>
        </div>
      ) : (
        <div className="panel min-w-0 overflow-hidden rounded-lg">
          <div className="hidden grid-cols-[minmax(8rem,1fr)_7rem_8rem_minmax(10rem,1.5fr)] gap-3 border-b border-border/60 bg-surface/60 px-4 py-2.5 text-[0.64rem] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Competência / Período</span><span>Data de envio</span><span>Status</span><span>Resultado da análise</span>
          </div>
          <ul className="min-w-0 divide-y divide-border/50">
          {relatorios.map((r) => (
            <li key={r.id} className="grid min-w-0 grid-cols-1 gap-2 p-4 md:grid-cols-[minmax(8rem,1fr)_7rem_8rem_minmax(10rem,1.5fr)] md:items-center md:gap-3">
              <p className="font-display text-sm font-semibold [overflow-wrap:anywhere]">{r.titulo}</p>
              <p className="text-[0.72rem] text-muted-foreground">
                {r.data ? new Date(`${r.data}T12:00:00`).toLocaleDateString("pt-BR") : "—"}
              </p>
              <span className={`w-fit rounded-full border px-2.5 py-0.5 text-[0.64rem] font-semibold ${estiloStatusAtividade[r.status]}`}>
                {statusRelatorioLabel[r.status]}
              </span>
              <p className="text-[0.72rem] text-muted-foreground">
                {r.status === "rascunho"
                  ? "Aguardando envio"
                  : r.status === "enviada"
                    ? "Enviado para acompanhamento"
                    : r.status === "ajustes_solicitados"
                      ? "Ajustes indicados pela Coordenação"
                      : r.status === "aprovada"
                        ? "Relatório aprovado"
                        : "Aguardando análise"}
              </p>
            </li>
          ))}
          </ul>
        </div>
      )}
    </section>
  );
}
