import sessionStore from '$lib/stores/session.svelte';
import { goto } from '$app/navigation';

export function routeGuard(path: string) {
	if (path.startsWith('/login')) {
		if (sessionStore.user !== null) {
			goto('/links').then();
		}
	}
	if (path.startsWith('/')) {
		if (sessionStore.user === null) {
			goto('/login').then();
		}
	}
}
