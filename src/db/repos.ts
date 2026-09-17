import {
  LOCAL_USER_ID,
  type LocationRecord,
  type Locator,
  type Rendition,
  type Work,
} from "@/domain";
import { getDb } from "./database";

const DEVICE_KEY = "deviceId";

export async function getDeviceId(): Promise<string> {
  const db = getDb();
  const existing = await db.meta.get(DEVICE_KEY);
  if (existing) return existing.value;
  const value = crypto.randomUUID();
  await db.meta.put({ key: DEVICE_KEY, value });
  return value;
}

export async function listWorks(): Promise<Work[]> {
  return getDb().works.orderBy("sortTitle").toArray();
}

export async function getWork(id: string): Promise<Work | undefined> {
  return getDb().works.get(id);
}

export async function getRenditionsForWork(workId: string): Promise<Rendition[]> {
  return getDb().renditions.where("workId").equals(workId).toArray();
}

export async function getPrimaryRendition(workId: string): Promise<Rendition | undefined> {
  const rows = await getRenditionsForWork(workId);
  return rows[0];
}

export async function getFileBlob(renditionId: string): Promise<Blob | undefined> {
  const row = await getDb().fileBlobs.get(renditionId);
  return row?.blob;
}

export async function getLocation(renditionId: string): Promise<LocationRecord | undefined> {
  return getDb().locations.get([renditionId, LOCAL_USER_ID]);
}

export async function saveLocation(renditionId: string, locator: Locator): Promise<void> {
  const deviceId = await getDeviceId();
  const record: LocationRecord = {
    renditionId,
    userId: LOCAL_USER_ID,
    locator,
    updatedAt: new Date().toISOString(),
    deviceId,
  };
  await getDb().locations.put(record);
}

const pending = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleLocationSave(renditionId: string, locator: Locator): void {
  const previous = pending.get(renditionId);
  if (previous !== undefined) clearTimeout(previous);
  const timer = setTimeout(() => {
    pending.delete(renditionId);
    void saveLocation(renditionId, locator);
  }, 500);
  pending.set(renditionId, timer);
}

export type LibraryItem = {
  work: Work;
  rendition: Rendition | undefined;
  location: LocationRecord | undefined;
};

export async function listLibraryItems(): Promise<LibraryItem[]> {
  const works = await listWorks();
  const items: LibraryItem[] = [];
  for (const work of works) {
    const rendition = await getPrimaryRendition(work.id);
    const location = rendition ? await getLocation(rendition.id) : undefined;
    items.push({ work, rendition, location });
  }
  return items;
}
