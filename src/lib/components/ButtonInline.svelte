<script lang="ts">
	import { concatClasses } from '$lib/utils/utils.js';
	import { btnPrimary } from '$lib/utils/styles.js';
	import type { Icon as LucideIcon } from 'lucide-svelte';

	type Props = {
		Icon: LucideIcon
		onclick?: () => void
		href?: string
		external?: boolean
		start?: boolean
		end?: boolean
	}
	let { Icon, onclick, href, external, start = false, end = false }: Props = $props();

	const sideClass = start
		? 'rounded-l-md'
		: end
		? 'rounded-r-md'
		: '';
	const classes = concatClasses(btnPrimary, sideClass, 'w-12 min-w-12');
	const aProps = external
		? { target: '_blank', rel: 'noopener noreferrer' }
		: {};
</script>

{#if href}
	<a
		class={classes}
		href={href}
		{...aProps}
	>
		<Icon size={16} />
	</a>
{:else}
	<button class={classes} onclick={onclick}>
		<Icon size={16} />
	</button>
{/if}
