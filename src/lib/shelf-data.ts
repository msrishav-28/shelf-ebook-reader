export type Work = {
  id: string;
  title: string;
  author: string;
  unread: number;
  chapters: number;
  source: string;
  lastRead?: string;
};

export const library: Work[] = [
  { id: "one-piece", title: "Sea of Ledgers", author: "H. Marune", unread: 543, chapters: 1102, source: "Komga", lastRead: "Ch. 559" },
  { id: "blue-lock", title: "Quiet Machines", author: "R. Okabe", unread: 153, chapters: 288, source: "Local files", lastRead: "Ch. 135" },
  { id: "dandadan", title: "Signal Garden", author: "T. Ibarra", unread: 12, chapters: 96, source: "OPDS" },
  { id: "vinland", title: "Winterlight", author: "M. Yukimura", unread: 0, chapters: 210, source: "Komga", lastRead: "Ch. 210" },
  { id: "frieren", title: "After the Journey", author: "K. Abe", unread: 4, chapters: 118, source: "Kavita" },
  { id: "berserk", title: "Iron Pilgrim", author: "S. Vale", unread: 27, chapters: 374, source: "Local folder" },
];

export type HistoryEvent = {
  id: string;
  workId: string;
  title: string;
  chapter: string;
  time: string;
  day: string;
};

export const history: HistoryEvent[] = [
  { id: "h1", workId: "one-piece", title: "Sea of Ledgers", chapter: "Ch. 559", time: "9:51 am", day: "25/08/2026" },
  { id: "h2", workId: "blue-lock", title: "Quiet Machines", chapter: "Ch. 135", time: "9:12 am", day: "25/08/2026" },
  { id: "h3", workId: "frieren", title: "After the Journey", chapter: "Ch. 114", time: "11:38 pm", day: "24/08/2026" },
  { id: "h4", workId: "berserk", title: "Iron Pilgrim", chapter: "Ch. 347", time: "8:02 pm", day: "24/08/2026" },
  { id: "h5", workId: "vinland", title: "Winterlight", chapter: "Ch. 210", time: "7:30 pm", day: "22/08/2026" },
];

export type UpdateRow = {
  id: string;
  workId: string;
  title: string;
  chapter: string;
  ago: string;
  day: string;
};

export const updates: UpdateRow[] = [];

export const sources = {
  lastUsed: [
    { id: "local-files", kind: "folder", title: "Local files", subtitle: "On this device" },
    { id: "komga", kind: "server", title: "Komga", subtitle: "komga.home.lan" },
  ],
  groups: [
    {
      label: "Local",
      rows: [
        { id: "local-files", kind: "folder", title: "Local files", subtitle: "On this device" },
        { id: "local-folder", kind: "folder", title: "Local folder", subtitle: "/Comics/2026" },
      ],
    },
    {
      label: "Servers",
      rows: [
        { id: "komga", kind: "server", title: "Komga", subtitle: "komga.home.lan" },
        { id: "kavita", kind: "server", title: "Kavita", subtitle: "kavita.home.lan" },
      ],
    },
    {
      label: "Feeds",
      rows: [{ id: "opds", kind: "rss", title: "OPDS", subtitle: "Standard Ebooks" }],
    },
  ],
} as const;

export const connectors = {
  connected: [
    { id: "komga", title: "Komga", detail: "Komga · token set", status: null as null | "UNREACHABLE" | "AUTH" },
    { id: "kavita", title: "Kavita", detail: "Kavita · token set", status: "AUTH" as const },
    { id: "opds", title: "Standard Ebooks", detail: "OPDS · public feed", status: "UNREACHABLE" as const },
  ],
  available: [
    { id: "add-komga", title: "Add Komga" },
    { id: "add-kavita", title: "Add Kavita" },
    { id: "add-opds", title: "Add OPDS" },
    { id: "add-folder", title: "Add local folder" },
  ],
};

export const moveSources = [
  { id: "local-files", title: "Local files", count: 24 },
  { id: "komga", title: "Komga", count: 118 },
  { id: "opds", title: "OPDS", count: 3 },
];

export function chaptersFor(work: Work) {
  const read = Math.max(work.chapters - work.unread, 0);
  return Array.from({ length: Math.min(work.chapters, 24) }, (_, i) => {
    const n = work.chapters - i;
    return {
      id: `${work.id}-${n}`,
      number: n,
      title: `Chapter ${n}`,
      date: `${((i * 7) % 28) + 1}/08/2026`,
      read: n <= read,
    };
  });
}
