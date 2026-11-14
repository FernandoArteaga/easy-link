---
status: current
description: 'Catalog of all wiki pages with one-line descriptions.'
superseded_by: ''
---

# Wiki Index

## Prologue

- [README.md](README.md) | Purpose, rules, and shell-first navigation.
- [prologue/schema.md](prologue/schema.md) | Required structure and maintenance contract.
- [prologue/phases.md](prologue/phases.md) | Phase rollout plan.
- [prologue/repo-map.md](prologue/repo-map.md) | Current repo architecture and exclusions.
- [prologue/log.md](prologue/log.md) | Append-only timeline of wiki maintenance.

## Operations

- [operations/ingest.md](operations/ingest.md) | How to absorb a repo change into the wiki.
- [operations/query.md](operations/query.md) | How to answer questions from the wiki first.
- [operations/lint.md](operations/lint.md) | How to health-check and repair wiki drift.

## Categories

Group related topic pages in subdirectories — see [prologue/schema.md](prologue/schema.md) for the directory convention.

### Architectures

- [architectures/app-architecture.md](architectures/app-architecture.md) | SPA shape, routes, auth flow, stores/contexts, realtime subscriptions.
- [architectures/data-model.md](architectures/data-model.md) | Firestore collections, fields, security rules, indexes.

### Decisions

- [decisions/folder-limit.md](decisions/folder-limit.md) | 10-folder cap via transactional counter + rules.

### Operations (project)

- [operations/ci-and-release.md](operations/ci-and-release.md) | PR checks, previews, versioning/CHANGELOG rule, tag-driven deploy.
