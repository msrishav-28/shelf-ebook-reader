import type { RenditionKind } from "@/domain";
import { openEpub } from "./epub/open-epub";
import { openCbz } from "./images/open-cbz";
import { openPdf } from "./pdf/open-pdf";
import type { OpenReaderArgs, ReaderHandle } from "./types";

export type { OpenReaderArgs, ReaderHandle, ReaderProgress } from "./types";
export { defaultLocator } from "./types";

export async function openReader(kind: RenditionKind, args: OpenReaderArgs): Promise<ReaderHandle> {
  if (kind === "local_pdf") return openPdf(args);
  if (kind === "local_epub") return openEpub(args);
  if (kind === "local_cbz" || kind === "local_images") return openCbz(args);
  throw new Error("This format cannot be opened yet.");
}
