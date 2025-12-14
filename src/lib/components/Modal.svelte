<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte'
	import type { Snippet } from 'svelte'

	type Props = {
		isOpen: boolean
		trigger: Snippet
		triggerClasses?: string
		title: string
		description?: string
		body?: Snippet
		action?: () => void
		confirmButtonFormId?: string
	}
	let {
		isOpen = $bindable(false),
		trigger,
		triggerClasses = '',
		title,
		description,
		body,
		action,
		confirmButtonFormId,
	}: Props = $props()

	let confirmBtnClasses = 'btn preset-filled-secondary-500'
</script>

<Dialog open={isOpen} onOpenChange={(e) => (isOpen = e.open)}>
	<Dialog.Trigger class={triggerClasses}>
		{@render trigger()}
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="bg-surface-50-950/50 fixed inset-0 z-50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class="card dark:bg-surface-900 w-full max-w-118 space-y-5 bg-white p-4 shadow-xl"
			>
				<Dialog.Title>
					<h2 class="h2">{title}</h2>
				</Dialog.Title>

				{#if description}
					<Dialog.Description>
						<p>{description}</p>
					</Dialog.Description>
				{/if}

				{#if body}
					{@render body()}
				{/if}
				<footer class="flex justify-end gap-4">
					<button type="button" class="btn preset-ghost-primary" onclick={() => (isOpen = false)}>
						Cancel
					</button>
					{#if confirmButtonFormId}
						<button type="submit" form={confirmButtonFormId} class={confirmBtnClasses}>
							Confirm
						</button>
					{:else}
						<button type="button" class={confirmBtnClasses} onclick={action}>Confirm</button>
					{/if}
				</footer>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
