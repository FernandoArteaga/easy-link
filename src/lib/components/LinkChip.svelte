<script lang="ts">
	import { getContext } from 'svelte';
	import { Copy, ExternalLink, Delete } from 'lucide-svelte';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';
	import { concatClasses } from '$lib/utils/utils';
	import { deleteLink } from '$lib/firestore/links';
	import sessionStore from '$lib/stores/session.svelte';

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

	async function removeLink() {
		await deleteLink(sessionStore.user!.uid, link.id)
		toast.create({
			description: 'Link deleted',
			type: 'info'
		});
	}

	let btnStyle = 'preset-tonal-primary hover:preset-filled-primary-500 flex w-12 items-center justify-center';
</script>

<div class="flex">
	<button
		class={concatClasses(btnStyle, 'rounded-l-md')}
		onclick={removeLink}
	>
		<Delete size={16} />
	</button>
	<div class="border-surface-800 flex-1 overflow-x-auto border px-4 py-1.5">
		{link.url}
	</div>
	<a
		href={link.url} target="_blank" rel="noopener noreferrer" class={btnStyle}>
		<ExternalLink size={16} />
	</a>
	<button
		class={concatClasses(btnStyle, 'rounded-r-md')}
		onclick={() => setClipboard(link.url)}
	>
		<Copy size={16} />
	</button>
</div>
