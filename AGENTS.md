# AGENTS.md — living map of this repository

This file is the source of truth for **what is in the repo right now**.

Charter docs in `suvadi-dev-pack/` describe the **intended product**. They are not a dump of the current tree. If a charter file and this file disagree about the code, **this file wins**. If they disagree about product rules (no pirate catalogs, no hosting other people’s books, Mihon chrome without Mihon branding), **the charter wins** until a dated note is added here.

When you change routes, stack, persistence, readers, or product behavior, update this file in the same change.

Do not reintroduce Lovable, `@lovable.dev/*`, `.lovable/`, or editor telemetry.

## Which file to open

Start every session here. Then open **one** charter file. Pack index: `suvadi-dev-pack/suvadi-docs/00_README.md`.

| Job                            | Open                                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| What exists in the code today  | this file                                                               |
| Unfinished work / resume       | `TRACKER.md`                                                            |
| How to work phase by phase     | `AGENT_HANDOFF.md`                                                      |
| Current phase plan             | `PHASE_0.md`                                                            |
| Clone / run / legal line       | `README.md`                                                             |
| What we are allowed to build   | `suvadi-dev-pack/suvadi-docs/01_PRODUCT_BRIEF.md`                       |
| What a screen should look like | `suvadi-dev-pack/SHELF_UI_SPEC.md`                                      |
| Data shape                     | `suvadi-dev-pack/suvadi-docs/03_DATA_MODEL.md`                          |
| Stack / rejected libraries     | `suvadi-dev-pack/SHELF_DEVELOPER_SHEET.md`                              |
| Is this story done?            | `suvadi-dev-pack/suvadi-docs/02_USER_STORIES.md` and `06_ACCEPTANCE.md` |
| Komga CORS for a tester        | `suvadi-dev-pack/suvadi-docs/07_CORS_KOMGA.md`                          |
| Invites / friends server       | `suvadi-dev-pack/suvadi-docs/04_SYNC_API.md` (Phase 3 only)             |
| What URL to code               | this file, §5                                                           |

Do not treat kickoff paths (`/library`, `/work/$workId`, `/read/$renditionId`) as the current tree.

---

## 1. What this product is

Working UI name: **Shelf**.
Charter product name: **Suvadi** (சுவடி). Former working title in older sheets: Shelf.

Shelf/Suvadi is a private reader for **the user’s own** comics, ebooks, and PDFs. The chrome copies Mihon’s five-tab muscle memory (Library, Updates, History, Browse, More). Browse means **local files and user-configured servers** (Komga, Kavita, OPDS later) — not manga websites.

The site does not host publications. Book bytes must never transit a Suvadi-operated origin. There is no source catalog, no open sign-up, no Mihon/Tachiyomi name or み glyph.

Legal line (must stay in About and README):

> Suvadi is a reader for files and servers you configure. We do not host publications. You are responsible for the copies you add.

The UI currently still says **Shelf**. Do not silently rename the wordmark. A rename is a product decision.

---

## 2. What the code actually does today (Phase 0 chrome, not Phase 0 readers)

This is a **clickable Mihon-like shell** with **in-memory fixture data**. It is not yet a working library or reader.

A person using the running app can:

- Open five main tabs on phone (bottom nav) and desktop (left rail).
- See a cover grid on Library, filter/sort/display in a bottom sheet, search titles.
- Open a series page and a fake paged reader (placeholder art, tap zones, slider).
- See History rows (heart and delete are local React state; they reset on refresh).
- See Updates empty state and an Upcoming calendar (hard-coded August 2026 demo dots).
- See Browse Sources / Connectors / Move lists (not wired to real servers).
- Toggle Downloaded-only and Incognito on More (state does **not** affect Library or History).
- Open Settings group labels (rows do nothing).

A person **cannot** yet:

- Open a real CBZ, EPUB, or PDF.
- Persist progress, history, settings, or connectors.
- Talk to Komga / Kavita / OPDS.
- Install as a PWA.
- Annotate text or pages.
- Sign in or invite anyone.

