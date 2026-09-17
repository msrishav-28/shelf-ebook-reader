export const sources = {
  lastUsed: [
    { id: "local-files", kind: "folder", title: "Local files", subtitle: "On this device" },
  ],
  groups: [
    {
      label: "Local",
      rows: [
        {
          id: "local-files",
          kind: "folder" as const,
          title: "Local files",
          subtitle: "On this device",
        },
        {
          id: "local-folder",
          kind: "folder" as const,
          title: "Local folder",
          subtitle: "Folder picking comes in a later phase",
        },
      ],
    },
    {
      label: "Samples",
      rows: [
        {
          id: "sample-pdf",
          kind: "folder" as const,
          title: "Sample PDF",
          subtitle: "Test document (3 pages)",
        },
        {
          id: "sample-epub",
          kind: "folder" as const,
          title: "Sample EPUB",
          subtitle: "Test book (2 chapters)",
        },
        {
          id: "sample-cbz",
          kind: "folder" as const,
          title: "Sample CBZ",
          subtitle: "Test comic archive (4 pages)",
        },
      ],
    },
    {
      label: "Servers",
      rows: [
        {
          id: "komga",
          kind: "server" as const,
          title: "Komga",
          subtitle: "Not connected in this phase",
        },
        {
          id: "kavita",
          kind: "server" as const,
          title: "Kavita",
          subtitle: "Not connected in this phase",
        },
      ],
    },
    {
      label: "Feeds",
      rows: [
        {
          id: "opds",
          kind: "rss" as const,
          title: "OPDS",
          subtitle: "Not connected in this phase",
        },
      ],
    },
  ],
};

export const connectors = {
  connected: [] as Array<{
    id: string;
    title: string;
    detail: string;
    status: null | "UNREACHABLE" | "AUTH";
  }>,
  available: [
    { id: "add-komga", title: "Add Komga" },
    { id: "add-kavita", title: "Add Kavita" },
    { id: "add-opds", title: "Add OPDS" },
    { id: "add-folder", title: "Add local folder" },
  ],
};

export type UpdateRow = {
  id: string;
  workId: string;
  title: string;
  chapter: string;
  ago: string;
  day: string;
};

export const updates: UpdateRow[] = [];
