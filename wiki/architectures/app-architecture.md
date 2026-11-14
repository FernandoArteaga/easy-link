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

- **SvelteKit 2 + Svelte 5 (runes)**, built with `@sveltejs/adapter-static` into `public/` with `fallback: 'index.html'`. `ssr = false` in the root `+layout.ts`, so the whole app is a client-rendered SPA.
- **No server code.** All data access goes straight from the browser to Firebase; authorisation is enforced only by [Firestore security rules](data-model.md#security-rules).
- **UI:** Skeleton v4 (`@skeletonlabs/skeleton-svelte`) components (Dialog-based `Modal`, `Toast`, `Tabs`), Tailwind CSS v4 via `@tailwindcss/vite`, icons from `lucide-svelte`.

## Routes

| Route      | Group       | Purpose                                                                                     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------- |
| `/`        | —           | Entry; guard redirects to `/login` or `/links`.                                             |
| `/login`   | `(open)`    | Sign in / sign up tabs (email + password).                                                  |
| `/links`   | `(secured)` | Folder tab bar (`FolderList`) + live link list (`LinkList`). Quick-add link form in layout. |
| `/folders` | `(secured)` | Rename/delete folders (`FolderChip`). Quick-add folder form in layout when under the cap.   |

Route groups are layout-only; protection is not by group but by `routeGuard` in [src/lib/guard.ts](../../src/lib/guard.ts): unauthenticated users on any path go to `/login`; authenticated users on `/login` go to `/links`. The `(secured)` layout additionally renders nothing unless `userStore.session` is set.

## Auth Flow

1. Root layout subscribes to `onAuthStateChanged`. On sign-in it fills `userStore.session` (`uid`, `email`, `displayName`) and calls `updateUserLastLogin`; on sign-out it clears the store.
2. Sign up (`SignUpForm`) calls `createUserWithEmailAndPassword` then `createUser(uid)` to create `users/{uid}` with `totalFolders: 0`. The folder-cap rule assumes this doc exists.
3. A `permission-denied` Firestore error in a live subscription triggers sign-out and redirect to `/login`.
4. Error codes are mapped to friendly text in `src/lib/firestore/errors.ts`; toasts are shown through the toaster context.

## State

- **Class stores with runes**, instantiated once in the root layout and shared via typed contexts (`src/lib/contexts/*Ctx.ts`, each exposing `setCtx`/`getCtx` with a private `Symbol` key):
  - `UserStore` — `session`, `user` (Firestore doc), derived `isSignedIn`, derived `canCreateFolder` (`totalFolders < 10`).
  - `FolderStore` — `folders` (always prefixed with a synthetic `{ id: 'all' }` entry), `activeFolderId`, `assigningLinks` toggle, `loading`.
  - Toaster — `createToaster({ placement: 'bottom-end', max: 5 })`.
- **Theme** — module-level singleton (`theme.svelte.ts`) persisted in localStorage, toggles the `dark` class on `<html>`; defaults to system preference.

## Realtime Subscriptions

All reads are `onSnapshot` listeners created inside `$effect.pre` and unsubscribed on cleanup:

- `(secured)/+layout.svelte` — `users/{uid}` doc and `users/{uid}/folders` ordered by `nameLower`.
- `LinkList.svelte` — `users/{uid}/links` ordered by `timestamp desc`, plus `where('folderId', '==', activeFolderId)` when a real folder is selected (needs the composite index).

Writes go through helpers in `src/lib/firestore/`; see [Data model](data-model.md).

## Environment

`src/lib/firebase.ts` reads `PUBLIC_FIREBASE_*` from `$env/static/public`. Emulators are used only when `dev` and `PUBLIC_FIREBASE_USE_EMULATOR === 'true'`. Analytics initialises only in production builds when supported.

## Related

- [Data model](data-model.md) | Firestore collections, rules, indexes.
- [Folder limit decision](../decisions/folder-limit.md) | Why folders are capped and how.
- [Repo map](../prologue/repo-map.md) | File-level overview and build commands.
- [Index](../index.md)
