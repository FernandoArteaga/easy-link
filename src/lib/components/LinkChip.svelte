<script lang="ts">
	import { getContext } from 'svelte';
	import { Copy } from 'lucide-svelte';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

	type Props = {
		link: Firestore.Link;
	};
	let { link }: Props = $props();
	export const toast: ToastContext = getContext('toast');

	async function setClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		toast.create({
			description: 'Link copied to clipboard',
			type: 'info'
		});
	}
</script>

<div class="flex">
	<div class="border-surface-800 flex-1 overflow-x-auto rounded-l-md border px-4 py-1.5">
		{link.url}
	</div>
	<button
		class="preset-tonal-primary hover:preset-filled-primary-500 flex w-12 items-center justify-center rounded-r-md"
		onclick={() => setClipboard(link.url)}
	>
		<Copy size={16} />
	</button>
</div>
