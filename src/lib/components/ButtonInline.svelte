<script lang="ts">
	import { resolve } from '$app/paths'
	import { concatClasses } from '$lib/utils/utils'
	import { btnPrimary } from '$lib/utils/styles'
	import type { Icon as LucideIcon } from 'lucide-svelte'

	type Props = {
		Icon: typeof LucideIcon
		onclick?: () => void
		href?: string
		external?: boolean
		start?: boolean
		end?: boolean
	}
	let { Icon, onclick, href, external, start = false, end = false }: Props = $props()

	const sideClass = $derived(start ? 'rounded-l-md' : end ? 'rounded-r-md' : '')
	const classes = $derived(concatClasses(btnPrimary, sideClass, 'w-12 min-w-12'))
	const aProps = $derived(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})
</script>

{#if href}
	<a class={classes} href={resolve(href)} {...aProps}>
		<Icon size={16} />
	</a>
{:else}
	<button class={classes} {onclick}>
		<Icon size={16} />
	</button>
{/if}
