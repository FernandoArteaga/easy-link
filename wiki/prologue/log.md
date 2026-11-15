---
status: current
description: 'Append-only timeline of wiki maintenance activity.'
superseded_by: ''
---

# Wiki Log

Append-only timeline of wiki maintenance activity.

## [2026-11-14] ingest | initial full-repo wiki build

- Populated [repo-map.md](repo-map.md): purpose, high-signal areas, generated artifacts, build/run commands, ignored paths.
- Added `architectures/app-architecture.md`, `architectures/data-model.md`, `decisions/folder-limit.md`, `operations/ci-and-release.md`.
- Added Project Conventions section to `README.md`.
- Removed template pages `architectures/example.md` and `decisions/example.md`.
- Migration: `AGENTS.md` and `CLAUDE.md` were already redirect shims; root `README.md` and `CHANGELOG.md` kept as-is (user-facing); no `docs/`, `CONTRIBUTING.md`, or `ARCHITECTURE.md` exist. Nothing migrated.
- Needs human review:
  - Production deploy pushes `firestore:rules` only, not indexes — intentional?
  - Deleting a folder leaves stale `folderId` on its links.
  - Pre-v1.2.3 users without a `users/{uid}` doc cannot create folders.
  - Untracked `tmp/rules.md` scratch file — keep or delete?
  - Root `README.md` lists "tags and categories" as a feature; only folders exist.

## [2026-11-14] ingest | Node 26 / pnpm 11 and SvelteKit 3 upgrade

- Updated repo-map, app-architecture and README conventions for: Node ≥ 24, pnpm 11 (`pnpm-workspace.yaml`), SvelteKit 3 (config in `vite.config.ts`, `src/env.ts` env declarations, `#lib` imports, `$app/env`), Skeleton 5, `@lucide/svelte`.
- Needs human review: visual changes from Skeleton 5 theme/component redesign.
- Node stays on 24 (not 26): firebase-tools (emulators) depends on `superstatic`, which only supports Node 20/22/24, and older firebase-tools crash on Node 26 (`SlowBuffer` removed).
- Added `firebase-tools` as a dev dependency (emulators no longer need a global CLI). `re2` (optional native dep of `superstatic`) build is disabled; only needed for regex rewrites in `firebase.json`.
- Replaced Husky + lint-staged with Lefthook (`lefthook.yml`, mirrors neat-web-app); updated ci-and-release local gates and repo-map.

## [2026-11-14] ingest | #96 bug fixes

- data-model: `url` keeps path/query/hash case (`normalizeLink`); `folderId` is deleted for "No folder", never `'all'` (legacy `'all'` values treated as unassigned).
- Auth guard now waits for `UserStore.authReady` (first `onAuthStateChanged`).
