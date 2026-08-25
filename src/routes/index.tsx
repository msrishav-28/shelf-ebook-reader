import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, MoreVertical } from "lucide-react";
import { AppBar, AppShell, EmptyState, IconButton, Screen } from "@/components/shelf/AppShell";
import { CoverCard } from "@/components/shelf/pieces";
import { LibraryFilterSheet, type LibraryView } from "@/components/shelf/LibraryFilterSheet";
import { library } from "@/lib/shelf-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shelf — Your library of comics, books and PDFs" },
      {
        name: "description",
        content:
          "Shelf is a reader for your own files and your own servers: CBZ, EPUB and PDF, plus Komga, Kavita and OPDS.",
      },
      { property: "og:title", content: "Shelf — Your library, your servers" },
      {
        property: "og:description",
        content: "Open CBZ, EPUB and PDF, keep progress, and connect Komga, Kavita or OPDS.",
      },
    ],
  }),
  component: LibraryScreen,
});

function LibraryScreen() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState<LibraryView>({
    columns: 2,
    density: "comfortable",
    sort: "alphabetical",
    filters: [],
  });

  const works = library.filter((w) => {
    if (query && !w.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (view.filters.includes("unread") && w.unread === 0) return false;
    if (view.filters.includes("started") && !w.lastRead) return false;
    if (view.filters.includes("completed") && w.unread !== 0) return false;
    return true;
  });

  const sorted = [...works].sort((a, b) => {
    if (view.sort === "unread") return b.unread - a.unread;
    if (view.sort === "added") return 0;
    if (view.sort === "lastRead") return (b.lastRead ? 1 : 0) - (a.lastRead ? 1 : 0);
    return a.title.localeCompare(b.title);
  });

  return (
    <AppShell>
      <AppBar
        title="Library"
        actions={
          <>
            <IconButton label="Search library" onClick={() => setSearching((s) => !s)}>
              <Search className="size-5" />
            </IconButton>
            <IconButton label="Filter and display" onClick={() => setOpen(true)}>
              <SlidersHorizontal className="size-5" />
            </IconButton>
            <IconButton label="More options">
              <MoreVertical className="size-5" />
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
            placeholder="Search titles"
            className="mb-4 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        ) : null}

        {sorted.length === 0 ? (
          <EmptyState face="（；¬＿¬）" caption="Nothing in your library yet" />
        ) : (
          <div
            className={cn(
              "grid",
              view.density === "compact" ? "gap-1.5" : "gap-2.5",
              view.columns === 3
                ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
            )}
          >
            {sorted.map((work) => (
              <CoverCard key={work.id} work={work} columns={view.columns} />
            ))}
          </div>
        )}
      </Screen>
      <LibraryFilterSheet open={open} onOpenChange={setOpen} view={view} onChange={setView} />
    </AppShell>
  );
}
