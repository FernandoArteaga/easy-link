---
status: current
description: 'CI checks, preview deploys, versioning rules, and the tag-driven production release flow.'
superseded_by: ''
created: '2026-11-14'
tags: ['ci', 'release', 'github-actions', 'firebase']
references: ['source:.github/workflows/pr-checks.yml', 'source:.github/workflows/firebase-services-deploy.yml', 'source:.github/workflows/build-sveltekit.yml', 'source:.github/workflows/pr-firebase-hosting-preview.yml', 'source:.github/workflows/secrets-scan.yml', 'source:.github/dependabot.yml']
---

# CI and Release

## Local Gates

- Husky `pre-commit` runs `lint-staged`: `pnpm fmt` on staged js/ts/svelte/css/md/json/yml, and `pnpm check` on js/ts/svelte.

## Pull Requests

| Workflow                          | Trigger                                                                          | What it does                                                                                                                                                                                                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pr-checks.yml`                   | every PR                                                                         | `pnpm fmt:check`, `pnpm check` (with `.env.ci` copied to `.env`), `pnpm build`, and **asserts `package.json` version has a `## [x.y.z]` heading in `CHANGELOG.md`**. If `firebase.json` / `firestore.rules` / `firestore.indexes.json` changed, dry-runs `firebase deploy --only firestore`. |
| `pr-firebase-hosting-preview.yml` | PRs touching `src/`, `static/`, `package.json`, `pnpm-lock.yaml`, `CHANGELOG.md` | Builds and deploys to a Firebase Hosting preview channel.                                                                                                                                                                                                                                    |
| `secrets-scan.yml`                | PRs, pushes to `main`, manual                                                    | gitleaks secret scan.                                                                                                                                                                                                                                                                        |

`build-sveltekit.yml` is a reusable workflow: renders `.env` from `.env.ci` with `envsubst` using repo `vars.FIREBASE_*`, runs `pnpm build`, uploads `public/` as the `build` artifact. Shared pnpm setup lives in `.github/actions/setup-pnpm`.

## Release Flow

1. Bump `version` in `package.json` and add a matching `## [x.y.z] - YYYY-MM-DD` section in `CHANGELOG.md` (Keep a Changelog: Added / Changed / Fixed).
2. Merge to `main`.
3. Push tag `vX.Y.Z`. `firebase-services-deploy.yml` then:
   - validates tag version == `package.json` version and that CHANGELOG has it;
   - builds via `build-sveltekit.yml`;
   - deploys Hosting to the `live` channel (project `the-easy-link`);
   - deploys **Firestore rules only** (`--only firestore:rules`);
   - creates a GitHub release with generated notes.

Note: production deploy does not push `firestore.indexes.json`; index changes must be deployed separately (PR dry-run covers them).

## Dependency Updates

Dependabot: GitHub Actions weekly; npm monthly, ignoring semver-patch updates. Dependency bump PRs are typically batched ("Update dependencies").

## PR Conventions

PR template sections: Description, Changes (🐣 Added / 🍃 Changed / 🥥 Fixed / 🗑️ Removed).

## Related

- [Repo map](../prologue/repo-map.md) | Build commands.
- [Data model](../architectures/data-model.md) | Rules and indexes being deployed.
- [Wiki conventions](../README.md)
- [Index](../index.md)
