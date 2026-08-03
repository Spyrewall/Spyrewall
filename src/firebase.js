import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDw3_oEnsu6-5HubDNbnMyod4kohOCH52w',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'spyrewall9.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'spyrewall9',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'spyrewall9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '941768211490',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:941768211490:web:5a11d2f00d46960bd89e7b',
}

// Check if Firebase is configured
const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app = null
let auth = null
let googleProvider = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
}

export { auth, googleProvider, isConfigured }
