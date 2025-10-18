<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { Icon as LucideIcon } from 'lucide-svelte'
	import { CornerDownRight, Eraser } from 'lucide-svelte'
	import { concatClasses } from '$lib/utils/utils'
	import { btnPrimary } from '$lib/utils/styles'

	type Props = {
		value: string | undefined
		submit: () => void
		placeholder: string
		Icon: LucideIcon
		attr?: HTMLInputAttributes
	}
	let { value = $bindable(undefined), submit, placeholder, Icon, attr }: Props = $props()
</script>

<form class="w-full" onsubmit={submit}>
	<div class="input-group grid-cols-[auto_1fr_auto]">
		{#if value}
			<button
				type="button"
				class={concatClasses(btnPrimary, 'ig-cell')}
				onclick={() => (value = undefined)}
			>
				<Eraser size={16} />
			</button>
		{:else}
			<div class="ig-cell preset-tonal">
				<Icon size={16} />
			</div>
		{/if}
		<input bind:value name="input-value" class="ig-input" type="text" {placeholder} {...attr} />
		<button class="ig-btn preset-filled-secondary-500" type="submit">
			<CornerDownRight size={16} />
		</button>
	</div>
</form>
