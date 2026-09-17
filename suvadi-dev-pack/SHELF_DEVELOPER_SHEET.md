# Shelf — Developer sheet (frozen for 2026–27)

**Status:** charter for implementation. Decisions below are defaults. Changing a freeze requires a one-line note in the Decision log, not a new debate in chat.
**Code in this sheet:** none, except tiny identifiers (package names, header names, env keys).
**Product:** PWA client for _the user’s_ files and _the user’s_ servers. Not a content host. Not a source catalog.

> Charter. Current tree: `/AGENTS.md`.

---

## 0. How to use this sheet

1. Read §1–§3 before touching a terminal.
2. Scaffold with §6 only.
3. Build in the order of §10. If a library fight starts, look at §4 “Rejected.”
4. Do not add a backend until Phase 2.

Placeholder name in repo: `shelf`. Change package name before a public URL.

---

## 1. What we are building (engineer version)

A **single-page PWA** that:

- Installs on Android Chrome / desktop Chromium as an app.
- Opens **CBZ/image folders**, **EPUB**, **PDF**.
- Keeps a **library + progress** in the browser.
- Talks **directly from the browser** to Komga, later Kavita, and OPDS.
- Optionally talks to a **tiny user-hosted sync box** (progress JSON only).

Hard rules:

- Bytes of books/comics never transit _our_ servers.
- No shadow-library connectors.
- No bundled manga-site extension repo.

---

## 2. Target runtimes (support matrix)

Treat this as the contract.

| Surface               | Phase 0–1                         | Phase 2+               |
| --------------------- | --------------------------------- | ---------------------- |
| Desktop Chrome / Edge | **Required**                      | Required               |
| Android Chrome        | **Required**                      | Required               |
| Desktop Firefox       | Best-effort                       | OPDS/Komga must work   |
| Safari / iOS          | Degraded: no durable local folder | Komga/Kavita/OPDS only |
| Desktop Safari        | Degraded File System Access       | Same                   |

**Must be HTTPS** (or `localhost`). File System Access, service workers, and crypto APIs require a secure context.

**Do not promise:** iOS offline library, Firefox “pick a disk folder and remember it,” Internet Explorer, embedded WebViews without a plan.

PWA features we actually use:

- Web App Manifest + install.
- Service worker for **app shell only** in Phase 1 (not the books).
- Later: Cache Storage / OPFS for _explicit_ “save this chapter.”

We do **not** precache user publications in the service worker. Workbox would eat quota and go stale.

---

## 3. Frozen stack (do not reopen)

### 3.1 App shell

| Concern                | Freeze                                                                 | Why (2026–27)                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language               | **TypeScript** (strict)                                                | AI + humans both fail less                                                                                                                               |
| Package manager        | **pnpm**                                                               | Lockfile + disk; fine in 2026                                                                                                                            |
| Node                   | **Current LTS** at scaffold time; pin in `.nvmrc`                      | Don’t chase odd-numbered Node                                                                                                                            |
| Bundler                | **Vite**                                                               | Default for SPAs; HMR; PWA plugin                                                                                                                        |
| UI library             | **React 19**                                                           | Largest AI/docs/hiring pool. This is a client app, not a marketing site.                                                                                 |
| React compiler         | Enable if Vite template supports it; not a blocker                     | Nice, not sacred                                                                                                                                         |
| Routing                | **TanStack Router**                                                    | Type-safe routes for `library`, `work/$id`, `read/$renditionId`. React Router 7 is acceptable fallback if the team already knows it — pick one on day 1. |
| Server cache / fetches | **TanStack Query**                                                     | Komga lists, retries, stale-while-revalidate                                                                                                             |
| Client/UI state        | **Zustand**                                                            | Shelves, reader chrome, PIN session. Keep tiny.                                                                                                          |
| Styling                | **Tailwind CSS v4**                                                    | Fast UI without a design-system project                                                                                                                  |
| Components             | **Base-ui or plain HTML + Tailwind**                                   | Avoid a 200-component kit on day 1. Add shadcn-style copies only when a control is repeated 3 times.                                                     |
| Icons                  | **Lucide**                                                             | Enough                                                                                                                                                   |
| Dates                  | **Temporal** if the runtime is there; else native `Date` + ISO strings | Store ISO-8601 in DB                                                                                                                                     |
| Linting                | **ESLint** + typescript-eslint + **Prettier**                          | One format                                                                                                                                               |
| Tests                  | **Vitest** + Testing Library + **Playwright** (Phase 1+)               | Unit the model; e2e open a fixture CBZ                                                                                                                   |

