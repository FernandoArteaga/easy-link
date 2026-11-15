<script lang="ts">
	import { untrack } from 'svelte'
	import type { FirestoreError } from 'firebase/firestore'
	import { Pencil, Trash2, Folder } from '@lucide/svelte'
	import { deleteFolder, restoreFolder, updateFolder } from '#lib/firestore/folders.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import IconButton from '#lib/components/IconButton.svelte'
	import InputField from '#lib/components/InputField.svelte'
	import Sheet from '#lib/components/Sheet.svelte'

	type Props = {
		folder: Firestore.Doc<Firestore.Folder>
	}
	let { folder }: Props = $props()
	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const formId = $derived(`rename-folder-${folder.id}`)
	let isOpen = $state(false)
	let inputValue = $state('')
	// Prefill on every open, so a cancelled rename isn't kept for next time
	$effect.pre(() => {
		if (isOpen) untrack(() => (inputValue = folder.name))
	})

	const showError = (error: unknown) => {
		toast.create({
			description: handleErrorMessages(error as FirestoreError),
			type: 'error',
		})
	}

	const submitRename = async (e: SubmitEvent) => {
		e.preventDefault()
		const folderName = inputValue.trim()
		if (folderName.length < 2 || folderName.length > 36) return
		try {
			await updateFolder(userStore.session!.uid, folder.id, {
				name: folderName,
			})
			isOpen = false
		} catch (error) {
			showError(error)
		}
	}

	async function removeFolder() {
		const uid = userStore.session!.uid
		const deleted = { ...folder }
		try {
			if (!(await deleteFolder(uid, folder.id))) return
			toast.create({
				description: 'Folder deleted',
				type: 'info',
				action: {
					label: 'Undo',
					onClick: () => {
						restoreFolder(uid, deleted).catch(showError)
					},
				},
			})
		} catch (error) {
			showError(error)
		}
	}
</script>

<div class="flex min-h-15 items-center gap-3 pr-2 pl-4">
	<span class="min-w-0 flex-1 truncate text-[15px] leading-5 font-bold">{folder.name}</span>
	<IconButton Icon={Pencil} label={`Rename ${folder.name}`} onclick={() => (isOpen = true)} />
	<IconButton
		Icon={Trash2}
		label={`Delete ${folder.name}`}
		variant="danger"
		onclick={removeFolder}
	/>
</div>

<Sheet bind:isOpen title="Rename folder" confirmLabel="Save" confirmFormId={formId}>
	<form id={formId} onsubmit={submitRename}>
		<InputField
			id={`folder-name-${folder.id}`}
			label="Folder name"
			type="text"
			name={folder.id}
			bind:value={inputValue}
			attr={{ required: true, minlength: 2, maxlength: 36, spellcheck: 'false' }}
		>
			{#snippet icon()}
				<Folder size={20} class="flex-none" aria-hidden="true" />
			{/snippet}
		</InputField>
	</form>
</Sheet>
