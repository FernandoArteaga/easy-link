# UI/UX bugs (#96, part 1) — design

Approved 2026-11-14. First slice of issue #96; the whole issue ships in one PR on `96-improve-ui-and-ux`.

## Intent

Fix the five bugs listed in #96 before the visual and UX work builds on the same components.

## Approaches

Each bug had one sensible fix given the existing code; alternatives (e.g. a loading route, server-side
URL normalisation, a separate "Remove from folder" button) were heavier or would be replaced by the
later UX work (inline folder picker).

## Design

1. **Guard race** — `UserStore.authReady` set `true` on first `onAuthStateChanged`. `routeGuard` no-ops
   until ready. Root layout renders a centred spinner instead of children until ready.
2. **Raw Firebase errors** — map `auth/wrong-password`, `auth/invalid-email`, `auth/missing-password`,
   `auth/weak-password`, `auth/too-many-requests`, `auth/network-request-failed`, `auth/user-disabled`,
   `unavailable`. Default: generic "Something went wrong. Please try again." and `console.error(error)`.
3. **`folderId: 'all'` written** — "All" radio in the assign modal becomes "No folder"; selecting it
   calls `updateLink` with `deleteField()`. `Firestore.UpdateLink.folderId` becomes optional.
4. **URL lower-casing** — `normalizeLink()` in `src/lib/utils/utils.ts`: with a scheme, lowercase only
   scheme + host via `URL`; without, lowercase up to first `/`, `?` or `#`. Existing data untouched.
5. **Label `for` mismatch** — `InputField` takes optional `id` (fallback random); folder modals pass
   ids matching their labels.

Extra: `removeLink` / `removeFolder` no longer show a success toast after a failed delete.

## Docs

`CHANGELOG.md` `[Unreleased]` → Fixed entries. Version bump deferred to end of PR. Wiki data-model
note on `folderId` removal.
