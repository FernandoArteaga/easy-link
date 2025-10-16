import type { Timestamp } from 'firebase/firestore'

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
		type Doc<T> = T & { id: string }

		type User = {
			totalFolders: number
		}

		type Link = {
			url: string
			timestamp: Timestamp
		}
		type CreateLink = {
			url: string
		}

		type Folder = {
			name: string
			nameLower: string
		}
		type CreateFolder = {
			name: string
		}
	}
}

export {}
