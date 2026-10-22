import { describe, expect, it } from "vitest";
import { missoesTerritorio } from "@/data/missoes.config";
import { calcularMissoes, somarPontuacao, type ContribuicaoMissao } from "@/data/pontuacao";

const aprovados = (missaoId: string, quantidade: number): ContribuicaoMissao[] =>
  Array.from({ length: quantidade }, () => ({ missaoId, statusValidacao: "aprovado" }));
const pontos = (registros: ContribuicaoMissao[]) => somarPontuacao(calcularMissoes(registros));

describe("pontuação compartilhada preservada", () => {
  it("sem contribuições aprovadas concede zero pontos", () => {
    expect(pontos([])).toBe(0);
  });
  it("contribuições pendentes não concedem pontos", () => {
    expect(pontos(Array.from({ length: 10 }, () => ({ missaoId: "exp-mapear-ator", statusValidacao: "em_validacao" })))).toBe(0);
  });
  it("ajustes solicitados não concedem pontos", () => {
    expect(pontos([{ missaoId: "exp-mapear-ator", statusValidacao: "ajustes_solicitados" }])).toBe(0);
  });
  it("meta parcial de 9 dos 10 ativos não concede os 180 pontos", () => {
    expect(pontos(aprovados("exp-mapear-ator", 9))).toBe(0);
  });
  it("10 ativos aprovados concedem exatamente 180 pontos", () => {
    expect(pontos(aprovados("exp-mapear-ator", 10))).toBe(180);
  });
  it("aprovações excedentes não repetem os pontos da missão", () => {
    expect(pontos(aprovados("exp-mapear-ator", 30))).toBe(180);
    expect(calcularMissoes(aprovados("exp-mapear-ator", 30)).find(m => m.id === "exp-mapear-ator")?.progressoAtual).toBe(10);
  });
  it("preserva bloqueio de conclusão por pendência adicional", () => {
    expect(pontos([...aprovados("exp-mapear-ator", 10), { missaoId: "exp-mapear-ator", statusValidacao: "em_validacao" }])).toBe(0);
  });
  it("preserva bloqueio de conclusão por ajustes adicionais", () => {
    expect(pontos([...aprovados("exp-mapear-ator", 10), { missaoId: "exp-mapear-ator", statusValidacao: "ajustes_solicitados" }])).toBe(0);
  });
  it("as 12 missões completas totalizam 2.780 pontos", () => {
    expect(pontos(missoesTerritorio.flatMap(m => aprovados(m.id, m.metaTotal)))).toBe(2780);
  });
});