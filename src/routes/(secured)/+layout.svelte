<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { ArrowLeft, Folders, Link, LogOut, Moon, Sun } from '@lucide/svelte'
	import type { AuthError } from 'firebase/auth'
	import { signOut } from 'firebase/auth'
	import type { FirestoreError } from 'firebase/firestore'
	import { onSnapshot, orderBy, query } from 'firebase/firestore'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { auth } from '#lib/firebase.ts'
	import { userDoc } from '#lib/firestore/users.ts'
	import { createLink } from '#lib/firestore/links.ts'
	import { folderCollection } from '#lib/firestore/folders.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import themeStore from '#lib/stores/theme.svelte.ts'
	import AddBar from '#lib/components/AddBar.svelte'
	import IconButton from '#lib/components/IconButton.svelte'
	import { concatClasses, normalizeLink } from '#lib/utils/utils.ts'

	let { children, data } = $props()

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	let inputLink: string | undefined = $state(undefined)

	const signOutUser = () => {
		signOut(auth)
			.then(() => {
				userStore.signOut()
				goto(resolve('login'))
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const handleError = (error: AuthError | FirestoreError, signOut = false) => {
		toast.create({
			description: handleErrorMessages(error),
			type: 'error',
		})
		if (error.code === 'permission-denied' && signOut) {
			signOutUser()
		}
	}

	$effect.pre(() => {
		if (!userStore.isSignedIn) return
		const getUserSub = onSnapshot(userDoc(userStore.session!.uid), (snapshot) => {
			userStore.user = { ...snapshot.data() } as Firestore.Doc<Firestore.User>
		})
		const getFoldersSub = onSnapshot(
			query(folderCollection(userStore.session!.uid), orderBy('nameLower', 'asc')),
			(snapshot) => {
				folderStore.loading = false
				const folderSnapshot = snapshot.docs.map((doc) => {
					const data = doc.data()
					return {
						id: doc.id,
						name: data.name,
						nameLower: data.nameLower,
					}
				})
				folderStore.folders = [{ id: 'all', name: 'All', nameLower: 'all' }, ...folderSnapshot]
			},
			(error) => handleError(error, true)
		)
		return () => {
			getUserSub()
			getFoldersSub()
		}
	})

	const submitLink = async () => {
		try {
			if (!inputLink) return
			const link = inputLink.trim()
			if (link.length < 2) return
			await createLink(userStore.session!.uid, {
				url: normalizeLink(link),
			})
			inputLink = undefined
		} catch (error) {
			handleError(error as FirestoreError)
		}
	}

	const changeTheme = () => {
		themeStore.theme = themeStore.theme === 'light' ? 'dark' : 'light'
	}

	const inputAttributes: HTMLInputAttributes = {
		autocomplete: 'off',
		spellcheck: 'false',
		minlength: 2,
		required: true,
		// Not type="url": it would reject schemeless links and plain text, which save today
		inputmode: 'url',
		autocapitalize: 'off',
		autocorrect: 'off',
	}
</script>

{#if userStore.session}
	<header
		class={concatClasses(
			'h-bar flex items-center gap-1 pr-2',
			data.pathname === '/folders' ? 'pl-1' : 'pl-4'
		)}
	>
		{#if data.pathname === '/folders'}
			<IconButton Icon={ArrowLeft} label="Back to links" href="links" />
		{/if}
		<a
			href={resolve('links')}
			class="text-ink mr-auto flex items-center gap-2.5 rounded-md text-lg leading-none font-extrabold tracking-[-0.02em]"
		>
			<img src="/logo.png" alt="" class="size-7" />
			Easy Link
		</a>
		{#if data.pathname === '/links'}
			<IconButton Icon={Folders} label="Manage folders" href="folders" />
		{/if}
		<IconButton
			Icon={themeStore.isLight() ? Moon : Sun}
			label={themeStore.isLight() ? 'Switch to dark theme' : 'Switch to light theme'}
			onclick={changeTheme}
		/>
		<IconButton Icon={LogOut} label="Sign out" onclick={signOutUser} />
	</header>
	<main class="flex flex-1 flex-col gap-4 pt-2 pb-4">
		{@render children()}
	</main>
	{#if data.pathname === '/links'}
		<div
			class="from-bg sticky bottom-0 z-10 bg-linear-to-t from-70% to-transparent px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]"
		>
			<AddBar
				placeholder="Paste a link"
				submitLabel="Save link"
				bind:value={inputLink}
				onsubmit={submitLink}
				Icon={Link}
				attr={inputAttributes}
			/>
		</div>
	{/if}
{/if}
