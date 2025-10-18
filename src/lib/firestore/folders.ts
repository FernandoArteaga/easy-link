import { type CollectionReference, doc, increment, runTransaction } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { firestore } from '$lib/firebase'
import { userDoc } from '$lib/firestore/users'

export function folderCollection(uid: string) {
	return collection(firestore, 'users', uid, 'folders') as CollectionReference<Firestore.Folder>
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
