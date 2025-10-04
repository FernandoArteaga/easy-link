export const ssr = false
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ url }) => {
	const { pathname } = url
	return {
		pathname
	}
}
