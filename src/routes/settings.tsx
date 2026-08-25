import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, BookOpen, Library, Plug, Archive, Wrench } from "lucide-react";
import { AppBar, AppShell, Screen } from "@/components/shelf/AppShell";
import { ListRow } from "@/components/shelf/pieces";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Shelf" },
      { name: "description", content: "Appearance, reader, library, connectors, backup and advanced settings." },
      { property: "og:title", content: "Settings — Shelf" },
      { property: "og:description", content: "Configure how Shelf reads and syncs your library." },
    ],
  }),
  component: SettingsScreen,
});

const GROUPS = [
  { id: "appearance", title: "Appearance", icon: <Palette className="size-5" /> },
  { id: "reader", title: "Reader", icon: <BookOpen className="size-5" /> },
  { id: "library", title: "Library", icon: <Library className="size-5" /> },
  { id: "connectors", title: "Connectors", icon: <Plug className="size-5" /> },
  { id: "backup", title: "Backup", icon: <Archive className="size-5" /> },
  { id: "advanced", title: "Advanced", icon: <Wrench className="size-5" /> },
];

function SettingsScreen() {
  return (
    <AppShell>
      <AppBar
        title="Settings"
        leading={
          <Link
            to="/more"
            aria-label="Back"
            className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
        }
      />
      <Screen>
        <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
          {GROUPS.map((g) => (
            <ListRow key={g.id} icon={g.icon} title={g.title} />
          ))}
        </div>
      </Screen>
    </AppShell>
  );
}
