import type { Locator } from "@/domain";
import type { OpenReaderArgs, ReaderHandle } from "../types";

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

function pageFromLocator(locator: Locator | undefined, max: number): number {
  if (locator?.type === "pdf_page") {
    return Math.min(Math.max(1, locator.page), max);
  }
  return 1;
}

export async function openPdf({
  file,
  container,
  initial,
  onLocation,
  onProgress,
}: OpenReaderArgs): Promise<ReaderHandle> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  let pageNum = pageFromLocator(initial, pdf.numPages);
  let cancelled = false;
  let rendering = false;
  let queued: number | undefined;

  const canvas = document.createElement("canvas");
  canvas.className = "max-h-[92vh] w-full max-w-3xl bg-white";
  container.replaceChildren(canvas);

  async function render(n: number): Promise<void> {
    if (cancelled) return;
    if (rendering) {
      queued = n;
      return;
    }
    rendering = true;
    try {
      const page = await pdf.getPage(n);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const width = Math.max(container.clientWidth, 320);
      const scale = width / base.width;
      const viewport = page.getViewport({ scale: Math.min(scale, 2.5) });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const task = page.render({ canvas, viewport });
      await task.promise;
      if (cancelled) return;
      pageNum = n;
      onLocation({ type: "pdf_page", page: n });
      onProgress({ current: n, total: pdf.numPages, unit: "page" });
    } finally {
      rendering = false;
      if (queued !== undefined && queued !== pageNum) {
        const next = queued;
        queued = undefined;
        await render(next);
      }
    }
  }

  await render(pageNum);

  return {
    async goTo(locator) {
      if (locator.type !== "pdf_page") return;
      await render(pageFromLocator(locator, pdf.numPages));
    },
    async next() {
      if (pageNum < pdf.numPages) await render(pageNum + 1);
    },
    async prev() {
      if (pageNum > 1) await render(pageNum - 1);
    },
    async seekPercent() {
      /* PDF uses page locators, not percent. */
    },
    destroy() {
      cancelled = true;
      void pdf.destroy();
      canvas.remove();
    },
  };
}
