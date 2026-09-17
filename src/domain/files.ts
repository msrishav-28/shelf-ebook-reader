import type { RenditionKind } from "./types";

export function kindFromFile(file: { name: string; type: string }): RenditionKind | null {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.endsWith(".pdf") || type === "application/pdf") return "local_pdf";
  if (name.endsWith(".epub") || type === "application/epub+zip") return "local_epub";
  if (
    name.endsWith(".cbz") ||
    type === "application/vnd.comicbook+zip" ||
    type === "application/x-cbz"
  ) {
    return "local_cbz";
  }
  return null;
}

export function mimeForKind(kind: RenditionKind, fallback: string): string {
  if (kind === "local_pdf") return fallback || "application/pdf";
  if (kind === "local_epub") return fallback || "application/epub+zip";
  if (kind === "local_cbz") return fallback || "application/vnd.comicbook+zip";
  return fallback || "application/octet-stream";
}

export function titleFromFileName(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").replace(/\.[^.]+$/, "");
  const trimmed = base.trim();
  return trimmed.length > 0 ? trimmed : "Untitled";
}

export function sortTitleFromTitle(title: string): string {
  return title.toLowerCase();
}

export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function formatKindLabel(kind: RenditionKind): string {
  if (kind === "local_pdf") return "PDF";
  if (kind === "local_epub") return "EPUB";
  if (kind === "local_cbz") return "CBZ";
  return "Images";
}
