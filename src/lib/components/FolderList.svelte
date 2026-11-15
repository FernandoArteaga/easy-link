<script lang="ts">
	import type { FirestoreError } from 'firebase/firestore'
	import { Folder, Plus } from '@lucide/svelte'
	import { createFolder } from '#lib/firestore/folders.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import { concatClasses } from '#lib/utils/utils.ts'
	import Placeholder from '#lib/components/Placeholder.svelte'
	import Sheet from '#lib/components/Sheet.svelte'
	import InputField from '#lib/components/InputField.svelte'

	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	const formId = 'add-folder'
	let isCreateOpen = $state(false)
	let inputFolder: string | undefined = $state(undefined)

	const chip =
		'inline-flex h-9 flex-none snap-start items-center gap-1.5 rounded-full px-3.5 text-sm leading-[18px] font-semibold whitespace-nowrap transition-colors'

	const submit = async (e: SubmitEvent) => {
		e.preventDefault()
		if (!inputFolder) return
		const folderName = inputFolder.trim()
		if (folderName.length < 2 || folderName.length > 36) return
		try {
			await createFolder(userStore.session!.uid, {
				name: folderName,
			})
			inputFolder = undefined
			isCreateOpen = false
		} catch (error) {
			toast.create({
				description: handleErrorMessages(error as FirestoreError),
				type: 'error',
			})
		}
	}
</script>

{#if folderStore.loading}
	<div class="px-4 py-1"><Placeholder variant="chip" repeat={4} /></div>
{:else}
	<div
		class="flex snap-x snap-proximity scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-1 [&::-webkit-scrollbar]:hidden"
		role="tablist"
		aria-label="Folders"
	>
		{#each folderStore.folders as f (f.id)}
			{@const active = f.id === folderStore.activeFolderId}
			<button
				type="button"
				role="tab"
				aria-selected={active}
				class={concatClasses(
					chip,
					active ? 'bg-violet text-on-violet' : 'bg-surface-2 text-ink hover:brightness-97'
				)}
				onclick={() => (folderStore.activeFolderId = f.id)}
			>
				{f.name}
			</button>
		{/each}
		{#if userStore.canCreateFolder}
			<button
				type="button"
				class={concatClasses(
					chip,
					'text-violet-text shadow-[inset_0_0_0_1.5px_var(--line-control)]'
				)}
				onclick={() => (isCreateOpen = true)}
			>
				<Plus size={16} aria-hidden="true" />
				New
			</button>
		{/if}
	</div>
	<Sheet
		bind:isOpen={isCreateOpen}
		title="New folder"
		description="Group the links you want to find together."
		confirmLabel="Create folder"
		confirmFormId={formId}
	>
		<form id={formId} onsubmit={submit}>
			<InputField
				id="new-folder-name"
				label="Folder name"
				type="text"
				name="folderName"
				placeholder="e.g. Work, Personal"
				bind:value={inputFolder}
				attr={{ required: true, minlength: 2, maxlength: 36, spellcheck: 'false' }}
			>
				{#snippet icon()}
					<Folder size={20} class="flex-none" aria-hidden="true" />
				{/snippet}
			</InputField>
		</form>
	</Sheet>
{/if}
