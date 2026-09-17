# Suvadi — Sync API (Phase 3)

> Charter. Current tree: `/AGENTS.md`.

Do not implement this in Phase 0–2. Freeze the contract so the client can keep fields compatible.

## Deployment

- One Docker image, SQLite, single process.
- HTTPS via user’s Caddy/Tailscale.
- Auth: `Authorization: Bearer <token>` after invite accept.
- **Never** accept or store publication files (no EPUB/PDF/CBZ upload endpoint).

## Resources

Base path: `/v1`

### Auth

- `POST /v1/invites` (owner) body `{ expiresInHours, role }` → `{ code, url }`
- `POST /v1/invites/accept` body `{ code, displayName, color }` → `{ token, user }`
- `GET /v1/me`

### Works (metadata only)

- `GET /v1/works` — works shared with caller
- `POST /v1/works` — upsert metadata (title, authors). No file bytes.
- `POST /v1/works/{id}/share` `{ userId, role }`
- `DELETE /v1/works/{id}/share/{userId}`

Renditions are metadata: kind + remote pointer (komga series id). Local file handles **do not sync**. Each device attaches its own local rendition to the same `workId`.

### Locations

- `PUT /v1/locations` `{ renditionId, locator, updatedAt, deviceId }`
- Server keeps row if incoming `updatedAt` ≥ stored.

### Annotations

- `GET /v1/works/{id}/annotations?since=`
- `PUT /v1/annotations` upsert
- `DELETE /v1/annotations/{id}` — author or owner; sets `deletedAt`

### Media

- `POST /v1/assets` multipart, quota enforced
- `GET /v1/assets/{id}` authenticated

## Sync algorithm (client)

1. Push local dirty annotations/locations.
2. Pull `since=lastCursor`.
3. Apply tombstones.
4. Last-write-wins on `updatedAt` per annotation id and per location key.

No CRDTs in v1.

## Errors

JSON `{ "error": "code", "message": "human" }`  
Codes: `unauth`, `forbidden`, `quota`, `not_found`, `gone`, `invalid_locator`.
