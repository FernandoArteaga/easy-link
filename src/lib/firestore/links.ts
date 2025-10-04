import {
	doc,
	collection,
	query,
	addDoc,
	getDocs,
	deleteDoc,
	serverTimestamp
} from 'firebase/firestore'
import { firestore } from '$lib/firebase'

export async function getUserLinks(uid: string) {
	const q = query(collection(firestore, 'users', uid, 'links'))
	const docs = await getDocs(q)
	return docs.docs.map((doc) => doc.data())
}

export async function createLink(uid: string, link: Firestore.CreateLink) {
	await addDoc(collection(firestore, 'users', uid, 'links'), {
		url: link.url,
		timestamp: serverTimestamp()
	})
}

export async function deleteLink(uid: string, id: string) {
	await deleteDoc(doc(firestore, 'users', uid, 'links', id))
}
