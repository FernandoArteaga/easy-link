<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { FullAutoFill, HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'
	import { Eye, EyeOff } from '@lucide/svelte'
	import { randomInputID } from '#lib/utils/utils.ts'
	import IconButton from '#lib/components/IconButton.svelte'

	type Props = {
		/** Input id; random when omitted */
		id?: string
		/** Visible label above the box */
		label: string
		/** Adds "(optional)" after the label */
		optional?: boolean
		hint?: string
		name: string
		type: HTMLInputTypeAttribute
		value?: string | number
		placeholder?: string
		autocomplete?: FullAutoFill
		/** Leading icon (20px Lucide) */
		icon?: Snippet
		/** Trailing slot, e.g. a clear button */
		trailing?: Snippet
		attr?: HTMLInputAttributes
		canReveal?: boolean
		disabled?: boolean
		input?: HTMLInputElement
	}
	let {
		id,
		label,
		optional = false,
		hint,
		value = $bindable(undefined),
		name,
		type,
		placeholder,
		autocomplete = 'off',
		icon,
		trailing,
		attr,
		canReveal = false,
		disabled = false,
		input = $bindable(undefined),
	}: Props = $props()
	const fallbackID = randomInputID()
	let inputID = $derived(id ?? fallbackID)
	let hintID = $derived(`${inputID}-hint`)
	let revealed = $state(false)
	let showReveal = $derived(canReveal && !!value)
	let inputType = $derived(canReveal && revealed ? 'text' : type)
</script>

<div class="flex flex-col gap-1.5">
	<label for={inputID} class="text-ink text-sm leading-[18px] font-semibold">
		{label}
		{#if optional}<span class="text-ink-muted font-medium">(optional)</span>{/if}
	</label>
	<div
		class="bg-surface-2 text-ink-muted focus-within:border-violet-text focus-within:bg-surface flex h-13 items-center gap-2 rounded-md border-[1.5px] border-transparent pr-1.5 pl-4"
	>
		{@render icon?.()}
		<input
			bind:this={input}
			id={inputID}
			class="text-ink placeholder:text-ink-muted h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium outline-none focus-visible:outline-none"
			{name}
			type={inputType}
			{placeholder}
			{autocomplete}
			bind:value
			{disabled}
			aria-describedby={hint ? hintID : undefined}
			{...attr}
		/>
		{#if showReveal}
			<IconButton
				Icon={revealed ? EyeOff : Eye}
				label={revealed ? 'Hide password' : 'Show password'}
				size="sm"
				onclick={() => (revealed = !revealed)}
			/>
		{/if}
		{@render trailing?.()}
	</div>
	{#if hint}
		<span id={hintID} class="text-ink-muted text-[13px] leading-[18px] font-medium">{hint}</span>
	{/if}
</div>
