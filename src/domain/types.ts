export const LOCAL_USER_ID = "local";

export type RenditionKind = "local_pdf" | "local_epub" | "local_cbz" | "local_images";

export type Work = {
  id: string;
  title: string;
  sortTitle: string;
  authors: string[];
  tags: string[];
  nsfw: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Rendition = {
  id: string;
  workId: string;
  kind: RenditionKind;
  source: {
    fileName: string;
    mime: string;
  };
  addedAt: string;
};

export type PdfPageLocator = { type: "pdf_page"; page: number };
export type EpubCfiLocator = { type: "epub_cfi"; cfi: string };
export type ImagePageLocator = { type: "image_page"; page: number };

export type Locator = PdfPageLocator | EpubCfiLocator | ImagePageLocator;

export type LocationRecord = {
  renditionId: string;
  userId: string;
  locator: Locator;
  updatedAt: string;
  deviceId: string;
};

export type FileBlobRecord = {
  id: string;
  blob: Blob;
  fileName: string;
  mime: string;
};
