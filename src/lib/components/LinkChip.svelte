<script lang="ts">
	import { untrack } from 'svelte'
	import type { FirestoreError } from 'firebase/firestore'
	import {
		Copy,
		EllipsisVertical,
		ExternalLink,
		Folder,
		FolderInput,
		Pencil,
		Trash2,
		X,
	} from '@lucide/svelte'
	import { isValidLink, isValidUrl, splitLink } from '#lib/utils/utils.ts'
	import { deleteLink, restoreLink, updateLink, updateLinkTitle } from '#lib/firestore/links.ts'
	import { handleErrorMessages } from '#lib/firestore/errors.ts'
	import toasterCtx from '#lib/contexts/toasterCtx.ts'
	import foldersCtx from '#lib/contexts/foldersCtx.ts'
	import userCtx from '#lib/contexts/userCtx.ts'
	import IconButton from '#lib/components/IconButton.svelte'
	import InputField from '#lib/components/InputField.svelte'
	import Sheet from '#lib/components/Sheet.svelte'

	type Props = {
		link: Firestore.Doc<Firestore.Link>
	}
	let { link }: Props = $props()
	const toast = toasterCtx.getCtx()
	const userStore = userCtx.getCtx()
	const folderStore = foldersCtx.getCtx()

	const parts = $derived(splitLink(link.url))
	const title = $derived(link.title?.trim() || undefined)
	const canOpen = $derived(isValidLink(link.url))
	// Schemeless links ("example.com/x") would resolve relative to the app without a scheme
	const href = $derived(isValidUrl(link.url) ? link.url : `https://${link.url}`)
	const folderName = $derived(
		folderStore.activeFolderId === 'all' && link.folderId
			? folderStore.folders.find((f) => f.id === link.folderId)?.name
			: undefined
	)

	const moveFormId = $derived(`move-${link.id}`)
	const titleFormId = $derived(`title-${link.id}`)
	let isOpen = $state(false)
	let view = $state<'menu' | 'move' | 'title'>('menu')
	let inputFolder = $state('all')
	let inputTitle = $state('')
	let titleInput: HTMLInputElement | undefined = $state(undefined)

	// Each time the sheet opens: back to the menu, inputs reset so a cancelled edit isn't saved later.
	// untrack: a live update of this link while the sheet is open must not reset what the user is doing.
	$effect.pre(() => {
		if (!isOpen) return
		untrack(() => {
			view = 'menu'
			inputFolder = link.folderId ?? 'all'
			inputTitle = link.title ?? ''
		})
	})
	$effect(() => {
		if (view === 'title') titleInput?.focus()
	})

	const showError = (error: unknown) => {
		toast.create({
			description: handleErrorMessages(error as FirestoreError),
			type: 'error',
		})
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(link.url)
			isOpen = false
			toast.create({ description: 'Link copied', type: 'info' })
		} catch {
			toast.create({ description: 'Couldn’t copy the link.', type: 'error' })
		}
	}

	async function move(e: SubmitEvent) {
		e.preventDefault()
		const folderId = inputFolder === 'all' ? undefined : inputFolder
		try {
			// 'all' is client-only: remove the field instead of writing it
			await updateLink(userStore.session!.uid, link.id, { folderId })
			isOpen = false
			const name = folderStore.folders.find((f) => f.id === folderId)?.name
			toast.create({
				description: name ? `Moved to ${name}` : 'Removed from folder',
				type: 'info',
			})
		} catch (error) {
			showError(error)
		}
	}

	async function saveTitle(e: SubmitEvent) {
		e.preventDefault()
		const trimmed = inputTitle.trim()
		try {
			await updateLinkTitle(userStore.session!.uid, link.id, trimmed)
			isOpen = false
			toast.create({ description: trimmed ? 'Title saved' : 'Title removed', type: 'info' })
		} catch (error) {
			showError(error)
		}
	}

	async function remove() {
		const uid = userStore.session!.uid
		const deleted = { ...link }
		isOpen = false
		try {
			await deleteLink(uid, link.id)
			toast.create({
				description: 'Link deleted',
				type: 'info',
				action: {
					label: 'Undo',
					onClick: () => {
						restoreLink(uid, deleted).catch(showError)
					},
				},
			})
		} catch (error) {
			showError(error)
		}
	}

	const sheet = $derived(
		view === 'move'
			? {
					title: 'Move to folder',
					description: title ?? parts.display,
					confirmLabel: 'Move',
					formId: moveFormId,
				}
			: view === 'title'
				? {
						title: link.title ? 'Edit title' : 'Add title',
						description: parts.display,
						confirmLabel: 'Save title',
						formId: titleFormId,
					}
				: {
						title: 'Link actions',
						description: undefined,
						confirmLabel: undefined,
						formId: undefined,
					}
	)

	const menuItem =
		'flex min-h-13 w-full items-center gap-3 rounded-md px-3 text-left text-[15px] leading-5 font-semibold'
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- links open saved, external URLs -->
<div
	class="bg-surface shadow-card border-card-border flex min-w-0 items-center gap-3 rounded-lg border py-3 pr-2 pl-3"
