<script lang="ts">
	import { Folder, Folders, FolderTree, Plus, Check } from 'lucide-svelte'
	import { createFolder } from '$lib/firestore/folders'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import sessionStore from '$lib/stores/session.svelte'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import userCtx from '$lib/contexts/userCtx'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import { concatClasses } from '$lib/utils/utils'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import Modal from '$lib/components/Modal.svelte'
	import InputField from '$lib/components/InputField.svelte'
	import ButtonInline from '$lib/components/ButtonInline.svelte'
	import Message from '$lib/components/Message.svelte';

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	const formId = 'add-folder'
	let isCreateModalOpen = $state(false)
	let inputFolder: string | undefined = $state(undefined)

	const btnFolder = 'py-1 px-2 w-auto whitespace-nowrap border-b-2 hover:border-primary-500'
	const btnFolderActive = (folderId: string) =>
		folderId === folderStore.activeFolderId
			? 'border-secondary-500 font-medium'
			: 'border-transparent'

	const selectFolder = (folderId: string) => {
		folderStore.activeFolderId = folderId
	}
	const toggleAssigningLinks = () => {
		folderStore.assigningLinks = !folderStore.assigningLinks
	}

	const submit = async () => {
		if (!inputFolder) return
		const folderName = inputFolder.trim()
		if (folderName.length < 2 || folderName.length > 36) return
		try {
			await createFolder(sessionStore.user!.uid, {
				name: folderName,
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

{#if folderStore.loading}
	<Placeholder repeat={4} horizontal />
{:else}
	<div class="flex flex-row">
		{#if userStore.canCreateFolder}
			<Modal
				bind:isOpen={isCreateModalOpen}
				title="Add folder"
				description="Create a folder to better organize your links"
				triggerClasses="p-0 flex"
				confirmButtonFormId={formId}
			>
				{#snippet triggerContent()}
					<ButtonInline Icon={Plus} start />
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
									attr={{ required: true, minlength: 2, maxlength: 36 }}
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
			{#each folderStore.folders as f (f.id)}
				<button
					type="button"
					class={concatClasses(btnFolder, btnFolderActive(f.id))}
					onclick={() => selectFolder(f.id)}
				>
					{f.name}
				</button>
			{/each}
		</div>
		{#if folderStore.assigningLinks}
			<ButtonInline Icon={Check} onclick={toggleAssigningLinks} />
		{:else}
			<ButtonInline Icon={FolderTree} onclick={toggleAssigningLinks} />
		{/if}
		<ButtonInline Icon={Folders} href="/folders" end />
	</div>
	{#if folderStore.assigningLinks}
		<Message extraClasses="mt-4">
			Click on a link to assign it to a folder.
		</Message>
	{/if}
{/if}
