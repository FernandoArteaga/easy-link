import { getContext, setContext } from 'svelte'
import { UserData } from '$lib/stores/user.svelte'

function ctx(): Ctx<UserData> {
	return {
		key: Symbol('user'),
		setCtx(value) {
			setContext(this.key, value)
		},
		getCtx() {
			return getContext(this.key) as UserData
		},
	}
}

export default ctx()
