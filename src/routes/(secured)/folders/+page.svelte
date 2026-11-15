<script lang="ts">
	import type { FirestoreError } from 'firebase/firestore'
	import { Folder, FolderPlus } from '@lucide/svelte'
	import { createFolder } from '#lib/firestore/folders.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import AddBar from '#lib/components/AddBar.svelte'
	import Placeholder from '#lib/components/Placeholder.svelte'
	import EmptyState from '#lib/components/EmptyState.svelte'
	import FolderChip from '#lib/components/FolderChip.svelte'

	const folderStore = foldersCtx.getCtx()
	const userStore = userCtx.getCtx()
	const toast = toasterCtx.getCtx()
	let inputFolder: string | undefined = $state(undefined)
	// 'all' is synthetic, not a folder
	const folders = $derived(folderStore.folders.filter((f) => f.id !== 'all'))

	const submitFolder = async () => {
		if (!inputFolder) return
		const name = inputFolder.trim()
		if (name.length < 2 || name.length > 36) return
		try {
			await createFolder(userStore.session!.uid, { name })
			inputFolder = undefined
		} catch (error) {
			toast.create({ description: handleErrorMessages(error as FirestoreError), type: 'error' })
		}
	}
</script>

<div class="flex items-baseline justify-between px-4 pt-2 pb-1">
	<h1 class="text-2xl leading-[30px] font-extrabold tracking-[-0.015em]">Folders</h1>
	{#if !folderStore.loading}
		<span class="text-ink-muted text-xs leading-4 font-semibold tracking-[0.02em] uppercase">
			{folders.length} of 10
		</span>
	{/if}
</div>

{#if !folderStore.loading}
	<div class="px-4">
		{#if userStore.canCreateFolder}
			<AddBar
				placeholder="New folder name"
				submitLabel="Create folder"
				bind:value={inputFolder}
				onsubmit={submitFolder}
				Icon={Folder}
				attr={{
					autocomplete: 'off',
					spellcheck: 'false',
					minlength: 2,
					maxlength: 36,
					required: true,
				}}
			/>
		{:else}
			<p class="text-ink-muted py-2 text-sm font-medium">You’ve reached the limit of 10 folders.</p>
		{/if}
	</div>
{/if}

{#if folderStore.loading}
	<div class="px-4"><Placeholder variant="row" repeat={4} /></div>
{:else if folders.length === 0}
	<EmptyState
		Icon={FolderPlus}
		title="No folders yet"
		hint="Name one in the bar above to start grouping your links."
	/>
{:else}
	<ul
		class="bg-surface shadow-card border-card-border divide-line mx-4 divide-y overflow-hidden rounded-lg border"
	>
		{#each folders as folder (folder.id)}
			<li><FolderChip {folder} /></li>
		{/each}
	</ul>
{/if}
