import { Link } from "@tanstack/react-router";
import { Compass, Flag, Route as RouteIcon, Share2, User } from "lucide-react";

const itens = [
  { to: "/mapa", label: "Mapa", Icon: Compass },
  { to: "/missoes", label: "Missões", Icon: Flag },
  { to: "/jornada", label: "Jornada", Icon: RouteIcon },
  { to: "/rede", label: "Rede", Icon: Share2 },
  { to: "/perfil", label: "Perfil", Icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {itens.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="tap flex flex-col items-center gap-1 px-1 py-2.5 text-[0.68rem] font-medium text-muted-foreground data-[status=active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? "panel-glow rounded-full bg-primary/25 p-1.5 text-lilac"
                        : "rounded-full p-1.5"
                    }
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
                  </span>
                  <span>{label}</span>
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
