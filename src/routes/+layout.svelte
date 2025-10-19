<script lang="ts">
	import '../app.css'
	import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte'
	import { routeGuard } from '$lib/guard'
	import { auth } from '$lib/firebase'
	import { onAuthStateChanged } from 'firebase/auth'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import userCtx from '$lib/contexts/userCtx'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import sessionStore from '$lib/stores/session.svelte'
	import themeStore from '$lib/stores/theme.svelte'
	import { FolderStore } from '$lib/stores/folders.svelte'
	import { UserStore } from '$lib/stores/user.svelte'

	let { children, data } = $props()
	const toaster = createToaster({
		placement: 'bottom-end',
		max: 5,
	})
	const userStore = new UserStore()
	const folderStore = new FolderStore()
	toasterCtx.setCtx(toaster)
	userCtx.setCtx(userStore)
	foldersCtx.setCtx(folderStore)

	$effect.pre(() => routeGuard(data.pathname))
	$effect.pre(() => {
		const authStateSub = onAuthStateChanged(auth, (user) => {
			if (user) {
				sessionStore.user = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				}
			} else {
				sessionStore.signOut()
				userStore.user = undefined
			}
		})
		return () => authStateSub()
	})
	themeStore.isLight()
</script>

<Toaster {toaster} />
<div class="mx-auto flex max-w-9/10 flex-col justify-center sm:max-w-xl">
	{@render children()}
</div>
