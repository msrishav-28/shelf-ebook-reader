import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { library } from "@/lib/shelf-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reader/$workId")({
  head: () => ({
    meta: [
      { title: "Reader — Shelf" },
      { name: "description", content: "Distraction-free reading with tap zones, page slider and hidden chrome." },
      { property: "og:title", content: "Reader — Shelf" },
      { property: "og:description", content: "Read comics, books and PDFs with chrome that gets out of the way." },
    ],
  }),
  loader: ({ params }) => {
    const work = library.find((w) => w.id === params.workId);
    if (!work) throw notFound();
    return { work };
  },
  component: ReaderScreen,
});

function ReaderScreen() {
  const { work } = Route.useLoaderData();
  const [chrome, setChrome] = useState(true);
  const [page, setPage] = useState(4);
  const total = 22;

  return (
    <div className="relative min-h-screen bg-background">
      {/* page surface */}
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-2">
        <div className="cover-art grid aspect-2/3 w-full max-h-[92vh] place-items-center rounded-sm">
          <span className="text-4xl font-semibold text-foreground/30">{page}</span>
        </div>
      </div>

      {/* tap zones: left back, center chrome, right forward */}
      <div className="absolute inset-0 grid grid-cols-[1fr_1fr_1fr]">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        />
        <button type="button" aria-label="Toggle controls" onClick={() => setChrome((c) => !c)} />
        <button
          type="button"
          aria-label="Next page"
          onClick={() => setPage((p) => Math.min(total, p + 1))}
        />
      </div>

      {/* chrome */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-2 py-2 backdrop-blur transition-opacity",
          chrome ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Link
          to="/series/$workId"
          params={{ workId: work.id }}
          aria-label="Back to series"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{work.title}</p>
          <p className="truncate text-xs text-muted-foreground">{work.lastRead ?? "Ch. 1"}</p>
        </div>
        <button
          type="button"
          aria-label="Reader settings"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings2 className="size-5" />
        </button>
      </header>

      <footer
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-3 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur transition-opacity",
          chrome ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <ChevronLeft className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={1}
            max={total}
            value={page}
            aria-label="Page"
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-1 flex-1 appearance-none rounded-full bg-muted accent-primary"
          />
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
            {page} / {total}
          </span>
        </div>
      </footer>
    </div>
  );
}
