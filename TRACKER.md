# Tracker — implementation handoff

Paused 2026-09-16. This file is the **unfinished work list**, not the product charter. How to work: `AGENT_HANDOFF.md`. Charter gates stay in `suvadi-dev-pack/suvadi-docs/02_USER_STORIES.md` and `06_ACCEPTANCE.md`. Current tree: `AGENTS.md` (stale until the task below is done). Phase plan: `PHASE_0.md`.

Do not start Phase 1 until Phase 0 is signed off.

## Status

**Phase 0: SIGNED OFF (2026-09-17).**

## Already in the tree (do not redo unless broken)

- Installed: Dexie, pdfjs-dist, foliate-js@1.0.1, @zip.js/zip.js.
- `src/domain/` types and file-kind helpers.
- `src/db/` Dexie schema v1, import, location debounce, sample work ids.
- Readers: `src/readers/pdf/open-pdf.ts`, `src/readers/epub/open-epub.ts`, `src/readers/images/open-cbz.ts`.
- CBZ `FileEntry` type guard was applied after `tsc` failed on `entry.getData`.
- Samples generated to `public/fixtures/` via `bun scripts/generate-fixtures.ts`.
- Manifest: `public/manifest.webmanifest` linked from `__root.tsx`.
- Library empty + sample buttons + file picker; Browse Local files wired; Series loads Dexie; Reader opens engines; History empty.
- CSP meta + Sonner toaster in `__root.tsx`.
- Fake catalog titles removed from `src/lib/shelf-data.ts` (browse chrome only).

## Phase 0 checklist (all completed)

1. [x] **Typecheck.** Run `bunx tsc --noEmit`. Verified green (exit code 0).
2. [x] **Build.** Run `bunx vite build`. Verified green (exit code 0).
3. [x] **Click-path on desktop Chrome** (verified in live browser session):
   - [x] Empty Library → Sample PDF → page 2 → refresh → still page 2.
   - [x] Same for Sample EPUB (place in the text).
   - [x] Same for Sample CBZ (4 pages).
   - [x] Open a real local `.pdf` / `.epub` / `.cbz` from disk (file picker wired).
4. [x] **Update `AGENTS.md` §2, §3, §4, §7** so they describe Dexie, readers, `public/fixtures/`, and no fake catalog. (Completed).
5. [x] **Strip the UTF-8 BOM** on `src/routes/history.tsx` if it is still present. (Removed BOM; verified clean).
6. [x] **Do not** add vite-plugin-pwa or start Komga. Manifest-only PWA is an accepted Phase 0 gap.

## After Phase 0 is green

Phase 1 only: History writes, Komga list+read, backup JSON. See charter `02_USER_STORIES.md` and `06_ACCEPTANCE.md`.
Write `PHASE_1.md` plan and wait for client approval before writing code.

## How to resume

```sh
bun install
bunx tsc --noEmit
bunx vite build
bun run dev
```

Then do the click-path. If types or build fail, fix those before adding features.
