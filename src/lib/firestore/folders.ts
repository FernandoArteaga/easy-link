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

export async function createFolder(uid: string, link: Firestore.CreateFolder) {
	await runTransaction(firestore, async (transaction) => {
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

export async function deleteFolder(userUid: string, uid: string) {
	await runTransaction(firestore, async (transaction) => {
		transaction.update(userDoc(userUid), {
			totalFolders: increment(-1),
		})
		transaction.delete(folderDoc(userUid, uid))
	})
}

/** Re-creates a deleted folder with its original id (Undo); its links still point at that id */
export async function restoreFolder(userUid: string, folder: Firestore.Doc<Firestore.Folder>) {
	await runTransaction(firestore, async (transaction) => {
		transaction.update(userDoc(userUid), {
			totalFolders: increment(1),
		})
		transaction.set(folderDoc(userUid, folder.id), {
			name: folder.name,
			nameLower: folder.nameLower,
		})
	})
}
