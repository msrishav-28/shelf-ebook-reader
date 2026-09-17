# Suvadi — Product brief

> Charter. Current tree: `/AGENTS.md`.

## Summary

Suvadi is a **progressive web app** for a private library of comics, ebooks, and PDFs. The chrome copies **Mihon** (five tabs, cover grid, bottom sheets). The meaning of Browse is **local files and home servers**, not website sources. A **small invited circle** can annotate shared works with highlights, text, voice, and pictures, pinned to a **page** or a **line**.

We do not ship another Tachiyomi. We do not host other people’s books.

## Problem

Readers already use Mihon for manhwa and something else for PDFs and EPUBs. Progress and notes do not follow. Notes live in a separate app and cannot point at a sentence inside the book. Sharing a marked-up PDF with one classmate is email chaos.

## Solution

One installable site:

- Library of works the user owns or has on Komga / Kavita / OPDS / disk.
- One reader chrome; three engines (images, EPUB, PDF).
- Progress per rendition, continue row on Library.
- Annotations that survive refresh and, later, sync to invited profiles.
- Invite cap: **10 people** per hosted circle.

## Personas

**Owner (primary).** Tamil-speaking or bilingual. Reads comics and class/work PDFs. Wants Mihon muscle memory. Will run or ask someone to run a NAS box.

**Member.** Invited. Reads a shared EPUB/PDF. Leaves a voice note on a paragraph. Does not manage connectors.

**Viewer.** Can read shared marks, cannot add.

## Product principles

1. Files stay with the user. Suvadi-the-website is an empty backpack.
2. Chrome is familiar; sources are honest.
3. Solo notes ship before multi-user.
4. Small circle, not a network.
5. Mid-range Android Chrome is the performance budget.

## Scope by phase

| Phase | Ships                                                              | Does not ship              |
| ----- | ------------------------------------------------------------------ | -------------------------- |
| 0     | 5-tab shell, open local CBZ/EPUB/PDF, persist position             | Servers, accounts          |
| 1     | Library grid, History, More, filters, Komga list+read, JSON backup | Kavita required            |
| 1b    | Solo highlight + text note on EPUB line and PDF page               | Voice, friends             |
| 2     | Voice + image attachments, OPFS quota                              | Public upload              |
| 3     | Invites, profiles, sync annotations + progress                     | Chat, likes                |
| 4     | Kavita, OPDS, Upcoming, Move tab                                   | Native iOS, CBR-in-browser |

## Out of scope forever unless a new brief says so

Bundled manga websites, Anna’s Archive and similar indexes, proxying publication bytes through a Suvadi-operated CDN, anime, claiming to be Mihon, open sign-up.

## Success metrics (qualitative v1)

- Owner uses Suvadi as the default opener for Downloads + NAS comics.
- One member can open a shared EPUB and see a highlight on the same sentence.
- Tester adds Komga using only `07_CORS_KOMGA.md`.
- No feature in the UI that implies a pirate catalog.

## Localization

UI English first (match Mihon screenshots). Tamil strings for wordmark and a future language pack. Do not block Phase 0 on i18n infrastructure beyond a `t()` stub.

## Legal / trust copy (must appear in About and README)

> Suvadi is a reader for files and servers you configure. We do not host publications. You are responsible for the copies you add.