**Not Next.js / SvelteKit / Nuxt.** Those pull a server into a product that must stay a static client. SEO is irrelevant. Hosting must be a folder of HTML/JS.

### 3.2 PWA

| Concern          | Freeze                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Plugin           | **vite-plugin-pwa** (`vite-pwa/vite-plugin-pwa`) — current in 2026, Workbox underneath              |
| Strategy Phase 1 | Precache shell. Network-first for our own static assets. **No** runtime cache of Komga image URLs.  |
| Updates          | Prompt on new version (`registerType` prompt, not silent wipe mid-chapter)                          |
| Manifest         | `standalone`, theme color, maskable icon. Generate icons from one SVG via the plugin’s asset helper |

### 3.3 Persistence in the browser

| Store           | Freeze                                        | Holds                                                    |
| --------------- | --------------------------------------------- | -------------------------------------------------------- |
| Structured data | **Dexie** (IndexedDB wrapper)                 | Works, renditions, locations, shelves, connector configs |
| File handles    | IndexedDB via Dexie                           | `FileSystemFileHandle` / directory handles (Chrome)      |
| Cached bytes    | **OPFS** (`navigator.storage.getDirectory()`) | Optional downloaded chapters, Phase 2                    |
| Session only    | memory / Zustand                              | PIN unlocked flag                                        |

Do **not** use `localStorage` for the library. Quota and sync are worse. Tokens: Dexie table `secrets`, never logged, never put in the URL after first paste.

### 3.4 Readers (the product)

| Format              | Freeze                                                                                                                 | Notes                                                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PDF                 | **pdfjs-dist** (Mozilla PDF.js, npm package; v6.x line as of mid-2026)                                                 | Worker must be bundled correctly in Vite. Render **one page** at a time + neighbors. Do not iframe the stock viewer unmodified (Mozilla asks you to reskin).                          |
| EPUB                | **foliate-js** (`johnfactotum/foliate-js`) for Phase 0–1                                                               | Modular, no giant framework, same family as the Foliate desktop app. **epub.js** is easier in tutorials but maintenance is weak; treat as fallback only.                              |
| EPUB later          | Re-evaluate **Readium Web TS toolkit** / Thorium Web if we need production a11y, FXL, Readium Web Publication Manifest | Readium’s typical deploy wants a **Go streamer** next to the UI. That is a Phase 3 architecture change, not Phase 0.                                                                  |
| CBZ / ZIP of images | **@zip.js/zip.js**                                                                                                     | Streaming, Zip64, large archives. Do **not** use JSZip (loads too much). **fflate** is faster on tiny files; CBZs are large already-compressed images — zip.js streaming wins on RAM. |
| Loose images        | Native `File` / directory handle, sort by filename with a **natural sort**                                             | Same viewer as CBZ                                                                                                                                                                    |
| CBR / RAR           | **Out of Phase 0–2**                                                                                                   | Needs a WASM RAR decoder and is a support swamp. Tell users to convert or use Komga (server unpacks).                                                                                 |

**Image viewer rules (write these on the reader module):**

- Virtualize. Never keep 80 decoded bitmaps.
- Webtoon = vertical strip, decode ahead N pages, evict behind.
- Paged = one/two page, preload ±1.
- Respect `orientation` and a user RTL toggle.
- Cap in-flight decodes. Mid-range Android is the performance budget, not a desktop GPU.

### 3.5 Network / connectors

