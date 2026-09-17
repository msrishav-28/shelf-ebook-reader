# Shelf (charter name: Suvadi)

A private reader for **your** comics, ebooks, and PDFs. The screens follow Mihon muscle memory. Browse means local files and home servers you configure — not a website catalog.

> Suvadi is a reader for files and servers you configure. We do not host publications. You are responsible for the copies you add.

**What you can do today:** click through Library, Updates, History, Browse, More, a series page, and a placeholder reader on phone and desktop. Data is fake and does not survive a refresh. Real CBZ/EPUB/PDF opening is not built yet.

Developers and agents: read `AGENTS.md` before changing code. Product charter: `suvadi-dev-pack/`.

## Run locally

You need [Bun](https://bun.sh).

```sh
bun install
bun run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

- `bun run lint` — lint
- `bun run format` — format
- `bun run build` — production build
