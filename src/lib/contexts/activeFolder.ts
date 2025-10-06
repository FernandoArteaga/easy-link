import { getContext, setContext } from 'svelte'
import { ActiveFolder } from '$lib/stores/folders.svelte'

function ctx(): Ctx<ActiveFolder> {
	return {
		key: Symbol('active-folder'),
		setCtx(value) {
			setContext(this.key, value)
		},
		getCtx() {
			return getContext(this.key) as ActiveFolder
		}
	}
}

export default ctx()
