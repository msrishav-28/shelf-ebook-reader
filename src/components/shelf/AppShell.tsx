import { Link, useRouterState } from "@tanstack/react-router";
import { BookCopy, Bell, History, Compass, MoreHorizontal, Library } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Library", icon: BookCopy },
  { to: "/updates", label: "Updates", icon: Bell },
  { to: "/history", label: "History", icon: History },
  { to: "/browse", label: "Browse", icon: Compass },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;

function useActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
}

export function AppShell({ children }: { children: ReactNode }) {
  const isActive = useActive();

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Desktop rail / sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 flex-col border-r border-border bg-sidebar py-4 md:flex lg:w-60">
        <div className="mb-6 flex items-center gap-3 px-4 lg:px-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Library className="size-5" />
          </span>
          <span className="hidden truncate text-lg font-semibold tracking-tight lg:block">
            Shelf
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-2 lg:px-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  "justify-center lg:justify-start",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 1.8} />
                <span className="hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav — five items, frozen order */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <li key={to}>
                <Link to={to} className="flex flex-col items-center gap-1 py-2" aria-label={label}>
                  <span
                    className={cn(
                      "grid h-7 w-14 place-items-center rounded-full transition-colors",
                      active ? "bg-primary" : "bg-transparent",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5",
                        active ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                      strokeWidth={active ? 2.4 : 1.8}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-[11px] leading-none",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function AppBar({
  title,
  actions,
  leading,
  tabs,
}: {
  title: string;
  actions?: ReactNode;
  leading?: ReactNode;
  tabs?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {leading}
          <h1 className="truncate text-[22px] font-medium tracking-tight sm:text-2xl">{title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 text-muted-foreground">{actions}</div>
      </div>
      {tabs ? <div className="mx-auto max-w-6xl px-1 sm:px-3">{tabs}</div> : null}
    </header>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-3 py-3 sm:px-5 sm:py-5">{children}</div>;
}

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function EmptyState({ face, caption }: { face: string; caption: string }) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-muted-foreground">
      <p className="text-3xl sm:text-4xl">{face}</p>
      <p className="text-sm">{caption}</p>
    </div>
  );
}
