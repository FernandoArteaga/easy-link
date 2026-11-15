import type { CollectionReference, DocumentReference } from 'firebase/firestore'
import { doc, updateDoc, increment, runTransaction, collection } from 'firebase/firestore'
import { firestore } from '#lib/firebase.ts'
import { userDoc } from '#lib/firestore/users.ts'

export function folderCollection(uid: string) {
	return collection(firestore, 'users', uid, 'folders') as CollectionReference<Firestore.Folder>
}

export function folderDoc(userUid: string, uid: string): DocumentReference<Firestore.Folder> {
	return doc(firestore, 'users', userUid, 'folders', uid) as DocumentReference<Firestore.Folder>
}

/** Must match the `totalFolders < 10` check in firestore.rules */
export const FOLDER_LIMIT = 10

/** Shaped like a FirestoreError so `handleErrorMessages` maps it */
const limitReached = () => ({ code: 'resource-exhausted', message: 'Folder limit reached' })

// Each write reads the user doc (and folder) first, so concurrent writes retry on the new state
// instead of all passing the limit check, and a repeated delete/restore can't skew totalFolders.

export async function createFolder(uid: string, link: Firestore.CreateFolder) {
	await runTransaction(firestore, async (transaction) => {
		const user = await transaction.get(userDoc(uid))
		if ((user.data()?.totalFolders ?? 0) >= FOLDER_LIMIT) {
			throw limitReached()
		}
		transaction.update(userDoc(uid), {
			totalFolders: increment(1),
		})
		transaction.set(doc(folderCollection(uid)), {
			name: link.name,
			nameLower: link.name.toLowerCase(),
		})
	})
}

export async function updateFolder(userUid: string, uid: string, link: Firestore.CreateFolder) {
	await updateDoc(folderDoc(userUid, uid), {
		name: link.name,
		nameLower: link.name.toLowerCase(),
	})
}

/** Resolves false when the folder was already gone (double tap, another tab) */
export async function deleteFolder(userUid: string, uid: string): Promise<boolean> {
	return runTransaction(firestore, async (transaction) => {
		// Don't count an already-deleted folder twice
		if (!(await transaction.get(folderDoc(userUid, uid))).exists()) return false
		transaction.update(userDoc(userUid), {
			totalFolders: increment(-1),
		})
		transaction.delete(folderDoc(userUid, uid))
		return true
	})
}

/** Re-creates a deleted folder with its original id (Undo); its links still point at that id */
export async function restoreFolder(userUid: string, folder: Firestore.Doc<Firestore.Folder>) {
	await runTransaction(firestore, async (transaction) => {
		// Already restored (Undo tapped twice): don't count it twice
		if ((await transaction.get(folderDoc(userUid, folder.id))).exists()) return
		const user = await transaction.get(userDoc(userUid))
		if ((user.data()?.totalFolders ?? 0) >= FOLDER_LIMIT) {
			throw limitReached()
		}
		transaction.update(userDoc(userUid), {
			totalFolders: increment(1),
		})
		transaction.set(folderDoc(userUid, folder.id), {
			name: folder.name,
			nameLower: folder.nameLower,
		})
	})
}
