import type { AuthError } from 'firebase/auth'
import type { FirestoreError } from 'firebase/firestore'

const PASSWORD_REQUIREMENTS =
	'The password does not meet the requirements. It must be at least 6 characters long and contain at least: one uppercase letter, one lowercase letter, and one number.'
const WRONG_CREDENTIALS = 'Your email or password is incorrect. Please try again 😃'
const NETWORK = "Can't reach the server. Check your connection and try again."
const GENERIC = 'Something went wrong. Please try again.'

export function handleErrorMessages(error: AuthError | FirestoreError): string {
	switch (error.code) {
		case 'auth/user-not-found':
			return 'User not found. Please sign up 😃'
		case 'auth/password-does-not-meet-requirements':
		case 'auth/weak-password':
			return PASSWORD_REQUIREMENTS
		case 'auth/email-already-in-use':
			return 'Email already in use. Please sign in 😃'
		case 'auth/invalid-credential':
		case 'auth/wrong-password':
			return WRONG_CREDENTIALS
		case 'auth/invalid-email':
			return 'Please enter a valid email address.'
		case 'auth/missing-password':
			return 'Please enter your password.'
		case 'auth/too-many-requests':
			return 'Too many attempts. Please wait a moment and try again.'
		case 'auth/network-request-failed':
		case 'unavailable':
			return NETWORK
		case 'auth/user-disabled':
			return 'This account has been disabled.'
		case 'resource-exhausted':
			return 'You’ve reached the limit of 10 folders.'
		case 'permission-denied':
			return 'You do not have permission to perform this action.'
		default:
			console.error(error)
			return GENERIC
	}
}
