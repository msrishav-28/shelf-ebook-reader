# Suvadi — Engineering kickoff

> Charter. Current tree: `/AGENTS.md`.

## Week 1 outcome

A running PWA on `localhost` that:

- Shows five tabs styled per `SHELF_UI_SPEC.md`
- Opens fixture PDF, EPUB, and CBZ from `fixtures/`
- Writes a location to Dexie and restores it on refresh

If that fails, stop and fix. Do not start Komga or auth.

## Repos

Recommended monorepo later. Start with one:

```
suvadi/
  apps/web/          # Vite PWA
  packages/domain/   # optional from day 1 if two people; else src/domain
  fixtures/
  docs/              # this pack, copied in
```

Package name: `@suvadi/web`. App display name: Suvadi.

## Frozen stack

See `SHELF_DEVELOPER_SHEET.md`. Do not reopen.

- pnpm, Vite, React 19, TypeScript strict
- TanStack Router + Query
- Zustand
- Tailwind v4
- Dexie
- vite-plugin-pwa
- pdfjs-dist, foliate-js, @zip.js/zip.js
- native fetch

Day-1 router freeze: **TanStack Router**.

## Module rules

| Folder          | May import       | Must not import                |
| --------------- | ---------------- | ------------------------------ |
| `domain/`       | nothing from app | React, Dexie, Vite, connectors |
| `db/`           | domain           | React, readers                 |
| `connectors/`   | domain           | React, Dexie (pass repos in)   |
| `readers/`      | domain           | Dexie, connectors              |
| `routes/` `ui/` | all              | —                              |

Readers expose: `open(file | url), goTo(locator), onLocation(cb), destroy()`.

## Routing map

| Path                 | Screen              |
| -------------------- | ------------------- |
| `/library`           | Library             |
| `/updates`           | Updates             |
| `/history`           | History             |
| `/browse`            | Sources tab default |
| `/browse/connectors` | Connectors          |
| `/browse/move`       | Move                |
| `/more`              | More                |
| `/work/$workId`      | Series              |
| `/read/$renditionId` | Reader (no tab bar) |
| `/upcoming`          | Calendar            |

## Environment

Client may only have:

```
VITE_APP_NAME=Suvadi
VITE_SYNC_URL=          # empty until Phase 3
```

No Komga secrets in env. User pastes in UI.

## CI

GitHub Actions: `pnpm lint && pnpm test && pnpm build`.  
Playwright job from Phase 1: open fixture PDF, go to page 2.

## Fixtures

Commit **public-domain / clearly licensed** samples only:

- `fixtures/sample.pdf`
- `fixtures/sample.epub`
- `fixtures/sample.cbz` (few small pages)

Do not commit copyrighted manga.

## Definition of done (any ticket)

- Types for new fields live in `domain`
- No `any` without comment
- Error string is human-readable
- Does not fetch publication bytes through a Suvadi origin
- UI matches spec tokens or files a spec amendment

## Who decides

Product/scope: owner brief.  
Stack change: written line in developer sheet Decision log.  
“Is this a scraper?” — veto. If the connector only exists to hit a known pirate index, reject the PR.
