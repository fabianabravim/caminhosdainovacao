import { useContext, useMemo, useState } from "react";
import { MapPinned } from "lucide-react";
import { BlocoTerritorial, SeloOrigem, SemDados } from "@/components/territorio/OrigemDado";
import { Button } from "@/components/ui/button";
import { MeuNucleoContext, type MeuNucleoState } from "@/context/meuNucleoBase";
import { nucleoMap } from "@/data/nucleos";
import {
  areasPerfilTerritorial,
  categoriasDescoberta,
  referenciaDoNucleo,
  type AreaPerfilTerritorial,
} from "@/data/territorios.config";
import { cn } from "@/lib/utils";

/** Perfil Territorial — território + conhecimento + descoberta. */
export function PerfilTerritorial({ nucleoId }: { nucleoId: string }) {
  const [area, setArea] = useState<AreaPerfilTerritorial>("visao-geral");
  const nucleo = nucleoMap[nucleoId];
  const referencia = referenciaDoNucleo(nucleoId);
  const ctx = useContext(MeuNucleoContext);
  /** Dados do Caminhos só existem para o Núcleo vinculado ao Conector. */
  const dadosDoCaminhos = ctx && ctx.nucleoId === nucleoId ? ctx : null;

  if (!nucleo) {
    return <SemDados texto="Núcleo não encontrado" nota="Verifique o território selecionado no mapa." />;
  }

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-lg bg-brand-dark px-5 py-8 text-primary-foreground sm:px-8">
        <div className="topo-lines absolute inset-0 opacity-35" />
        <div className="relative max-w-2xl">
          <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-energy">
            <MapPinned aria-hidden="true" className="h-3.5 w-3.5" /> Perfil territorial · Região {nucleo.regiao}
          </p>
          <h2 className="mt-2 font-brand-condensed text-4xl font-semibold leading-tight sm:text-5xl">
            Núcleo {nucleo.nome}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
            Conheça o território e acompanhe o que está sendo revelado pelos Conectores.
          </p>
          <div className="mt-4">
            <Municipios municipios={referencia.municipios} escuro />
          </div>
        </div>
      </header>

      <nav
        aria-label="Áreas do Perfil Territorial"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {areasPerfilTerritorial.map((a) => (
          <Button
            key={a.id}
            variant={area === a.id ? "default" : "outline"}
            size="sm"
            onClick={() => setArea(a.id)}
            aria-pressed={area === a.id}
            className={cn("shrink-0 whitespace-nowrap text-xs", area === a.id ? "" : "bg-surface/70")}
          >
            {a.rotulo}
          </Button>
        ))}
      </nav>

      {area === "visao-geral" ? (
        <VisaoGeral nucleoNome={nucleo.nome} referencia={referencia} dados={dadosDoCaminhos} />
      ) : null}

      {area === "vocacoes" ? (
        <BlocoTerritorial
          titulo="Vocações do território"
          descricao="Vocações econômicas e territoriais previamente identificadas nos documentos de referência."
          origem="referencia"
          fonte={referencia.fonte}
        >
          {referencia.vocacoes.length ? (
            <ul className="flex flex-wrap gap-2">
              {referencia.vocacoes.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary"
                >
                  {v}
                </li>
              ))}
            </ul>
          ) : (
            <SemDados nota="As vocações de cada Núcleo serão incorporadas a partir dos documentos de referência." />
          )}
        </BlocoTerritorial>
      ) : null}

      {area === "potencialidades" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <BlocoTerritorial
            titulo="Potencialidades"
            descricao="Linha de base territorial já existente."
            origem="referencia"
            fonte={referencia.fonte}
          >
            <ListaTerritorial itens={referencia.potencialidades} />
          </BlocoTerritorial>
          <BlocoTerritorial
            titulo="Desafios"
            descricao="Desafios apontados pelos estudos — não confundir com as lacunas descobertas em campo."
            origem="referencia"
            fonte={referencia.fonte}
          >
            <ListaTerritorial itens={referencia.desafios} />
          </BlocoTerritorial>
        </div>
      ) : null}

      {area === "inovacao" ? (
        <BlocoTerritorial
          titulo="Inovação no território"
          descricao="Leitura inicial proveniente dos estudos de referência, a ser aprofundada no trabalho de campo."
          origem="referencia"
          fonte={referencia.fonte}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lilac">
                Pontos fortes identificados
              </p>
              <div className="mt-2.5">
                <ListaTerritorial
                  itens={referencia.inovacaoPontosFortes}
                  notaVazia={
                    referencia.inovacaoEmConsolidacao
                      ? "Pontos fortes identificados — dados de referência em consolidação"
                      : undefined
                  }
                />
              </div>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-energy-foreground">
                Pontos a investigar
              </p>
              <div className="mt-2.5">
                <ListaTerritorial
                  itens={referencia.inovacaoPontosAInvestigar}
                  notaVazia={
                    referencia.inovacaoEmConsolidacao
                      ? "Pontos a investigar — dados de referência em consolidação"
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </BlocoTerritorial>
      ) : null}

      {area === "descobertas" ? <Descobertas dados={dadosDoCaminhos} /> : null}
    </div>
  );
}

