import {
  humanizeStorageError,
  kindFromFile,
  mimeForKind,
  sortTitleFromTitle,
  titleFromFileName,
  unsupportedFileMessage,
  type Rendition,
  type Work,
} from "@/domain";
import { getDb } from "./database";

export const SAMPLE_WORK_IDS = {
  "sample.pdf": "sample-pdf",
  "sample.epub": "sample-epub",
  "sample.cbz": "sample-cbz",
} as const;

export type SampleFileName = keyof typeof SAMPLE_WORK_IDS;

export async function importLocalFile(
  file: File,
  options: { workId?: string } = {},
): Promise<{ workId: string; renditionId: string }> {
  const kind = kindFromFile(file);
  if (!kind) {
    throw new Error(unsupportedFileMessage());
  }

  const db = getDb();
  const now = new Date().toISOString();
  const title = titleFromFileName(file.name);
  const workId = options.workId ?? crypto.randomUUID();
  const existing = await db.works.get(workId);

  try {
    if (existing) {
      const renditions = await db.renditions.where("workId").equals(workId).toArray();
      const current = renditions[0];
      if (current) {
        await db.fileBlobs.put({
          id: current.id,
          blob: file,
          fileName: file.name,
          mime: mimeForKind(kind, file.type),
        });
        await db.renditions.update(current.id, {
          kind,
          source: { fileName: file.name, mime: mimeForKind(kind, file.type) },
        });
        await db.works.update(workId, {
          title,
          sortTitle: sortTitleFromTitle(title),
          updatedAt: now,
        });
        return { workId, renditionId: current.id };
      }
    }

    const renditionId = crypto.randomUUID();
    const work: Work = {
      id: workId,
      title,
      sortTitle: sortTitleFromTitle(title),
      authors: [],
      tags: [],
      nsfw: false,
      createdAt: now,
      updatedAt: now,
    };
    const rendition: Rendition = {
      id: renditionId,
      workId,
      kind,
      source: { fileName: file.name, mime: mimeForKind(kind, file.type) },
      addedAt: now,
    };

    await db.transaction("rw", db.works, db.renditions, db.fileBlobs, async () => {
      await db.works.put(work);
      await db.renditions.put(rendition);
      await db.fileBlobs.put({
        id: renditionId,
        blob: file,
        fileName: file.name,
        mime: mimeForKind(kind, file.type),
      });
    });

    return { workId, renditionId };
  } catch (error) {
    throw new Error(humanizeStorageError(error));
  }
}

export async function importSampleFile(fileName: SampleFileName): Promise<{ workId: string }> {
  const response = await fetch(`/fixtures/${fileName}`);
  if (!response.ok) {
    throw new Error("The sample file could not be loaded.");
  }
  const blob = await response.blob();
  const mime = fileName.endsWith(".pdf")
    ? "application/pdf"
    : fileName.endsWith(".epub")
      ? "application/epub+zip"
      : "application/vnd.comicbook+zip";
  const file = new File([blob], fileName, { type: mime });
  return importLocalFile(file, { workId: SAMPLE_WORK_IDS[fileName] });
}
