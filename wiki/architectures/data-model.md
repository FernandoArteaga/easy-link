---
status: current
description: 'Firestore data model: collections, document fields, security rules, and indexes.'
superseded_by: ''
created: '2026-11-14'
tags: ['firestore', 'data-model', 'security']
references: ['source:src/app.d.ts', 'source:firestore.rules', 'source:firestore.indexes.json', 'source:src/lib/firestore/links.ts', 'source:src/lib/firestore/folders.ts', 'source:src/lib/firestore/users.ts']
---

# Data Model

All data is per-user, nested under `users/{uid}`. Types live in the global `Firestore` namespace in [src/app.d.ts](../../src/app.d.ts); refs and write helpers live in `src/lib/firestore/`.

## Collections

### `users/{uid}` — `Firestore.User`

| Field          | Type      | Notes                                                                                      |
| -------------- | --------- | ------------------------------------------------------------------------------------------ |
| `totalFolders` | number    | Counter maintained transactionally on folder create/delete. Initialised to `0` on sign-up. |
| `lastLogin`    | Timestamp | `serverTimestamp()` on every auth state change to signed-in.                               |

### `users/{uid}/links/{linkId}` — `Firestore.Link`

| Field       | Type      | Notes                                                                                                                                                                                   |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | string    | Trimmed on create; `normalizeLink` lower-cases only scheme + host (path/query/hash keep case); min length 2. Not required to be a valid URL — `isValidLink` (URL, domain, or IPv4) only controls whether the "open externally" action is shown. |
| `timestamp` | Timestamp | `serverTimestamp()` on create; list sorted desc.                                                                                                                                        |
| `folderId`  | string?   | Optional; set when assigned to a folder, **deleted** (`deleteField()`) when set to "No folder". Never `'all'`.                                                                                                                                    |

### `users/{uid}/folders/{folderId}` — `Firestore.Folder`

| Field       | Type   | Notes                                |
| ----------- | ------ | ------------------------------------ |
| `name`      | string | 2–36 chars (client-enforced).        |
| `nameLower` | string | Lower-cased copy, used for ordering. |

`'all'` is a **synthetic folder id** that exists only in `FolderStore`; it is never written to Firestore and means "no folder filter". Previously, assigning a link to "All" wrote `folderId: 'all'`; the client treats that legacy value as unassigned.

## Write Helpers

- `createUser`, `updateUserLastLogin` — `users.ts`.
- `createLink`, `updateLink` (sets `folderId`, or deletes it when omitted), `deleteLink` — `links.ts`.
- `createFolder` / `deleteFolder` — run in a transaction that also `increment(±1)`s `users/{uid}.totalFolders`. `updateFolder` rewrites `name` + `nameLower`.
- Deleting a folder does **not** clear `folderId` on links that referenced it.

## Security Rules

From [firestore.rules](../../firestore.rules):

- Helper `ownsDoc(uid)` = authenticated and `request.auth.uid == uid`.
- `users/{uid}` and `users/{uid}/links/**`: read/write only by owner.
- `users/{uid}/folders/**`: read/update/delete by owner; **create** only if owner **and** `userDoc().data.totalFolders < 10`. Rules assume the user doc exists (since v1.2.3).
- No other paths are readable or writable.

Rules changes are dry-run validated in PRs and deployed on release; see [CI and release](../operations/ci-and-release.md).

## Indexes

From [firestore.indexes.json](../../firestore.indexes.json):

- `links` (collection scope): `folderId ASC, timestamp DESC` — backs the folder-filtered link query in `LinkList`.

## Related

- [App architecture](app-architecture.md) | Where these collections are subscribed to.
- [Folder limit decision](../decisions/folder-limit.md)
- [Repo map](../prologue/repo-map.md)
- [Index](../index.md)
