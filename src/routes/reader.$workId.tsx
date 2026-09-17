import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getFileBlob, getLocation, getPrimaryRendition, getWork, scheduleLocationSave } from "@/db";
import type { Locator, Rendition, Work } from "@/domain";
import { openReader, type ReaderHandle, type ReaderProgress } from "@/readers/open";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reader/$workId")({
  head: () => ({
    meta: [
      { title: "Reader — Shelf" },
      {
        name: "description",
        content: "Distraction-free reading with tap zones, page slider and hidden chrome.",
      },
      { property: "og:title", content: "Reader — Shelf" },
      {
        property: "og:description",
        content: "Read comics, books and PDFs with chrome that gets out of the way.",
      },
    ],
  }),
  component: ReaderScreen,
});

type Loaded = {
  work: Work;
  rendition: Rendition;
  blob: Blob;
  initial: Locator | undefined;
};

function ReaderScreen() {
  const { workId } = Route.useParams();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chrome, setChrome] = useState(true);
  const [progress, setProgress] = useState<ReaderProgress>({ current: 1, total: 1, unit: "page" });
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ReaderHandle | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const work = await getWork(workId);
        const rendition = await getPrimaryRendition(workId);
        if (!work || !rendition) {
          if (!cancelled) setError("This work is not in your library.");
          return;
        }
        const blob = await getFileBlob(rendition.id);
        if (!blob) {
          if (!cancelled) setError("The file for this work is missing.");
          return;
        }
        const location = await getLocation(rendition.id);
        if (cancelled) return;
        setLoaded({ work, rendition, blob, initial: location?.locator });
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "This file could not be opened.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workId]);

  useEffect(() => {
    const el = hostRef.current;
    if (!loaded || !el) return;
    let dead = false;
    void openReader(loaded.rendition.kind, {
      file: loaded.blob,
      fileName: loaded.rendition.source.fileName,
      container: el,
      initial: loaded.initial,
      onLocation: (locator) => scheduleLocationSave(loaded.rendition.id, locator),
      onProgress: setProgress,
    })
      .then((handle) => {
        if (dead) {
          handle.destroy();
          return;
        }
        handleRef.current = handle;
      })
      .catch((cause: unknown) => {
        if (!dead) {
          setError(cause instanceof Error ? cause.message : "This file could not be opened.");
        }
      });
    return () => {
      dead = true;
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [loaded]);

  const work = loaded?.work;
  const isEpub = loaded?.rendition.kind === "local_epub";

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Link to="/" className="text-sm text-primary">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-2 py-16">
        <div ref={hostRef} className="flex w-full justify-center" />
      </div>

      {!isEpub ? (
        <div className="absolute inset-0 z-10 grid grid-cols-[1fr_1fr_1fr]">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => void handleRef.current?.prev()}
          />
          <button type="button" aria-label="Toggle controls" onClick={() => setChrome((c) => !c)} />
          <button
            type="button"
            aria-label="Next page"
            onClick={() => void handleRef.current?.next()}
          />
        </div>
      ) : null}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-2 py-2 backdrop-blur transition-opacity",
          chrome ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Link
          to="/series/$workId"
          params={{ workId }}
          aria-label="Back to series"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{work?.title ?? "Reader"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {loaded?.rendition.source.fileName}
          </p>
        </div>
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
            min={progress.unit === "page" ? 1 : 0}
            max={progress.total}
            value={progress.current}
            aria-label={progress.unit === "page" ? "Page" : "Place in book"}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (progress.unit === "percent") {
                void handleRef.current?.seekPercent(value);
                return;
              }
              const kind = loaded?.rendition.kind;
              if (kind === "local_pdf") {
                void handleRef.current?.goTo({ type: "pdf_page", page: value });
              } else {
                void handleRef.current?.goTo({ type: "image_page", page: value });
              }
            }}
            className="h-1 flex-1 appearance-none rounded-full bg-muted accent-primary"
          />
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          <span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
            {progress.unit === "page"
              ? `${progress.current} / ${progress.total}`
              : `${progress.current}%`}
          </span>
        </div>
      </footer>
    </div>
  );
}
