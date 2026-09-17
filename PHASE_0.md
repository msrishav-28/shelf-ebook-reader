# Phase 0 — open local files and remember place

Paused 2026-09-16. Implementation was started and is **not signed off**. Resume from `TRACKER.md`. Do not start Phase 1 until the gates below are green.

This is the first coding slice. We stop when a person can open a PDF, an EPUB, and a CBZ, turn pages, refresh the tab, and land on the same place. We do not start Komga, accounts, notes, or a rewrite of the five-tab chrome.

## What people will notice when this slice is done

- Library starts empty (no fake titles).
- Browse → Local files lets them pick `.pdf`, `.epub`, or `.cbz` from disk.
- Three sample files ship in the repo so we can test without hunting books.
- Opening a file adds it to Library, then opens the real reader (not the placeholder page number).
- Refresh restores the last page / EPUB place.
- Reader still hides the five tabs.
- Komga / Kavita / OPDS rows stay on screen but say this phase does not connect servers yet. They will not pretend to work.

## What will not change

- Product rules: no pirate sources, no hosting other people’s books, no Mihon branding.
- Existing URLs (`/`, `/browse`, `/reader/$workId`). We will not add the kickoff paths `/library` or `/read/$renditionId`.
- Package manager stays Bun. App stays TanStack Start. We will not convert to a static-only Vite SPA in this slice.
- No Zustand unless a later slice needs it. Dexie is the store.

## Libraries (charter freeze)

- Dexie: library, renditions, and last place live in the browser.
- pdfjs-dist: PDF, one page plus neighbours. Worker via Vite `?url` import, client-only.
- foliate-js: EPUB (`foliate-view`). Pin npm 1.0.1. Needs a strict CSP so book scripts cannot run (`script-src 'self'`; `blob:` only for images, styles, frames).
- @zip.js/zip.js: CBZ page images; also what foliate uses for zips.

Do not add react-pdf, JSZip, Axios, or vite-plugin-pwa in this slice.

## PWA (honest gap)

Charter wants an installable PWA. vite-plugin-pwa does not generate a service worker in TanStack Start production builds (upstream, still open). This phase ships a web app manifest and icons only. Chrome Install may still require a service worker. Do not fake a green checkbox. Do not cache books in any worker.

## How the code is shaped

- `src/domain/` — Work, Rendition, Location, Locator types and pure helpers. No React, no Dexie.
- `src/db/` — Dexie schema v1 plus small repos. No React, no readers.
- `src/readers/pdf`, `src/readers/epub`, `src/readers/images` — `open` / `goTo` / `onLocation` / `destroy`. No Dexie.

Dexie tables: works, renditions, locations, fileBlobs. IDs are UUID v4. Locators: `pdf_page`, `epub_cfi`, `image_page`. Location writes debounce 500ms. Dexie and PDF.js run in the browser only.

## User path

1. Browse → Local files → native file picker.
2. Detect kind; store work + rendition + blob; go to `/reader/$workId`.
3. Reader picks the engine from rendition kind, restores locator.
4. Library reads Dexie.
5. Series Resume opens the same rendition.
6. Sample files from `/fixtures/sample.pdf`, `sample.epub`, `sample.cbz` (generated into `public/fixtures/`).

## Done when

A person on desktop Chrome:

1. Opens empty Library.
2. Opens the sample PDF, goes to page 2, refreshes, is still on page 2.
3. Same for sample EPUB (place in the text, not only start).
4. Same for sample CBZ (short 4-page archive; heap must stay flat).
5. Picks a real local file of each kind and it opens.
6. `bunx tsc --noEmit` and `bunx vite build` succeed.
7. `AGENTS.md` §2 and §3 match the new tree.

Do not mark Phase 0 done if any engine is a stub, if refresh loses place, or if Komga is started.

## After this, not now

Phase 1 (real History writes, Komga, backup JSON) starts only when the gates above are green.
