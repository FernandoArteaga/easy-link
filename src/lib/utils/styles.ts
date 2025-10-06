import { concatClasses } from '$lib/utils/utils'

const btnBase = 'flex items-center justify-center cursor-pointer'

export const btnPrimary = concatClasses(
	btnBase,
	'preset-tonal-primary hover:preset-filled-primary-500'
)

export const btnSecondary = concatClasses(
	btnBase,
	'preset-tonal-secondary hover:preset-filled-secondary-500'
)
