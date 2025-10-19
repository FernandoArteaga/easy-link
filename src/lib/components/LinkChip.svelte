<script lang="ts">
	import type { FirestoreError } from 'firebase/firestore'
	import { Copy, ExternalLink, FolderPlus, OctagonX } from 'lucide-svelte'
	import { isValidLink } from '$lib/utils/utils'
	import { deleteLink, updateLink } from '$lib/firestore/links'
	import { handleErrorMessages } from '$lib/firestore/errors'
	import toasterCtx from '$lib/contexts/toasterCtx'
	import foldersCtx from '$lib/contexts/foldersCtx'
	import userCtx from '$lib/contexts/userCtx'
	import ButtonInline from '$lib/components/ButtonInline.svelte'
	import Modal from '$lib/components/Modal.svelte'

	type Props = {
		link: Firestore.Doc<Firestore.Link>
	}
	let { link }: Props = $props()
	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()
	const formId = 'assign-link-to-folder'
	let isModalOpen = $state(false)
	let inputFolder: string = $state(link.folderId || 'all')

	async function setClipboard(text: string) {
		await navigator.clipboard.writeText(text)
		toast.create({
			description: 'Link copied to clipboard',
			type: 'info',
		})
	}

	const assignLink = async () => {
		try {
			await updateLink(userStore.session!.uid, link.id, {
				folderId: inputFolder,
			})
			isModalOpen = false
			inputFolder = 'all'
			toast.create({
				description: 'Link assigned to folder',
				type: 'info',
			})
		} catch (error) {
			toast.create({
				title: 'Error',
				description: handleErrorMessages(error as FirestoreError),
				type: 'error',
			})
		}
	}

	async function removeLink() {
		try {
			await deleteLink(userStore.session!.uid, link.id)
		} catch (error) {
			toast.create({
				title: 'Error deleting link',
				description: handleErrorMessages(error as FirestoreError),
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
	{#if folderStore.assigningLinks}
		{@render linkUrl()}
		<Modal
			bind:isOpen={isModalOpen}
			title="Organize Link"
			description="Save this link to a folder for better organization."
			triggerClasses="p-0 flex"
			confirmButtonFormId={formId}
		>
			{#snippet triggerContent()}
				<ButtonInline Icon={FolderPlus} end />
			{/snippet}

			{#snippet body()}
				<form
					id={formId}
					class="space-y-4"
					onsubmit={assignLink}
					onchange={(e) => {
						const target = e.target as HTMLInputElement
						inputFolder = target.value
					}}
				>
					{#each folderStore.folders as f (f.id)}
						{@render radio(f.name, f.id)}
					{/each}
				</form>
			{/snippet}
		</Modal>
	{:else}
		<ButtonInline Icon={OctagonX} onclick={removeLink} start />
		{@render linkUrl()}
		{#if isValidLink(link.url)}
			<ButtonInline Icon={ExternalLink} href={link.url} external />
		{/if}
		<ButtonInline Icon={Copy} onclick={() => setClipboard(link.url)} end />
	{/if}
</div>

{#snippet linkUrl()}
	<div class="border-surface-800 max-h-19 min-h-9.5 flex-1 overflow-x-auto border px-4 py-1.5">
		{link.url}
	</div>
{/snippet}

{#snippet radio(name: string, value: string)}
	{@const checked = link.folderId === value}
	<div class="flex items-center space-x-2">
		<input id={value} class="radio" type="radio" name="assign-link-folder" {value} {checked} />
		<label for={value}>{name}</label>
	</div>
{/snippet}