| Connector         | Freeze                                                                                   | Auth                                                            |
| ----------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Local files       | File picker + File System Access API                                                     | User gesture                                                    |
| Komga **first**   | Official REST (`/api/...`). Docs: komga.org OpenAPI + `/swagger-ui.html` on any instance | Prefer **`X-API-Key`**. Cookies/`KOMGA-SESSION` fight CORS.     |
| Kavita **second** | Official REST + `x-api-key`. OpenAPI from their repo                                     | Auth key, not scraping the PWA                                  |
| OPDS 1.2          | Fetch Atom XML, parse, acquire acquisition links                                         | URL + optional HTTP Basic / key-in-path as the server specifies |
| OPDS-PS           | Phase 2 if we want page images without full download                                     | —                                                               |
| Suwayomi          | Phase 3 only, user-hosted, same “connector” pattern                                      | —                                                               |

HTTP client: **native `fetch`**. Add a 40-line wrapper for timeouts and 401. Do not add Axios.

CORS: **user configures the media server.** We ship a snippet (Komga: `komga.cors.allowed-origins`). We do **not** run an open proxy on shelf.example.

### 3.6 Optional sync server (Phase 2 only)

| Concern        | Freeze                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Shape          | One Docker image, one user or a short token list, SQLite                                                                                 |
| Language       | **Go** or **Hono on Node** — pick Go if we want a single static binary; pick Hono if the team only knows JS. Freeze at start of Phase 2. |
| Protocol       | Our JSON: works, renditions, locations, shelves. Last-write-wins per `renditionId` + `deviceId`                                          |
| Auth           | Bearer token generated on first run                                                                                                      |
| What it stores | Metadata and progress. **No** publication files                                                                                          |

Do not start with Postgres, Redis, or Keycloak.

### 3.7 Hosting the PWA

| Concern     | Freeze                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Prod static | **Cloudflare Pages** or GitHub Pages (project pages). Cloudflare Pages if we later want Functions — still don’t proxy books. |
| Preview     | Same                                                                                                                         |
| Domain      | HTTPS required                                                                                                               |
| Analytics   | None in v1, or a privacy-respecting self-hosted count. No ad pixels.                                                         |

### 3.8 Tooling around the repo

| Concern   | Freeze                                                       |
| --------- | ------------------------------------------------------------ |
| Git hooks | **simple-git-hooks** or leftover husky — optional            |
| CI        | GitHub Actions: `pnpm lint`, `pnpm test`, `pnpm build`       |
| Release   | GitHub Releases of nothing (it’s static). Tag + Pages deploy |
| Env files | `VITE_APP_NAME`, nothing secret in the client bundle         |

---

## 4. Rejected options (so we don’t relitigate)

| Idea                               | Why not                                            |
| ---------------------------------- | -------------------------------------------------- |
| Next.js / SvelteKit SSR            | Wrong product shape; secrets and proxy temptations |
| Capacitor / Tauri / Electron in v1 | We chose web. Native wrap is a later skin          |
| Fork Komikku                       | Abandoned for this product                         |
| JSZip                              | Memory                                             |
| epub.js as long-term core          | Community itself points at foliate-js / Readium    |
| Embedding Thorium Web wholesale    | We would be forking a whole reader product         |
| Dexie + Redux                      | Redundant                                          |
| GraphQL layer on Komga             | They have REST                                     |
| Our cloud library                  | Legal + cost                                       |
| Service-worker cache of all images | Quota death                                        |
| RAR in JS in v1                    | Delay                                              |
| Mongo for sync                     | SQLite is the whole database                       |

---

## 5. Domain model (implement this, not “an array of books”)

IDs: `ulid` or `crypto.randomUUID()`. Freeze **UUID v4** for simplicity.

**Work**  
`id`, `title`, `sortTitle`, `authors[]`, `year?`, `coverBlobId?`, `tags[]`, `nsfw`, `createdAt`, `updatedAt`

**Rendition**  
`id`, `workId`, `kind` = `local_cbz` | `local_epub` | `local_pdf` | `local_images` | `komga_series` | `kavita_series` | `opds_entry`  
`source` (opaque JSON: handle id, komga series id, href, …)  
`addedAt`

