import { dev } from '$app/environment'
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_FIREBASE_USE_EMULATOR,
} from '$env/static/public'
import type { FirebaseApp } from 'firebase/app'
import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp

if (getApps().length > 0) {
	app = getApps()[0]
} else {
	app = initializeApp(firebaseConfig)
}

;(async () => {
	if (!dev && (await isSupported())) {
		getAnalytics(app)
	}
})()

const auth = getAuth(app)
const firestore = getFirestore()

if (dev && PUBLIC_FIREBASE_USE_EMULATOR === 'true') {
	connectAuthEmulator(auth, 'http://localhost:9099')
	connectFirestoreEmulator(firestore, 'localhost', 9080)
}

export { app, auth, firestore }
