<script lang="ts">
	import { onDestroy } from 'svelte';
	import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
	import sessionStore from '$lib/stores/session.svelte';
	import { firestore } from '$lib/firebase';
	import LinkChip from '$lib/components/LinkChip.svelte';

	let links: Firestore.Link[] = $state([]);
	let loading = $state(true);
	let unsubscribe = () => {};

	$effect.pre(() => {
		if (sessionStore.user === null) return;
		loading = false;
		const q = query(
			collection(firestore, 'users', sessionStore.user.uid, 'links'),
			orderBy('timestamp', 'desc')
		);
		unsubscribe = onSnapshot(q, (snapshot) => {
			links = snapshot.docs.map((doc) => {
				const data = doc.data();
				let serverTimestamp = 0;
				if (data.timestamp) {
					serverTimestamp = data.timestamp.toMillis();
				}
				return {
					id: doc.id,
					url: data.url,
					timestamp: serverTimestamp
				};
			});
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if loading}
	{#each { length: 4 }}
		<div class="placeholder h-10 animate-pulse"></div>
	{/each}
{:else}
	{#each links as link}
		<LinkChip {link} />
	{/each}
{/if}
