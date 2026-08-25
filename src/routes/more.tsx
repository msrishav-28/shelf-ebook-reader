import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  EyeOff,
  ListOrdered,
  Layers,
  BarChart3,
  Database,
  Settings,
  Info,
  HelpCircle,
  Library,
} from "lucide-react";
import { AppBar, AppShell, Screen } from "@/components/shelf/AppShell";
import { ListRow } from "@/components/shelf/pieces";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More settings and tools — Shelf" },
      {
        name: "description",
        content: "Downloaded-only mode, incognito reading, categories, storage and app settings.",
      },
      { property: "og:title", content: "More — Shelf" },
      { property: "og:description", content: "Toggles, storage, categories and settings for Shelf." },
    ],
  }),
  component: MoreScreen,
});

function MoreScreen() {
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  const [incognito, setIncognito] = useState(false);

  return (
    <AppShell>
      <AppBar title="More" />
      <Screen>
        <div className="mb-6 flex flex-col items-center gap-2 py-6 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Library className="size-7" />
          </span>
          <p className="text-xl font-semibold tracking-tight">Shelf</p>
        </div>

        <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
          <ToggleRow
            icon={<Download className="size-5" />}
            title="Downloaded only"
            subtitle="Filters all entries in your library"
            checked={downloadedOnly}
            onChange={setDownloadedOnly}
          />
          <ToggleRow
            icon={<EyeOff className="size-5" />}
            title="Incognito mode"
            subtitle="Pauses reading history"
            checked={incognito}
            onChange={setIncognito}
          />
        </div>

        <Group>
          <ListRow icon={<ListOrdered className="size-5" />} title="Download queue" />
          <ListRow icon={<Layers className="size-5" />} title="Categories" />
          <ListRow icon={<BarChart3 className="size-5" />} title="Statistics" />
          <ListRow icon={<Database className="size-5" />} title="Data and storage" />
        </Group>

        <Group>
          <ListRow icon={<Settings className="size-5" />} title="Settings" to="/settings" />
        </Group>

        <Group>
          <ListRow icon={<Info className="size-5" />} title="About" />
          <ListRow icon={<HelpCircle className="size-5" />} title="Help" />
        </Group>
      </Screen>
    </AppShell>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="hairline-y mt-4 overflow-hidden rounded-md border border-border bg-card">
      {children}
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  subtitle,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-4">
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}
