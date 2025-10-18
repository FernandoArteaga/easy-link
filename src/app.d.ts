import type { Timestamp } from 'firebase/firestore'

declare global {
	type Nullable<T> = T | null

	namespace App {
		type Themes = 'dark' | 'light'
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
