import { defineEnvVars } from '@sveltejs/kit/env'

// Static SPA: every variable is public and inlined at build time.
const firebase = { public: true, static: true } as const

export const variables = defineEnvVars({
	PUBLIC_FIREBASE_API_KEY: firebase,
	PUBLIC_FIREBASE_AUTH_DOMAIN: firebase,
	PUBLIC_FIREBASE_PROJECT_ID: firebase,
	PUBLIC_FIREBASE_STORAGE_BUCKET: firebase,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebase,
	PUBLIC_FIREBASE_APP_ID: firebase,
	PUBLIC_FIREBASE_MEASUREMENT_ID: firebase,
	PUBLIC_FIREBASE_USE_EMULATOR: {
		...firebase,
		description: 'Connect to local Firebase emulators in dev when "true".',
		schema: (value) => value === 'true',
	},
})
