import type { AuthError } from 'firebase/auth'
import type { FirestoreError } from 'firebase/firestore'

export function handleErrorMessages(error: AuthError | FirestoreError): string {
	let message: string
	switch (error.code) {
		case 'auth/user-not-found':
			message = 'User not found. Please sign up 😃'
			break
		case 'auth/password-does-not-meet-requirements':
			message =
				'The password does not meet the requirements. It must be at least 6 characters long and contain at least: one uppercase letter, one lowercase letter, and one number.'
			break
		case 'auth/email-already-in-use':
			message = 'Email already in use. Please sign in 😃'
			break
		case 'auth/invalid-credential':
			message = 'Your email or password is incorrect. Please try again 😃'
			break
		case 'permission-denied':
			message = 'You do not have permission to perform this action.'
			break
		default:
			message = error.message
	}
	return message
}
