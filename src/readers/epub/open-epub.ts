import type { Locator } from "@/domain";
import type { OpenReaderArgs, ReaderHandle } from "../types";

type FoliateView = HTMLElement & {
  open: (book: File | Blob | string) => Promise<void>;
  close: () => void;
  init: (opts: { lastLocation?: string; showTextStart?: boolean }) => Promise<void>;
  goTo: (target: string | number) => Promise<unknown>;
  goToFraction: (frac: number) => Promise<void>;
  prev: () => Promise<void>;
  next: () => Promise<void>;
  lastLocation?: { cfi?: string; fraction?: number };
};

export async function openEpub({
  file,
  fileName,
  container,
  initial,
  onLocation,
  onProgress,
}: OpenReaderArgs): Promise<ReaderHandle> {
  await import("foliate-js/view.js");
  const view = document.createElement("foliate-view") as FoliateView;
  view.style.display = "block";
  view.style.width = "100%";
  view.style.height = "100%";
  view.style.minHeight = "70vh";
  container.replaceChildren(view);

  const bookFile =
    file instanceof File ? file : new File([file], fileName, { type: "application/epub+zip" });

  const onRelocate = (event: Event) => {
    const detail = (event as CustomEvent<{ cfi?: string; fraction?: number }>).detail;
    const cfi = detail.cfi ?? "";
    if (cfi.length === 0) return;
    onLocation({ type: "epub_cfi", cfi });
    const fraction = typeof detail.fraction === "number" ? detail.fraction : 0;
    onProgress({
      current: Math.round(fraction * 100),
      total: 100,
      unit: "percent",
    });
  };
  view.addEventListener("relocate", onRelocate);

  await view.open(bookFile);
  const startCfi = initial?.type === "epub_cfi" && initial.cfi.length > 0 ? initial.cfi : undefined;
  if (startCfi) {
    await view.init({ lastLocation: startCfi });
  } else {
    await view.init({ showTextStart: true });
  }

  return {
    async goTo(locator) {
      if (locator.type !== "epub_cfi" || locator.cfi.length === 0) return;
      await view.goTo(locator.cfi);
    },
    async next() {
      await view.next();
    },
    async prev() {
      await view.prev();
    },
    async seekPercent(percent) {
      await view.goToFraction(Math.min(100, Math.max(0, percent)) / 100);
    },
    destroy() {
      view.removeEventListener("relocate", onRelocate);
      view.close();
      view.remove();
    },
  };
}
