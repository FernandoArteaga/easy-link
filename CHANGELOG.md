# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com), and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]
### Changed
- Require pnpm 11+ and Node.js 24.12+; pnpm settings moved to `pnpm-workspace.yaml`.
- Upgrade to SvelteKit 3, Vite 8, Skeleton 5, Firebase 13, ESLint 10 and TypeScript 6.
  - Move Svelte config into `vite.config.ts` and declare env vars in `src/env.ts`.
  - Replace `$lib` imports with `#lib` subpath imports.
  - Replace deprecated `lucide-svelte` with `@lucide/svelte`.
- Add `firebase-tools` as a dev dependency so the emulators use a project-pinned CLI.
- Replace Husky and lint-staged with Lefthook (`lefthook.yml`): staged files get ESLint and Prettier fixes, plus `pnpm check`.
- New mobile-first look from the Easy Link design system (`design-system/`): warm light and true dark themes, Manrope and JetBrains Mono, replacing the Skeleton "terminus" theme.
  - App bar with logo and icon buttons (manage folders, theme, sign out), all with labels and tooltips.
  - Links as cards: bold domain and mono path (or title and URL), each truncated to one line; tapping opens the link.
  - Folders as scrolling chips, with a "New" chip that opens the add-folder sheet.
  - Add link / add folder bar docked at the bottom, in thumb reach.
  - Bottom sheets instead of centred modals, with buttons named by what they do.
  - Sign-in page with logo, headline and a Sign in / Sign up switch; fields have visible labels.
  - One-line pill toasts, bottom centre; empty states and skeleton loaders.
- Delete, open and move to folder live in each link's "More" sheet. The organize mode toggle is removed; "Move to folder" replaces it.

### Added
- Optional link titles, set from the More sheet ("Add title" / "Edit title").
- Undo on the "Link deleted" and "Folder deleted" toasts.

### Fixed
- Restore input groups after Skeleton 5 removed `input-group`/`ig-*` (now `field-group`).
- Size icons with Skeleton 5 classes instead of the Lucide `size` prop.
- Give the modal Cancel button a valid style (`preset-ghost-primary` doesn't exist).
- Refreshing or opening a secured page directly (e.g. `/folders`) no longer redirects to `/links`; routes are guarded only after Firebase Auth restores the session.
- Error toasts show friendly messages for more Firebase codes and a generic message instead of raw Firebase text.
- Choosing "No folder" for a link removes its `folderId` instead of writing `'all'` to Firestore.
- Cancelling the folder picker no longer saves the cancelled choice on the next confirm.
- Saved links keep the case of their path, query and hash; only the scheme and host are lower-cased.
- "Folder Name" labels in the folder modals are linked to their inputs.
- "Link deleted" / "Folder deleted" toasts no longer appear when the delete fails.


## [1.3.0] - 2025-12-13
### Added
- New component `DisplayTextInline` to standardize inline text.
- GHA workflow to scan repositories for secrets using `gitleaks`.

### Changed
- Don't show the "All" folder option in the folder page since this is not a real folder and cannot be managed.
- Update Firestore indexes.
- Upgrade Skeleton to version 4.
  - Refactor the Modal component to use new the Skeleton Dialog component.
  - Refactor the Toaster component to use the new Skeleton Toast component.
  - Fix the use of the Skeleton Tab component.
- Update GHA to use latest versions.

### Fixed
- Make the folder tab bar full width when there are few folders to prevent layout issues.

## [1.2.3] - 2025-10-20
### Added
- Create a user document on signup to initialize `totalFolders` field.
- Add `lastLogin` field to the user document that updates on each login.

### Changed
- Simplify folder creation security rules by assuming a user document always exists.
- Unify GHA workflow for tagged releases to a single workflow file.

## [1.2.2] - 2025-10-19
### Changed
- Include in the Firebase workflows a new job to deploy Firestore rules.
- Validate the Firestore rules in PRs to prevent invalid rules from being merged.

### Fixed
- Fixed folder creation security rules that incorrectly denied creation when the actor had no `user` document.

## [1.2.1] - 2025-10-19
### Added
- New page for managing folders.
- Option to assign links to folder.

## [1.2.0] - 2025-10-15
### Added
- Folders feature to organize links.

## [1.1.2] - 2025-04-04
### Changed
- Updated iOS image.

## [1.1.1] - 2025-03-17
### Changed
- Updated dependencies.

## [1.1.0] - 2025-03-11
### Changed
- Hide Links page when the user is not authenticated.

## [1.0.1] - 2025-03-06
### Fixed
- Set max height for LinkChip to improve layout and prevent overflow.

## [1.0.0] - 2025-03-02
### Added
- Initial release of Easy Link.
- Firebase authentication.
- Firestore integration.
- Action buttons for each link.
- External navigation icon shown only for valid links.
- Initial login layout and base application setup.