function Municipios({ municipios, escuro = false }: { municipios: string[]; escuro?: boolean }) {
  if (!municipios.length) {
    return (
      <p className={cn("text-xs leading-relaxed", escuro ? "text-primary-foreground/60" : "text-muted-foreground")}>
        Municípios vinculados: composição oficial em incorporação.
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {municipios.map((m) => (
        <li
          key={m}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs",
            escuro ? "border-primary-foreground/25 bg-primary-foreground/10" : "border-border/70 bg-surface/70",
          )}
        >
          {m}
        </li>
      ))}
    </ul>
  );
}

function ListaTerritorial({ itens, notaVazia }: { itens: string[]; notaVazia?: string }) {
  if (!itens.length) {
    return (
      <SemDados
        texto={notaVazia ?? "Dados de referência em consolidação"}
        nota={notaVazia ? "" : "Conteúdo a ser incorporado a partir dos documentos de referência."}
      />
    );
  }
  return (
    <ul className="space-y-2">
      {itens.map((item) => (
        <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5 text-sm leading-relaxed">
          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 rounded-full bg-lilac" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

type Dados = MeuNucleoState;

function VisaoGeral({
  nucleoNome,
  referencia,
  dados,
}: {
  nucleoNome: string;
  referencia: ReturnType<typeof referenciaDoNucleo>;
  dados: Dados | null;
}) {
  const indicadores = dados?.indicadoresTerritoriais ?? [];
  return (
    <div className="space-y-4">
      <BlocoTerritorial titulo={`Núcleo ${nucleoNome}`} origem="referencia" fonte={referencia.fonte}>
        <Municipios municipios={referencia.municipios} />
        <div className="mt-4">
          {referencia.apresentacao ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{referencia.apresentacao}</p>
          ) : (
            <SemDados
              texto="Apresentação territorial ainda não disponível"
              nota="Será incorporada a partir dos estudos de referência do território."
            />
          )}
        </div>
      </BlocoTerritorial>

      <BlocoTerritorial
        titulo="O que o Caminhos está revelando"
        descricao="Indicadores construídos progressivamente pelas atividades validadas dos Conectores."
        origem="caminhos"
      >
        {!dados ? (
          <SemDados
            texto="Indicadores disponíveis apenas para o Núcleo vinculado ao seu acesso"
            nota="Em construção a partir do trabalho de campo de cada território."
          />
        ) : indicadores.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {indicadores.map((i) => (
              <li key={i.id} className="rounded-md border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  <span aria-hidden="true">{i.icone} </span>
                  {i.rotulo}
                </p>
                <p className="mt-1 font-brand-condensed text-3xl font-semibold leading-none">
                  {i.valor > 0 ? i.valor.toLocaleString("pt-BR") : "—"}
                </p>
                {i.valor === 0 ? (
                  <p className="mt-1 text-[0.65rem] leading-4 text-muted-foreground">
                    Em construção a partir do trabalho de campo
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <SemDados />
        )}
      </BlocoTerritorial>
    </div>
  );
}

function Descobertas({ dados }: { dados: Dados | null }) {
  const aprovadas = useMemo(
    () => (dados?.atividades ?? []).filter((a) => a.status === "aprovada"),
    [dados],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-energy/35 bg-energy/8 p-5 sm:p-6">
        <h3 className="font-brand-condensed text-2xl font-semibold leading-tight">
          O que os Conectores estão descobrindo?
        </h3>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Resultados progressivos do trabalho de campo. Nada aqui é dado de referência.
        </p>
        <SeloOrigem origem="caminhos" className="mt-3" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {categoriasDescoberta.map((cat) => {
          const itens = aprovadas.filter((a) =>
            a.fonteContribuicao ? (cat.fontes as readonly string[]).includes(a.fonteContribuicao) : false,
          );
          return (
            <section key={cat.id} className="rounded-lg border border-border/70 bg-surface/70 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lilac">
                    <span aria-hidden="true">{cat.icone} </span>
                    {cat.rotulo}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cat.descricao}</p>
                </div>
                {itens.length ? (
                  <span className="shrink-0 font-brand-condensed text-2xl font-semibold leading-none">
                    {itens.length}
                  </span>
                ) : null}
              </div>
              <div className="mt-3">
                {!dados ? (
                  <SemDados
                    texto="Dados ainda não disponíveis"
                    nota="As descobertas aparecem para o Núcleo vinculado ao seu acesso."
                  />
                ) : itens.length ? (
                  <ul className="space-y-2">
                    {itens.slice(0, 5).map((a) => (
                      <li key={a.id} className="rounded-md border border-border/60 bg-background/60 px-3 py-2">
                        <p className="text-sm font-medium leading-snug">{a.titulo}</p>
                        <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                          {[a.municipio, a.data].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SemDados texto="Nenhum registro validado até o momento" />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
