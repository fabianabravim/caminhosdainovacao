import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapaVivo } from "@/components/MapaVivo";
import { ModoApresentacao } from "@/components/ModoApresentacao";
import { useJornada } from "@/context/JornadaContext";
import { nucleoMap, nucleos } from "@/data/nucleos";
import { dimensoes } from "@/data/dimensoes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caminhos da Inovação — Jornada da Inovação Capixaba" },
      {
        name: "description",
        content:
          "A inovação capixaba está em movimento: 14 territórios, 28 conectores e uma rede viva de inovação mapeada pelo IJSN e pelo Governo do Espírito Santo.",
      },
      { property: "og:title", content: "Caminhos da Inovação — A inovação capixaba em movimento" },
      {
        property: "og:description",
        content:
          "Explore o mapa vivo do Espírito Santo: cada ponto é uma descoberta, cada linha é uma conexão.",
      },
    ],
  }),
  component: Home,
});

const PAR_WOW = ["serra", "caparao"] as const;

function Home() {
  const navigate = useNavigate();
  const { conexoes, criarConexao, pontos, nivelAtual, fecharCelebracao } = useJornada();
  const [hover, setHover] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [zoom, setZoom] = useState(false);
  const [apresentacao, setApresentacao] = useState(false);
  const [wow, setWow] = useState(false);

  const focado = hover ? nucleoMap[hover] : null;

  function selecionar(id: string) {
    const proximo = selecionados.includes(id)
      ? selecionados.filter((i) => i !== id)
      : [...selecionados, id].slice(-2);
    setSelecionados(proximo);

    if (!PAR_WOW.every((p) => proximo.includes(p))) return;
    const jaConectado = conexoes.some(
      (c) =>
        (c.de === PAR_WOW[0] && c.para === PAR_WOW[1]) ||
        (c.de === PAR_WOW[1] && c.para === PAR_WOW[0]),
    );
    if (!jaConectado) criarConexao(PAR_WOW[0], PAR_WOW[1], "Serra ↔ Caparaó");
    fecharCelebracao();
    setWow(true);
  }

  function explorar() {
    setZoom(true);
    setTimeout(() => navigate({ to: "/mapa" }), 900);
  }

  if (apresentacao) return <ModoApresentacao onSair={() => setApresentacao(false)} />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center gap-3 px-5 pt-6">
        <p className="min-w-0 text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-lilac/80">
          IJSN · Governo do ES
        </p>
        <button
          onClick={() => setApresentacao(true)}
          className="tap ml-auto shrink-0 rounded-full border border-border/70 bg-surface/50 px-3.5 py-2 text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          [ MODO APRESENTAÇÃO ]
        </button>
        <Link
          to="/entrar"
          className="tap hidden shrink-0 rounded-full border border-border/70 bg-surface/50 px-3.5 py-2 text-[0.6rem] font-semibold tracking-[0.18em] text-muted-foreground sm:block"
        >
          ENTRAR
        </Link>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-8 lg:grid-cols-[45fr_55fr] lg:items-center lg:gap-6 lg:pt-4">
        <div className="relative z-10 order-2 lg:order-1">
          <p
            className="animate-fade-in text-[0.66rem] font-semibold uppercase tracking-[0.34em] text-lilac/90"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
          >
            Caminhos da Inovação
          </p>
          <h1
            className="animate-fade-in mt-4 font-display text-[2.6rem] font-semibold leading-[1.03] sm:text-6xl"
            style={{ animationDelay: "260ms", animationFillMode: "backwards" }}
          >
            A inovação capixaba
            <br />
            <span className="text-gradient">está em movimento.</span>
          </h1>
          <p
            className="animate-fade-in mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: "460ms", animationFillMode: "backwards" }}
          >
            Uma plataforma de inteligência territorial que revela, conecta e fortalece a inovação
            que nasce em cada canto do Espírito Santo — do litoral às montanhas.
          </p>

          <div
            className="animate-fade-in mt-8 border-l border-glow/40 pl-4"
            style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
          >
            <p className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-glow sm:text-sm">
              14 territórios • 28 conectores • uma rede de inovação em movimento
            </p>
            <p
              className="animate-fade-in mt-3 max-w-md text-sm leading-relaxed text-lilac/90"
              style={{ animationDelay: "1000ms", animationFillMode: "backwards" }}
            >
              Cada ponto é uma descoberta. Cada linha é uma conexão. Cada território revela novos
              caminhos para a inovação.
            </p>
          </div>

          <div
            className="animate-fade-in mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "1200ms", animationFillMode: "backwards" }}
          >
            <button
              onClick={explorar}
              className="tap panel-glow rounded-2xl bg-primary px-6 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Explorar o mapa
            </button>
            <Link
              to="/jornada"
              className="tap rounded-2xl border border-border/70 bg-surface/60 px-6 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Minha jornada
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {dimensoes.map((d) => (
              <span
                key={d.id}
                className="rounded-full border border-border/60 bg-surface/50 px-3 py-1.5 text-[0.68rem] font-medium"
                style={{ color: d.colorVar }}
              >
                {d.icone} {d.nome}
              </span>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div
            className="relative mx-auto aspect-[3/4] w-full max-w-[540px] transition-transform duration-[900ms] ease-in"
            style={{ transform: zoom ? "scale(1.6)" : "scale(1)" }}
          >
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-primary/12 blur-3xl" />
            <MapaVivo
              conexoes={conexoes}
              selecionados={selecionados}
              onSelecionar={selecionar}
              onHover={setHover}
              particulas
              labels
            />

            {focado ? (
              <div
                className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(focado.x / 400) * 100}%`,
                  top: `${(focado.y / 600) * 100 - 2}%`,
                }}
              >
                <div className="panel panel-glow animate-scale-in rounded-2xl p-3">
                  <p className="text-[0.58rem] uppercase tracking-[0.18em] text-lilac/80">
                    {focado.regiao}
                  </p>
                  <p className="font-display text-sm font-semibold">{focado.nome}</p>
                  <p className="mt-1 text-[0.66rem] font-semibold text-glow">
                    {focado.progresso}% da jornada
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[0.62rem] text-muted-foreground">
                    <span>{focado.atores} atores</span>
                    <span>{focado.escutas} escutas</span>
                    <span>{focado.conexoes} conexões</span>
                    <span>{focado.inovacoes} inovações</span>
                  </div>
                  <p className="mt-2 rounded-lg bg-primary/25 px-2 py-1.5 text-center text-[0.62rem] font-semibold">
                    Toque para explorar
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-center text-[0.68rem] text-muted-foreground">
            Selecione <span className="text-lilac">Serra</span> e{" "}
            <span className="text-lilac">Caparaó</span> para acender uma nova conexão territorial
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: nucleos.length, l: "territórios em rede" },
            { v: 28, l: "conectores territoriais" },
            { v: conexoes.length, l: "conexões acesas" },
            { v: `${pontos.toLocaleString("pt-BR")}`, l: `pontos · nível ${nivelAtual.nome}` },
          ].map((m) => (
            <div key={m.l} className="panel rounded-2xl px-4 py-4">
              <p className="font-display text-2xl font-semibold text-gradient">{m.v}</p>
              <p className="mt-1 text-[0.68rem] uppercase tracking-wide text-muted-foreground">
                {m.l}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { to: "/missoes", label: "Missões do Território" },
            { to: "/rede", label: "Rede Capixaba" },
            { to: "/descobertas", label: "Descobertas" },
            { to: "/ranking", label: "Movimento dos Territórios" },
            { to: "/perfil", label: "Núcleo Serra" },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="tap rounded-full border border-border/70 bg-surface/50 px-4 py-2 text-xs font-medium"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </section>

      {wow ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 px-6 backdrop-blur-md">
          <div className="panel panel-glow animate-scale-in relative max-w-md rounded-3xl p-7 text-center">
            <span className="anim-halo absolute inset-x-1/2 top-6 h-16 w-16 -translate-x-1/2 rounded-full border border-glow/60" />
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-glow">
              Nova conexão territorial
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-gradient">
              Serra ↔ Caparaó
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Dois territórios. Uma nova possibilidade.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setWow(false);
                  navigate({ to: "/rede" });
                }}
                className="tap rounded-2xl bg-primary px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
              >
                Ver na rede capixaba
              </button>
              <button
                onClick={() => setWow(false)}
                className="tap rounded-2xl border border-border/70 bg-surface/60 px-5 py-3 text-xs font-semibold text-muted-foreground"
              >
                Continuar explorando
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
