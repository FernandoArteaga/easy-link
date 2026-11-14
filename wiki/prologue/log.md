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
