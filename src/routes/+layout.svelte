<script lang="ts">
	import '../app.css'
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte'
	import { routeGuard } from '#lib/guard.ts'
	import { auth } from '#lib/firebase.ts'
	import { onAuthStateChanged } from 'firebase/auth'
	import { Check, LoaderCircle, X } from '@lucide/svelte'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import themeStore from '#lib/stores/theme.svelte.ts'
	import { FolderStore } from '#lib/stores/folders.svelte.ts'
	import { UserStore } from '#lib/stores/user.svelte.ts'
	import { updateUserLastLogin } from '#lib/firestore/users.ts'

	let { children, data } = $props()
	const toaster = createToaster({
		placement: 'bottom',
		// Sit above the docked add bar
		offsets: { bottom: '96px', top: '16px', left: '16px', right: '16px' },
		max: 3,
	})
	const userStore = new UserStore()
	const folderStore = new FolderStore()
	toasterCtx.setCtx(toaster)
	userCtx.setCtx(userStore)
	foldersCtx.setCtx(folderStore)

	$effect.pre(() => routeGuard(data.pathname, userStore.isSignedIn, userStore.authReady))
	$effect.pre(() => {
		const authStateSub = onAuthStateChanged(auth, async (user) => {
			if (user) {
				userStore.session = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				}
			} else {
				userStore.signOut()
			}
			// Set after the session so the guard never sees "ready but signed out" for a signed-in user
			userStore.authReady = true
			if (user) await updateUserLastLogin(user.uid)
		})
		return () => authStateSub()
	})
	themeStore.isLight()
</script>

<div class="max-w-content mx-auto flex min-h-svh flex-col">
	{#if userStore.authReady}
		{@render children()}
	{:else}
		<div class="flex h-svh items-center justify-center" role="status" aria-label="Loading">
			<LoaderCircle class="text-violet-text size-8 animate-spin" />
		</div>
	{/if}
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast
			{toast}
			class="bg-toast-bg text-toast-ink shadow-float flex min-h-12 w-max max-w-[calc(100vw-32px)] items-center gap-3 rounded-full py-1.5 pr-1.5 pl-4 text-sm leading-[18px] font-semibold"
		>
			<span
				class="grid size-6 flex-none place-items-center rounded-full {toast.type === 'error'
					? 'bg-danger text-on-danger'
					: 'bg-mint text-on-mint'}"
				aria-hidden="true"
			>
				{#if toast.type === 'error'}
					<X size={14} strokeWidth={3} />
				{:else}
					<Check size={14} strokeWidth={3} />
				{/if}
			</span>
			<Toast.Message class="min-w-0 flex-1 py-2 pr-2">
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			{#if toast.action}
				<Toast.ActionTrigger
					class="h-9 flex-none rounded-full px-3 font-extrabold underline underline-offset-3"
				>
					{toast.action.label}
				</Toast.ActionTrigger>
			{/if}
		</Toast>
	{/snippet}
</Toast.Group>
