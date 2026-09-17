# Shelf — UI spec (Mihon chrome, our meaning)

Taken from the user’s Mihon screenshots (2026-08-25).
**Copy layout, type, sheets, empty states. Do not copy the み mark, the name Mihon, or a catalog of website sources.**

> Charter. Current tree: `/AGENTS.md`.

---

## Visual tokens (dark theme, v1)

Match the screens, not Material “close enough.”

| Token                                        | Value (approx from shots)                          |
| -------------------------------------------- | -------------------------------------------------- |
| App background                               | `#121212` – `#161616`                              |
| Surface / rows                               | same as background; hairline `#2A2A2A`             |
| Primary text                                 | `#EEEEEE` – `#F5F5F5`                              |
| Secondary text                               | `#9A9A9A`                                          |
| Accent / selected tab pill                   | `#1A73E8` – `#3D7EFF` (blue capsule on active nav) |
| Unread badge                                 | light blue pill `#8AB4F8` on cover top-left        |
| Tab underline                                | accent, ~2px                                       |
| Kaomoji empty                                | `#9A9A9A`                                          |
| Danger / orphaned (we reuse for errors only) | muted red `#C97B7B`                                |
| Bottom nav height                            | ~56–64px + safe area                               |
| Title on screen                              | ~22–24px, left, not bold-heavy                     |
| Cover grid                                   | 2 columns phone; gap ~8–10px; radius ~4px          |
| Cover ratio                                  | ~2:3                                               |
| Icon buttons in app bar                      | 24px, grey                                         |

Light theme: invert later. Ship dark first — that is what they use.

Typography: one sans (system UI on the PWA). No custom display font except our own wordmark (not み).

---

## App shell (every main screen)

```
[ status bar — browser/PWA ]
[ title ................. actions ]
[ optional secondary tabs ]
[ scroll body ]
[ Library | Updates | History | Browse | More ]
```

**Bottom nav — freeze 5 items, same order as the screenshots:**

| Index | Label   | Icon idea     | Active                  |
| ----- | ------- | ------------- | ----------------------- |
| 1     | Library | stacked books | blue pill + filled icon |
| 2     | Updates | burst / alert | same                    |
| 3     | History | clock-arrow   | same                    |
| 4     | Browse  | compass       | same                    |
| 5     | More    | ⋯             | same                    |

Inactive = outline grey. Active = **blue rounded rectangle behind the icon**, label in accent/white.

Do not collapse to 4 tabs. Their muscle memory is five.

Reader screens **hide** this bar.

---

## 1. Library

From shots: two covers, unread counts 543 / 153, title overlay at bottom of cover, app bar: search, filter, overflow.

**App bar:** title `Library` · search · filter (sliders) · overflow `⋮`

**Body:** 2-column cover grid.  
On cover:

- Top-left: unread / remaining badge (number).
- Bottom: title, one line, white, slight scrim.

Tap cover → series screen (not in shots; use standard Mihon series: big cover, Read, chapter list).

Long-press → select mode (later).

**Filter sheet** (bottom sheet, three tabs like the shot):

- Tabs: `Filter` | `Sort` | `Display`
- Filter checks: Downloaded, Unread, Started, Bookmarked, Completed  
  Shelf meaning: Downloaded = on-device/OPFS; others map to our Work flags.
- Sort (define): Alphabetical, Last read, Date added, Unread count.
- Display: compact vs comfortable grid; 2 / 3 columns.

Sheet: dark raised card, top corners ~24px, handle implied by tabs.

---

## 2. Updates

App bar: `Updates` · filter · calendar · refresh.

Body default empty (copy the spirit, not the exact kaomoji if we want our own):

- Centered grey face `（；¬＿¬）` or `（・Д・。）`
- Caption: `No recent updates`

When not empty: date headers + rows (cover, title, “Ch. N”, relative time). Same row language as History.

**Filter sheet:** Downloaded, Unread, Started, Bookmarked.  
Toggle row: `Filter excluded scanlators` → **rename** `Hide ignored groups` or drop in v1 (we have no scanlators). Prefer drop.

**Calendar action** opens **Upcoming** (see §7).

Refresh: pull or icon; hits Komga/Kavita “new chapters” if connected; local-only libraries stay empty — that is OK.

---

## 3. History

