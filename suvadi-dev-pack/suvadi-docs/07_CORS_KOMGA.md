# Komga CORS for Suvadi testers

> Charter. Current tree: `/AGENTS.md`.

Suvadi’s browser talks **directly** to your Komga. Komga must allow the Suvadi origin.

## Dev

Suvadi: `http://localhost:5173`  
Komga: typically `http://localhost:25600` or your Docker publish port.

In Komga config (`application.yml` or env), allow the exact origin:

```yaml
komga:
  cors:
    allowed-origins:
      - http://localhost:5173
```

Env equivalent: `KOMGA_CORS_ALLOWEDORIGINS=http://localhost:5173`

Use an **API key** (`X-API-Key`) created in Komga for the user. Prefer keys over Basic auth in the web client.

## Prod PWA

Add the deployed origin, e.g. `https://suvadi.example`.  
Komga must be **HTTPS** if Suvadi is HTTPS (mixed content will block images).

Caddy in front of Komga (from Komga docs): set `X-Forwarded-Proto`, `X-Forwarded-Host`, `X-Forwarded-For`.

## Checklist when “images fail”

1. DevTools → failed URL host is Komga, not Suvadi.
2. Response is CORS error vs 401 (key) vs mixed content.
3. Origin string matches **exactly** (no trailing slash in allowed-origins).
4. Do not “fix” this by proxying pages through the Suvadi static host.
