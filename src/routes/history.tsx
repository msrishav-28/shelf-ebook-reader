import { createFileRoute } from "@tanstack/react-router";
import { AppBar, AppShell, EmptyState, Screen } from "@/components/shelf/AppShell";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Shelf" },
      {
        name: "description",
        content: "Everything you read recently, with the exact spot you left off.",
      },
      { property: "og:title", content: "History — Shelf" },
      { property: "og:description", content: "Resume any chapter from your reading history." },
    ],
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  return (
    <AppShell>
      <AppBar title="History" />
      <Screen>
        <EmptyState face="（；¬＿¬）" caption="Nothing read yet" />
      </Screen>
    </AppShell>
  );
}
