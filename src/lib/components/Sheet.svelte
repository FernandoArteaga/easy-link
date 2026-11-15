<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte'
	import type { Snippet } from 'svelte'
	import { btn, type BtnVariant } from '#lib/utils/styles.ts'

	type Props = {
		isOpen: boolean
		title: string
		description?: string
		/** Keep the title for screen readers only (e.g. when `header` shows the context) */
		titleHidden?: boolean
		/** Shown in place of the visible title and description */
		header?: Snippet
		children?: Snippet
		/** Primary action label; no primary button when omitted */
		confirmLabel?: string
		/** Submit this form instead of calling `onConfirm` */
		confirmFormId?: string
		confirmVariant?: BtnVariant
		onConfirm?: () => void
		showCancel?: boolean
	}
	let {
		isOpen = $bindable(false),
		title,
		description,
		titleHidden = false,
		header,
		children,
		confirmLabel,
		confirmFormId,
		confirmVariant = 'primary',
		onConfirm,
		showCancel = true,
	}: Props = $props()
</script>

<Dialog open={isOpen} onOpenChange={(e) => (isOpen = e.open)}>
	<Portal>
		<Dialog.Backdrop class="bg-scrim fixed inset-0 z-50" />
		<Dialog.Positioner
			class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
		>
			<Dialog.Content
				class="bg-surface shadow-sheet animate-sheet-up max-w-content flex max-h-[90svh] w-full flex-col gap-4 overflow-y-auto rounded-t-xl px-5 pt-2.5 pb-[calc(20px+env(safe-area-inset-bottom))] sm:animate-none sm:rounded-xl sm:pt-5 sm:pb-5"
			>
				<div
					class="bg-line-control mx-auto h-[5px] w-9 flex-none rounded-full opacity-50 sm:hidden"
					aria-hidden="true"
				></div>
				<div class={titleHidden ? 'sr-only' : ''}>
					<Dialog.Title class="text-xl leading-[26px] font-bold tracking-[-0.01em]">
						{title}
					</Dialog.Title>
					{#if description}
						<Dialog.Description class="text-ink-muted mt-1 text-[15px] leading-[22px] font-medium">
							{description}
						</Dialog.Description>
					{/if}
				</div>
				{@render header?.()}
				{@render children?.()}
				{#if confirmLabel || showCancel}
					<div class="flex flex-col gap-2">
						{#if confirmLabel}
							{#if confirmFormId}
								<button type="submit" form={confirmFormId} class={btn(confirmVariant, true)}>
									{confirmLabel}
								</button>
							{:else}
								<button type="button" class={btn(confirmVariant, true)} onclick={onConfirm}>
									{confirmLabel}
								</button>
							{/if}
						{/if}
						{#if showCancel}
							<button type="button" class={btn('ghost', true)} onclick={() => (isOpen = false)}>
								Cancel
							</button>
						{/if}
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
