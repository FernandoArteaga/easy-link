<script lang="ts">
	type Props = {
		variant?: 'card' | 'chip' | 'row'
		repeat?: number
	}
	let { variant = 'card', repeat = 1 }: Props = $props()
	const shapes = {
		card: 'h-[66px] w-full rounded-lg',
		chip: 'h-9 w-20 flex-none rounded-full',
		row: 'h-15 w-full rounded-md',
	}
</script>

<div
	class={variant === 'chip' ? 'flex gap-2 overflow-hidden' : 'flex flex-col gap-3'}
	role="status"
	aria-label="Loading"
>
	{#each { length: repeat }}
		<div class="bg-surface-2 animate-skel {shapes[variant]}"></div>
	{/each}
</div>
