<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { LucideIcon } from '@lucide/svelte'
	import { CornerDownLeft, X } from '@lucide/svelte'
	import IconButton from '#lib/components/IconButton.svelte'

	type Props = {
		value: string | undefined
		placeholder: string
		Icon: LucideIcon
		/** Accessible name of the mint submit button */
		submitLabel: string
		onsubmit: () => void | Promise<void>
		attr?: HTMLInputAttributes
	}
	let {
		value = $bindable(undefined),
		placeholder,
		Icon,
		submitLabel,
		onsubmit,
		attr,
	}: Props = $props()
</script>

<form
	class="h-bar border-line bg-surface shadow-float focus-within:border-violet-text flex items-center gap-1 rounded-xl border pr-1.5 pl-4"
	onsubmit={(e) => {
		e.preventDefault()
		onsubmit()
	}}
>
	<Icon size={20} class="text-ink-muted flex-none" aria-hidden="true" />
	<input
		bind:value
		name="add-bar-value"
		aria-label={placeholder}
		{placeholder}
		class="text-ink placeholder:text-ink-muted h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-base font-medium outline-none focus-visible:outline-none"
		{...attr}
	/>
	{#if value}
		<IconButton Icon={X} label="Clear" size="sm" onclick={() => (value = undefined)} />
	{/if}
	<IconButton Icon={CornerDownLeft} label={submitLabel} variant="save" type="submit" />
</form>
