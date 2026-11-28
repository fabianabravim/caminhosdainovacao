import { describe, expect, it } from "vitest";
import { apresentacaoMissoes } from "@/data/missoes.apresentacao";
import { missoesTerritorio } from "@/data/missoes.config";
import { movimentoPorMissao, missoesDoMovimento, ordemMovimentos } from "@/data/movimentos";

const bloco = apresentacaoMissoes.reconhecer;
if (!bloco) throw new Error("Bloco de apresentação de Reconhecer ausente");

describe("Apresentação de Reconhecer — Dados Secundários", () => {
  it("exibe o subtítulo oficial", () => {
    expect(bloco.subtitulo).toBe("Dados Secundários");
  });

  it("são exatamente dois cartões, na ordem aprovada", () => {
    expect(bloco.cartoes.map((c) => c.titulo)).toEqual([
      "Mapeamento de ambientes",
      "Mapeamento de suporte",
    ]);
  });

  it("reproduz as descrições aprovadas", () => {
    expect(bloco.cartoes[0]?.descricao).toBe(
      "Identifique e registre ambientes que promovem a inovação no território.",
    );
    expect(bloco.cartoes[1]?.descricao).toBe(
      "Identifique e registre mecanismos de apoio e incentivo à inovação no território.",
    );
  });

  it("lista as categorias de ambientes", () => {
    expect(bloco.cartoes[0]?.categorias).toEqual([
      "Incubadora",
      "Aceleradora",
      "Parque Tecnológico",
      "NIT",
      "Outros (especificar)",
    ]);
  });

  it("lista as categorias de suporte", () => {
    expect(bloco.cartoes[1]?.categorias).toEqual([
      "Leis",
      "Programas de Inovação",
      "Editais de Fomento",
      "Órgãos Públicos",
      "Feiras e Eventos de Inovação",
      "Pesquisa",
      "Outros (especificar)",
    ]);
  });

  it("usa os botões e a pontuação informativa aprovados", () => {
    expect(bloco.cartoes.map((c) => c.cta)).toEqual(["Cadastrar ambiente", "Cadastrar suporte"]);
    expect(bloco.cartoes.map((c) => c.pontuacao)).toEqual([
      "50 pontos após aprovação",
      "40 pontos após aprovação",
    ]);
  });

  it("não exibe conquistas, metas ou pontuações antigas nos cartões", () => {
    for (const cartao of bloco.cartoes) {
      expect(cartao).not.toHaveProperty("conquista");
      expect(cartao).not.toHaveProperty("metaTotal");
      expect(cartao).not.toHaveProperty("pontuacaoAnterior");
    }
    expect(bloco.cartoes.map((c) => c.pontuacao).join()).not.toContain("120");
    expect(bloco.cartoes.map((c) => c.pontuacao).join()).not.toContain("180");
  });

  it("preserva o identificador legado da missão de ambientes", () => {
    expect(bloco.cartoes[0]?.missaoId).toBe("exp-ambiente");
    expect(missoesTerritorio.some((m) => m.id === "exp-ambiente")).toBe(true);
    expect(movimentoPorMissao["exp-ambiente"]).toBe("reconhecer");
  });

  it("não inventa missão para suporte: o cartão não referencia identificador", () => {
    expect(bloco.cartoes[1]?.missaoId).toBeUndefined();
  });

  it("a apresentação nunca define associação de movimento", () => {
    for (const mov of ordemMovimentos) {
      for (const cartao of apresentacaoMissoes[mov]?.cartoes ?? []) {
        if (cartao.missaoId) expect(movimentoPorMissao[cartao.missaoId]).toBe(mov);
      }
    }
  });

  it("mantém as três missões legadas de Reconhecer no banco de regras", () => {
    expect(missoesDoMovimento(missoesTerritorio, "reconhecer").map((m) => m.id).sort()).toEqual([
      "des-iniciativa",
      "exp-ambiente",
      "exp-mapear-ator",
    ]);
  });

  it("não altera a apresentação de Ouvir, Traduzir e Articular", () => {
    expect(apresentacaoMissoes.ouvir).toBeUndefined();
    expect(apresentacaoMissoes.traduzir).toBeUndefined();
    expect(apresentacaoMissoes.articular).toBeUndefined();
  });
});
