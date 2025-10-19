<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { Folder, Link, Moon, Sun, House } from 'lucide-svelte'
	import type { AuthError } from 'firebase/auth'
	import { signOut } from 'firebase/auth'
	import type { FirestoreError } from 'firebase/firestore'
	import { onSnapshot, orderBy, query } from 'firebase/firestore'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { auth } from '$lib/firebase'
	import { userDoc } from '$lib/firestore/users'
	import { createLink } from '$lib/firestore/links'
	import { createFolder, folderCollection } from '$lib/firestore/folders'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import userCtx from '$lib/contexts/userCtx'
	import themeStore from '$lib/stores/theme.svelte'
	import QuickForm from '$lib/components/QuickForm.svelte'
	import Message from '$lib/components/Message.svelte'

	let { children, data } = $props()

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	let inputLink: string | undefined = $state(undefined)
	let inputFolder: string | undefined = $state(undefined)

	const signOutUser = () => {
		signOut(auth)
			.then(() => {
				userStore.signOut()
				goto(resolve('/login'))
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const handleError = (error: AuthError | FirestoreError, signOut = false) => {
		toast.create({
			title: 'Error',
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
				url: link.toLowerCase(),
			})
			inputLink = undefined
		} catch (error) {
			handleError(error as FirestoreError)
		}
	}

	const submitFolder = async () => {
		try {
			if (!inputFolder) return
			const folder = inputFolder.trim()
			if (folder.length < 2 || folder.length > 36) return
			await createFolder(userStore.session!.uid, {
				name: folder,
			})
			inputFolder = undefined
		} catch (error) {
			handleError(error as FirestoreError)
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

{#if userStore.session}
	<div class="bg-surface-50-950 sticky -top-4 z-10 pb-8">
		<nav class="flex w-full flex-row flex-wrap items-center justify-end space-x-2 py-8">
			<a href={resolve('/links')} class={navButton}>
				<House size={14} />
			</a>
			<button class={navButton} onclick={changeTheme}>
				{#if themeStore.isLight()}
					<Moon size={14} />
				{:else}
					<Sun size={14} />
				{/if}
			</button>
			<button type="button" class={navButton} onclick={signOutUser}> Sign out </button>
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
			{#if userStore.canCreateFolder}
				<QuickForm
					placeholder="Add folder"
					bind:value={inputFolder}
					submit={submitFolder}
					Icon={Folder}
					attr={{ ...inputAttributes, maxlength: 36 }}
				/>
			{:else}
				<Message>You’ve reached the maximum number of folders allowed.</Message>
			{/if}
		{/if}
	</div>

	{@render children()}
{/if}
