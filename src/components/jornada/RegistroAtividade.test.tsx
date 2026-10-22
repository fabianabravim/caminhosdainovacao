import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistroAtividadeProvider, BotaoRegistrarAtividade } from "./RegistroAtividade";
import { criarEnvioUnico, errosFormulario, formularioAlterado, vinculoRegistro, type FormularioAtividade } from "./registroAtividadeFormulario";
import type { ResultadoRegistro } from "@/context/meuNucleoBase";

const { registrar } = vi.hoisted(() => ({ registrar: vi.fn() }));
// Never mount the real data provider: submissions only reach this isolated spy.
vi.mock("@/context/meuNucleoBase", () => ({ useMeuNucleo: () => ({ registrarAtividade: registrar }) }));

const vazio: FormularioAtividade = { tipoId: "mapeamento_ativo", data: "", titulo: "", descricao: "", municipio: "", local: "", atores: "", resultados: "", observacoes: "", localizacao: "", evidenciaLink: "" };
const valido = { ...vazio, data: "2026-10-22", titulo: "Teste isolado", descricao: "Atividade sem persistência real" };
const retorno = (extra = {}): ResultadoRegistro => ({ atividade: { ...valido, id: "isolado", status: "em_validacao", criadoEm: "2026-10-22", missoesRelacionadas: ["exp-mapear-ator", "exp-ambiente"], fonteContribuicao: "ativos_inovacao", ...extra }, missoesRelacionadas: [] });

afterEach(cleanup);
beforeEach(() => { registrar.mockReset(); });

async function abrir() {
  const user = userEvent.setup();
  render(<RegistroAtividadeProvider><BotaoRegistrarAtividade /><a href="#fora">Fora do diálogo</a></RegistroAtividadeProvider>);
  const origem = screen.getByRole("button", { name: "Registrar atividade" });
  await user.click(origem);
  return { user, origem };
}

async function preencher() {
  fireEvent.change(screen.getByLabelText("Data (obrigatório)"), { target: { value: valido.data } });
  fireEvent.change(screen.getByLabelText("Título da atividade (obrigatório)"), { target: { value: valido.titulo } });
  fireEvent.change(screen.getByLabelText("O que foi realizado? (obrigatório)"), { target: { value: valido.descricao } });
}

