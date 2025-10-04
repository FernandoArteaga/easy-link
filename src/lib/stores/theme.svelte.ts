import { browser } from '$app/environment'
import { readFromLocalStorage, saveToLocalStorage } from '$lib/utils/localStorage'

const themeStorageKey = 'theme'

const setBrowserTheme = (theme: App.Themes) => {
	if (browser) {
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}
}
const systemTheme = (): App.Themes => {
	const checkDark: boolean = browser && window.matchMedia('(prefers-color-scheme: dark)').matches
	return checkDark ? 'dark' : 'light'
}

const initTheme = (): App.Themes => {
	const theme = readFromLocalStorage(themeStorageKey, systemTheme()) as App.Themes
	setBrowserTheme(theme)
	return theme
}

interface ThemeStore {
	get theme(): App.Themes
	set theme(v: App.Themes)
	get themes(): Array<App.Themes>
	isLight(): boolean
}

function store(): ThemeStore {
	let _theme = $state<App.Themes>(initTheme())

	return {
		get theme() {
			return _theme
		},
		set theme(value) {
			_theme = value
			saveToLocalStorage(themeStorageKey, value)
			setBrowserTheme(value)
		},
		get themes(): Array<App.Themes> {
			return ['light', 'dark']
		},
		isLight() {
			return _theme === 'light'
		}
	}
}

export default store()
