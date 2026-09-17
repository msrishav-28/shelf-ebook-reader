# Routes (this app)

TanStack Start file-based routing. Every `.tsx` file here is a route.
Do **not** create `src/pages/`, `src/routes/_app/`, or `app/layout.tsx`.
The only document shell is `__root.tsx`. Keep `<Outlet />`, `<HeadContent />`, and `<Scripts />`.

Living map: `/AGENTS.md`.

## URLs that exist

| File                 | URL               | Screen                                                            |
| -------------------- | ----------------- | ----------------------------------------------------------------- |
| `__root.tsx`         | (shell)           | HTML document, QueryClient, 404, error UI                         |
| `index.tsx`          | `/`               | Library                                                           |
| `updates.tsx`        | `/updates`        | Updates                                                           |
| `history.tsx`        | `/history`        | History                                                           |
| `browse.tsx`         | `/browse`         | Browse (Sources / Connectors / Move are **tabs**, not extra URLs) |
| `more.tsx`           | `/more`           | More                                                              |
| `settings.tsx`       | `/settings`       | Settings groups                                                   |
| `upcoming.tsx`       | `/upcoming`       | Calendar                                                          |
| `series.$workId.tsx` | `/series/$workId` | Series                                                            |
| `reader.$workId.tsx` | `/reader/$workId` | Reader (no tab bar)                                               |

Dynamic params use a bare `$` (`$workId`), never `{workId}`.
Unknown work ids throw `notFound()`.

`../routeTree.gen.ts` is generated. Do not edit it.

## Do not assume these kickoff paths

`/library`, `/browse/connectors`, `/browse/move`, `/work/$workId`, `/read/$renditionId` are charter names, not this tree.
