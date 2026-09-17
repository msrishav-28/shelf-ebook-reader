# Suvadi — Acceptance and QA

> Charter. Current tree: `/AGENTS.md`.

## Devices

Must pass: desktop Chrome, Android Chrome (mid-range, last two major versions).  
Best effort: Firefox desktop (Komga + PDF).  
Degraded: iOS Safari (no persistent folder; Komga path only).

## Phase 0 gate (block merge of “Phase 1” until green)

- [ ] PWA installable on desktop Chrome
- [ ] Five tabs, blue pill, dark background ≈ `#121212`
- [ ] Wordmark Suvadi / சுவடி — not み
- [ ] PDF fixture opens; page 2 after refresh
- [ ] EPUB fixture opens; position after refresh
- [ ] CBZ fixture: 20 pages scrolled; tab still usable (no crash)
- [ ] Lighthouse: app installable (PWA) — treat as advisory if CI flake

## Phase 1 gate

- [ ] Two-column library with badge + title
- [ ] Filter sheet three tabs
- [ ] History row + delete + incognito
- [ ] Komga: list series on a tester instance after CORS snippet
- [ ] Chapter images load from Komga host (DevTools: destination is Komga, not Pages)
- [ ] Backup restore of 50 works < 2s on a laptop
- [ ] Default backup has no API keys

## Phase 1b gate

- [ ] EPUB highlight survives reload and jumps back to text
- [ ] PDF page note survives reload
- [ ] Delete annotation
- [ ] Incognito blocks silent annotation create

## Phase 2 gate

- [ ] Voice ≤30s plays
- [ ] Overlong audio rejected with a sentence
- [ ] Image resized
- [ ] Comic region pin visible on correct page

## Phase 3 gate

- [ ] Second browser profile accepts invite
- [ ] Shared work annotations appear
- [ ] Unshared work invisible to member
- [ ] Viewer cannot POST annotation
- [ ] Kick works
- [ ] Server has no route that accepts an EPUB/PDF upload

## Explicit fail conditions

- Any Browse tile for a named public manga aggregator
- Service worker caching whole chapters by default
- Secrets in console.log or backup
- Mixed-content blocked images with no CORS/HTTPS doc link
