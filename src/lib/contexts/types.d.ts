interface Ctx<T, U = T> {
	readonly key: symbol
	setCtx(value: T): void
	getCtx(): U
}
