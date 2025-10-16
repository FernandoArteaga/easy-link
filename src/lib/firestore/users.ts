import type { DocumentReference } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { firestore } from '$lib/firebase'

export function userDoc(uid: string): DocumentReference<Firestore.User> {
	return doc(firestore, 'users', uid) as DocumentReference<Firestore.User>
}
