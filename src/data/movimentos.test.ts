import { describe, expect, it } from "vitest";
import { missoesTerritorio } from "@/data/missoes.config";
import {
  calcularProgressoPorMovimento,
  movimentoPorMissao,
  missoesDoMovimento,
  pontuacaoTotalMovimento,
} from "@/data/movimentos";

const idsOriginais = [
  "exp-mapear-ator", "exp-ambiente", "exp-escuta", "con-articulacao", "con-conexao-atores",
  "con-outro-nucleo", "des-iniciativa", "des-vocacao", "des-oportunidade", "tra-mobilizar",
  "tra-oficina", "tra-resultado",
];

describe("movimentos oficiais", () => {
  it("preserva os 12 IDs originais e mapeia todos", () => {
    expect(missoesTerritorio.map((m) => m.id).sort()).toEqual([...idsOriginais].sort());
    expect(Object.keys(movimentoPorMissao).sort()).toEqual([...idsOriginais].sort());
  });

  it("aplica a matriz aprovada (não usa prefixo)", () => {
    expect(movimentoPorMissao["des-iniciativa"]).toBe("reconhecer");
    expect(movimentoPorMissao["exp-escuta"]).toBe("ouvir");
    expect(movimentoPorMissao["des-vocacao"]).toBe("traduzir");
    expect(movimentoPorMissao["tra-mobilizar"]).toBe("articular");
  });

  it("subtotais 500/400/920/960 e teto 2.780", () => {
    expect(pontuacaoTotalMovimento(missoesTerritorio, "reconhecer")).toBe(500);
    expect(pontuacaoTotalMovimento(missoesTerritorio, "ouvir")).toBe(400);
    expect(pontuacaoTotalMovimento(missoesTerritorio, "traduzir")).toBe(920);
    expect(pontuacaoTotalMovimento(missoesTerritorio, "articular")).toBe(960);
    expect(missoesTerritorio.reduce((s, m) => s + m.pontuacao, 0)).toBe(2780);
    expect(missoesDoMovimento(missoesTerritorio, "articular")).toHaveLength(4);
  });

  it("progresso usa apenas o progresso aprovado e respeita a meta", () => {
    const calc = missoesTerritorio.map((m) => ({
      ...m,
      progressoAtual: m.id === "exp-escuta" ? 99 : 0, // excesso não ultrapassa a meta
    }));
    const p = calcularProgressoPorMovimento(calc);
    expect(p.ouvir).toBe(60); // 6 de 10 (6 escutas + 4 oportunidades)
    expect(p.reconhecer).toBe(0);
    expect(p.traduzir).toBe(0);
  });
});
