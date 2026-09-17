import { BlobReader, BlobWriter, ZipReader, type FileEntry } from "@zip.js/zip.js";
import { naturalCompare, type Locator } from "@/domain";
import type { OpenReaderArgs, ReaderHandle } from "../types";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp)$/i;

function pageFromLocator(locator: Locator | undefined, max: number): number {
  if (locator?.type === "image_page") {
    return Math.min(Math.max(1, locator.page), max);
  }
  return 1;
}

export async function openCbz({
  file,
  container,
  initial,
  onLocation,
  onProgress,
}: OpenReaderArgs): Promise<ReaderHandle> {
  const zipReader = new ZipReader(new BlobReader(file));
  const entries = await zipReader.getEntries();
  const images = entries
    .filter((entry): entry is FileEntry => !entry.directory && IMAGE_EXT.test(entry.filename))
    .sort((a, b) => naturalCompare(a.filename, b.filename));

  if (images.length === 0) {
    await zipReader.close();
    throw new Error("This CBZ does not contain any images.");
  }

  let pageNum = pageFromLocator(initial, images.length);
  const urls: (string | undefined)[] = Array.from({ length: images.length });
  const img = document.createElement("img");
  img.alt = "";
  img.className = "max-h-[92vh] w-full max-w-3xl object-contain";
  container.replaceChildren(img);

  async function ensure(index: number): Promise<string> {
    const cached = urls[index];
    if (cached) return cached;
    const entry = images[index];
    if (!entry) {
      throw new Error("This page could not be read.");
    }
    const blob = await entry.getData(new BlobWriter());
    const url = URL.createObjectURL(blob);
    urls[index] = url;
    return url;
  }

  function evictFar(): void {
    for (let i = 0; i < urls.length; i += 1) {
      const url = urls[i];
      if (Math.abs(i + 1 - pageNum) > 1 && url) {
        URL.revokeObjectURL(url);
        urls[i] = undefined;
      }
    }
  }

  async function show(n: number): Promise<void> {
    const url = await ensure(n - 1);
    pageNum = n;
    img.src = url;
    onLocation({ type: "image_page", page: n });
    onProgress({ current: n, total: images.length, unit: "page" });
    const neighbor = n < images.length ? n : n > 1 ? n - 2 : n - 1;
    void ensure(neighbor).then(() => evictFar());
    evictFar();
  }

  await show(pageNum);

  return {
    async goTo(locator) {
      if (locator.type !== "image_page") return;
      await show(pageFromLocator(locator, images.length));
    },
    async next() {
      if (pageNum < images.length) await show(pageNum + 1);
    },
    async prev() {
      if (pageNum > 1) await show(pageNum - 1);
    },
    async seekPercent() {
      /* CBZ uses page locators, not percent. */
    },
    destroy() {
      for (const url of urls) {
        if (url) URL.revokeObjectURL(url);
      }
      void zipReader.close();
      img.remove();
    },
  };
}
