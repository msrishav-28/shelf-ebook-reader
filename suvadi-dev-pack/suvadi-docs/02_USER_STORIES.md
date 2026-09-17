# Suvadi — User stories

> Charter. Current tree: `/AGENTS.md`.

Format: `ID | Phase | Story | Notes`

Priority inside a phase is top-to-bottom.

## Phase 0 — Reader exists

| ID    | Story                                                                | Acceptance                                   |
| ----- | -------------------------------------------------------------------- | -------------------------------------------- |
| P0-01 | As a user I can install the PWA on Chrome desktop and Android Chrome | Manifest, standalone, icon, no み            |
| P0-02 | I see five tabs: Library, Updates, History, Browse, More             | Active tab = blue pill                       |
| P0-03 | I can open a local PDF and turn pages                                | pdf.js worker loads; one page + neighbors    |
| P0-04 | I can open a local EPUB and move through spine                       | foliate-js; font size later                  |
| P0-05 | I can open a local CBZ and step/webtoon-scroll images                | zip.js; no JSZip; heap stable after 20 pages |
| P0-06 | After refresh, I resume the same locator                             | Dexie `locations`                            |
| P0-07 | Reader hides the tab bar                                             | Matches Mihon                                |

## Phase 1 — Library

| ID    | Story                                      | Acceptance                                         |
| ----- | ------------------------------------------ | -------------------------------------------------- |
| P1-01 | Library shows a 2-column cover grid        | Unread badge, title scrim                          |
| P1-02 | Filter sheet: Filter / Sort / Display      | Checks from UI spec                                |
| P1-03 | History lists sessions by date             | Heart + delete event                               |
| P1-04 | Incognito stops History writes             | Toggle on More                                     |
| P1-05 | Downloaded-only filters library            | OPFS/local only                                    |
| P1-06 | I add a Komga connector with URL + API key | Stored in Dexie secrets, not in URL                |
| P1-07 | I browse Komga series and read a chapter   | Images fetched **from Komga origin**, not our host |
| P1-08 | I export/import `suvadi-backup.json`       | No secrets in default export                       |
| P1-09 | Updates empty state uses kaomoji + caption | Calendar icon may stub Upcoming                    |
| P1-10 | Browse Sources lists Local / Komga rows    | No third-party manga site tiles                    |

## Phase 1b — Solo annotations

| ID     | Story                                                  | Acceptance                          |
| ------ | ------------------------------------------------------ | ----------------------------------- |
| P1b-01 | I select a line in an EPUB and highlight it            | Locator = CFI + selectedText        |
| P1b-02 | I add a text note to that range                        | Sheet with author = me              |
| P1b-03 | I tap a PDF page and add a page-level note             | Locator = page number               |
| P1b-04 | I select PDF text (when extractable) and highlight     | Fallback: page pin if no text layer |
| P1b-05 | I see my marks after refresh                           | Dexie                               |
| P1b-06 | I delete my annotation                                 | Gone locally                        |
| P1b-07 | Incognito does not create annotations unless I confirm | Dialog                              |

## Phase 2 — Media notes

| ID    | Story                                                 | Acceptance                 |
| ----- | ----------------------------------------------------- | -------------------------- |
| P2-01 | I attach a ≤30s voice note to a locator               | Stored OPFS; play in sheet |
| P2-02 | I attach a photo; it is downscaled                    | Max edge ~1600px           |
| P2-03 | Quota warning when OPFS is low                        | Human sentence, not stack  |
| P2-04 | Comics: I draw a region on a page instead of a “line” | Rect locator               |

## Phase 3 — Circle

| ID    | Story                                                | Acceptance                                 |
| ----- | ---------------------------------------------------- | ------------------------------------------ |
| P3-01 | Owner generates an invite link                       | Expires; single-use or cap                 |
| P3-02 | Member creates profile (name, avatar, color)         | Color used on highlights                   |
| P3-03 | Owner shares a work with the circle                  | Other works stay private                   |
| P3-04 | Member sees others’ visible annotations on that work | Same locator                               |
| P3-05 | Member cannot see Owner’s unshared library           | Server enforces                            |
| P3-06 | Viewer role cannot create marks                      | API 403                                    |
| P3-07 | Progress syncs last-write-wins per rendition         | Toast if discarded                         |
| P3-08 | Owner can kick a member and revoke access            | Marks remain or tombstone — see data model |

## Phase 4

Kavita connector, OPDS browse, Upcoming calendar with dots when metadata exists, Move tab identity mapping. Stories written when Phase 1 is green.
