import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Folder,
  Server,
  Rss,
  Search,
  Plus,
  Settings2,
  ArrowRightLeft,
  Pin,
  Sparkles,
} from "lucide-react";
import { AppBar, AppShell, EmptyState, IconButton, Screen } from "@/components/shelf/AppShell";
import { ListRow, SectionLabel } from "@/components/shelf/pieces";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { connectors, moveSources, sources } from "@/lib/shelf-data";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse sources and connectors — Shelf" },
      {
        name: "description",
        content: "Browse local folders, Komga and Kavita servers, and OPDS feeds you connected yourself.",
      },
      { property: "og:title", content: "Browse — Shelf" },
      { property: "og:description", content: "Your sources, connectors and move tools in one place." },
    ],
  }),
  component: BrowseScreen,
});

function kindIcon(kind: string) {
  if (kind === "server") return <Server className="size-5" />;
  if (kind === "rss") return <Rss className="size-5" />;
  return <Folder className="size-5" />;
}

function BrowseScreen() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const match = (t: string) => (query ? t.toLowerCase().includes(query.toLowerCase()) : true);

  return (
    <AppShell>
      <AppBar
        title="Browse"
        actions={
          <IconButton label="Search sources" onClick={() => setSearching((s) => !s)}>
            <Search className="size-5" />
          </IconButton>
        }
      />
      <Screen>
        {searching ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter rows"
            className="mb-3 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        ) : null}

        <Tabs defaultValue="sources">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-transparent p-0">
            {[
              { id: "sources", label: "Sources" },
              { id: "connectors", label: "Connectors" },
              { id: "move", label: "Move" },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-b-2 border-transparent bg-transparent pb-2 text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sources">
            <SectionLabel>Last used</SectionLabel>
            <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
              {sources.lastUsed.filter((r) => match(r.title)).map((r) => (
                <ListRow
                  key={`last-${r.id}`}
                  icon={kindIcon(r.kind)}
                  title={r.title}
                  subtitle={r.subtitle}
                  trailing={<TrailingSource />}
                />
              ))}
            </div>

            {sources.groups.map((g) => {
              const rows = g.rows.filter((r) => match(r.title));
              if (rows.length === 0) return null;
              return (
                <div key={g.label}>
                  <SectionLabel>{g.label}</SectionLabel>
                  <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
                    {rows.map((r) => (
                      <ListRow
                        key={r.id}
                        icon={kindIcon(r.kind)}
                        title={r.title}
                        subtitle={r.subtitle}
                        trailing={<TrailingSource />}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="connectors">
            <SectionLabel>Connected</SectionLabel>
            <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
              {connectors.connected.filter((c) => match(c.title)).map((c) => (
                <ListRow
                  key={c.id}
                  icon={<Server className="size-5" />}
                  title={
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate">{c.title}</span>
                      {c.status ? (
                        <span className="shrink-0 rounded-sm px-1 text-[10px] font-semibold tracking-wide text-destructive">
                          {c.status}
                        </span>
                      ) : null}
                    </span>
                  }
                  subtitle={c.detail}
                  trailing={<Settings2 className="size-5" />}
                />
              ))}
            </div>

            <SectionLabel>Available</SectionLabel>
            <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
              {connectors.available.filter((c) => match(c.title)).map((c) => (
                <ListRow
                  key={c.id}
                  icon={<Plus className="size-5" />}
                  title={c.title}
                  trailing={<Plus className="size-5" />}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="move">
            {moveSources.length === 0 ? (
              <EmptyState face="（；¬＿¬）" caption="Nothing to move" />
            ) : (
              <>
                <p className="px-3 pt-5 pb-2 text-sm text-muted-foreground sm:px-4">
                  Select a source to move from
                </p>
                <div className="hairline-y overflow-hidden rounded-md border border-border bg-card">
                  {moveSources.filter((m) => match(m.title)).map((m) => (
                    <ListRow
                      key={m.id}
                      icon={<ArrowRightLeft className="size-5" />}
                      title={m.title}
                      trailing={
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {m.count}
                        </span>
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Screen>
    </AppShell>
  );
}

function TrailingSource() {
  return (
    <>
      <span className="hidden items-center gap-1 text-xs text-primary sm:inline-flex">
        <Sparkles className="size-4" /> Latest
      </span>
      <Pin className="size-4" />
    </>
  );
}
