<script lang="ts">
	import { FolderPlus } from '@lucide/svelte'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import Placeholder from '#lib/components/Placeholder.svelte'
	import EmptyState from '#lib/components/EmptyState.svelte'
	import FolderChip from '#lib/components/FolderChip.svelte'

	const folderStore = foldersCtx.getCtx()
	// 'all' is synthetic, not a folder
	const folders = $derived(folderStore.folders.filter((f) => f.id !== 'all'))
</script>

<div class="flex items-baseline justify-between px-4 pt-2 pb-1">
	<h1 class="text-2xl leading-[30px] font-extrabold tracking-[-0.015em]">Folders</h1>
	{#if !folderStore.loading}
		<span class="text-ink-muted text-xs leading-4 font-semibold tracking-[0.02em] uppercase">
			{folders.length} of 10
		</span>
	{/if}
</div>

{#if folderStore.loading}
	<div class="px-4"><Placeholder variant="row" repeat={4} /></div>
{:else if folders.length === 0}
	<EmptyState
		Icon={FolderPlus}
		title="No folders yet"
		hint="Name one in the bar below to start grouping your links."
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
