export class FolderStore {
	folders = $state<Firestore.Doc<Firestore.Folder>[]>([
		{ id: 'all', name: 'All', nameLower: 'all' },
	])
	activeFolderId = $state<string>('all')
	loading = $state<boolean>(true)
}
