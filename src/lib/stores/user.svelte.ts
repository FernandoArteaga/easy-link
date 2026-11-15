import { FOLDER_LIMIT } from '#lib/firestore/folders.ts'

interface SessionUser {
	uid: string
	email: Nullable<string>
	displayName: Nullable<string>
}
export class UserStore {
	user = $state<Undefinable<Firestore.User>>()
	session = $state<Undefinable<SessionUser>>()
	authReady = $state(false)
	canCreateFolder = $derived.by(() => {
		const u = this.user
		return !!u && (u.totalFolders === undefined || u.totalFolders < FOLDER_LIMIT)
	})
	isSignedIn = $derived.by(() => {
		return this.session !== undefined
	})
	signOut = () => {
		this.session = undefined
		this.user = undefined
	}
}
