import type { Timestamp } from 'firebase/firestore'

declare global {
	type Nullable<T> = T | null
	type Undefinable<T> = T | undefined

	namespace App {
		type Themes = 'dark' | 'light'
	}

	namespace Firestore {
		type Doc<T> = T & { id: string }

		type User = {
			totalFolders: number
			lastLogin: Timestamp
		}

		type Link = {
			url: string
			timestamp: Timestamp
			folderId?: string
		}
		type CreateLink = {
			url: string
		}
		type UpdateLink = {
			folderId: string
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
