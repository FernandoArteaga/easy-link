<script lang="ts">
	import { onDestroy } from 'svelte';
	import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
	import sessionStore from '$lib/stores/session.svelte';
	import { firestore } from '$lib/firebase';

	let links: Firestore.Link[] = $state([]);
	let loading = $state(true);
	let unsubscribe = () => {};

	$effect.pre(() => {
		if (sessionStore.user === null) return;
		loading = false;
		const q =  query(collection(firestore, "users", sessionStore.user.uid, "links"), orderBy("timestamp", "desc"));
		unsubscribe = onSnapshot(q, (snapshot) => {
			links = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				};
			});
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if loading}
	{#each { length: 4 }, n}
		<div class="placeholder h-10 animate-pulse"></div>
	{/each}
{:else}
	{#each links as link}
		<p>{link.url}</p>
	{/each}
{/if}
