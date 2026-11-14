<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { FullAutoFill, HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements'
	import { Eye, EyeOff } from '@lucide/svelte'
	import { concatClasses, randomInputID } from '#lib/utils/utils.ts'

	type Props = {
		name: string
		type: HTMLInputTypeAttribute
		value?: string | number
		placeholder: string
		autocomplete?: FullAutoFill
		icon?: Snippet
		attr?: HTMLInputAttributes
		canReveal?: boolean
		disabled?: boolean
	}
	let {
		value = $bindable(undefined),
		name,
		type,
		placeholder,
		autocomplete = 'off',
		icon,
		attr,
		canReveal = false,
		disabled = false,
	}: Props = $props()

	const inputID = randomInputID()
	let showReveal = $derived(canReveal && !!value)
	// Literal class names so Tailwind can detect them
	let gridCols = $derived(
		icon
			? showReveal
				? 'grid-cols-[auto_1fr_auto]'
				: 'grid-cols-[auto_1fr]'
			: showReveal
				? 'grid-cols-[1fr_auto]'
				: 'grid-cols-1'
	)

	let toggleReveal = () => {
		type = type === 'text' ? 'password' : 'text'
	}
</script>

<div class={concatClasses('field-group gap-0', gridCols)}>
	{#if icon}
		<label class="label label-text preset-tonal" for={inputID}>{@render icon?.()}</label>
	{/if}
	<input
		id={inputID}
		class="input"
		{name}
		{type}
		{placeholder}
		{autocomplete}
		bind:value
		{disabled}
		{...attr}
	/>

	{#if showReveal}
		<button class="btn preset-tonal" type="button" onclick={toggleReveal}>
			{#if type === 'text'}
				<EyeOff />
			{:else}
				<Eye />
			{/if}
		</button>
	{/if}
</div>
