<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { FirestoreError } from 'firebase/firestore'
	import { Pencil, OctagonX, Folder } from 'lucide-svelte'
	import { deleteFolder, updateFolder } from '$lib/firestore/folders'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import userCtx from '$lib/contexts/userCtx'
	import ButtonInline from '$lib/components/ButtonInline.svelte'
	import InputField from '$lib/components/InputField.svelte'
	import Modal from '$lib/components/Modal.svelte'

	type Props = {
		folder: Firestore.Doc<Firestore.Folder>
	}
	let { folder }: Props = $props()

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	let formId = 'update-folder'
	let isModalOpen = $state(false)
	let inputValue = $state(folder.name)

	const inputAttributes: HTMLInputAttributes = {
		autocomplete: 'off',
		spellcheck: 'false',
		minlength: 2,
		required: true,
	}

	const submitUpdateFolder = async () => {
		if (!inputValue) return
		const folderName = inputValue.trim()
		if (folderName.length < 2 || folderName.length > 36) return
		try {
			await updateFolder(userStore.session!.uid, folder.id, {
				name: folderName,
			})
			isModalOpen = false
		} catch (error) {
			toast.create({
				title: 'Error',
				description: handleErrorMessages(error as FirestoreError),
				type: 'error',
			})
		}
	}

	async function removeFolder() {
		try {
			await deleteFolder(userStore.session!.uid, folder.id)
		} catch (error) {
			toast.create({
				title: 'Error deleting folder',
				description: handleErrorMessages(error as FirestoreError),
				type: 'error',
			})
		}
		toast.create({
			description: 'Folder deleted',
			type: 'info',
		})
	}
</script>

<div class="flex">
	<ButtonInline Icon={OctagonX} onclick={removeFolder} start />
	<div class="border-surface-800 max-h-19 min-h-9.5 flex-1 overflow-x-auto border px-4 py-1.5">
		{folder.name}
	</div>
	<Modal
		bind:isOpen={isModalOpen}
		title="Update folder"
		description={`Modify the folder '${folder.name}'`}
		triggerClasses="flex w-full"
		confirmButtonFormId={formId}
	>
		{#snippet triggerContent()}
			<ButtonInline Icon={Pencil} end />
		{/snippet}

		{#snippet body()}
			<form id={formId} class="space-y-4" onsubmit={submitUpdateFolder}>
				<div>
					<label for="folderName" class="text-sm text-gray-700 dark:text-gray-300">
						Folder Name
					</label>
					<div class="mt-1">
						<InputField
							type="text"
							name={folder.id}
							placeholder="Update folder name"
							bind:value={inputValue}
							attr={inputAttributes}
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
</div>
