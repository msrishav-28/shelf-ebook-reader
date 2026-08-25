import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { AppBar, AppShell, IconButton, Screen } from "@/components/shelf/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming releases — Shelf" },
      { name: "description", content: "A month view of expected chapters from your connected servers." },
      { property: "og:title", content: "Upcoming — Shelf" },
      { property: "og:description", content: "See which days have expected chapters." },
    ],
  }),
  component: UpcomingScreen,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOTS = [4, 11, 18, 25, 27];

function UpcomingScreen() {
  const [month, setMonth] = useState(7); // August 2026
  const year = 2026;
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday start
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const today = month === 7 ? 25 : -1;

  return (
    <AppShell>
      <AppBar
        title="Upcoming"
        leading={
          <Link
            to="/updates"
            aria-label="Back"
            className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
        }
        actions={
          <IconButton label="Help">
            <HelpCircle className="size-5" />
          </IconButton>
        }
      />
      <Screen>
        <div className="mx-auto max-w-md sm:max-w-lg">
          <div className="flex items-center justify-between py-2">
            <p className="text-base font-medium">
              {MONTHS[month]} {year}
            </p>
            <div className="flex items-center">
              <IconButton label="Previous month" onClick={() => setMonth((m) => (m + 11) % 12)}>
                <ChevronLeft className="size-5" />
              </IconButton>
              <IconButton label="Next month" onClick={() => setMonth((m) => (m + 1) % 12)}>
                <ChevronRight className="size-5" />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs text-muted-foreground">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={`${d}-${i}`}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => (
              <div key={i} className="flex aspect-square flex-col items-center justify-center gap-1">
                {day ? (
                  <>
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full text-sm",
                        day === today ? "border border-primary text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {day}
                    </span>
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        month === 7 && DOTS.includes(day) ? "bg-primary" : "bg-transparent",
                      )}
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </AppShell>
  );
}
