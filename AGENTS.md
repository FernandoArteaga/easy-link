# AI Agent Instructions

This project uses a structured wiki for all documentation and agent context.

Start here: **[wiki/index.md](wiki/index.md)**

The wiki covers architecture, conventions, active phases, and the project change log.
To ingest, query, or refresh the wiki, follow the workflows in
[.wiki-instructions/](.wiki-instructions/) (tool-agnostic) or use the
[.claude/commands/](.claude/commands/) slash commands (Claude Code).

## Project at a Glance

**The Easy Link** — save copied links to the cloud and access them in real time from any device, organised into folders.

- SvelteKit 3 + Svelte 5 (runes), client-only SPA (`ssr = false`, `adapter-static` → `public/`).
- Firebase Auth (email/password), Firestore, Firebase Hosting. No server code — Firestore rules are the only authorisation layer.
- UI: Skeleton v5, Tailwind CSS v4, `@lucide/svelte` icons.

Details: [repo map](wiki/prologue/repo-map.md) · [app architecture](wiki/architectures/app-architecture.md) · [data model](wiki/architectures/data-model.md)

## Commands

```bash
pnpm install                  # pnpm >= 11 only; Node >= 24.12
pnpm dev                      # dev server
pnpm firebase-emulator:start  # local firebase-tools; Auth :9099, Firestore :9080, UI :9090
pnpm check                    # svelte-check (type check)
pnpm fmt:check                # eslint + prettier check
pnpm fmt                      # auto-fix formatting
pnpm build                    # production build -> public/
```

There is no test suite. Before finishing a change, run `pnpm fmt:check`, `pnpm check`, and `pnpm build`.

## Where Things Live

| Need                                                  | Location                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Routes / pages                                        | `src/routes/` — `(open)/login`, `(secured)/links`, `(secured)/folders`   |
| Auth listener, store/context setup                    | `src/routes/+layout.svelte`                                              |
| Authenticated shell, live user + folder subscriptions | `src/routes/(secured)/+layout.svelte`                                    |
| Route guard                                           | `src/lib/guard.ts`                                                       |
| Firebase init / emulator wiring                       | `src/lib/firebase.ts`                                                    |
| Firestore refs + write helpers                        | `src/lib/firestore/` (`users.ts`, `links.ts`, `folders.ts`, `errors.ts`) |
| Shared state                                          | `src/lib/stores/` (rune classes) exposed via `src/lib/contexts/`         |
| Document types                                        | global `Firestore` namespace in `src/app.d.ts`                           |
| Security rules / indexes                              | `firestore.rules`, `firestore.indexes.json`                              |

## Rules for Agents

- **Read the wiki first** ([wiki/index.md](wiki/index.md)) before broad repo exploration; update it when you change architecture, data model, or workflows (see [wiki/operations/ingest.md](wiki/operations/ingest.md)).
- **Imports:** use `#lib/...` subpath imports with explicit extensions (`#lib/firebase.ts`, `#lib/components/Modal.svelte`). `$lib` no longer exists in SvelteKit 3. Use `$app/env` (not `$app/environment`). `resolve()` takes paths without a leading slash (`resolve('links')`).
- **Style:** Prettier — tabs, no semicolons, single quotes, width 100. Use Svelte 5 runes (`$state`, `$derived`, `$effect.pre`, `$props`), not legacy stores or `export let`.
- **State:** add shared state as a rune class in `src/lib/stores/` and expose it through a typed `Ctx<T>` in `src/lib/contexts/`.
- **Firestore:** go through helpers in `src/lib/firestore/`; add/extend types in `src/app.d.ts`. Realtime reads use `onSnapshot` inside `$effect.pre` and must return the unsubscribe.
- **Data model changes:** if you add a query with a new filter/order combination, add the composite index to `firestore.indexes.json`. If you add a collection or field that needs protection, update `firestore.rules`.
- **Limits are duplicated:** the 10-folder cap lives in both `firestore.rules` and `UserStore.canCreateFolder` — change both ([decision](wiki/decisions/folder-limit.md)).
- **`'all'` folder id is synthetic** — client-only, never write it to Firestore.
- **Errors:** map new Firebase error codes in `src/lib/firestore/errors.ts`; surface them via the toaster context.
- **Versioning:** CI fails unless `CHANGELOG.md` has a `## [x.y.z]` heading matching `package.json` `version`. For user-facing changes, bump the version and add Added/Changed/Fixed entries ([CI and release](wiki/operations/ci-and-release.md)).
- **Secrets:** never commit `.env`; Firebase config comes from `PUBLIC_FIREBASE_*` env vars, declared in `src/env.ts` (`defineEnvVars`) and imported from `$app/env/public`. New env vars must be added there.
- Do not edit generated output: `public/`, `.svelte-kit/`, `.firebase-emulator-data/`.
