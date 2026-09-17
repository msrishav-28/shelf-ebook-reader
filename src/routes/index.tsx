import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, FileUp } from "lucide-react";
import { AppBar, AppShell, IconButton, Screen } from "@/components/shelf/AppShell";
import { CoverCard } from "@/components/shelf/pieces";
import { LibraryFilterSheet, type LibraryView } from "@/components/shelf/LibraryFilterSheet";
import { useLibraryItems } from "@/hooks/use-library";
import { openLocalPublication, openSamplePublication } from "@/lib/open-publication";
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
  const navigate = useNavigate();
  const { items, ready, error } = useLibraryItems();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState<LibraryView>({
    columns: 2,
    density: "comfortable",
    sort: "alphabetical",
    filters: [],
  });

  const goToReader = (workId: string) => {
    void navigate({ to: "/reader/$workId", params: { workId } });
  };

  const sorted = useMemo(() => {
    const filtered = items.filter((item) => {
      if (query && !item.work.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (view.filters.includes("started") && !item.location) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (view.sort === "added") return b.work.createdAt.localeCompare(a.work.createdAt);
      if (view.sort === "lastRead") {
        return (b.location?.updatedAt ?? "").localeCompare(a.location?.updatedAt ?? "");
      }
      return a.work.sortTitle.localeCompare(b.work.sortTitle);
    });
  }, [items, query, view.filters, view.sort]);

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
            <IconButton label="Open a file" onClick={() => void openLocalPublication(goToReader)}>
              <FileUp className="size-5" />
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

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading your library…</p>
        ) : sorted.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center text-muted-foreground">
            <p className="text-3xl sm:text-4xl">（；¬＿¬）</p>
            <p className="text-sm">Nothing in your library yet</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                onClick={() => void openLocalPublication(goToReader)}
              >
                Open a file
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm"
                onClick={() => void openSamplePublication("sample.pdf", goToReader)}
              >
                Sample PDF
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm"
                onClick={() => void openSamplePublication("sample.epub", goToReader)}
              >
                Sample EPUB
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm"
                onClick={() => void openSamplePublication("sample.cbz", goToReader)}
              >
                Sample CBZ
              </button>
            </div>
          </div>
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
            {sorted.map((item) => (
              <CoverCard
                key={item.work.id}
                workId={item.work.id}
                title={item.work.title}
                columns={view.columns}
              />
            ))}
          </div>
        )}
      </Screen>
      <LibraryFilterSheet open={open} onOpenChange={setOpen} view={view} onChange={setView} />
    </AppShell>
  );
}
