<script lang="ts">
	import { goto } from '$app/navigation'
	import { onSnapshot, query, orderBy, where } from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { auth } from '$lib/firebase'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import { linkCollection } from '$lib/firestore/links'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import sessionStore from '$lib/stores/session.svelte'
	import LinkChip from '$lib/components/LinkChip.svelte'
	import Placeholder from '$lib/components/Placeholder.svelte'

	const toast = toasterCtx.getCtx()
	const foldersContext = foldersCtx.getCtx()
	let links: Firestore.Doc<Firestore.Link>[] = $state([])
	let loading = $state(true)

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const qConstraints = [orderBy('timestamp', 'desc')]
		if (foldersContext.activeFolderId !== 'all') {
			qConstraints.push(where('folderId', '==', foldersContext.activeFolderId))
		}
		const q = query(linkCollection(sessionStore.user.uid), ...qConstraints)

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				loading = false
				links = snapshot.docs.map((doc) => {
					const data = doc.data()
					return {
						id: doc.id,
						url: data.url,
						timestamp: data.timestamp,
						folderId: data.folderId,
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
		return () => unsubscribe()
	})
</script>

{#if loading}
	<Placeholder repeat={4} />
{:else}
	{#each links as link (link.id)}
		<LinkChip {link} />
	{/each}
{/if}
