# Instructions for the next agent

You are continuing a paid, production engagement. The client is not an engineer. Speak in outcomes. Do not start Phase 1 until Phase 0 is signed off.

Work **exactly** as this project has been working: one phase at a time, a written plan first, wait for a clear YES, implement the smallest complete slice, prove it, update the living docs, then stop.

## First session (do this before any new feature)

1. Read `TRACKER.md` (unfinished work).
2. Read `PHASE_0.md` (the Phase 0 contract).
3. Read `AGENTS.md` “Which file to open”, then only the files that job needs. §2 of `AGENTS.md` is **stale** until you update it.
4. Survey the tree with tools. Do not trust memory or this file if the code disagrees.
5. **Finish Phase 0.** Do not write a Phase 1 plan until the Phase 0 gates are green.

Phase 0 remaining work is listed in `TRACKER.md`. In short: typecheck, build, Chrome click-path, update `AGENTS.md` §2–§4 and §7, strip BOM on `src/routes/history.tsx` if present. Do not add vite-plugin-pwa. Do not start Komga.

When Phase 0 is actually proven, mark it signed off in `TRACKER.md` and make `AGENTS.md` match the tree.

## How every later phase must run

Repeat this loop. Do not skip steps.

1. **Survey.** Map the area you will touch and twins of the same pattern.
2. **Plan.** Write a phase plan (new `PHASE_N.md`, or replace the previous phase file and keep history in `TRACKER.md`). The plan must say, in plain language:
   - What a person will be able to do
   - What will look different
   - What will not change
   - Libraries you will add (only if the charter already froze them, or you have a yes)
   - Honest gaps (do not fake a green checkbox)
   - Click-path that proves done
3. **Wait.** Show the plan. Do not code until the client replies YES to that phase.
4. **Implement** only that slice. Complete vertical: no stubs, no dead buttons, no second way to do what already exists.
5. **Prove.** `bunx tsc --noEmit`, `bunx vite build`, and the click-path. Do not claim tests/builds passed unless you ran them in this session.
6. **Sync docs.** Update `AGENTS.md` in the same change. Update `TRACKER.md` (done / pending). Do not rewrite charter files in `suvadi-dev-pack/` unless the product itself changed.
7. **Stop.** Do not roll into the next phase in the same breath.

## Phase order (charter)

- **0** — Local PDF / EPUB / CBZ + remember place. (`PHASE_0.md`)
- **1** — Library persistence polish, History writes, More that actually filters, Komga list+read, JSON backup. No Kavita required.
- **1b** — Solo highlight + text note on EPUB line and PDF page.
- **2** — Voice + image notes, OPFS quota.
- **3** — Invites, profiles, sync. Read `04_SYNC_API.md` only then. Never accept publication uploads.
- **4** — Kavita, OPDS, Upcoming metadata, Move identity.

Kill gates: Phase 0 fails if a mid phone dies on a 60-page CBZ. Phase 3 is forbidden until solo notes work on one EPUB and one PDF.

## Hard rules

- Product: user’s files and user’s servers only. No pirate catalogs, no book proxy, no Mihon/Tachiyomi/み branding.
- URLs that exist: `/`, `/browse`, `/reader/$workId`, `/series/$workId`. Do not add kickoff paths `/library` or `/read/$renditionId` unless the client asks.
- Stack in this checkout: **Bun** + **TanStack Start** + Nitro. Charter freeze still says pnpm / static PWA; do not silently switch. Dexie is the store. No Next.js, Axios, JSZip.
- Module rules when those folders exist: `domain/` no React/Dexie; `db/` no React/readers; `readers/` no Dexie.
- No Lovable packages, `.lovable/`, or editor telemetry.
- No secrets in git. No copyrighted manga as fixtures. Samples stay public-domain in `public/fixtures/`.
- Speak to the client in outcomes, not diffs. If you must delete, change stored data, or add a major library not already frozen, stop and ask in plain language.

## What to say to the client when you start

You are picking up Shelf/Suvadi. Phase 0 is coded but not signed off. You will finish and prove Phase 0 first. Then you will write a Phase 1 plan and wait for YES before coding it.
