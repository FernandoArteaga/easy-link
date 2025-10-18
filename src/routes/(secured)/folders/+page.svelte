<script lang="ts">
	import foldersCtx from '$lib/contexts/foldersCtx'
	import Placeholder from '$lib/components/Placeholder.svelte'
	import FolderChip from '$lib/components/FolderChip.svelte'

	const foldersContext = foldersCtx.getCtx()
</script>

{#if foldersContext.loading}
	<Placeholder repeat={4} />
{:else}
	<div class="space-y-4 overflow-auto">
		{#each foldersContext.folders as folder (folder.id)}
			<FolderChip {folder} />
		{/each}
	</div>
{/if}