**Location**  
`renditionId`, `locator` (JSON: `{ type: "page", n }` \| `{ type: "chapterPage", chapter, page }` \| `{ type: "epubcfi", cfi }` \| `{ type: "percent", p }`), `updatedAt`, `deviceId`

**Shelf**  
`id`, `name`, `hidden`, `workIds[]`

**Connector**  
`id`, `type`, `baseUrl`, `label`, `secretRef`

**Secret**  
`id`, `value` (API key)

Backup file: `shelf-backup.json` versioned `{ v: 1, exportedAt, works, renditions, locations, shelves }` — **no secrets** in the default export. Optional “include connectors” checkbox.

Conflict: last `updatedAt` wins per rendition. Show a toast if we discarded a value.

---

## 6. Repository layout (create this on day 1)

```
shelf/
  package.json
  pnpm-lock.yaml
  tsconfig.json
  vite.config.ts
  index.html
  public/          # favicon, robots, no books
  src/
    main.tsx
    app/           # router, providers
    routes/        # library, work, reader, settings
    domain/        # types + pure functions (sort, merge location)
    db/            # Dexie schema + repos
    connectors/
      local/
      komga/
      opds/        # phase 1.5
      kavita/      # phase 2
    readers/
      images/      # CBZ + folder
      epub/
      pdf/
    pwa/           # register SW hooks
    ui/            # dumb components
    styles/
  fixtures/        # tiny public-domain CBZ, EPUB, PDF for tests
  docs/
    CORS.md
    SHEET.md       # this file, living copy
```

Readers must not import Dexie. Connectors must not import React. Domain must not import Vite.

---

## 7. Komga integration notes (so the first CORS week is short)

- Base URL: user-pasted, no trailing-slash drama — normalize once.
- Auth header: `X-API-Key: <key>` (Komga API keys created per user).
- Also exists: Basic auth; avoid it on the web (credentials + CORS preflight pain).
- CORS: on the **Komga** host, `KOMGA_CORS_ALLOWEDORIGINS` / `komga.cors.allowed-origins` must include the exact Shelf origin (`https://shelf.example` and `http://localhost:5173` for dev).
- Komga behind a proxy needs `X-Forwarded-*` (their docs recommend Caddy).
- HTTPS on Komga if the PWA is HTTPS (mixed content will block images).
- Do not use the demo server as a production backend.

Kavita later: `x-api-key`, OpenAPI JSON from upstream, OPDS URL is a _fallback_ path if REST mapping is too slow — REST is richer.

---

## 8. Browser file access notes

- `showOpenFilePicker` / `showDirectoryPicker`: Chrome, Edge, Android Chrome (version-dependent).
- Persist handles in IndexedDB; on next visit call `queryPermission` / `requestPermission`.
- Safari: fall back to `<input type="file" accept=".cbz,.epub,.pdf" multiple>`. Handles will not survive refresh the same way.
- OPFS is **our** sandbox, good for downloads we create, not a replacement for “open my Downloads folder.”

---

## 9. Security / privacy checklist

- CSP: default-src self; pdf/epub workers; connect-src self + user-approved hosts (dynamic CSP is hard — start with a documented connect-src that users who self-host can loosen).
- No `eval`. PDF.js worker via Vite `new URL(..., import.meta.url)`.
- API keys only in Dexie, not query strings after setup.
- Hidden shelf: PIN in session; this is **not** cryptography against a forensic attacker. Don’t market it as encryption.
- Take-down / scope: connectors are generic. No parser for a named pirate index.
- Dependencies: `pnpm audit` in CI; pin majors.

---

## 10. Build order (scratch → finish)

### Phase 0 — “three buttons” (about 1–2 weeks of real work)

Exit: refresh the tab, position still there, mid-phone opens a 60-page CBZ without crashing.

1. Vite + React 19 + TS + Tailwind + TanStack Router.
2. Dexie schema v1.
3. Local file open for PDF (pdf.js).
4. Local file open for EPUB (foliate-js).
5. Local file open for CBZ (zip.js + image viewer).
6. Save `Location` on page change (debounce 500ms).
7. PWA manifest + installable on Chrome.
8. Fixture files in repo (public domain only).

