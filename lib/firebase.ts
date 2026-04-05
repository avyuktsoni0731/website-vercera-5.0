import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (typeof window !== 'undefined' && (!firebaseConfig.apiKey || !firebaseConfig.projectId)) {
  console.error(
    '[Firebase] Missing config. Ensure .env.local has NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID, then restart the dev server.'
  )
}

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp)
const auth: Auth = getAuth(app)

/**
 * Firestore WebChannel can use fetch-based streams (see `useFetchStreams` in the SDK).
 * In some production environments the browser then treats requests as `credentials: 'include'`
 * while `firestore.googleapis.com` responds with `Access-Control-Allow-Origin: *`, which
 * CORS rejects — causing offline mode and failed reads/writes. Disabling fetch streams
 * avoids that transport path.
 *
 * `useFetchStreams` is a supported SDK setting but not yet in the public .d.ts; see
 * @firebase/firestore FirestoreSettingsImpl.
 */
function createFirestore(): Firestore {
  if (typeof window === 'undefined') {
    return getFirestore(app)
  }
  try {
    return initializeFirestore(app, {
      useFetchStreams: false,
    } as Parameters<typeof initializeFirestore>[1])
  } catch {
    return getFirestore(app)
  }
}

const db: Firestore = createFirestore()
const storage: FirebaseStorage = getStorage(app)

export { app, auth, db, storage }
