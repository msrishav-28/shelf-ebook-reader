import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, RefreshCw, SlidersHorizontal } from "lucide-react";
import { AppBar, AppShell, EmptyState, IconButton, Screen } from "@/components/shelf/AppShell";
import { updates } from "@/lib/shelf-data";
import { Cover, DayHeader } from "@/components/shelf/pieces";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Updates — Shelf" },
      {
        name: "description",
        content: "New chapters from your connected Komga, Kavita and OPDS libraries.",
      },
      { property: "og:title", content: "Updates — Shelf" },
      { property: "og:description", content: "New chapters from your own servers and feeds." },
    ],
  }),
  component: UpdatesScreen,
});

function UpdatesScreen() {
  return (
    <AppShell>
      <AppBar
        title="Updates"
        actions={
          <>
            <IconButton label="Filter updates">
              <SlidersHorizontal className="size-5" />
            </IconButton>
            <Link to="/upcoming" aria-label="Upcoming" className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <CalendarDays className="size-5" />
            </Link>
            <IconButton label="Refresh">
              <RefreshCw className="size-5" />
            </IconButton>
          </>
        }
      />
      <Screen>
        {updates.length === 0 ? (
          <EmptyState face="（・Д・。）" caption="No recent updates" />
        ) : (
          <ul>
            {updates.map((u) => (
              <li key={u.id}>
                <DayHeader>{u.day}</DayHeader>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="h-16 w-11 shrink-0">
                    <Cover title={u.title} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{u.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.chapter} · {u.ago}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Screen>
    </AppShell>
  );
}
