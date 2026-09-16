import { Link } from "@tanstack/react-router";
import { Compass, FileText, Flag, Route as RouteIcon, User } from "lucide-react";

const itens = [
  { to: "/mapa", label: "Territórios", Icon: Compass },
  { to: "/missoes", label: "Missões", Icon: Flag },
  { to: "/jornada", label: "Jornada", Icon: RouteIcon },
  { to: "/relatorios", label: "Relatórios", Icon: FileText },
  { to: "/perfil", label: "Perfil", Icon: User },
] as const;

export function BottomNav({ compacta = false }: { compacta?: boolean }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-surface/90 shadow-[0_-8px_24px_-20px_color-mix(in_oklab,var(--brand-dark)_28%,transparent)] backdrop-blur-xl">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {itens.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className={`tap flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 font-medium text-muted-foreground data-[status=active]:text-primary ${compacta ? "text-[0.58rem] min-[390px]:text-[0.64rem] sm:text-[0.68rem]" : "text-[0.68rem]"}`}
              activeProps={{ className: "text-primary" }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? "rounded-full bg-primary/10 p-1.5 text-primary"
                        : "rounded-full p-1.5"
                    }
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
                  </span>
                  <span className="max-w-full truncate">{label}</span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
