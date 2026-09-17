# Suvadi — Data model

> Charter. Current tree: `/AGENTS.md`.

IDs: UUID v4 strings. Timestamps: ISO-8601 UTC.

Client source of truth until Phase 3: Dexie.  
Phase 3+: sync server is source of truth for circle objects; client remains source for unsynced local-only works.

## Entity relationship (logical)

```
User
  └── CircleMembership (role)
Work
  ├── Rendition[]
  ├── Location[]          (progress, per user per rendition)
  ├── Annotation[]
  └── WorkShare[]         (which users may see this work)
Annotation
  └── MediaAsset?         (voice / image)
Connector
  └── Secret              (API key)
Shelf (category)
HistoryEvent
```

## Tables / types

### User

| Field         | Type      | Notes              |
| ------------- | --------- | ------------------ |
| id            | uuid      |                    |
| displayName   | string    |                    |
| avatarAssetId | uuid?     |                    |
| color         | `#RRGGBB` | highlight identity |
| createdAt     | datetime  |                    |

Local-only Phase 0–2: a single implicit user `local`.

### Work

| Field        | Type     | Notes         |
| ------------ | -------- | ------------- |
| id           | uuid     |               |
| title        | string   |               |
| sortTitle    | string   |               |
| authors      | string[] |               |
| year         | number?  |               |
| coverAssetId | uuid?    |               |
| tags         | string[] |               |
| nsfw         | boolean  | default false |
| createdAt    | datetime |               |
| updatedAt    | datetime |               |

### Rendition

| Field   | Type     | Notes                                                                                           |
| ------- | -------- | ----------------------------------------------------------------------------------------------- |
| id      | uuid     |                                                                                                 |
| workId  | uuid     |                                                                                                 |
| kind    | enum     | `local_cbz` `local_epub` `local_pdf` `local_images` `komga_series` `kavita_series` `opds_entry` |
| source  | json     | opaque: file handle id, komga seriesId, href…                                                   |
| addedAt | datetime |                                                                                                 |

### Location (progress)

| Field       | Type     | Notes   |
| ----------- | -------- | ------- |
| renditionId | uuid     | PK part |
| userId      | uuid     | PK part |
| locator     | Locator  |         |
| updatedAt   | datetime |         |
| deviceId    | string   |         |

Conflict: last `updatedAt` wins.

### Locator

Discriminated union:

```
PdfPage     { type: "pdf_page", page: number }
PdfText     { type: "pdf_text", page: number, rects: Rect[], selectedText?: string }
EpubCfi     { type: "epub_cfi", cfi: string, selectedText?: string }
ImagePage   { type: "image_page", chapterId?: string, page: number }
ImageRegion { type: "image_region", chapterId?: string, page: number, rect: Rect }
Percent     { type: "percent", p: number }   // fallback only
```

`Rect` = `{ x, y, w, h }` in 0–1 normalized page coordinates (not CSS pixels).

### Annotation

| Field        | Type      | Notes                              |
| ------------ | --------- | ---------------------------------- |
| id           | uuid      |                                    |
| workId       | uuid      |                                    |
| renditionId  | uuid      |                                    |
| userId       | uuid      | author                             |
| kind         | enum      | `highlight` `note` `voice` `image` |
| locator      | Locator   | page or line/region                |
| body         | string?   | text note / caption                |
| color        | string?   | override; default author’s color   |
| mediaAssetId | uuid?     | voice or image                     |
| visibility   | enum      | `private` `circle`                 |
| createdAt    | datetime  |                                    |
| updatedAt    | datetime  |                                    |
| deletedAt    | datetime? | tombstone for sync                 |

Rules:

- `highlight` requires a text or region locator when possible.
- `voice` / `image` require `mediaAssetId`.
- Default visibility: `circle` if WorkShare exists for ≥1 other user, else `private`.
- Incognito: do not insert unless confirmed.

### MediaAsset

| Field      | Type                    | Notes      |
| ---------- | ----------------------- | ---------- |
| id         | uuid                    |            |
| kind       | `audio` `image` `cover` |            |
| mime       | string                  |            |
| byteSize   | number                  |            |
| localPath  | string?                 | OPFS path  |
| remoteId   | string?                 | after sync |
| durationMs | number?                 | audio      |

Limits: audio ≤ 30_000 ms; image longest edge 1600; reject if circle storage quota exceeded.

### WorkShare

| Field     | Type                      | Notes |
| --------- | ------------------------- | ----- |
| workId    | uuid                      |       |
| userId    | uuid                      |       |
| role      | `owner` `member` `viewer` |       |
| createdAt | datetime                  |       |

Owner implicit on create. Server must reject annotation writes if no share or role is viewer.

### Connector / Secret

Connector: `id, type (local|komga|kavita|opds), baseUrl, label, secretId?`  
Secret: `id, value` — never in backup default, never in logs, never in query string after paste.

### Shelf (category)

`id, name, hidden, workIds[], pinHash?`  
PIN is a hash for hidden shelf UX, not encryption.

### HistoryEvent

`id, userId, workId, renditionId, locator, at`  
Omitted when Incognito is on.

## Backup file

```
suvadi-backup.json
{
  "v": 1,
  "exportedAt": "...",
  "works": [],
  "renditions": [],
  "locations": [],
  "annotations": [],
  "shelves": [],
  "history": []
}
```

Optional checkbox later: include connectors (still no secrets unless explicit “include keys”).

## Permission matrix

| Action                           | Owner | Member | Viewer |
| -------------------------------- | ----- | ------ | ------ |
| Read shared work                 | yes   | yes    | yes    |
| Add annotation visibility=circle | yes   | yes    | no     |
| Add visibility=private           | yes   | yes    | no     |
| Edit/delete own annotation       | yes   | yes    | no     |
| Delete others’ annotation        | yes   | no     | no     |
| Invite / kick                    | yes   | no     | no     |
| See unshared works               | yes   | no     | no     |
