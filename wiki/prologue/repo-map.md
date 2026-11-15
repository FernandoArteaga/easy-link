---
status: current
description: 'Overview of the repository architecture, high-signal areas, and build instructions.'
superseded_by: ''
updated: '2026-11-14'
references: ['source:package.json', 'source:vite.config.ts', 'source:src/env.ts', 'source:pnpm-workspace.yaml', 'source:firebase.json']
---

# Repo Map

## Purpose

The Easy Link is a single-page web app for saving copied links to the cloud and accessing them in real time from any device, with optional folder organisation. It is a client-only SvelteKit SPA (static adapter, `ssr = false`) backed by Firebase Auth, Firestore, and Firebase Hosting (live at `https://the-easy-link.web.app`).

Deeper detail: [App architecture](../architectures/app-architecture.md), [Data model](../architectures/data-model.md), [CI and release](../operations/ci-and-release.md).

## High-Signal Areas

| Path                                        | Role                                                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/+layout.svelte`                 | Root layout: creates the toaster, `UserStore`, `FolderStore`, sets contexts, runs the route guard and `onAuthStateChanged` listener.           |
| `src/routes/+layout.ts`                     | Disables SSR; passes `pathname` to layouts for guarding and nav.                                                                               |
| `src/routes/(secured)/+layout.svelte`       | Authenticated shell: nav (home, theme, sign out), quick-add forms, live subscriptions to the user doc and folders.                             |
| `src/routes/(secured)/links/+page.svelte`   | Main page: folder tab bar + link list.                                                                                                         |
| `src/routes/(secured)/folders/+page.svelte` | Folder management (rename/delete).                                                                                                             |
| `src/routes/(open)/login/+page.svelte`      | Sign in / sign up tabs.                                                                                                                        |
| `src/routes/+page.svelte`                   | Root `/` entry; route guard redirects.                                                                                                         |
| `vite.config.ts` | Vite + SvelteKit config (SvelteKit 3 has no `svelte.config.js`): `adapter-static` options, `vitePreprocess`, Tailwind. |
| `src/env.ts` | `defineEnvVars` declaration of all `PUBLIC_FIREBASE_*` vars (public + static, inlined at build). |
| `pnpm-workspace.yaml` | pnpm 11 settings: `allowBuilds`, `engineStrict`. |
| `lefthook.yml` | Git pre-commit hook: ESLint + Prettier on staged files, `pnpm check`. |
| `src/lib/firebase.ts` | Firebase app init; connects Auth/Firestore emulators when `dev && PUBLIC_FIREBASE_USE_EMULATOR`; Analytics in prod only.            |
| `src/lib/guard.ts`                          | Client-side `routeGuard(path, isAuthenticated)` redirects between `/login` and `/links`.                                                       |
| `src/lib/firestore/`                        | Typed collection/doc refs and CRUD helpers (`users.ts`, `links.ts`, `folders.ts`) plus `errors.ts` (Firebase error code → user message).       |
| `src/lib/stores/`                           | Svelte 5 rune stores: `UserStore`, `FolderStore` (classes, provided via context) and `theme` (module singleton, persisted in localStorage).    |
| `src/lib/contexts/`                         | Typed `Ctx<T>` wrappers around `setContext`/`getContext` for user, folders, toaster.                                                           |
| `src/lib/components/`                       | UI components (Tailwind v4 + design tokens): `LinkList`, `LinkChip`, `FolderList`, `FolderChip`, `Sheet`, `AddBar`, `IconButton`, `InputField`, forms, etc. |
| `src/lib/utils/`                            | `utils.ts` (class concat, link/domain/IP validation), `localStorage.ts`, `styles.ts`.                                                          |
| `src/app.d.ts`                              | Global types: `Nullable`, `Undefinable`, `App.Themes`, and the `Firestore.*` document types.                                                   |
| `firestore.rules`                           | Security rules: per-user ownership + 10-folder cap.                                                                                            |
| `firestore.indexes.json`                    | Composite index `links(folderId ASC, timestamp DESC)`.                                                                                         |
| `firebase.json`                             | Hosting (SPA rewrite to `index.html`, serves `public/`), emulator ports.                                                                       |
| `.github/workflows/`                        | PR checks, preview deploys, tag-triggered production deploy, secrets scan.                                                                     |
| `CHANGELOG.md`                              | Keep a Changelog; must contain the `package.json` version (CI-enforced).                                                                       |

## Generated Artifacts

- `public/` — SvelteKit static build output (`pages`/`assets` dir of `adapter-static`); deployed to Firebase Hosting. Not committed (only `static/` is the source of static assets).
- `.svelte-kit/` — SvelteKit sync/build cache.
- `node_modules/` — pnpm install.
- `.firebase-emulator-data/` — local emulator snapshot (imported on start, exported on exit).
- `firestore-debug.log` — emulator log.
- `.env` — local Firebase config (git-ignored); CI generates it from `.env.ci` via `envsubst`.

## Build and Run Path

Requirements: Node ≥ 24.12 (`.nvmrc`; Firebase 13 minimum), pnpm ≥ 11 (`packageManager: pnpm@11.17.0`), Java for emulators. `firebase-tools` is a dev dependency, so `pnpm firebase-emulator:start` uses the project-pinned CLI (no global install needed).

```bash
# Install
pnpm install

# Dev server (add --host variant for LAN testing)
pnpm dev
pnpm dev:network

# Local Firebase emulators (Auth :9099, Firestore :9080, UI :9090)
pnpm firebase-emulator:start
pnpm firebase-emulator:export

# Type check / lint / format
pnpm check
pnpm fmt:check
pnpm fmt

# Production build -> public/
pnpm build
pnpm preview
```

There is no automated test suite; quality gates are `fmt:check`, `check`, and `build`. Copy `.env.example` to `.env` and fill in the `PUBLIC_FIREBASE_*` values (set `PUBLIC_FIREBASE_USE_EMULATOR=true` to use emulators). Variables are declared in `src/env.ts`.

## Ignored Paths (from .wikirc)

- `wiki/`
- `bin/`
- `*.log`
- `*.tmp`

## Related

- [schema.md](schema.md) — the contract this page must satisfy.
- [operations/ingest.md](../operations/ingest.md) — how this page gets updated.
- [README.md](../README.md) — wiki rules and navigation.
- [App architecture](../architectures/app-architecture.md) | [Data model](../architectures/data-model.md) | [CI and release](../operations/ci-and-release.md)
