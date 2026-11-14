---
status: current
description: 'Overview of the wiki structure, rules, and navigation.'
superseded_by: ''
---

# Wiki

This directory is the repository-local knowledge base.

The wiki is the working memory for repo analysis, architectural summaries, operating procedures, and durable answers that should survive beyond a single chat session. It is meant to be updated incrementally instead of regenerated from zero.

## Rules

- Read the wiki before doing broad repo analysis.
- Keep files plain Markdown with stable filenames and grep-friendly headings.
- Update the wiki when the repo meaningfully changes.
- Append dated entries to [prologue/log.md](prologue/log.md) for ingest, query, and lint activity.
- Treat repo source files as the underlying evidence.

## Required Files

- [index.md](index.md) tracks the catalog.
- [prologue/log.md](prologue/log.md) tracks chronology.
- [prologue/schema.md](prologue/schema.md) defines the contract.
- [prologue/phases.md](prologue/phases.md) tracks rollout.
- [prologue/repo-map.md](prologue/repo-map.md) records the current repo model.
- [operations/](operations/ingest.md) holds repeatable workflows.

## Project Conventions

- Package manager: **pnpm** only (`npm` is blocked via `engines`). Node ≥ 24.12 (Firebase 13 minimum), pnpm ≥ 11 (`pnpm-workspace.yaml` holds pnpm settings: `allowBuilds`, `engineStrict`).
- Imports: `#lib/*` subpath imports (declared in `package.json` `imports`) with explicit file extensions; SvelteKit 3 removed `$lib`.
- Formatting: Prettier — tabs, no semicolons, single quotes, `printWidth` 100, `trailingComma: es5`, Svelte + Tailwind plugins. ESLint flat config. Run `pnpm fmt` before committing (the Lefthook pre-commit hook fixes staged files automatically).
- Svelte 5 runes everywhere (`$state`, `$derived`, `$effect.pre`, `$props`); shared state as rune classes passed through typed contexts in `src/lib/contexts/`.
- Firestore access only through helpers in `src/lib/firestore/`; document types in the global `Firestore` namespace (`src/app.d.ts`).
- Every PR must keep a `CHANGELOG.md` entry for the current `package.json` version; user-facing changes bump the version. See [operations/ci-and-release.md](operations/ci-and-release.md).
- Rule limits (e.g. folder cap) are mirrored in client stores — change both. See [decisions/folder-limit.md](decisions/folder-limit.md).

## Shell-First Navigation

```bash
wiki-engine list
wiki-engine headings
wiki-engine log-tail
wiki-engine search <term>
```

## Update Loop

1. Read [index.md](index.md).
2. Read the last few entries in [prologue/log.md](prologue/log.md).
3. Read the relevant page under [operations/](operations/ingest.md).
4. Read only the topic pages needed for the task.
5. Read source files when the wiki lacks detail or needs verification.
6. Write durable findings back into the wiki.
