<script lang="ts">
	import { Copy, ExternalLink, OctagonX } from 'lucide-svelte'
	import { isValidLink } from '$lib/utils/utils'
	import { deleteLink } from '$lib/firestore/links'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import sessionStore from '$lib/stores/session.svelte'
	import ButtonInline from '$lib/components/ButtonInline.svelte'

	type Props = {
		link: Firestore.Doc<Firestore.Link>
	}
	let { link }: Props = $props()
	const toast = toasterCtx.getCtx()

	async function setClipboard(text: string) {
		await navigator.clipboard.writeText(text)
		toast.create({
			description: 'Link copied to clipboard',
			type: 'info',
		})
	}

	async function removeLink() {
		try {
			await deleteLink(sessionStore.user!.uid, link.id)
		} catch (error) {
			toast.create({
				title: 'Error deleting link',
				description: handleErrorMessages(error),
				type: 'error',
			})
		}
		toast.create({
			description: 'Link deleted',
			type: 'info',
		})
	}
</script>

<div class="flex">
	<ButtonInline Icon={OctagonX} onclick={removeLink} start />
	<div class="border-surface-800 max-h-19 min-h-9.5 flex-1 overflow-x-auto border px-4 py-1.5">
		{link.url}
	</div>
	{#if isValidLink(link.url)}
		<ButtonInline Icon={ExternalLink} href={link.url} external />
	{/if}
	<ButtonInline Icon={Copy} onclick={() => setClipboard(link.url)} end />
</div>
