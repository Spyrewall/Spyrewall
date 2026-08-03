import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, isConfigured } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isConfigured) // only loading if Firebase is set up

  // Listen for auth state changes (persists across refreshes)
  useEffect(() => {
    if (!isConfigured) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    if (!isConfigured) {
      return { success: false, error: 'Firebase is not configured. Add your credentials to the .env file.' }
    }
    try {
      await signInWithPopup(auth, googleProvider)
      return { success: true }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: null }
      }
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    if (!isConfigured) return
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
