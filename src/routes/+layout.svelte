<script lang="ts">
	import '../app.css'
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte'
	import { routeGuard } from '#lib/guard.ts'
	import { auth } from '#lib/firebase.ts'
	import { onAuthStateChanged } from 'firebase/auth'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import themeStore from '#lib/stores/theme.svelte.ts'
	import { FolderStore } from '#lib/stores/folders.svelte.ts'
	import { UserStore } from '#lib/stores/user.svelte.ts'
	import { updateUserLastLogin } from '#lib/firestore/users.ts'

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

	$effect.pre(() => routeGuard(data.pathname, userStore.isSignedIn))
	$effect.pre(() => {
		const authStateSub = onAuthStateChanged(auth, async (user) => {
			if (user) {
				userStore.session = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				}
				await updateUserLastLogin(user.uid)
			} else {
				userStore.signOut()
			}
		})
		return () => authStateSub()
	})
	themeStore.isLight()
</script>

<div class="mx-auto flex max-w-9/10 flex-col justify-center sm:max-w-xl">
	{@render children()}
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title class="text-base font-bold">{toast.title}</Toast.Title>
				<Toast.Description class="text-sm">{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>
