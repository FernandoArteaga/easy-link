<script lang="ts">
	import { getContext, onDestroy } from 'svelte'
	import { onSnapshot, query, orderBy } from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { goto } from '$app/navigation'
	import sessionStore from '$lib/stores/session.svelte'
	import { auth } from '$lib/firebase'
	import LinkChip from '$lib/components/LinkChip.svelte'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import { handleErrorMessages } from '$lib/firestore/authentication'
	import { linkCollection } from '$lib/firestore/links'

	const toast = getContext('toast')
	let links: Firestore.Doc<Firestore.Link>[] = $state([])
	let loading = $state(true)
	let unsubscribe = () => {}

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const q = query(linkCollection(sessionStore.user.uid), orderBy('timestamp', 'desc'))
		unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				loading = false
				links = snapshot.docs.map((doc) => {
					const data = doc.data()
					return {
						id: doc.id,
						url: data.url,
						timestamp: data.timestamp,
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
	})

	onDestroy(() => {
		unsubscribe()
	})
</script>

{#if loading}
	<Placeholder repeat={4} />
{:else}
	{#each links as link (link.id)}
		<LinkChip {link} />
	{/each}
{/if}
