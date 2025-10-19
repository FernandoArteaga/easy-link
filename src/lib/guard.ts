import { goto } from '$app/navigation'
import { resolve } from '$app/paths'

export function routeGuard(path: string, isUserAuthenticated: boolean) {
	if (path.startsWith('/login')) {
		if (isUserAuthenticated) {
			goto(resolve('/links')).then()
		}
	}
	if (path.startsWith('/')) {
		if (!isUserAuthenticated) {
			goto(resolve('/login')).then()
		}
	}
}
