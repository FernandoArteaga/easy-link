<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { concatClasses, randomInputID } from '$lib/utils/utils';

	type Props = {
		name: string;
		type: HTMLInputTypeAttribute;
		value?: string | number;
		placeholder: string;
		autocomplete?: FullAutoFill;
		icon?: Snippet;
		constraints?: App.InputConstraint;
		canReveal?: boolean;
		disabled?: boolean;
	};
	let {
		value = $bindable(undefined),
		name,
		type,
		placeholder,
		autocomplete = 'off',
		icon,
		constraints,
		canReveal = false,
		disabled = false
	}: Props = $props();

	const inputID = randomInputID();
	let revealClass = $derived(canReveal && value ? 'pr-8' : '');

	let toggleReveal = () => {
		type = type === 'text' ? 'password' : 'text';
	};
</script>

<div class="input-group relative grid-cols-[auto_1fr_auto]">
	{#if icon}
		<div class="ig-cell preset-tonal">{@render icon?.()}</div>
	{/if}
	<input
		id={inputID}
		class={concatClasses('ig-input', revealClass)}
		{name}
		{type}
		{placeholder}
		{autocomplete}
		bind:value
		{disabled}
		{...constraints}
	/>

	{#if canReveal && value}
		<button class="ig-btn preset" type="button" onclick={toggleReveal}>
			{#if type === 'text'}
				<EyeOff size={16} />
			{:else}
				<Eye size={16} />
			{/if}
		</button>
	{/if}
</div>
