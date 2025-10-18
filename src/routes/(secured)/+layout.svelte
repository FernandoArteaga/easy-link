<script lang="ts">
	import { getContext } from 'svelte'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { Folder, Link, Moon, Sun, House } from 'lucide-svelte'
	import { signOut } from 'firebase/auth'
	import { onSnapshot } from 'firebase/firestore'
	import { goto } from '$app/navigation'
	import { auth } from '$lib/firebase'
	import { userDoc } from '$lib/firestore/users'
	import { createLink } from '$lib/firestore/links'
	import { createFolder } from '$lib/firestore/folders'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import userDataCtx from '$lib/contexts/userData'
	import sessionStore from '$lib/stores/session.svelte'
	import themeStore from '$lib/stores/theme.svelte'
	import QuickForm from '$lib/components/QuickForm.svelte'

	let { children, data } = $props()

	const toast = getContext('toast')
	const userData = userDataCtx.getCtx()
	let inputLink: string | undefined = $state(undefined)
	let inputFolder: string | undefined = $state(undefined)

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const getUserSub = onSnapshot(userDoc(sessionStore.user.uid), (snapshot) => {
			userData.user = { ...snapshot.data() } as Firestore.Doc<Firestore.User>
		})
		return () => getUserSub()
	})

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				sessionStore.signOut()
				goto('/login')
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const submitLink = async () => {
		try {
			if (!inputLink) return
			const link = inputLink.trim()
			if (link.length < 2) return
			await createLink(sessionStore.user!.uid, {
				url: link.toLowerCase(),
			})
			inputLink = undefined
		} catch (error) {
			toast.create({
				title: 'Error',
				description: handleErrorMessages(error),
				type: 'error',
			})
		}
	}

	const submitFolder = async () => {
		try {
			if (!inputFolder) return
			const folder = inputFolder.trim()
			if (folder.length < 2 || folder.length > 36) return
			await createFolder(sessionStore.user!.uid, {
				name: folder,
			})
			inputFolder = undefined
		} catch (error) {
			toast.create({
				title: 'Error',
				description: handleErrorMessages(error),
				type: 'error',
			})
		}
	}

	const changeTheme = () => {
		themeStore.theme = themeStore.theme === 'light' ? 'dark' : 'light'
	}

	const navButton = 'btn btn-sm preset-filled w-fit min-w-20 h-6'
	const inputAttributes: HTMLInputAttributes = {
		autocomplete: 'off',
		spellcheck: 'false',
		minlength: 2,
		required: true,
	}
</script>

{#if sessionStore.user}
	<div class="bg-surface-50-950 sticky -top-4 z-10 pb-8">
		<nav class="flex w-full flex-row flex-wrap items-center justify-end space-x-2 py-8">
			<a href="/links" class={navButton}>
				<House size={14} />
			</a>
			<button class={navButton} onclick={changeTheme}>
				{#if themeStore.isLight()}
					<Moon size={14} />
				{:else}
					<Sun size={14} />
				{/if}
			</button>
			<button type="button" class={navButton} onclick={handleLogout}> Sign out </button>
		</nav>

		{#if data.pathname === '/links'}
			<QuickForm
				placeholder="Add link"
				bind:value={inputLink}
				submit={submitLink}
				Icon={Link}
				attr={inputAttributes}
			/>
		{:else if data.pathname === '/folders'}
			{#if userData.canCreateFolder}
				<QuickForm
					placeholder="Add folder"
					bind:value={inputFolder}
					submit={submitFolder}
					Icon={Folder}
					attr={{ ...inputAttributes, maxlength: 36 }}
				/>
			{:else}
				<div class="text-center text-sm text-gray-500 dark:text-gray-400">
					You’ve reached the maximum number of folders allowed.
				</div>
			{/if}
		{/if}
	</div>

	{@render children()}
{/if}
