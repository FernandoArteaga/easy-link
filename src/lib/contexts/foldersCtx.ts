import { getContext, setContext } from 'svelte'
import { FolderStore } from '$lib/stores/folders.svelte'

function ctx(): Ctx<FolderStore> {
	return {
		key: Symbol('active-folder'),
		setCtx(value) {
			setContext(this.key, value)
		},
		getCtx() {
			return getContext(this.key) as FolderStore
		},
	}
}

export default ctx()
