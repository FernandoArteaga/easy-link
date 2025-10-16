<script lang="ts">
	import { getContext } from 'svelte'
	import { Copy, ExternalLink, OctagonX } from 'lucide-svelte'
	import { concatClasses, isValidLink } from '$lib/utils/utils'
	import { deleteLink } from '$lib/firestore/links'
	import sessionStore from '$lib/stores/session.svelte'
	import { btnPrimary } from '$lib/utils/styles'

	type Props = {
		link: Firestore.Doc<Firestore.Link>
	}
	let { link }: Props = $props()
	const toast = getContext('toast')

	async function setClipboard(text: string) {
		await navigator.clipboard.writeText(text)
		toast.create({
			description: 'Link copied to clipboard',
			type: 'info',
		})
	}

	async function removeLink() {
		await deleteLink(sessionStore.user!.uid, link.id)
		toast.create({
			description: 'Link deleted',
			type: 'info',
		})
	}
</script>

<div class="flex">
	<button class={concatClasses(btnPrimary, 'w-12 rounded-l-md')} onclick={removeLink}>
		<OctagonX size={16} />
	</button>
	<div class="border-surface-800 max-h-19 min-h-9.5 flex-1 overflow-x-auto border px-4 py-1.5">
		{link.url}
	</div>
	{#if isValidLink(link.url)}
		<a
			href={link.url}
			target="_blank"
			rel="noopener noreferrer"
			class={concatClasses(btnPrimary, 'w-12')}
		>
			<ExternalLink size={16} />
		</a>
	{/if}
	<button
		class={concatClasses(btnPrimary, 'w-12 rounded-r-md')}
		onclick={() => setClipboard(link.url)}
	>
		<Copy size={16} />
	</button>
</div>
