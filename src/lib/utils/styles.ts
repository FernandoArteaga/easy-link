import { concatClasses } from '#lib/utils/utils.ts'

const btnBase =
	'inline-flex min-h-tap items-center justify-center gap-2 rounded-md px-5 text-[15px] leading-5 font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45'

const btnVariants = {
	primary: 'bg-violet text-on-violet',
	save: 'bg-mint text-on-mint',
	tonal: 'bg-violet-soft text-violet-text',
	ghost: 'bg-transparent text-ink hover:bg-surface-2',
	danger: 'bg-danger text-on-danger',
}

export type BtnVariant = keyof typeof btnVariants

/** Text button classes (design system "Button") */
export function btn(variant: BtnVariant = 'primary', block = false) {
	return concatClasses(btnBase, btnVariants[variant], block ? 'w-full' : '')
}

/** One-line, ellipsis-truncated text */
export const truncate = 'truncate whitespace-nowrap'
