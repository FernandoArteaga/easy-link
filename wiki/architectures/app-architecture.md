---
status: current
description: 'Client-side architecture: routing, auth flow, state (stores + contexts), and Firestore subscriptions.'
superseded_by: ''
created: '2026-11-14'
tags: ['architecture', 'sveltekit', 'firebase']
references: ['source:src/routes/+layout.svelte', 'source:src/routes/(secured)/+layout.svelte', 'source:src/lib/guard.ts', 'source:src/lib/firebase.ts', 'source:src/lib/stores/user.svelte.ts', 'source:src/lib/stores/folders.svelte.ts']
---

# App Architecture

## Shape

- **SvelteKit 3 + Svelte 5 (runes)**, configured in `vite.config.ts` via `sveltekit({ ... })` (no `svelte.config.js`), built with `@sveltejs/adapter-static` into `public/` with `fallback: 'index.html'`. `ssr = false` in the root `+layout.ts`, so the whole app is a client-rendered SPA.
- **No server code.** All data access goes straight from the browser to Firebase; authorisation is enforced only by [Firestore security rules](data-model.md#security-rules).
- **UI:** the Easy Link design system (`design-system/`, the visual reference) implemented with Tailwind CSS v4: its tokens are CSS variables in `src/app.css` (light on `:root`/`[data-theme=light]`, dark on `[data-theme=dark]`/`.dark`) exposed through `@theme inline` (`bg-surface`, `text-ink-muted`, `bg-violet`, `shadow-card`, `rounded-lg`, …). Skeleton CSS is not loaded; `@skeletonlabs/skeleton-svelte` `Dialog` (wrapped by `Sheet`) and `Toast` are used for behaviour only, and the Zag toast positioning rules are copied into `app.css`. Shared primitives: `IconButton` (always `label`ed), `Sheet` (bottom sheet, centred ≥ 640px, max 560px wide; page content max 720px), `InputField` (labelled field), `AddBar` (docked add form), `EmptyState`, `Placeholder` (skeletons); button classes from `btn()` in `src/lib/utils/styles.ts`. Icons from `@lucide/svelte`. Modules under `src/lib` are imported as `#lib/<path>.<ext>`.

## Routes

| Route      | Group       | Purpose                                                                                     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------- |
| `/`        | —           | Entry; guard redirects to `/login` or `/links`.                                             |
| `/login`   | `(open)`    | Logo, headline, Sign in / Sign up segmented switch (email + password).                      |
| `/links`   | `(secured)` | Folder chips (`FolderList`, "+ New" first) + live link cards (`LinkList` → `LinkChip`: tap copies, Open button for links, Copy button hidden on touch screens, More / Move / Title sheet). Add bar docked in the layout. |
| `/folders` | `(secured)` | Back button in the app bar, "N of 10" and grouped folder rows (`FolderChip`: rename sheet, delete with Undo). Add bar docked in the layout when under the cap. |

Route groups are layout-only; protection is not by group but by `routeGuard` in [src/lib/guard.ts](../../src/lib/guard.ts): unauthenticated users on any path go to `/login`; authenticated users on `/login` go to `/links`. The guard is a no-op until `userStore.authReady` (set on the first `onAuthStateChanged`), and the root layout shows a spinner until then, so a refresh keeps the current route. The `(secured)` layout additionally renders nothing unless `userStore.session` is set.

## Auth Flow

1. Root layout subscribes to `onAuthStateChanged`. On sign-in it fills `userStore.session` (`uid`, `email`, `displayName`) and calls `updateUserLastLogin`; on sign-out it clears the store.
2. Sign up (`SignUpForm`) calls `createUserWithEmailAndPassword` then `createUser(uid)` to create `users/{uid}` with `totalFolders: 0`. The folder-cap rule assumes this doc exists.
3. A `permission-denied` Firestore error in a live subscription triggers sign-out and redirect to `/login`.
4. Error codes are mapped to friendly text in `src/lib/firestore/errors.ts`; toasts are shown through the toaster context.

## State

- **Class stores with runes**, instantiated once in the root layout and shared via typed contexts (`src/lib/contexts/*Ctx.ts`, each exposing `setCtx`/`getCtx` with a private `Symbol` key):
  - `UserStore` — `session`, `user` (Firestore doc), derived `isSignedIn`, derived `canCreateFolder` (`totalFolders < 10`).
  - `FolderStore` — `folders` (always prefixed with a synthetic `{ id: 'all' }` entry), `activeFolderId`, `loading`. (The organize-mode `assigningLinks` toggle was removed; links move via their More sheet.)
  - Toaster — `createToaster({ placement: 'bottom', offsets: { bottom: '96px', … }, max: 3 })`, above the dock. Toasts are one line (`description` only, no `title`); deletes pass `action: { label: 'Undo', onClick }`.
- **Theme** — module-level singleton (`theme.svelte.ts`) persisted in localStorage, toggles the `dark` class and sets `data-theme` on `<html>`; defaults to system preference.

## Realtime Subscriptions

All reads are `onSnapshot` listeners created inside `$effect.pre` and unsubscribed on cleanup:

- `(secured)/+layout.svelte` — `users/{uid}` doc and `users/{uid}/folders` ordered by `nameLower`.
- `LinkList.svelte` — `users/{uid}/links` ordered by `timestamp desc`, plus `where('folderId', '==', activeFolderId)` when a real folder is selected (needs the composite index).

Writes go through helpers in `src/lib/firestore/`; see [Data model](data-model.md).

## Environment

`src/env.ts` declares every `PUBLIC_FIREBASE_*` variable with `defineEnvVars` as `public` + `static` (inlined at build). `src/lib/firebase.ts` imports them from `$app/env/public`; `PUBLIC_FIREBASE_USE_EMULATOR` is parsed to a boolean there. Emulators are used only when `dev` and that flag is true. Analytics initialises only in production builds when supported.

## Related

- [Data model](data-model.md) | Firestore collections, rules, indexes.
- [Folder limit decision](../decisions/folder-limit.md) | Why folders are capped and how.
- [Repo map](../prologue/repo-map.md) | File-level overview and build commands.
- [Index](../index.md)
