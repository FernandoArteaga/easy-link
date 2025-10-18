<script lang="ts">
	import '../app.css'
	import { Toaster, createToaster } from '@skeletonlabs/skeleton-svelte'
	import { goto } from '$app/navigation'
	import { routeGuard } from '$lib/guard'
	import { auth } from '$lib/firebase'
	import type { AuthError } from 'firebase/auth'
	import type { FirestoreError } from 'firebase/firestore'
	import { onSnapshot, orderBy, query } from 'firebase/firestore'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import { folderCollection } from '$lib/firestore/folders'
	import { onAuthStateChanged, signOut } from 'firebase/auth'
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

	const handleError = (error: AuthError | FirestoreError) => {
		console.log('Error occurred:', error)
		toaster.create({
			title: 'Error',
			description: handleErrorMessages(error),
			type: 'error',
		})
		if (error.code === 'permission-denied') {
			signOut(auth)
				.then(() => {
					goto('/login')
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}

	$effect.pre(() => routeGuard(data.pathname))
	$effect.pre(() => {
		let getFoldersSub = () => {}
		const authStateSub = onAuthStateChanged(auth, (user) => {
			if (user) {
				sessionStore.user = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				}
				getFoldersSub = onSnapshot(
					query(folderCollection(user.uid), orderBy('nameLower', 'asc')),
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
					(error) => handleError(error)
				)
			} else {
				getFoldersSub()
				sessionStore.signOut()
				userStore.user = undefined
			}
		})

		return () => {
			authStateSub()
			getFoldersSub()
		}
	})
	themeStore.isLight()
</script>

<Toaster {toaster} />
<div class="mx-auto flex max-w-9/10 flex-col justify-center sm:max-w-xl">
	{@render children()}
</div>
