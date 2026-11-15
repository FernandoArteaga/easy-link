---
status: current
description: 'Decision record: cap each user at 10 folders using a transactional counter enforced in Firestore rules.'
superseded_by: ''
created: '2026-11-14'
tags: ['decision', 'firestore', 'folders']
references: ['source:firestore.rules', 'source:src/lib/firestore/folders.ts', 'source:src/lib/stores/user.svelte.ts', 'source:CHANGELOG.md']
---

# Decision: 10-Folder Limit per User

## Context

Folders were introduced in v1.2.0 to organise links. With no backend code, any limit must be enforced by Firestore security rules, which cannot count documents in a collection.

## Decision

- Keep a `totalFolders` counter on `users/{uid}`.
- `createFolder` / `deleteFolder` update the counter and the folder doc in a single `runTransaction`.
- Rules allow folder **create** only when `userDoc().data.totalFolders < 10`.
- The UI mirrors the limit via `FOLDER_LIMIT` (`src/lib/firestore/folders.ts`), used by `UserStore.canCreateFolder` to hide the add-folder form and by `createFolder` / `restoreFolder` to refuse at the cap.

## History

- v1.2.2 — fixed rules that denied creation when the user doc was missing.
- v1.2.3 — user doc is now created on sign-up (`totalFolders: 0`), so rules were simplified to assume it exists. An earlier, more defensive variant (null / missing-field checks) is kept in the untracked `tmp/rules.md` scratch file.

## Consequences

- Users created before v1.2.3 without a user doc cannot create folders until the doc exists (`updateUserLastLogin` uses `updateDoc`, which does not create it).
- The counter is only as correct as the transactions; rules do not verify that the increment matches a folder create.
- Changing the limit requires editing both `firestore.rules` and `FOLDER_LIMIT`.
- The rules don't verify the counter: the owner can write `users/{uid}.totalFolders` directly, and folder create doesn't check that it was incremented. Tightening needs a rules change and deploy.

## Related

- [Data model](../architectures/data-model.md)
- [App architecture](../architectures/app-architecture.md)
- [Index](../index.md)
