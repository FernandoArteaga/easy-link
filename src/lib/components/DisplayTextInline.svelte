<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet
	}
	let { children }: Props = $props()
</script>

<div class="border-surface-800 max-h-19 min-h-9.5 grow overflow-x-auto border px-4 py-1.5">
	{@render children()}
</div>
