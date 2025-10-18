import { getContext, setContext } from 'svelte'
import { createToaster } from '@skeletonlabs/skeleton-svelte'

function ctx(): Ctx<ReturnType<typeof createToaster>> {
	return {
		key: Symbol('toaster'),
		setCtx(value) {
			setContext(this.key, value)
		},
		getCtx() {
			return getContext(this.key) as ReturnType<typeof createToaster>
		},
	}
}

export default ctx()
