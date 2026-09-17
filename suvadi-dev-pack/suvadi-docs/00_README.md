# Suvadi — Development documentation pack

**Product name:** Suvadi (சுவடி)
**Former working title:** Shelf
**Pack date:** 2026-09-08
**Audience:** engineering, design, QA.

> Charter pack (destination). Current tree: `/AGENTS.md`. If this pack and the code disagree, the code wins for “what exists now.” This pack wins for product rules (no pirate catalogs, no hosting books, Mihon chrome without Mihon branding) unless AGENTS.md records a later decision.

## Files

| #   | Doc                           | Use                                   |
| --- | ----------------------------- | ------------------------------------- |
| —   | `/AGENTS.md`                  | What is actually in the repository    |
| 00  | This file                     | Index                                 |
| 01  | `01_PRODUCT_BRIEF.md`         | What we are building and why          |
| 02  | `02_USER_STORIES.md`          | Stories by phase, acceptance hints    |
| 03  | `03_DATA_MODEL.md`            | Entities, locators, permissions       |
| 04  | `04_SYNC_API.md`              | Invite-only server contract (Phase 3) |
| 05  | `05_ENGINEERING_KICKOFF.md`   | Intended week-1 outcome, module rules |
| 06  | `06_ACCEPTANCE.md`            | QA gates                              |
| 07  | `07_CORS_KOMGA.md`            | Copy-paste for testers                |
| —   | `../SHELF_UI_SPEC.md`         | Screen-level UI (Mihon chrome)        |
| —   | `../SHELF_DEVELOPER_SHEET.md` | Stack freeze and rejected options     |
| —   | `../SHELF_PRODUCT_PLAN.md`    | Earlier review freeze                 |

## Which file for which job

Open **one** file for the task. Do not read the whole pack every session.

| Job                            | Open this                                   | Do not use for                                    |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------- |
| What exists in the code today  | `/AGENTS.md`                                | This pack                                         |
| Unfinished work / resume       | `/TRACKER.md`                               | Charter stories                                   |
| Current phase plan             | `/PHASE_0.md`                               | Kickoff routing table                             |
| Clone, run, legal line         | `/README.md`                                | Kickoff                                           |
| What we are allowed to build   | `01_PRODUCT_BRIEF.md`                       | Kickoff routing table                             |
| What a screen should look like | `../SHELF_UI_SPEC.md`                       | Sync API                                          |
| Data shape                     | `03_DATA_MODEL.md`                          | User stories                                      |
| Stack / rejected libraries     | `../SHELF_DEVELOPER_SHEET.md`               | AGENTS.md for long-term intent                    |
| Is this story done?            | `02_USER_STORIES.md` and `06_ACCEPTANCE.md` | `/TRACKER.md` (that is resume, not charter gates) |
| Komga CORS for a tester        | `07_CORS_KOMGA.md`                          | Anything else                                     |
| Invites / friends server       | `04_SYNC_API.md` only in Phase 3            | Implementing it now                               |
| What URL to code               | `/AGENTS.md`                                | Kickoff `/library` and `/work/$id` table          |

**Brand:** Suvadi. Never Mihon, Tachiyomi, or the み glyph.
**Content rule:** user files and user-configured servers only. No source catalogs, no content proxy.
