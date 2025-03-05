<script lang="ts">
	import { onDestroy } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/firebase';
	import sessionStore from '$lib/stores/session.svelte';
	import themeStore from '$lib/stores/theme.svelte';
	import { routeGuard } from '$lib/guard';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let { children, data } = $props();
	let unsubscribe = () => {};

	$effect.pre(() => routeGuard(data.pathname));
	$effect.pre(() => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				sessionStore.user = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName
				};
			} else {
				sessionStore.signOut();
			}
		});
	});
	themeStore.isLight();

	onDestroy(() => {
		unsubscribe();
	});
</script>

<ToastProvider>
	{@render children()}
</ToastProvider>
