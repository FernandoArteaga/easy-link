import { browser } from '$app/environment'

export function saveToLocalStorage(storageKey: string, data: string) {
	if (browser) {
		localStorage.setItem(storageKey, btoa(data))
	}
}

export function readJSONFromLocalStorage<T>(storageKey: string): T | T[] | null {
	if (browser) {
		const data = localStorage.getItem(storageKey)
		return data ? JSON.parse(atob(data)) : data
	}
	return null
}

export function readFromLocalStorage(storageKey: string, defaultValue: string) {
	if (browser) {
		const data = localStorage.getItem(storageKey)
		return data ? atob(data) : defaultValue
	}
	return defaultValue
}
