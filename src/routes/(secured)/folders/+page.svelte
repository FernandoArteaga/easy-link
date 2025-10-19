<script lang="ts">
	import foldersCtx from '$lib/contexts/foldersCtx'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import FolderChip from '$lib/components/FolderChip.svelte'

	const folderStore = foldersCtx.getCtx()
</script>

{#if folderStore.loading}
	<Placeholder repeat={4} />
{:else}
	<div class="space-y-4 overflow-auto">
		{#each folderStore.folders as folder (folder.id)}
			<FolderChip {folder} />
		{/each}
	</div>
{/if}
