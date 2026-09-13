import { useMeuNucleo } from "@/context/meuNucleoBase";
import { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";

/**
 * "O que preciso entregar" — entregas do Conector.
 * Valores demonstrativos: nada é inventado, tudo começa zerado e é alimentado
 * pelos registros de atividade do tipo relatório.
 */
export function RelatoriosJornada() {
  const { atividades, indicadoresIndividuais } = useMeuNucleo();
  const { abrir } = useRegistroAtividade();
  const relatorios = atividades.filter((a) => a.tipoId === "relatorio");

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold">Relatórios e entregas</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            O que precisa ser entregue à Coordenação. As entregas seguem o mesmo fluxo de validação.
          </p>
        </div>
        <button
          type="button"
          onClick={() => abrir({ tipoId: "relatorio" })}
          className="tap panel-glow w-full rounded-full bg-primary px-4 py-2.5 font-display text-sm font-semibold text-primary-foreground sm:w-auto"
        >
          Enviar relatório
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {indicadoresIndividuais.slice(0, 3).map((i) => (
          <div key={i.id} className="panel min-w-0 rounded-2xl p-3.5">
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
        <div className="panel rounded-2xl border-dashed p-6 text-center">
          <p className="font-display text-sm font-semibold">Nenhuma entrega registrada ainda</p>
          <p className="mx-auto mt-1.5 max-w-md text-[0.78rem] leading-relaxed text-muted-foreground">
            Ao enviar um relatório, ele fica em validação e, quando aprovado, atualiza sozinho as
            missões e o progresso do Núcleo.
          </p>
        </div>
      ) : (
        <ul className="min-w-0 space-y-2.5">
          {relatorios.map((r) => (
            <li key={r.id} className="panel min-w-0 rounded-2xl p-3.5">
              <p className="text-[0.68rem] text-muted-foreground">
                {r.data ? new Date(`${r.data}T12:00:00`).toLocaleDateString("pt-BR") : "—"}
              </p>
              <p className="font-display text-sm font-semibold [overflow-wrap:anywhere]">{r.titulo}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
