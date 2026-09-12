import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MoreVertical, Play, Download, Check } from "lucide-react";
import { AppBar, AppShell, IconButton, Screen } from "@/components/shelf/AppShell";
import { Cover } from "@/components/shelf/pieces";
import { chaptersFor, library } from "@/lib/shelf-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/series/$workId")({
  head: () => ({
    meta: [
      { title: "Series details — Shelf" },
      { name: "description", content: "Cover, author, chapter list and where you left off for this work." },
      { property: "og:title", content: "Series details — Shelf" },
      { property: "og:description", content: "Resume or start reading, and browse every chapter." },
    ],
  }),
  loader: ({ params }) => {
    const work = library.find((w) => w.id === params.workId);
    if (!work) throw notFound();
    return { work };
  },
  component: SeriesScreen,
});

function SeriesScreen() {
  const { work } = Route.useLoaderData();
  const chapters = chaptersFor(work);

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
        actions={
          <IconButton label="More options">
            <MoreVertical className="size-5" />
          </IconButton>
        }
      />
      <Screen>
        <div className="flex gap-4 sm:gap-6">
          <div className="h-40 w-28 shrink-0 sm:h-56 sm:w-38">
            <Cover title={work.title} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold sm:text-2xl">{work.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{work.author}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {work.source} · {work.chapters} chapters · {work.unread} unread
            </p>
            <Link
              to="/reader/$workId"
              params={{ workId: work.id }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-4" />
              {work.lastRead ? "Resume" : "Start"}
            </Link>
          </div>
        </div>

        <h3 className="pt-7 pb-2 text-sm font-semibold text-primary">Chapters</h3>
        <ul className="hairline-y overflow-hidden rounded-md border border-border bg-card">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link
                to="/reader/$workId"
                params={{ workId: work.id }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/60 sm:px-4"
              >
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-sm",
                      c.read ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {c.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{c.date}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                  {c.read ? <Check className="size-4" /> : null}
                  <Download className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Screen>
    </AppShell>
  );
}
