<script lang="ts">
	import { getContext } from 'svelte'
	import { onSnapshot, orderBy, query } from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { goto } from '$app/navigation'
	import sessionStore from '$lib/stores/session.svelte'
	import { auth } from '$lib/firebase'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import { folderCollection } from '$lib/firestore/folders'
	import FolderChip from '$lib/components/FolderChip.svelte'

	const toast = getContext('toast')
	let folders: Firestore.Doc<Firestore.Folder>[] = $state([])
	let loading = $state(true)

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const q = query(folderCollection(sessionStore.user.uid), orderBy('nameLower', 'asc'))
		const getFoldersSub = onSnapshot(
			q,
			(snapshot) => {
				loading = false
				folders = snapshot.docs.map((doc) => {
					const data = doc.data()
					return {
						id: doc.id,
						name: data.name,
						nameLower: data.nameLower,
					}
				})
			},
			(error) => {
				toast.create({
					title: 'Error',
					description: handleErrorMessages(error),
					type: 'error',
				})
				if (error.code === 'permission-denied') {
					signOut(auth)
						.then(() => {
							goto('/login')
						})
						.catch((error) => {
							console.error(error)
						})
				}
			}
		)
		return () => getFoldersSub()
	})
</script>

{#if loading}
	<Placeholder repeat={4} />
{:else}
	<div class="space-y-4 overflow-auto">
		{#each folders as folder (folder.id)}
			<FolderChip {folder} />
		{/each}
	</div>
{/if}
