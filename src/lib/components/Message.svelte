<script lang="ts">
	import type { Snippet } from 'svelte'
	import { concatClasses } from '$lib/utils/utils'

	type Props = {
		children: Snippet
		extraClasses?: string
	}
	let { children, extraClasses = '' }: Props = $props()
</script>

<div class={concatClasses('text-center text-sm text-gray-500 dark:text-gray-400', extraClasses)}>
	{@render children()}
</div>