>
	{@render tile()}
	{#if canOpen}
		<a
			class="flex min-w-0 flex-1 flex-col gap-0.5"
			{href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{@render lines()}
		</a>
	{:else}
		<button type="button" class="flex min-w-0 flex-1 flex-col gap-0.5 text-left" onclick={copy}>
			{@render lines()}
		</button>
	{/if}
	<div class="flex flex-none items-center">
		<IconButton Icon={Copy} label="Copy link" onclick={copy} />
		<IconButton Icon={EllipsisVertical} label="More actions" onclick={() => (isOpen = true)} />
	</div>
</div>

<Sheet
	bind:isOpen
	title={sheet.title}
	description={sheet.description}
	titleHidden={view === 'menu'}
	header={view === 'menu' ? menuHeader : undefined}
	confirmLabel={sheet.confirmLabel}
	confirmFormId={sheet.formId}
	showCancel={view !== 'menu'}
>
	{#if view === 'menu'}
		<div class="flex flex-col">
			{#if canOpen}
				<a
					class={`${menuItem} text-ink hover:bg-surface-2`}
					{href}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => (isOpen = false)}
				>
					<ExternalLink size={18} class="text-ink-muted" aria-hidden="true" />
					Open
				</a>
			{/if}
			<button type="button" class={`${menuItem} text-ink hover:bg-surface-2`} onclick={copy}>
				<Copy size={18} class="text-ink-muted" aria-hidden="true" />
				Copy
			</button>
			<button
				type="button"
				class={`${menuItem} text-ink hover:bg-surface-2`}
				onclick={() => (view = 'title')}
			>
				<Pencil size={18} class="text-ink-muted" aria-hidden="true" />
				{title ? 'Edit title' : 'Add title'}
			</button>
			<button
				type="button"
				class={`${menuItem} text-ink hover:bg-surface-2`}
				onclick={() => (view = 'move')}
			>
				<FolderInput size={18} class="text-ink-muted" aria-hidden="true" />
				Move to folder
			</button>
			<button type="button" class={`${menuItem} text-danger hover:bg-danger-soft`} onclick={remove}>
				<Trash2 size={18} aria-hidden="true" />
				Delete
			</button>
		</div>
	{:else if view === 'move'}
		<form id={moveFormId} class="flex flex-col gap-1" onsubmit={move}>
			{#each folderStore.folders as f (f.id)}
				<label
					class="has-checked:bg-violet-soft has-checked:text-violet-text hover:bg-surface-2 flex min-h-13 cursor-pointer items-center gap-3 rounded-md px-3 text-[15px] leading-5 font-semibold"
				>
					<input
						type="radio"
						name={moveFormId}
						value={f.id}
						bind:group={inputFolder}
						class="border-line-control checked:border-violet size-[22px] flex-none appearance-none rounded-full border-2 checked:bg-[radial-gradient(circle,var(--violet-600)_0_5px,transparent_6px)]"
					/>
					{f.id === 'all' ? 'All (no folder)' : f.name}
				</label>
			{/each}
		</form>
	{:else}
		<form id={titleFormId} onsubmit={saveTitle}>
			<InputField
				id={`title-input-${link.id}`}
				label="Title"
				optional
				hint="Leave empty to show the link instead."
				name="title"
				type="text"
				bind:value={inputTitle}
				bind:input={titleInput}
				attr={{ maxlength: 80 }}
			>
				{#snippet trailing()}
					{#if inputTitle}
						<IconButton
							Icon={X}
							label="Clear title"
							size="sm"
							onclick={() => {
								inputTitle = ''
								titleInput?.focus()
							}}
						/>
					{/if}
				{/snippet}
			</InputField>
		</form>
	{/if}
</Sheet>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

{#snippet menuHeader()}
	<div class="flex min-w-0 items-center gap-3">
		{@render tile()}
		<div class="flex min-w-0 flex-col gap-0.5">{@render textLines()}</div>
	</div>
{/snippet}

{#snippet tile()}
	<span
		class="bg-violet-soft text-violet-text grid size-10 flex-none place-items-center rounded-sm text-base leading-none font-extrabold uppercase"
		aria-hidden="true"
	>
		{parts.domain.charAt(0)}
	</span>
{/snippet}

{#snippet textLines()}
	{#if title}
		<span class="truncate text-[15px] leading-5 font-bold">{title}</span>
		<span class="text-ink-muted truncate font-mono text-[13px] leading-[18px]">{parts.display}</span
		>
	{:else}
		<span class="truncate text-[15px] leading-5 font-bold">{parts.domain}</span>
		<!-- Keep the second line so cards with and without a path have the same height -->
		<span class="text-ink-muted truncate font-mono text-[13px] leading-[18px]">
			{parts.path || ' '}
		</span>
	{/if}
{/snippet}

{#snippet lines()}
	{@render textLines()}
	{#if folderName}
		<span
			class="bg-surface-2 text-ink-muted mt-1 inline-flex h-6 max-w-full items-center gap-1 self-start rounded-full px-2 text-xs leading-4 font-semibold"
		>
			<Folder size={12} class="flex-none" aria-hidden="true" />
			<span class="truncate">{folderName}</span>
		</span>
	{/if}
{/snippet}
