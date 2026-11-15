import type { CollectionReference, DocumentReference } from 'firebase/firestore'
import {
	doc,
	collection,
	addDoc,
	setDoc,
	deleteDoc,
	serverTimestamp,
	updateDoc,
	deleteField,
} from 'firebase/firestore'
import { firestore } from '#lib/firebase.ts'

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

export async function updateLink(userUid: string, uid: string, link: Firestore.UpdateLink) {
	await updateDoc(linkDoc(userUid, uid), {
		folderId: link.folderId ?? deleteField(),
	})
}

export async function deleteLink(userUid: string, uid: string) {
	await deleteDoc(linkDoc(userUid, uid))
}

export async function updateLinkTitle(userUid: string, uid: string, title: string | undefined) {
	const trimmed = title?.trim()
	await updateDoc(linkDoc(userUid, uid), {
		title: trimmed ? trimmed : deleteField(),
	})
}

/** Re-creates a deleted link with its original id and fields (Undo) */
export async function restoreLink(userUid: string, link: Firestore.Doc<Firestore.Link>) {
	const { id, ...data } = link
	await setDoc(linkDoc(userUid, id), {
		url: data.url,
		// A link deleted before its server timestamp resolved has `null` locally
		timestamp: data.timestamp ?? serverTimestamp(),
		...(data.folderId ? { folderId: data.folderId } : {}),
		...(data.title ? { title: data.title } : {}),
	})
}
