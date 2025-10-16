import {
	doc,
	collection,
	addDoc,
	deleteDoc,
	serverTimestamp,
	type CollectionReference,
	type DocumentReference,
} from 'firebase/firestore'
import { firestore } from '$lib/firebase'

export function linkCollection(uid: string): CollectionReference<Firestore.Link> {
	return collection(firestore, 'users', uid, 'links') as CollectionReference<Firestore.Link>
}

export function linkDoc(userUid: string, uid: string): DocumentReference<Firestore.Link> {
	return doc(firestore, 'users', userUid, 'links', uid) as DocumentReference<Firestore.Link>
}

export async function createLink(uid: string, link: Firestore.CreateLink) {
	await addDoc(linkCollection(uid), {
		url: link.url,
		timestamp: serverTimestamp(),
	})
}

export async function deleteLink(userUid: string, uid: string) {
	await deleteDoc(linkDoc(userUid, uid))
}