App bar: `History` · search · delete-all (trash).

Body: date headers `15/06/2026` then rows:

```
[cover 48–56px]  Title
                 Ch. 12 - 9:51 am          [♡] [trash]
```

Tap row → open that rendition at saved locator.  
♡ = bookmark work. Trash = remove history event only.

Incognito (More) = this list does not grow.

---

## 4. Browse — same chrome, new rows

Keep **three sub-tabs** and the list-row pattern (icon · name · subtitle · trailing actions).

### Tab labels (frozen)

| Mihon      | Shelf          |
| ---------- | -------------- |
| Sources    | **Sources**    |
| Extensions | **Connectors** |
| Migrate    | **Move**       |

“Extensions” as a word trains people to install APKs. Call the tab **Connectors**.

### Sources tab

Sections:

1. **Last used**
2. Groups by type (not “English / Other”): **Local**, **Servers**, **Feeds**

Rows v1:

| Icon   | Title        | Subtitle       | Trailing     |
| ------ | ------------ | -------------- | ------------ |
| folder | Local files  | On this device | Latest · pin |
| folder | Local folder | (name)         | Latest · pin |
| server | Komga        | (host label)   | Latest · pin |
| server | Kavita       | (host label)   | Latest · pin |
| rss    | OPDS         | (label)        | Latest · pin |

`Latest` = recently added / last modified in that source.  
Pin = keep in Last used.

**Do not** ship AllManga, 1Manga.co, MangaDex tiles.

App bar: search (filter rows) · global search later · filter optional.

### Connectors tab (was Extensions)

Sections: **Connected** · **Available**

Connected row: icon, name, `Komga · token set`, gear (settings).  
Error state can use the muted red label (Mihon used `ORPHANED`) — we use `UNREACHABLE` / `AUTH`.

Available: `Add Komga`, `Add Kavita`, `Add OPDS`, `Add local folder`. Trailing: plus, not APK download.

No “Update to Mihon 0.20.1+”.

### Move tab (was Migrate)

Title line: `Select a source to move from`  
Rows of sources that have works, badge = count.  
Flow: pick work(s) → pick destination source (e.g. Local → Komga is out of scope if we cannot upload; v1 = remap identity / “this EPUB is the same work as that Komga series”).

If Move is too heavy for v1: keep the tab, empty state `Nothing to move`, so the chrome still matches.

---

## 5. More

No み. Wordmark: **Shelf** (or final name) in a simple glyph.

Blocks, same grouping as shots:

**Toggles**

- Downloaded only — “Filters all entries in your library”
- Incognito mode — “Pauses reading history”

**List**

- Download queue (OPFS / in-flight)
- Categories (shelves)
- Statistics
- Data and storage (backup JSON, quota)

**List 2**

- Settings
- Support (optional; our funding link or omit)

**List 3**

- About
- Help

Icons: outline, accent-blue like the shots.

---

## 6. Settings (not fully shot — infer Mihon’s tree)

One stack of groups: Appearance, Reader, Library, Connectors, Backup, Advanced.  
Do not clone tracker / extension repos pages.

---

## 7. Upcoming (calendar)

Pushed from Updates calendar icon.

App bar: back · `Upcoming` · help.  
Month title + `<` `>` .  
Week starts **Monday** (as in the shot).  
Today = outline circle.  
Days with expected chapters = dot (when we have Komga metadata). Local-only = empty month is fine.

---

## 8. Series + Reader (not in this dump — still freeze)

**Series:** back, overflow; cover + title + author; primary `Resume` / `Start`; chapter list newest-first; download icon per chapter if we cache.

**Reader:** no bottom nav. Tap center toggles chrome (title + chapter slider). Paged tap zones left/right. Webtoon vertical. EPUB/PDF use same chrome, different engine.

---

## 9. What we deliberately drop

- Website source icons and language groups
- Extension install / orphaned APK versions
- Scanlator exclude (until we have groups)
- Mihon branding and update-to-Mihon rows
- Support Us if we have nothing to support

---

## 10. Build order for UI only

1. Shell + 5-tab nav, empty bodies
2. Library grid + filter sheet
3. History rows
4. More + toggles
5. Browse Sources with the five connector rows
6. Updates empty + Upcoming calendar
7. Series + Reader chrome

Stop restyling until those seven exist.
