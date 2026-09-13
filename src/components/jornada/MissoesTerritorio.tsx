import { Progresso } from "@/components/ui/Progresso";
import { tipoAtividadePorFonte } from "@/data/atividades.config";
import { useRegistroAtividade } from "@/components/jornada/RegistroAtividade";
import { useMeuNucleo } from "@/context/MeuNucleoContext";
import { dimensaoMap } from "@/data/dimensoes";
import { ordemDimensoes, statusMissaoLabel } from "@/data/missoes.config";
import type { StatusMissao } from "@/types";

const estiloStatus: Record<StatusMissao, string> = {
  nao_iniciada: "border-border/70 bg-surface/60 text-muted-foreground",
  andamento: "border-lilac/50 bg-primary/15 text-lilac",
  validacao: "border-glow/50 bg-glow/10 text-glow",
  ajustes: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  concluida: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
};

/**
 * Cards das missões do território.
 * Hierarquia: impacto/progresso primeiro; pontuação como camada secundária.
 * Nenhum controle permite avançar a barra manualmente.
 */
export function MissoesTerritorio() {
  const { missoesPorDimensao, registrarAtividade } = useMeuNucleo();
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
                const concluida = m.status === "concluida";
                return (
                  <article key={m.id} className="panel flex min-w-0 flex-col rounded-2xl p-3.5">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base"
                        style={{ backgroundColor: `color-mix(in oklab, ${dim.colorVar} 16%, transparent)` }}
                        aria-hidden
                      >
                        {m.icone}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-sm font-semibold [overflow-wrap:anywhere]">
                          {m.titulo}
                        </h3>
                        <p className="mt-1 break-words text-[0.72rem] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                          {m.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Impacto / progresso — elemento principal do card */}
                    <p className="mt-3 font-display text-sm font-semibold">
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
                      <button
                        type="button"
                        onClick={() => setMissaoAberta(m.id)}
                        className="tap mt-3 min-h-11 w-full rounded-xl bg-primary px-3.5 py-2 text-[0.74rem] font-semibold text-primary-foreground transition-opacity sm:min-h-0"
                      >
                        {m.cta}
                      </button>
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

      {missaoAberta ? (
        <ModalEvidencia
          missaoId={missaoAberta}
          onClose={() => setMissaoAberta(null)}
          onEnviar={(dados) => {
            registrarAtividade(missaoAberta, dados);
            setMissaoAberta(null);
          }}
        />
      ) : null}
    </div>
  );
}
