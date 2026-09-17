import type { Locator, RenditionKind } from "@/domain";

export type ReaderProgress = {
  current: number;
  total: number;
  unit: "page" | "percent";
};

export type OpenReaderArgs = {
  file: Blob;
  fileName: string;
  container: HTMLElement;
  initial: Locator | undefined;
  onLocation: (locator: Locator) => void;
  onProgress: (progress: ReaderProgress) => void;
};

export type ReaderHandle = {
  goTo: (locator: Locator) => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seekPercent: (percent: number) => Promise<void>;
  destroy: () => void;
};

export type ReaderEngine = (args: OpenReaderArgs) => Promise<ReaderHandle>;

export function defaultLocator(kind: RenditionKind): Locator {
  if (kind === "local_epub") return { type: "epub_cfi", cfi: "" };
  if (kind === "local_pdf") return { type: "pdf_page", page: 1 };
  return { type: "image_page", page: 1 };
}
