# Shelf — Final product plan (for review)

**Date:** 2026-09-08
**Status:** Review freeze. This is the product we agreed to, not Mihon and not a shadow library.
**Companion docs:** `SHELF_DEVELOPER_SHEET.md` (stack), `SHELF_UI_SPEC.md` (screens).

> Charter. Current tree: `/AGENTS.md`.

---

## 1. One-line product

**Shelf** is a private reading app (PWA) that looks like Mihon, holds _your_ comics, ebooks, and PDFs in one library, and lets a **small invited circle** leave highlights, notes, voice notes, and pictures on a **page** or a **line**.

---

## 2. Why it exists

Mihon/Komikku are excellent **image-chapter** clients on Android. Real reading is messier: manhwa + EPUB + lecture PDF, phone + laptop, and notes that should stick to a sentence.

Existing tools split that:

| Tool                      | Strong at                           | Weak at                                             |
| ------------------------- | ----------------------------------- | --------------------------------------------------- |
| Mihon / Komikku           | Website-manga feel, reader gestures | Novels/PDFs as first-class; multi-device by default |
| Kavita / Komga            | Your files on a NAS, mixed formats  | Not Mihon chrome; weak “line + voice note + friend” |
| Moon+ / KOReader          | Local books                         | Not one shelf with Komga + comics + circle          |
| Hypothesis / Kindle share | Web annotation                      | Not your CBZ library or Mihon UI                    |

Shelf is the **shelf + Mihon muscle memory + private annotations**.

---

## 3. Who it is for

- You, daily.
- A **few** other people you invite (family, class, two collaborators). Target: ≤ 10 profiles.
- People who already have files or a Komga/Kavita/OPDS server.

**Not for:** “install 400 sources,” public sign-up, Anna’s Archive / Libgen / Z-Lib, anime, iOS App Store v1.

---

## 4. What the user does (story)

1. Install the site as an app (Add to Home Screen).
2. See Mihon-like tabs: Library, Updates, History, Browse, More.
3. Browse is **Local / Komga / Kavita / OPDS**, not manga websites.
4. Open a CBZ, EPUB, or PDF in one reader chrome.
5. Progress is remembered (chapter/page/%).
6. Hold a line or mark a page → highlight, text note, voice note, or photo.
7. Invite someone with a link. They get a profile (name, avatar, color). On **shared works**, they see your marks and add their own.
8. History and incognito stay **per profile**.

Files never have to sit on a company cloud. Annotations for the circle sit on **your** small server.

---

## 5. Non-goals (wall)

- No official Mihon/Tachiyomi name, み logo, or update checker.
- No bundled scanlation / shadow-library catalog.
- No proxying book bytes through a public Shelf host.
- No forking Komikku/Mihon as the web app (wrong platform).
- No iOS native app in v1.
- No anime.
- No open registration, likes, public feeds, or AI recommendations in v1.
- RAR/CBR in the browser in v1 (use Komga or convert).

---

## 6. Product surface

### 6.1 Chrome (from your screenshots)

Five tabs, dark theme, blue selected pill:

1. **Library** — 2-column covers, unread badge, filter sheet (Filter / Sort / Display).
2. **Updates** — new chapters from connected servers; empty kaomoji state; calendar → Upcoming.
3. **History** — dated rows, chapter + time, heart, delete; paused in Incognito.
4. **Browse** — three sub-tabs: **Sources | Connectors | Move**.
5. **More** — Downloaded only, Incognito, queue, categories, stats, storage, settings, about, help.

Reader hides the tab bar.

### 6.2 Browse remapped

Same row UI as Mihon Sources; different rows:

- Local files / folder
- Komga
- Kavita
- OPDS

**Connectors** = add/edit those backends (not APK extensions).  
**Move** = “this EPUB is the same work as that Komga series” (identity), empty in v1 if too heavy.

### 6.3 Formats

- Comics: CBZ, image folders; CBR via server later.
- Books: EPUB.
- Documents: PDF.
- One **Work** can have several **Renditions** (PDF + EPUB + Komga series).

