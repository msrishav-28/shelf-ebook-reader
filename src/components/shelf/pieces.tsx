import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Cover({ title, className }: { title: string; className?: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={cn(
        "cover-art grid h-full w-full place-items-center overflow-hidden rounded-sm",
        className,
      )}
      aria-hidden
    >
      <span className="text-xl font-semibold text-foreground/35">{initials}</span>
    </div>
  );
}

export function CoverCard({
  workId,
  title,
  columns,
}: {
  workId: string;
  title: string;
  columns: 2 | 3;
}) {
  return (
    <Link
      to="/series/$workId"
      params={{ workId }}
      className="group relative block overflow-hidden rounded-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative aspect-2/3">
        <Cover title={title} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-scrim to-transparent px-2 pt-6 pb-1.5">
          <p
            className={cn(
              "truncate font-medium text-foreground",
              columns === 3 ? "text-xs" : "text-[13px]",
            )}
          >
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  to,
  params,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  to?: string;
  params?: Record<string, string>;
}) {
  const inner = (
    <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 text-left sm:px-4">
      {icon ? <span className="shrink-0 text-primary">{icon}</span> : <span />}
      <span className="min-w-0">
        <span className="block truncate text-sm text-foreground">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-muted-foreground">{trailing}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} params={params as never} className="block transition-colors hover:bg-muted/60">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full transition-colors hover:bg-muted/60"
    >
      {inner}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-3 pt-5 pb-2 text-[13px] font-semibold text-primary sm:px-4">{children}</h2>
  );
}

export function DayHeader({ children }: { children: ReactNode }) {
  return (
    <h2 className="bg-background/95 px-3 pt-5 pb-2 text-[13px] font-medium text-muted-foreground sm:px-4">
      {children}
    </h2>
  );
}
