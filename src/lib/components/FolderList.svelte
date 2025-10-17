<script lang="ts">
	import { getContext } from 'svelte'
	import {
		collection,
		doc,
		onSnapshot,
		orderBy,
		query,
		runTransaction,
		increment,
	} from 'firebase/firestore'
	import { signOut } from 'firebase/auth'
	import { Folder, Folders, Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation'
	import { auth, firestore } from '$lib/firebase'
	import { folderCollection } from '$lib/firestore/folders'
	import { handleErrorMessages } from '$lib/firestore/authentication'
	import { userDoc } from '$lib/firestore/users'
	import sessionStore from '$lib/stores/session.svelte'
	import activeFolderCtx from '$lib/contexts/activeFolder'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import { concatClasses } from '$lib/utils/utils'
	import Modal from '$lib/components/Modal.svelte'
	import InputField from '$lib/components/InputField.svelte'
	import ButtonInline from '$lib/components/ButtonInline.svelte';

	const toast = getContext('toast')
	let formId = 'add-folder'
	let folders: Firestore.Doc<Firestore.Folder>[] = $state([
		{ id: 'all', name: 'All', nameLower: 'all' },
	])
	let userData: Firestore.User | undefined = $state()
	let loading = $state(true)
	let isCreateModalOpen = $state(false)
	let inputFolder: string | undefined = $state(undefined)
	const activeFolder = activeFolderCtx.getCtx()

	$effect.pre(() => {
		if (sessionStore.user === null) return
		const q = query(
			collection(firestore, 'users', sessionStore.user.uid, 'folders'),
			orderBy('nameLower', 'asc')
		)
		const getFoldersSub = onSnapshot(
			q,
			(snapshot) => {
				loading = false
				folders = snapshot.docs.map((doc) => {
					const data = doc.data()
					return {
						id: doc.id,
						name: data.name,
						nameLower: data.nameLower,
					}
				})
				folders.unshift({ id: 'all', name: 'All', nameLower: 'all' })
			},
			(error) => {
				toast.create({
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
		)
		const getUserSub = onSnapshot(userDoc(sessionStore.user.uid), (snapshot) => {
			userData = { ...snapshot.data() } as Firestore.Doc<Firestore.User>
		})
		return () => {
			getFoldersSub()
			getUserSub()
		}
	})

	const btnFolder = 'py-1 px-2 w-auto whitespace-nowrap border-b-2 hover:border-primary-500'
	const btnFolderActive = (folderId: string) =>
		folderId === activeFolder.uid ? 'border-secondary-500 font-medium' : 'border-transparent'

	const selectFolder = (folderId: string) => {
		activeFolder.uid = folderId
	}

	const submit = async () => {
		if (!inputFolder) return
		const folderName = inputFolder.trim()
		if (folderName.length < 2) return
		try {
			const userUid = sessionStore.user!.uid
			await runTransaction(firestore, async (transaction) => {
				transaction.update(userDoc(userUid), {
					totalFolders: increment(1),
				})
				transaction.set(doc(folderCollection(userUid)), {
					name: folderName,
					nameLower: folderName.toLowerCase(),
				})
			})
			inputFolder = undefined
			isCreateModalOpen = false
		} catch (error) {
			toast.create({
				title: 'Error',
				description: handleErrorMessages(error),
				type: 'error',
			})
		}
	}
</script>

{#if loading}
	<Placeholder repeat={4} horizontal />
{:else}
	<div class="flex flex-row">
		{#if userData && (userData.totalFolders === undefined || userData.totalFolders < 10)}
			<Modal
				bind:isOpen={isCreateModalOpen}
				title="Add folder"
				description="Create a folder to better organize your links"
				triggerClasses='p-0 flex'
				confirmButtonFormId={formId}
			>
				{#snippet triggerContent()}
					<ButtonInline
						Icon={Plus}
						start
					/>
				{/snippet}

				{#snippet body()}
					<form id={formId} class="space-y-4" onsubmit={submit}>
						<div>
							<label for="folderName" class="text-sm text-gray-700 dark:text-gray-300">
								Folder Name
							</label>
							<div class="mt-1">
								<InputField
									type="text"
									name="folderName"
									placeholder="e.g., Work, Personal"
									autocomplete="email"
									bind:value={inputFolder}
									constraints={{ required: true, minlength: 2 }}
								>
									{#snippet icon()}
										<Folder size={16} />
									{/snippet}
								</InputField>
							</div>
						</div>
					</form>
				{/snippet}
			</Modal>
		{/if}
		<div class="flex flex-row overflow-x-auto overflow-y-hidden px-2">
			{#each folders as f (f.id)}
				<button
					type="button"
					class={concatClasses(btnFolder, btnFolderActive(f.id))}
					onclick={() => selectFolder(f.id)}
				>
					{f.name}
				</button>
			{/each}
		</div>
		<ButtonInline
			Icon={Folders}
			end
		/>
	</div>
{/if}
