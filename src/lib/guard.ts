import sessionStore from '$lib/stores/session.svelte';
import { goto } from '$app/navigation';

export function routeGuard(path: string) {
	console.log('routeGuard', path);
	if (path.startsWith('/login')) {
		if (sessionStore.user !== null) {
			goto('/').then();
		}
	}
	if (path.startsWith('/')) {
		if (sessionStore.user === null) {
			goto('/login').then();
		}
	}
}
