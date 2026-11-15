<script lang="ts">
	import { resolve } from '$app/paths'
	import type { Path } from '$app/types'
	import type { LucideIcon } from '@lucide/svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'
	import { concatClasses } from '#lib/utils/utils.ts'

	type Props = {
		Icon: LucideIcon
		/** Accessible name, also shown as a tooltip */
		label: string
		onclick?: (e: MouseEvent) => void
		href?: Path | string
		external?: boolean
		variant?: 'default' | 'tonal' | 'save' | 'danger'
		size?: 'md' | 'sm'
		type?: HTMLButtonAttributes['type']
	}
	let {
		Icon,
		label,
		onclick,
		href,
		external = false,
		variant = 'default',
		size = 'md',
		type = 'button',
	}: Props = $props()

	const variants = {
		default: 'text-ink-muted hover:bg-surface-2 hover:text-ink',
		tonal: 'bg-violet-soft text-violet-text hover:brightness-97',
		save: 'bg-mint text-on-mint',
		danger: 'text-ink-muted hover:bg-danger-soft hover:text-danger',
	}
	const classes = $derived(
		concatClasses(
			'inline-grid flex-none place-items-center rounded-full transition-colors',
			size === 'sm' ? 'size-9' : 'size-tap',
			variants[variant]
		)
	)
	const iconSize = $derived(size === 'sm' ? 18 : 20)
	const aProps = $derived(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})
</script>

{#if href}
	<!-- eslint-disable svelte/no-navigation-without-resolve -- external links, or resolved below -->
	<a
		class={classes}
		href={external ? href : resolve(href as Path)}
		aria-label={label}
		title={label}
		{...aProps}
	>
		<Icon size={iconSize} aria-hidden="true" />
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<button {type} class={classes} aria-label={label} title={label} {onclick}>
		<Icon size={iconSize} aria-hidden="true" />
	</button>
{/if}
