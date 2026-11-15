<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import type { QueryConstraint } from 'firebase/firestore'
	import { onSnapshot, query, orderBy, where } from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { auth } from '#lib/firebase.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import { linkCollection } from '#lib/firestore/links.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import LinkChip from '#lib/components/LinkChip.svelte'
	import { Link } from '@lucide/svelte'
	import Placeholder from '#lib/components/Placeholder.svelte'
	import EmptyState from '#lib/components/EmptyState.svelte'

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	let links: Firestore.Doc<Firestore.Link>[] = $state([])
	let loading = $state(true)
	const activeFolderName = $derived(
		folderStore.folders.find((f) => f.id === folderStore.activeFolderId)?.name ?? 'this folder'
	)

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
					description: handleErrorMessages(error),
					type: 'error',
				})
				if (error.code === 'permission-denied') {
					signOut(auth)
						.then(() => {
							goto(resolve('login'))
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
	<div class="px-4"><Placeholder variant="card" repeat={4} /></div>
{:else if links.length === 0}
	<EmptyState
		Icon={Link}
		title={folderStore.activeFolderId === 'all'
			? 'No links yet'
			: `No links in ${activeFolderName} yet`}
		hint="Paste a link in the bar below to save it here."
	/>
{:else}
	<ul class="flex flex-col gap-3 px-4">
		{#each links as link (link.id)}
			<li><LinkChip {link} /></li>
		{/each}
	</ul>
{/if}
