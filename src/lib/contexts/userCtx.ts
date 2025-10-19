import { getContext, setContext } from 'svelte'
import { UserStore } from '$lib/stores/user.svelte'

function ctx(): Ctx<UserStore> {
	return {
		key: Symbol('user'),
		setCtx(value) {
			setContext(this.key, value)
		},
		getCtx() {
			return getContext(this.key) as UserStore
		},
	}
}

export default ctx()
