import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { AppBar, AppShell, Screen } from "@/components/shelf/AppShell";
import { Cover } from "@/components/shelf/pieces";
import { getLocation, getPrimaryRendition, getWork } from "@/db";
import { formatKindLabel, type Rendition, type Work } from "@/domain";

export const Route = createFileRoute("/series/$workId")({
  head: () => ({
    meta: [
      { title: "Series details — Shelf" },
      {
        name: "description",
        content: "Cover, author, chapter list and where you left off for this work.",
      },
      { property: "og:title", content: "Series details — Shelf" },
      { property: "og:description", content: "Resume or start reading, and browse every chapter." },
    ],
  }),
  component: SeriesScreen,
});

function SeriesScreen() {
  const { workId } = Route.useParams();
  const [work, setWork] = useState<Work | null>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [started, setStarted] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const nextWork = await getWork(workId);
      const nextRendition = await getPrimaryRendition(workId);
      if (cancelled) return;
      if (!nextWork || !nextRendition) {
        setMissing(true);
        return;
      }
      const location = await getLocation(nextRendition.id);
      if (cancelled) return;
      setWork(nextWork);
      setRendition(nextRendition);
      setStarted(Boolean(location));
    })();
    return () => {
      cancelled = true;
    };
  }, [workId]);

  if (missing) {
    return (
      <AppShell>
        <AppBar
          title="Not found"
          leading={
            <Link
              to="/"
              aria-label="Back"
              className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <ArrowLeft className="size-5" />
            </Link>
          }
        />
        <Screen>
          <p className="text-sm text-muted-foreground">This work is not in your library.</p>
        </Screen>
      </AppShell>
    );
  }

  if (!work || !rendition) {
    return (
      <AppShell>
        <AppBar title="Series" />
        <Screen>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </Screen>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppBar
        title={work.title}
        leading={
          <Link
            to="/"
            aria-label="Back"
            className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
        }
      />
      <Screen>
        <div className="flex gap-4 sm:gap-6">
          <div className="h-40 w-28 shrink-0 sm:h-56 sm:w-38">
            <Cover title={work.title} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold sm:text-2xl">{work.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatKindLabel(rendition.kind)} · {rendition.source.fileName}
            </p>
            <Link
              to="/reader/$workId"
              params={{ workId: work.id }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-4" />
              {started ? "Resume" : "Start"}
            </Link>
          </div>
        </div>
      </Screen>
    </AppShell>
  );
}
