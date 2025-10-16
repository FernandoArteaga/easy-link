<script lang="ts">
	type Props = {
		repeat?: number
		horizontal?: boolean
	}
	let { repeat = 1, horizontal = false }: Props = $props()
</script>

<div class="grid gap-4 {horizontal ? 'auto-cols-fr grid-flow-col' : 'grid-cols-1'}">
	{#each { length: repeat }}
		<div class="placeholder h-10 animate-pulse"></div>
	{/each}
</div>
