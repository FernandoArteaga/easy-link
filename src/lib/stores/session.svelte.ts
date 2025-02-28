interface SessionUser {
	uid: string
	email: Nullable<string>
	displayName: Nullable<string>
}
interface SessionStore {
	get user(): Nullable<SessionUser>
	set user(value: SessionUser)
	signOut: () => void
}

function store(): SessionStore {
	let _session = $state<Nullable<SessionUser>>(null)

	return {
		get user(): Nullable<SessionUser> {
			return _session
		},
		set user(user: SessionUser) {
			_session = user
		},
		signOut() {
			_session = null
		},
	}
}

export default store()