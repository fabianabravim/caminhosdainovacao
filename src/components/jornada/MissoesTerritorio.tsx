import { Progresso } from "@/components/ui/Progresso";
import { AjudaInovacao } from "@/components/jornada/AjudaInovacao";
import { tipoAtividadePorFonte } from "@/data/atividades.config";
import { useRegistroAtividade } from "@/components/jornada/registroAtividadeBase";
import { useMeuNucleo } from "@/context/meuNucleoBase";
import { movimentosApresentacao } from "@/data/movimentos.apresentacao";
import { statusMissaoLabel } from "@/data/missoes.config";
import { Button } from "@/components/ui/button";
import type { StatusMissao } from "@/types";

const estiloStatus: Record<StatusMissao, string> = {
  nao_iniciada: "border-border/70 bg-surface/60 text-muted-foreground",
  andamento: "border-lilac/50 bg-primary/15 text-lilac",
  validacao: "border-glow/50 bg-glow/10 text-glow",
  ajustes: "border-amber-400/40 bg-amber-50 text-amber-700",
  concluida: "border-emerald-400/40 bg-emerald-50 text-emerald-700",
};

/**
 * Cards das missões do território.
 * Hierarquia: impacto/progresso primeiro; pontuação como camada secundária.
 * Nenhum controle permite avançar a barra manualmente.
 */
export function MissoesTerritorio() {
  const { missoesPorMovimento } = useMeuNucleo();
  const { abrir } = useRegistroAtividade();

  return (
    <div className="min-w-0 space-y-6">
      {movimentosApresentacao.map((dim) => {
        return (
          <div key={dim.id}>
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <h3 className={`flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${dim.textoClasse}`}>
                <span aria-hidden>{dim.icone}</span> {dim.nome}
              </h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{dim.descricao}</p>
            <div className="grid min-w-0 grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {missoesPorMovimento(dim.id).map((m) => {
                const concluida = m.status === "concluida";
                return (
                    <article key={m.id} className={`panel flex min-w-0 flex-col rounded-lg border-t-2 p-4 ${dim.bordaClasse}`}>
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base ${dim.fundoClasse}`}
                        aria-hidden
                      >
                        {m.icone}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold [overflow-wrap:anywhere]">
                          {m.titulo}
                        </h3>
                        <p className="mt-1 break-words text-[0.72rem] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                          {m.descricao}
                        </p>
                      </div>
                    </div>

                    {m.id === "des-iniciativa" ? <AjudaInovacao className="mt-3" /> : null}

                    {/* Impacto / progresso — elemento principal do card */}
                    <p className="mt-3 text-sm font-semibold">
                      {m.progressoAtual} de {m.metaTotal} {m.unidade}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Progresso valor={m.percentualProgresso} cor={dim.colorVar} className="flex-1" />
                      <span className="shrink-0 text-[0.7rem] font-semibold text-muted-foreground">
                        {m.percentualProgresso}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                      {concluida
                        ? "✓ Missão concluída"
                        : m.registrosEmAjuste > 0
                          ? `${m.registrosEmAjuste} registro(s) aguardando ajustes`
                          : m.registrosEmValidacao > 0
                            ? `${m.registrosEmValidacao} registro(s) em validação`
                            : `${m.restante} ${m.unidade} restantes`}
                    </p>

                    <span
                      className={`mt-2.5 w-fit rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold ${estiloStatus[m.status]}`}
                    >
                      {statusMissaoLabel[m.status]}
                    </span>

                    {!concluida ? (
                      <Button
                        type="button"
                        onClick={() =>
                          abrir({
                            missaoId: m.id,
                            tipoId: tipoAtividadePorFonte(m.fonteProgresso)?.id,
                          })
                        }
                        className="tap mt-3 min-h-11 w-full rounded-full bg-primary px-3.5 py-2 text-[0.74rem] font-semibold text-primary-foreground transition-opacity sm:min-h-0"
                      >
                        {m.cta}
                      </Button>
                    ) : null}

                    {/* Gamificação — visualmente secundária */}
                    <div className="mt-3 border-t border-border/50 pt-2.5 text-[0.68rem] text-muted-foreground">
                      <p>
                        Conquista: <span className="text-foreground/80">{m.conquista}</span>
                      </p>
                      <p className="mt-0.5">
                        {concluida
                          ? `🎁 +${m.pontuacao} pts conquistados`
                          : `+${m.pontuacao} pts ao concluir`}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}

    </div>
  );
}
