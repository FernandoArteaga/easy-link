import type { DocumentReference } from 'firebase/firestore'
import { setDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import { firestore } from '$lib/firebase'

export function userDoc(uid: string): DocumentReference<Firestore.User> {
	return doc(firestore, 'users', uid) as DocumentReference<Firestore.User>
}

export async function createUser(uid: string) {
	await setDoc(userDoc(uid), {
		totalFolders: 0,
		lastLogin: serverTimestamp(),
	})
}

export async function updateUserLastLogin(uid: string) {
	await updateDoc(userDoc(uid), {
		lastLogin: serverTimestamp(),
	})
}
