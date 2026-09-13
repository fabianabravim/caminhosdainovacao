import { createContext, useContext } from "react";

export interface PresetRegistroAtividade {
  tipoId?: string | undefined;
  missaoId?: string | undefined;
}

export interface RegistroAtividadeCtx {
  abrir: (preset?: PresetRegistroAtividade) => void;
}

export const RegistroAtividadeContext = createContext<RegistroAtividadeCtx | null>(null);

export function useRegistroAtividade() {
  const ctx = useContext(RegistroAtividadeContext);
  if (!ctx)
    throw new Error("useRegistroAtividade precisa estar dentro de RegistroAtividadeProvider");
  return ctx;
}