### 6.4 Circle + annotations

**Profiles:** display name, avatar, highlight color.  
**Roles:** Owner / Member / Viewer.  
**Share per work,** not the whole library.

**Annotation kinds:** highlight, text note, voice note, picture.  
**Pins:** page **or** line (EPUB CFI / PDF text range). Comics: page or drawn region, not fake “line” without OCR.

**Visibility:** private to author, or visible to the work’s circle.  
Owner can delete any mark. Author can delete own.

Caps: short voice (~30s), images resized. Export notes as Markdown + files.

---

## 7. Architecture (review version)

```
[PWA: Shelf]
  Mihon-like UI
  Image reader | EPUB reader | PDF reader
  Dexie: library, progress, local annotations
  OPFS: cached chapters, voice, photos
        │
        │ HTTPS, no book proxy through us
        ▼
  User NAS: Komga / Kavita / OPDS / folders
        │
        ▼
  Optional shelf-sync (you host)
        accounts, invites, annotation JSON, media blobs
```

**Legal posture:** reader for files and servers the user configures. We host no content catalog.

---

## 8. Frozen stack (2026–27)

| Layer                 | Choice                                   |
| --------------------- | ---------------------------------------- |
| App                   | Vite + React 19 + TypeScript + pnpm      |
| Routes / server state | TanStack Router + Query                  |
| UI state              | Zustand                                  |
| Style                 | Tailwind v4, dark-first                  |
| PWA                   | vite-plugin-pwa (shell only, not books)  |
| DB                    | Dexie                                    |
| PDF                   | pdfjs-dist                               |
| EPUB                  | foliate-js (Readium later if needed)     |
| CBZ                   | @zip.js/zip.js                           |
| First server          | Komga (`X-API-Key` + user CORS)          |
| Second                | Kavita                                   |
| Circle server         | Small Docker + SQLite, invite tokens     |
| Host PWA              | Cloudflare Pages / GitHub Pages (static) |

Not Next.js. Not a Komikku fork. Not JSZip.

---

## 9. Build order

**Phase 0** — Empty 5-tab shell + open local PDF / EPUB / CBZ + remember position.  
**Phase 1** — Library grid, History, More, filter sheets, Komga connector, backup JSON.  
**Phase 1b** — Solo annotations (highlight + text) on EPUB line and PDF page.  
**Phase 2** — Voice + photo attachments; OPFS; quotas.  
**Phase 3** — Invites, profiles, sync annotations on _your_ box; share-per-work.  
**Phase 4** — Kavita, OPDS, Upcoming if metadata exists, Move tab.

Kill gates:

- Phase 0 fails if a mid phone dies on a 60-page CBZ.
- Phase 3 is forbidden until solo notes work on one EPUB and one PDF.

---

## 10. Success (you would ship this)

- You use one icon for comics + class PDF.
- A second person can open a shared EPUB and see a highlight on the same sentence.
- No source list that looks like AllManga.
- Backup of library + notes without handing out API keys by default.

---

## 11. Decision log

| Decision     | Call                                          |
| ------------ | --------------------------------------------- |
| Platform     | Web PWA, not Android fork                     |
| Look         | Mihon screens, not Mihon brand                |
| Content      | User files + user servers only                |
| Social       | Invite-only circle, not a network             |
| Notes        | Page or line; text, voice, photo              |
| Sync         | User-hosted; files stay on NAS/device         |
| Time vs feel | Steal UI; do not rebuild Tachiyomi extensions |

---

## 12. Review checklist

Confirm or strike:

- [ ] Name stays working title **Shelf** until trademark check
- [ ] Five tabs stay; Browse rows are connectors only
- [ ] Circle size cap (~10)
- [ ] Voice/photos allowed
- [ ] No public hosting of books
- [ ] Phase 1b (solo notes) before any multi-user work

If those boxes stay ticked, the next artifact is the **Annotation + Circle data model** only — not another strategy reset.
