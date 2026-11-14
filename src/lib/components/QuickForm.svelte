<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { LucideIcon } from '@lucide/svelte'
	import { CornerDownRight, Eraser } from '@lucide/svelte'
	import { concatClasses } from '#lib/utils/utils.ts'
	import { btnPrimary } from '#lib/utils/styles.ts'

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
	<div class="field-group grid-cols-[auto_1fr_auto] gap-0">
		{#if value}
			<button
				type="button"
				class={concatClasses(btnPrimary, 'btn')}
				onclick={() => (value = undefined)}
			>
				<Eraser />
			</button>
		{:else}
			<span class="label label-text preset-tonal">
				<Icon class="size-elem-base" />
			</span>
		{/if}
		<input bind:value name="input-value" class="input" type="text" {placeholder} {...attr} />
		<button class="btn preset-filled-secondary-500" type="submit">
			<CornerDownRight />
		</button>
	</div>
</form>