There is **no database**, **no auth**, **no tests**, **no CI**, **no fixtures/** folder.

Seed titles in `src/lib/shelf-data.ts` are **fictional placeholders** for layout. They are not licensed publications and must not be shipped as if they were a catalog.

---

## 3. Stack that is actually installed

| Concern         | In this repo                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Language        | TypeScript, `strict` in `tsconfig.json`                                                                    |
| Package manager | **Bun** (`bun.lock`, `bunfig.toml`). Charter freeze says pnpm — do not switch without a decision-log line. |
| App framework   | **TanStack Start** (`@tanstack/react-start` 1.168.x) + **TanStack Router** 1.170.x                         |
| Server cache    | TanStack Query (provider in `__root.tsx`; no queries yet)                                                  |
| UI              | React 19                                                                                                   |
| Style           | Tailwind CSS v4 (`src/styles.css`), dark-first tokens from `SHELF_UI_SPEC.md`                              |
| Components      | shadcn/ui “new-york” copies under `src/components/ui/`                                                     |
| Icons           | lucide-react                                                                                               |
| Bundler         | Vite 8                                                                                                     |
| Deploy adapter  | Nitro 3 (vite plugin in `vite.config.ts`)                                                                  |
| Lint / format   | ESLint 9 + Prettier                                                                                        |
| Path alias      | `@/*` → `./src/*`                                                                                          |

**Not installed**, despite the developer sheet freeze: pnpm, Zustand, Dexie, vite-plugin-pwa, pdfjs-dist, foliate-js, @zip.js/zip.js, Vitest, Playwright, Temporal.

**Do not add Next.js, SvelteKit, Axios, JSZip, or a content proxy.** Those are rejected in the charter.

`package.json` name is `shelf`. Scripts: `dev` (`vite dev`), `build`, `build:dev`, `preview`, `lint`, `format`.

---

## 4. Repository layout

```
shelf-ebook-reader-main/
  AGENTS.md                 ← this file (living)
  README.md                 ← human start + legal line
  package.json
  bun.lock
  bunfig.toml
  vite.config.ts
  tsconfig.json
  eslint.config.js
  components.json           ← shadcn config; CSS at src/styles.css
  public/                   ← favicon.ico, robots.txt only. No books.
  src/
    router.tsx              ← getRouter(); QueryClient in router context
    start.ts                ← CSRF middleware for server functions + SSR error page
    server.ts               ← optional server entry; turns swallowed h3 500 JSON into HTML
    routeTree.gen.ts        ← generated; never edit
    styles.css              ← Tailwind + design tokens
    lib/
      shelf-data.ts         ← in-memory fixtures
      utils.ts              ← cn()
      error-capture.ts      ← last-error capture for SSR
      error-page.ts         ← HTML 500 page
    components/shelf/       ← product chrome
    components/ui/          ← shadcn primitives (most unused)
    hooks/use-mobile.tsx    ← unused by product screens
    routes/                 ← file routes
  suvadi-dev-pack/          ← product charter (not the live tree)
```

There is no `src/domain/`, `src/db/`, `src/connectors/`, `src/readers/`, `src/pwa/`, `fixtures/`, `apps/web/`, or `.env.example`.

---

## 5. Routes (file-based, TanStack Router)

Only files in `src/routes/*.tsx` are routes. Do not create `src/pages/`, `app/`, or `src/routes/_app/`.

The only document shell is `src/routes/__root.tsx`. Keep `<Outlet />`, `<HeadContent />`, and `<Scripts />`.

| File                 | URL               | What it is                                            |
| -------------------- | ----------------- | ----------------------------------------------------- |
| `__root.tsx`         | (shell)           | HTML document, QueryClient, 404, error UI             |
| `index.tsx`          | `/`               | Library grid                                          |
| `updates.tsx`        | `/updates`        | Updates (empty fixture)                               |
| `history.tsx`        | `/history`        | History list                                          |
| `browse.tsx`         | `/browse`         | Sources / Connectors / Move **tabs**, not nested URLs |
| `more.tsx`           | `/more`           | More                                                  |
| `settings.tsx`       | `/settings`       | Settings labels                                       |
| `upcoming.tsx`       | `/upcoming`       | Calendar                                              |
| `series.$workId.tsx` | `/series/$workId` | Series                                                |
| `reader.$workId.tsx` | `/reader/$workId` | Reader chrome; **hides** the five-tab shell           |

Unknown `$workId` values throw `notFound()`.

**Kickoff doc routes that do not exist and must not be assumed:**

- `/library` — Library is `/`
- `/browse/connectors`, `/browse/move` — those are tabs on `/browse`
- `/work/$workId` — actual path is `/series/$workId`
- `/read/$renditionId` — actual path is `/reader/$workId` (work id, not rendition id)

Do not “fix” this by adding duplicate URLs unless product asks. If you add a route, add the screen, nav (if needed), types, and a line in this table.

`src/routeTree.gen.ts` is generated on `bun run dev` / `bun run build`. Do not edit it. It is in `.prettierignore`.

---

## 6. UI architecture

Product chrome lives in `src/components/shelf/`:

- `AppShell.tsx` — five-tab nav (frozen order: Library, Updates, History, Browse, More). Desktop: left rail. Phone: bottom bar + safe area. Also `AppBar`, `Screen`, `IconButton`, `EmptyState`.
- `pieces.tsx` — `Cover`, `CoverCard`, `ListRow`, `SectionLabel`, `DayHeader`. Covers are token gradients + initials, not images.
- `LibraryFilterSheet.tsx` — Filter / Sort / Display bottom sheet.

Reader does **not** wrap `AppShell`.

Tokens are CSS variables in `src/styles.css` (`--background` ≈ `#121212`, `--primary` blue pill, `--badge` unread). Do not hardcode hex in components. Dark first. System UI font. No custom display face except a future wordmark.

**shadcn actually used by product screens:** `sheet`, `tabs`, `switch`.
Everything else under `src/components/ui/` is unused kit. Do not delete it in drive-by cleanup. Do not build new product UI out of random kit components when `components/shelf` already has the pattern.

---

## 7. Data and state

`src/lib/shelf-data.ts` exports:

- `library: Work[]`
- `history: HistoryEvent[]`
- `updates: UpdateRow[]` (empty)
- `sources`, `connectors`, `moveSources`
- `chaptersFor(work)`

There is no Dexie, no IndexedDB, no OPFS, no secrets table. History heart/delete and More toggles are `useState` only.

When persistence is added: follow `suvadi-dev-pack/suvadi-docs/03_DATA_MODEL.md`. Do not invent a second model. API keys go in a secrets store, never in the URL after paste, never in default backup, never in logs.

---

## 8. Server files (keep; not editor leftovers)

TanStack Start SSR is real in this repo even though the product is meant to stay a static PWA later.

- `src/start.ts` — `createStart` with error middleware (HTML 500) and **CSRF middleware for server functions**. If you delete `src/start.ts`, CSRF is no longer automatic; you must put it back.
- `src/server.ts` — wraps `@tanstack/react-start/server-entry`. If h3 swallows a throw into `{"unhandled":true,"message":"HTTPError"}`, it logs the captured error and returns `renderErrorPage()`.
- `src/lib/error-capture.ts` — records the last error (including via `console.error`) so `server.ts` can recover a stack. Do not remove it while `server.ts` depends on it.
- `src/lib/error-page.ts` — static HTML for catastrophic SSR failure.

There are **no server functions and no server routes** yet. Do not add an upload endpoint for EPUB/PDF/CBZ. Do not proxy publication bytes.

Client env, when needed: `VITE_APP_NAME`, `VITE_SYNC_URL` (empty until Phase 3). No Komga secrets in env.

---

## 9. Vite config

`vite.config.ts` uses the public plugins (not a private editor wrapper):

1. `vite-tsconfig-paths` (the `@/` alias)
2. `@tailwindcss/vite`
3. `tanstackStart()` from `@tanstack/react-start/plugin/vite`
4. `nitro()` from `nitro/vite`
5. `viteReact()` — **must stay after** `tanstackStart()`

Default Vite port (typically 5173). Komga CORS notes assume `http://localhost:5173`.

---

## 10. Charter docs (read these; do not treat them as the file tree)

Canonical pack: `suvadi-dev-pack/`.

| File                                                    | Role                                     |
| ------------------------------------------------------- | ---------------------------------------- |
| `suvadi-dev-pack/suvadi-docs/00_README.md`              | Pack index                               |
| `suvadi-dev-pack/suvadi-docs/01_PRODUCT_BRIEF.md`       | Why it exists, phases, out of scope      |
| `suvadi-dev-pack/suvadi-docs/02_USER_STORIES.md`        | Stories by phase                         |
| `suvadi-dev-pack/suvadi-docs/03_DATA_MODEL.md`          | Entities and locators                    |
| `suvadi-dev-pack/suvadi-docs/04_SYNC_API.md`            | Phase 3 only — do not implement now      |
| `suvadi-dev-pack/suvadi-docs/05_ENGINEERING_KICKOFF.md` | Intended week-1 outcome and module rules |
| `suvadi-dev-pack/suvadi-docs/06_ACCEPTANCE.md`          | QA gates                                 |
| `suvadi-dev-pack/suvadi-docs/07_CORS_KOMGA.md`          | Tester CORS snippet                      |
| `suvadi-dev-pack/SHELF_UI_SPEC.md`                      | Screen-level UI                          |
| `suvadi-dev-pack/SHELF_DEVELOPER_SHEET.md`              | Stack freeze + rejected options          |
| `suvadi-dev-pack/SHELF_PRODUCT_PLAN.md`                 | Review freeze                            |

Root `01_PRODUCT_BRIEF.md` and `05_ENGINEERING_KICKOFF.md` are **pointers** to the pack. Do not fork a third copy.

`src/routes/README.md` describes **this** app’s routes, not a generic starter.

---

## 11. Intended build order (from charter) vs now

| Phase | Charter                                                | Now                                         |
| ----- | ------------------------------------------------------ | ------------------------------------------- |
| 0     | Five-tab PWA + real PDF/EPUB/CBZ + Dexie location      | Five-tab UI + fake reader + memory fixtures |
| 1     | Library persistence, History, More, Komga, backup JSON | Layout only                                 |
| 1b    | Solo highlight + text note                             | Not started                                 |
| 2     | Voice/image notes, OPFS                                | Not started                                 |
| 3     | Invites, sync box                                      | Contract only (`04_SYNC_API.md`)            |
| 4     | Kavita, OPDS, Upcoming metadata, Move identity         | Upcoming calendar chrome only               |

Next honest slice, when asked: real local file open + persist locator. Do not start Komga, auth, or circle sync before that. Do not add a pirate source tile. Do not cache whole books in a service worker.

Module rule from kickoff, when those folders exist:

- `domain/` — no React, Dexie, Vite, connectors
- `db/` — no React, no readers
- `connectors/` — no React; no Dexie (pass repos in)
- `readers/` — no Dexie, no connectors; `open` / `goTo` / `onLocation` / `destroy`

---

## 12. Hard rules for anyone editing this repo

1. Survey the tree (or re-read this file and the files you will touch) before editing.
2. Do not add Lovable packages, `.lovable/`, `window.__lovable*`, or editor error bridges.
3. Do not rewrite git history.
4. Do not commit secrets, `.env` with real values, or copyrighted manga/fixtures.
5. Fixtures, when added, must be public-domain or clearly licensed, under `fixtures/`.
6. No `any` without a one-line reason and a removal condition.
7. Errors shown to humans are sentences, not stacks.
8. Hiding a button is not authorization. There is no auth yet; do not fake it.
9. Do not catch-and-ignore. Do not return fake success IDs.
10. Match existing shelf chrome; do not restyle from scratch.
11. Unused shadcn files are not a license to invent a second design system.
12. After a material change, update **this file** so the next agent is not lying.

---

## 13. How to run

Need Bun, then:

```sh
bun install
bun run dev
```

Lint: `bun run lint`. Format: `bun run format`. Build: `bun run build`.

There is no test script.

Click-path: open the dev URL → Library covers → a cover → Resume → tap center to toggle reader chrome → back → History / Browse / More.

---

## 14. Decision log (repo-local)

| Date       | Decision                                                                                                                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-25 | Charter: web PWA, React+Vite+TS, Komga first, no shadow-library connectors (see developer sheet)                                                                                                                  |
| 2026-09-08 | Charter pack renamed product to Suvadi; UI still Shelf                                                                                                                                                            |
| 2026-09-12 | Removed Lovable editor coupling. Vite uses public TanStack Start + Nitro + Tailwind plugins. This file is the living code map. Package name `shelf`. Package manager remains Bun until a freeze change is logged. |
