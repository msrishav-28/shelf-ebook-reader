import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BlobReader, BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "fixtures");

function pdfEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(labels: string[]): Uint8Array {
  const pageCount = labels.length;
  const kids = labels.map((_, i) => `${4 + i} 0 R`).join(" ");
  const contentStart = 4 + pageCount;
  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  for (let i = 0; i < pageCount; i += 1) {
    const contentNum = contentStart + i;
    objects[4 + i] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentNum} 0 R /Resources << /Font << /F1 3 0 R >> >> >>`;
  }
  for (let i = 0; i < pageCount; i += 1) {
    const label = labels[i] ?? "";
    const stream = `BT /F1 24 Tf 72 720 Td (${pdfEscape(label)}) Tj ET`;
    objects[contentStart + i] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  }

  let out = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let n = 1; n < objects.length; n += 1) {
    offsets[n] = out.length;
    out += `${n} 0 obj\n${objects[n]}\nendobj\n`;
  }
  const xrefPos = out.length;
  out += `xref\n0 ${objects.length}\n`;
  out += "0000000000 65535 f \n";
  for (let n = 1; n < objects.length; n += 1) {
    out += `${String(offsets[n]).padStart(10, "0")} 00000 n \n`;
  }
  out += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return new TextEncoder().encode(out);
}

function tinyPng(): Uint8Array {
  return Uint8Array.from([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0,
    0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 3, 1, 1,
    0, 24, 221, 141, 176, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
  ]);
}

async function writeEpub(path: string): Promise<void> {
  const writer = new ZipWriter(new BlobWriter("application/epub+zip"));
  await writer.add("mimetype", new TextReader("application/epub+zip"), {
    level: 0,
    extendedTimestamp: false,
  });
  await writer.add(
    "META-INF/container.xml",
    new TextReader(
      `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
    ),
  );
  await writer.add(
    "EPUB/content.opf",
    new TextReader(
      `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:suvadi-sample-epub</dc:identifier>
    <dc:title>Sample EPUB</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="c1" href="ch1.xhtml" media-type="application/xhtml+xml"/>
    <item id="c2" href="ch2.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="c1"/>
    <itemref idref="c2"/>
  </spine>
</package>`,
    ),
  );
  await writer.add(
    "EPUB/nav.xhtml",
    new TextReader(
      `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
  <head><title>Nav</title></head>
  <body>
    <nav epub:type="toc"><ol>
      <li><a href="ch1.xhtml">Chapter 1</a></li>
      <li><a href="ch2.xhtml">Chapter 2</a></li>
    </ol></nav>
  </body>
</html>`,
    ),
  );
  await writer.add(
    "EPUB/ch1.xhtml",
    new TextReader(
      `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter 1</title></head>
  <body>
    <h1>Chapter 1</h1>
    <p>This is a public-domain sample chapter for Shelf. Turn the page, refresh, and you should return here if you left mid-book.</p>
  </body>
</html>`,
    ),
  );
  await writer.add(
    "EPUB/ch2.xhtml",
    new TextReader(
      `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter 2</title></head>
  <body>
    <h1>Chapter 2</h1>
    <p>Second chapter. Use this to confirm EPUB place is remembered after refresh.</p>
  </body>
</html>`,
    ),
  );
  const blob = await writer.close();
  await Bun.write(path, new Uint8Array(await blob.arrayBuffer()));
}

async function writeCbz(path: string): Promise<void> {
  const writer = new ZipWriter(new BlobWriter("application/vnd.comicbook+zip"));
  for (let i = 1; i <= 4; i += 1) {
    const png = tinyPng();
    await writer.add(`page-${String(i).padStart(2, "0")}.png`, new BlobReader(new Blob([png])));
  }
  const blob = await writer.close();
  await Bun.write(path, new Uint8Array(await blob.arrayBuffer()));
}

await mkdir(outDir, { recursive: true });
await Bun.write(
  join(outDir, "sample.pdf"),
  buildPdf(["Sample PDF — page 1", "Sample PDF — page 2", "Sample PDF — page 3"]),
);
await writeEpub(join(outDir, "sample.epub"));
await writeCbz(join(outDir, "sample.cbz"));
console.log(`Wrote fixtures to ${outDir}`);
