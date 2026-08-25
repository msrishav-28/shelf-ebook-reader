import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Search, Trash2 } from "lucide-react";
import { AppBar, AppShell, EmptyState, IconButton, Screen } from "@/components/shelf/AppShell";
import { Cover, DayHeader } from "@/components/shelf/pieces";
import { history as seed } from "@/lib/shelf-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Shelf" },
      { name: "description", content: "Everything you read recently, with the exact spot you left off." },
      { property: "og:title", content: "History — Shelf" },
      { property: "og:description", content: "Resume any chapter from your reading history." },
    ],
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);

  const grouped = useMemo(() => {
    const filtered = rows.filter((r) =>
      query ? r.title.toLowerCase().includes(query.toLowerCase()) : true,
    );
    return Object.entries(
      filtered.reduce<Record<string, typeof rows>>((acc, r) => {
        acc[r.day] = [...(acc[r.day] ?? []), r];
        return acc;
      }, {}),
    );
  }, [rows, query]);

  return (
    <AppShell>
      <AppBar
        title="History"
        actions={
          <>
            <IconButton label="Search history" onClick={() => setSearching((s) => !s)}>
              <Search className="size-5" />
            </IconButton>
            <IconButton label="Clear history" onClick={() => setRows([])}>
              <Trash2 className="size-5" />
            </IconButton>
          </>
        }
      />
      <Screen>
        {searching ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history"
            className="mb-2 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        ) : null}

        {grouped.length === 0 ? (
          <EmptyState face="（；¬＿¬）" caption="Nothing read yet" />
        ) : (
          grouped.map(([day, events]) => (
            <section key={day}>
              <DayHeader>{day}</DayHeader>
              <ul className="hairline-y overflow-hidden rounded-md border border-border">
                {events.map((e) => (
                  <li key={e.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-card px-3 py-2.5">
                    <Link
                      to="/reader/$workId"
                      params={{ workId: e.workId }}
                      className="h-16 w-11 shrink-0"
                      aria-label={`Open ${e.title}`}
                    >
                      <Cover title={e.title} />
                    </Link>
                    <Link to="/reader/$workId" params={{ workId: e.workId }} className="min-w-0">
                      <p className="truncate text-sm">{e.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {e.chapter} · {e.time}
                      </p>
                    </Link>
                    <div className="flex shrink-0 items-center">
                      <IconButton
                        label="Bookmark"
                        onClick={() =>
                          setLiked((l) =>
                            l.includes(e.id) ? l.filter((x) => x !== e.id) : [...l, e.id],
                          )
                        }
                      >
                        <Heart
                          className={
                            liked.includes(e.id) ? "size-5 fill-primary text-primary" : "size-5"
                          }
                        />
                      </IconButton>
                      <IconButton
                        label="Remove from history"
                        onClick={() => setRows((r) => r.filter((x) => x.id !== e.id))}
                      >
                        <Trash2 className="size-5" />
                      </IconButton>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </Screen>
    </AppShell>
  );
}
