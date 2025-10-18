export class UserData {
	user = $state<Firestore.User | undefined>()
	canCreateFolder = $derived.by(() => {
		const u = this.user
		return !!u && (u.totalFolders === undefined || u.totalFolders < 10)
	})
}
