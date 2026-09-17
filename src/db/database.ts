import Dexie, { type Table } from "dexie";
import type { FileBlobRecord, LocationRecord, Rendition, Work } from "@/domain";

export type MetaRecord = {
  key: string;
  value: string;
};

export class ShelfDatabase extends Dexie {
  works!: Table<Work, string>;
  renditions!: Table<Rendition, string>;
  locations!: Table<LocationRecord, [string, string]>;
  fileBlobs!: Table<FileBlobRecord, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super("suvadi-shelf");
    this.version(1).stores({
      works: "id, sortTitle, updatedAt, createdAt",
      renditions: "id, workId, kind",
      locations: "[renditionId+userId], renditionId, updatedAt",
      fileBlobs: "id",
      meta: "key",
    });
  }
}

let instance: ShelfDatabase | undefined;

export function getDb(): ShelfDatabase {
  if (typeof indexedDB === "undefined") {
    throw new Error("This browser cannot store your library.");
  }
  if (!instance) {
    instance = new ShelfDatabase();
  }
  return instance;
}
