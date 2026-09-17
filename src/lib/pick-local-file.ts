type FilePickerHandle = { getFile: () => Promise<File> };

export async function pickLocalPublication(): Promise<File | null> {
  const picker = (
    window as Window & {
      showOpenFilePicker?: (options?: {
        multiple?: boolean;
        types?: Array<{ description: string; accept: Record<string, string[]> }>;
      }) => Promise<FilePickerHandle[]>;
    }
  ).showOpenFilePicker;

  if (typeof picker === "function") {
    try {
      const handles = await picker({
        multiple: false,
        types: [
          {
            description: "Books and comics",
            accept: {
              "application/pdf": [".pdf"],
              "application/epub+zip": [".epub"],
              "application/vnd.comicbook+zip": [".cbz"],
            },
          },
        ],
      });
      const handle = handles[0];
      if (!handle) return null;
      return await handle.getFile();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return null;
    }
  }

  return pickWithInput();
}

function pickWithInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.epub,.cbz,application/pdf,application/epub+zip";
    input.addEventListener("change", () => {
      resolve(input.files?.[0] ?? null);
    });
    input.addEventListener("cancel", () => resolve(null));
    input.click();
  });
}