### Phase 1 — “a shelf”

9. Library grid from Dexie.
10. Work ↔ multiple renditions (same title, PDF + EPUB).
11. Continue row.
12. Hidden shelf + PIN.
13. Backup / restore JSON.
14. Komga connector: list series, open a chapter image stream, write progress if their API allows.
15. `docs/CORS.md` with a copy-paste Komga snippet.
16. Playwright: open fixture PDF and assert page 2.

### Phase 1.5

17. OPDS browse + acquire-to-local (download into OPFS or “save file”).

### Phase 2 — “two devices”

18. Kavita connector or second Komga account.
19. Sync container (progress only).
20. Explicit offline pack of one work, quota warning.
21. Natural-sort + webtoon mode polish.

### Phase 3 — only if Phase 1 is daily-driver

22. Readium path or better FXL EPUB.
23. PDF highlights export.
24. Suwayomi as optional connector.
25. Share Target (“open this PDF with Shelf”).

---

## 11. Quality bar

- Lighthouse PWA installable on Chrome desktop.
- No unbounded memory in the image reader (heap should flatten after 20 pages).
- Backup restore of 200 works < 2s on a laptop.
- Komga chapter turn does not re-download the whole book.
- Every connector timeout surfaces a human sentence, not a raw stack.

---

## 12. What “future era” actually means here

Do **not** bet the repo on:

- Browser-native EPUB (doesn’t exist as a standard viewer).
- AI-generated reader engines.
- WebGPU page decode.
- Isolated Web Apps / Managed PWAs as a requirement.

Do stay aligned with:

- **Readium Web Publication Manifest** as a _possible_ interchange later.
- **OPFS + File System Access** as the local-file story.
- **User-hosted first** (the industry after 2024 takedowns).
- **PDF.js and zip.js** as long-lived infrastructure (both still releasing in 2026).
- Static PWA + official REST of Komga/Kavita rather than scraping their HTML.

When Readium Web comics/PDF land as first-class, revisit §3.4 in a dated Decision log entry. Until then, three engines behind one shelf is correct.

---

## 13. Day-1 commands (conceptual)

- `pnpm create vite@latest shelf --template react-ts`
- Add tailwind, tanstack router/query, zustand, dexie, vite-plugin-pwa, pdfjs-dist, @zip.js/zip.js, foliate-js (or git submodule if npm is awkward).
- Set `strict` TypeScript.
- Commit the empty Dexie schema before any UI polish.

Exact versions: resolve at scaffold day and pin. Do not copy year-old minor versions from blog posts.

---

## 14. Decision log

| Date       | Decision                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-25 | Web PWA, not Komikku fork                                                                                                                                                                        |
| 2026-08-25 | React 19 + Vite + TS, not Next                                                                                                                                                                   |
| 2026-08-25 | Komga first server, Kavita second                                                                                                                                                                |
| 2026-08-25 | pdf.js + foliate-js + zip.js                                                                                                                                                                     |
| 2026-08-25 | Dexie + OPFS; no content proxy                                                                                                                                                                   |
| 2026-08-25 | No shadow-library connectors                                                                                                                                                                     |
| 2026-09-12 | This checkout uses Bun + TanStack Start + Nitro (see `/AGENTS.md`). Freeze above is still the intended long-term shape; do not treat pnpm/static-SPA lines as a description of the current tree. |

---

## 15. Official references to keep open

- Komga API / CORS: https://komga.org/docs/openapi/komga-api and configuration `cors.allowed-origins`
- Kavita API / OPDS: wiki.kavitareader.com (`guides/api`, `guides/features/opds`)
- PDF.js getting started: https://mozilla.github.io/pdf.js/getting_started/
- zip.js: https://gildas-lormeau.github.io/zip.js/
- Readium Web (later): https://readium.org/web/
- File System Access / OPFS: MDN
- vite-plugin-pwa: https://github.com/vite-pwa/vite-plugin-pwa

When docs and this sheet disagree on a header name, **the running server’s Swagger wins**, then we patch the sheet.
