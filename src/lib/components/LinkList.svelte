<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import type { QueryConstraint } from 'firebase/firestore'
	import { onSnapshot, query, orderBy, where } from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { auth } from '$lib/firebase'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import { linkCollection } from '$lib/firestore/links'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import userCtx from '$lib/contexts/userCtx'
	import LinkChip from '$lib/components/LinkChip.svelte'
	import Placeholder from '$lib/components/Placeholder.svelte'

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	let links: Firestore.Doc<Firestore.Link>[] = $state([])
	let loading = $state(true)

	$effect.pre(() => {
		if (!userStore.isSignedIn) return
		const qConstraints: QueryConstraint[] = [orderBy('timestamp', 'desc')]
		if (folderStore.activeFolderId !== 'all') {
			qConstraints.push(where('folderId', '==', folderStore.activeFolderId))
		}
		const q = query(linkCollection(userStore.session!.uid), ...qConstraints)

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
							goto(resolve('/login'))
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
