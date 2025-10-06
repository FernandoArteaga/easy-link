<script lang="ts">
	import sessionStore from '$lib/stores/session.svelte'
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
	import { firestore } from '$lib/firebase'
	import { onDestroy } from 'svelte'
	import { Plus } from 'lucide-svelte'
	import activeFolderCtx from '$lib/contexts/activeFolder'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import { concatClasses } from '$lib/utils/utils'

	let folders: Firestore.Folder[] = $state([{ id: 'all', name: 'All' }])
	let loading = $state(true)
	const activeFolder = activeFolderCtx.getCtx()
	let unsubscribe = () => {}

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const q = query(
			collection(firestore, 'users', sessionStore.user.uid, 'folders'),
			orderBy('name', 'desc')
		)
		unsubscribe = onSnapshot(q, (snapshot) => {
			loading = false
			folders.concat(
				snapshot.docs.map((doc) => {
					const data = doc.data()

					return {
						id: doc.id,
						name: data.name
					}
				})
			)
		})
	})

	onDestroy(() => {
		unsubscribe()
	})

	const btnFolder = 'py-1 px-2 w-fit border-b-2 hover:border-primary-500'
	const btnFolderActive = (folderId: string) =>
		folderId === activeFolder.uid ? 'border-secondary-500 font-medium' : 'border-transparent'

	const selectFolder = (folderId: string) => {
		activeFolder.uid = folderId
	}
</script>

{#if loading}
	<Placeholder repeat={4} horizontal />
{:else}
	<div class="flex flex-row">
		{#each folders as f (f.id)}
			<button
				type="button"
				class={concatClasses(btnFolder, btnFolderActive(f.id))}
				onclick={() => selectFolder(f.id)}
			>
				{f.name}
			</button>
		{/each}
		<button type="button" class={concatClasses(btnFolder, 'w-fit border-transparent')}>
			<Plus size={16} />
		</button>
	</div>
{/if}
