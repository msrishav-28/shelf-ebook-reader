import { Check } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type LibraryView = {
  columns: 2 | 3;
  density: "compact" | "comfortable";
  sort: "alphabetical" | "lastRead" | "added" | "unread";
  filters: string[];
};

const FILTERS = [
  { id: "downloaded", label: "Downloaded" },
  { id: "unread", label: "Unread" },
  { id: "started", label: "Started" },
  { id: "bookmarked", label: "Bookmarked" },
  { id: "completed", label: "Completed" },
];

const SORTS: { id: LibraryView["sort"]; label: string }[] = [
  { id: "alphabetical", label: "Alphabetical" },
  { id: "lastRead", label: "Last read" },
  { id: "added", label: "Date added" },
  { id: "unread", label: "Unread count" },
];

export function LibraryFilterSheet({
  open,
  onOpenChange,
  view,
  onChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  view: LibraryView;
  onChange: (v: LibraryView) => void;
}) {
  const toggleFilter = (id: string) =>
    onChange({
      ...view,
      filters: view.filters.includes(id)
        ? view.filters.filter((f) => f !== id)
        : [...view.filters, id],
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-border bg-elevated pb-[calc(24px+env(safe-area-inset-bottom))] sm:mx-auto sm:max-w-lg"
      >
        <Tabs defaultValue="filter" className="mt-2">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
            {["filter", "sort", "display"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-none border-b-2 border-transparent bg-transparent pb-2 text-sm capitalize text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="filter" className="mt-2">
            <ul>
              {FILTERS.map((f) => (
                <li key={f.id}>
                  <Row
                    label={f.label}
                    active={view.filters.includes(f.id)}
                    onClick={() => toggleFilter(f.id)}
                  />
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="sort" className="mt-2">
            <ul>
              {SORTS.map((s) => (
                <li key={s.id}>
                  <Row
                    label={s.label}
                    active={view.sort === s.id}
                    onClick={() => onChange({ ...view, sort: s.id })}
                  />
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="display" className="mt-2 space-y-4">
            <Group title="Grid">
              <Row
                label="Comfortable"
                active={view.density === "comfortable"}
                onClick={() => onChange({ ...view, density: "comfortable" })}
              />
              <Row
                label="Compact"
                active={view.density === "compact"}
                onClick={() => onChange({ ...view, density: "compact" })}
              />
            </Group>
            <Group title="Columns">
              <Row
                label="2 columns"
                active={view.columns === 2}
                onClick={() => onChange({ ...view, columns: 2 })}
              />
              <Row
                label="3 columns"
                active={view.columns === 3}
                onClick={() => onChange({ ...view, columns: 3 })}
              />
            </Group>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-1 pb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-1 py-2.5 text-left transition-colors hover:bg-muted"
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-sm border",
          active ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {active ? <Check className="size-3.5" /> : null}
      </span>
      <span className={cn("text-sm", active ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  );
}
