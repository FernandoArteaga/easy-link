import type { CollectionReference } from 'firebase/firestore'
import { collection, addDoc } from 'firebase/firestore'
import { firestore } from '$lib/firebase'

export function folderCollection(uid: string) {
	return collection(firestore, 'users', uid, 'folders') as CollectionReference<Firestore.Folder>
}

export async function createFolder(uid: string, link: Firestore.CreateFolder) {
	await addDoc(folderCollection(uid), {
		name: link.name,
		nameLower: link.name.toLowerCase(),
	})
}
