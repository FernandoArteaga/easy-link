<script lang="ts">
	import { onDestroy } from 'svelte'
	import '../app.css'
	import { auth } from '$lib/firebase'
	import sessionStore from '$lib/stores/session.svelte'
	import themeStore from '$lib/stores/theme.svelte'
	import { routeGuard } from '$lib/guard'
	import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte'
	import { setContext } from 'svelte'
	import { onAuthStateChanged } from 'firebase/auth'
	import activeFolderCtx from '$lib/contexts/activeFolder'
	import userDataCtx from '$lib/contexts/userData'
	import { ActiveFolder } from '$lib/stores/folders.svelte'
	import { UserData } from '$lib/stores/user.svelte'

	let { children, data } = $props()
	const toaster = createToaster({
		placement: 'bottom-end',
		max: 5,
	})
	const userData = new UserData()
	setContext('toast', toaster)
	activeFolderCtx.setCtx(new ActiveFolder())
	userDataCtx.setCtx(userData)

	let unsubscribe = () => {}

	$effect.pre(() => routeGuard(data.pathname))
	$effect.pre(() => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				sessionStore.user = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				}
			} else {
				sessionStore.signOut()
				userData.user = undefined
			}
		})
	})
	themeStore.isLight()

	onDestroy(() => {
		unsubscribe()
	})
</script>

<Toaster {toaster} />
<div class="mx-auto flex max-w-9/10 flex-col justify-center sm:max-w-xl">
	{@render children()}
</div>
