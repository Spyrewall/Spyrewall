import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Google "G" logo SVG
function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

import { useState } from 'react'

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithGoogle } = useAuth()
  const [error, setError] = useState(null)

  const handleGoogleLogin = async () => {
    setError(null)
    const result = await loginWithGoogle()
    if (result.success) {
      onClose()
    } else if (result.error) {
      setError(result.error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: 'hsl(0 0% 0% / 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 w-full h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(217 91% 60%), transparent)' }}
            />

            <div
              className="p-8 cyber-clip"
              style={{
                backgroundColor: 'hsl(0 0% 8%)',
                border: '1px solid hsl(217 91% 60% / 0.3)',
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 transition-colors"
                style={{ color: 'hsl(0 0% 50%)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(0 0% 98%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(0 0% 50%)'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{
                    backgroundColor: 'hsl(217 91% 60% / 0.1)',
                    border: '1px solid hsl(217 91% 60% / 0.4)',
                  }}
                >
                  <ShieldCheck className="w-7 h-7" style={{ color: 'hsl(217 91% 60%)' }} />
                </div>
                <h2
                  className="font-display font-bold text-2xl uppercase tracking-widest"
                  style={{ color: 'hsl(0 0% 98%)' }}
                >
                  Sign In
                </h2>
                <p
                  className="text-xs font-mono uppercase tracking-widest mt-2"
                  style={{ color: 'hsl(0 0% 55%)' }}
                >
                  // authenticate to continue
                </p>
              </div>

              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-sm text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  color: 'hsl(0 0% 20%)',
                  border: '1px solid hsl(0 0% 85%)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'hsl(0 0% 95%)'
                  e.currentTarget.style.boxShadow = '0 2px 12px hsl(217 91% 60% / 0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'hsl(0 0% 100%)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <GoogleIcon size={20} />
                Continue with Google
              </button>

              {/* Error message */}
              {error && (
                <p
                  className="text-center text-xs font-mono mt-4 px-3 py-2"
                  style={{ color: 'hsl(0 80% 65%)', backgroundColor: 'hsl(0 80% 65% / 0.1)', border: '1px solid hsl(0 80% 65% / 0.3)' }}
                >
                  {error}
                </p>
              )}

              {/* Footer note */}
              <p
                className="text-center text-[10px] font-mono uppercase tracking-wider mt-6 leading-relaxed"
                style={{ color: 'hsl(0 0% 40%)' }}
              >
                Secure authentication powered by Google
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
