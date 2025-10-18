<script lang="ts">
	import LinkList from '$lib/components/LinkList.svelte'
	import FolderList from '$lib/components/FolderList.svelte'
</script>

<div class="pb-12">
	<div class="pb-8">
		<FolderList />
	</div>
	<div class="space-y-4 overflow-auto">
		<LinkList />
	</div>
</div>
