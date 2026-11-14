<script lang="ts">
	import { resolve } from '$app/paths'
	import type { Path } from '$app/types'
	import { concatClasses } from '#lib/utils/utils.ts'
	import { btnPrimary } from '#lib/utils/styles.ts'
	import type { LucideIcon } from '@lucide/svelte'

	type Props = {
		Icon: LucideIcon
		onclick?: () => void
		href?: Path | string
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
	<!--eslint-disable-next-line svelte/no-navigation-without-resolve-->
	<a class={classes} href={external ? href : resolve(href as Path)} {...aProps}>
		<Icon size={16} />
	</a>
{:else}
	<button class={classes} {onclick}>
		<Icon size={16} />
	</button>
{/if}
