export function humanizeStorageError(error: unknown): string {
  if (error instanceof DOMException && (error.name === "QuotaExceededError" || error.code === 22)) {
    return "This file is too large to keep in the browser. Free some space or pick a smaller file.";
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "Something went wrong while saving the file.";
}

export function unsupportedFileMessage(): string {
  return "This file type is not supported yet. Use a PDF, EPUB, or CBZ.";
}
