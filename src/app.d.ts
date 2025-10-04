declare global {
	type Nullable<T> = T | null

	namespace App {
		type Themes = 'dark' | 'light'
		type InputConstraint = Partial<{
			pattern: string
			min: number | string
			max: number | string
			required: boolean
			step: number | 'any'
			minlength: number
			maxlength: number
		}>
	}

	namespace Firestore {
		type Link = {
			id: string
			url: string
			timestamp: number
		}
		type CreateLink = {
			url: string
		}

		type Folder = {
			id: string
			name: string
		}
	}
}

export {}
