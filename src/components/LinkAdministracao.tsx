import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { souAdministrador } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

/** Item "Administração" — visível somente para Administradores (verificado no servidor). */
export function LinkAdministracao() {
  const checar = useServerFn(souAdministrador);
  const { data } = useQuery({
    queryKey: ["admin", "acesso"],
    queryFn: async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) return { admin: false };
      return checar();
    },
    staleTime: 60_000,
  });
  if (!data?.admin) return null;
  return (
    <Link
      to="/admin"
      className="tap flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
      activeProps={{ className: "bg-primary text-primary-foreground" }}
    >
      <ShieldCheck className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Administração</span><span className="sm:hidden">Admin</span>
    </Link>
  );
}
