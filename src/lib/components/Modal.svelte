<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte'
	import type { Snippet } from 'svelte'

	type Props = {
		triggerContent: Snippet
		triggerClasses?: string
		title: string
		description?: string
		body?: Snippet
		action?: () => void
		confirmButtonFormId?: string
	}
	let {
		isOpen = $bindable(false),
		triggerContent,
		triggerClasses = '',
		title,
		description,
		body,
		action,
		confirmButtonFormId,
	}: Props = $props()

	let confirmBtnClasses = 'btn preset-filled-secondary-500'
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => (isOpen = e.open)}
	contentBase="card bg-white dark:bg-surface-900 p-4 space-y-5 shadow-xl max-w-screen-sm min-w-96"
	triggerBase="h-full"
	{triggerClasses}
>
	{#snippet trigger()}
		{@render triggerContent()}
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">{title}</h2>
		</header>

		{#if description}
			<article>
				<p>{description}</p>
			</article>
		{/if}

		{#if body}
			{@render body()}
		{/if}
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-ghost-primary" onclick={() => (isOpen = false)}
				>Cancel</button
			>
			{#if confirmButtonFormId}
				<button type="submit" form={confirmButtonFormId} class={confirmBtnClasses}>
					Confirm
				</button>
			{:else}
				<button type="button" class={confirmBtnClasses} onclick={action}> Confirm </button>
			{/if}
		</footer>
	{/snippet}
</Modal>