describe("Etapa 3A sem persistência", () => {
  it("rejeita campos obrigatórios vazios e data impossível", () => {
    expect(Object.keys(errosFormulario(vazio)).sort()).toEqual(["data", "descricao", "titulo"]);
    expect(errosFormulario({ ...valido, data: "2026-02-30" }).data).toBeDefined();
    expect(errosFormulario({ ...valido, titulo: "   " }).titulo).toBeDefined();
  });
  it("rejeita links de execução e texto acima do limite", () => {
    expect(errosFormulario({ ...valido, evidenciaLink: "javascript:alert(1)" }).evidenciaLink).toBeDefined();
    expect(errosFormulario({ ...valido, titulo: "a".repeat(501) }).titulo).toBeDefined();
    expect(errosFormulario({ ...valido, evidenciaLink: "https://example.org/evidencia" })).toEqual({});
  });
  it("presets intocados não pedem descarte, textos e nomes de arquivos sim", () => {
    expect(formularioAlterado(vazio, vazio)).toBe(false);
    expect(formularioAlterado(valido, vazio)).toBe(true);
    expect(formularioAlterado(vazio, vazio, "foto.jpg")).toBe(true);
    expect(formularioAlterado(vazio, vazio, undefined, "documento.pdf")).toBe(true);
  });
  it("apresenta apenas o vínculo consumido pelo progresso e o movimento central", () => {
    expect(vinculoRegistro(retorno().atividade)?.missao.id).toBe("exp-mapear-ator");
    expect(vinculoRegistro(retorno().atividade)?.movimento).toBe("Reconhecer");
    expect(vinculoRegistro(retorno({ missaoId: "tra-mobilizar" }).atividade)?.movimento).toBe("Articular");
  });
  it("não inventa vínculo sem contribuição, sem IDs ou com ID desconhecido", () => {
    expect(vinculoRegistro(retorno({ fonteContribuicao: undefined }).atividade)).toBeUndefined();
    expect(vinculoRegistro(retorno({ missoesRelacionadas: [] }).atividade)).toBeUndefined();
    expect(vinculoRegistro(retorno({ missaoId: "inexistente" }).atividade)).toBeUndefined();
  });
  it("bloqueia concorrência e libera o envio após falha", async () => {
    const executar = criarEnvioUnico();
    let resolver: ((value: number) => void) | undefined;
    const enviar = vi.fn(() => new Promise<number>((resolve) => { resolver = resolve; }));
    const primeiro = executar(enviar);
    expect(await executar(enviar)).toBeUndefined();
    expect(enviar).toHaveBeenCalledTimes(1);
    resolver?.(7);
    expect(await primeiro).toBe(7);
    await expect(executar(() => Promise.reject(new Error("Falha")))).rejects.toThrow("Falha");
    expect(await executar(() => Promise.resolve(8))).toBe(8);
  });
  it("leva foco ao campo inicial, contém Tab e retorna à origem ao fechar", async () => {
    const { user, origem } = await abrir();
    expect(document.activeElement).toBe(screen.getByRole("combobox"));
    for (let n = 0; n < 18; n++) {
      await user.tab();
      expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    }
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(origem);
    expect(registrar).not.toHaveBeenCalled();
  });
  it("mostra erros junto aos campos e não envia um formulário inválido", async () => {
    const { user } = await abrir();
    await user.click(screen.getByRole("button", { name: "ENVIAR REGISTRO" }));
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Data (obrigatório)")));
    expect(registrar).not.toHaveBeenCalled();
  });
  it("preserva preenchimento ao cancelar descarte e devolve foco após confirmar", async () => {
    const { user, origem } = await abrir();
    await preencher();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("alertdialog")).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Continuar preenchendo" }));
    expect((screen.getByLabelText("Título da atividade (obrigatório)") as HTMLInputElement).value).toBe(valido.titulo);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    await user.click(screen.getByRole("button", { name: /^Descartar$/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(origem);
    expect(registrar).not.toHaveBeenCalled();
  });
  it("envia uma vez, impede fechar durante processamento e confirma apenas uma missão", async () => {
    let resolver: ((value: ResultadoRegistro) => void) | undefined;
    registrar.mockImplementation(() => new Promise<ResultadoRegistro>((resolve) => { resolver = resolve; }));
    const { user } = await abrir();
    await preencher();
    const form = screen.getByLabelText("Data (obrigatório)").closest("form");
    if (!form) throw new Error("Formulário ausente");
    fireEvent.submit(form); fireEvent.submit(form);
    expect(registrar).toHaveBeenCalledTimes(1);
    expect(registrar.mock.calls[0]?.[0].missaoId).toBeUndefined();
    expect((screen.getByRole("button", { name: "ENVIANDO…" }) as HTMLButtonElement).disabled).toBe(true);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeDefined();
    await act(async () => resolver?.(retorno()));
    expect(screen.getByText("Reconhecer")).toBeDefined();
    expect(screen.queryByText(/Esta atividade poderá contribuir/)).toBeNull();
    expect(screen.getByText(/Missão vinculada/).textContent).not.toContain("ambiente");
  });
  it("falha retém preenchimento e permite nova tentativa isolada", async () => {
    registrar.mockRejectedValueOnce(new Error("Falha isolada")).mockResolvedValueOnce(retorno({ fonteContribuicao: undefined }));
    const { user } = await abrir();
    await preencher();
    await user.click(screen.getByRole("button", { name: "ENVIAR REGISTRO" }));
    expect(await screen.findByRole("alert")).toBeDefined();
    expect((screen.getByLabelText("Título da atividade (obrigatório)") as HTMLInputElement).value).toBe(valido.titulo);
    await user.click(screen.getByRole("button", { name: "ENVIAR REGISTRO" }));
    expect(await screen.findByText(/Nenhuma missão contabilizada/)).toBeDefined();
    expect(registrar).toHaveBeenCalledTimes(2);
  });
});