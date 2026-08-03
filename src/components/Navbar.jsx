import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, LogOut, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { name: 'Services', to: '/services' },
  { name: 'Certifications', to: '/certifications' },
  { name: 'Careers', to: '/careers' },
  { name: 'Why Us', to: '/why-us' },
  { name: 'Team', to: '/team' },
  { name: 'Gallery', to: '/gallery' },
  { name: 'Support', to: '/support' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { itemCount } = useCart()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goHome = (e) => {
    e.preventDefault()
    navigate('/')
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    setMobileOpen(false)
  }

  const cartActive = location.pathname === '/cart' || location.pathname === '/checkout'

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3'
            : 'py-5 bg-transparent'
        }`}
        style={scrolled ? { backgroundColor: 'hsl(0 0% 4% / 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid hsl(217 91% 60% / 0.2)' } : {}}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-px w-24"
          style={{ backgroundColor: 'hsl(217 91% 60% / 0.8)', filter: 'blur(1px)' }}
          animate={{ x: ['-100px', '100vw'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo */}
            <a href="/" onClick={goHome} className="flex items-center gap-3 shrink-0 group">
              <div
                className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden transition-all duration-300 shrink-0"
                style={{ border: '1px solid hsl(217 91% 60% / 0.4)' }}
              >
                <img src="/spyrewall-logo.png" alt="Spyrewall Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg md:text-xl tracking-widest whitespace-nowrap">
                <span style={{ color: 'hsl(0 0% 98%)' }}>SPYRE</span><span style={{ color: '#3b82f6' }}>WALL</span>
              </span>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-xs xl:text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-colors duration-200"
                    style={{ color: active ? 'hsl(217 91% 60%)' : 'hsl(0 0% 70%)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                    onMouseLeave={e => e.currentTarget.style.color = active ? 'hsl(217 91% 60%)' : 'hsl(0 0% 70%)'}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Right Actions (Cart + Login) */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 transition-colors duration-200"
                style={{ color: cartActive ? 'hsl(217 91% 60%)' : 'hsl(0 0% 70%)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                onMouseLeave={e => e.currentTarget.style.color = cartActive ? 'hsl(217 91% 60%)' : 'hsl(0 0% 70%)'}
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Auth: Login button or User avatar */}
              {!loading && (
                user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-full transition-all duration-200"
                      style={{ border: '2px solid transparent' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.5)'}
                      onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'transparent' }}
                    >
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                        >
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 py-2 z-50"
                          style={{
                            backgroundColor: 'hsl(0 0% 10%)',
                            border: '1px solid hsl(0 0% 20%)',
                            boxShadow: '0 8px 30px hsl(0 0% 0% / 0.5)',
                          }}
                        >
                          {/* User info */}
                          <div className="px-4 py-3" style={{ borderBottom: '1px solid hsl(0 0% 18%)' }}>
                            <p className="text-sm font-medium truncate" style={{ color: 'hsl(0 0% 98%)' }}>{user.name}</p>
                            <p className="text-xs truncate mt-0.5" style={{ color: 'hsl(0 0% 55%)' }}>{user.email}</p>
                          </div>

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left"
                            style={{ color: 'hsl(0 0% 65%)' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(0 0% 15%)'; e.currentTarget.style.color = 'hsl(0 0% 98%)' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'hsl(0 0% 65%)' }}
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="cyber-clip-button px-5 py-2 text-xs xl:text-sm font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                    style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                  >
                    Login
                  </button>
                )
              )}
            </div>

            {/* Mobile / Tablet Toggle Actions */}
            <div className="lg:hidden flex items-center gap-3">
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="relative p-2 transition-colors"
                style={{ color: cartActive ? 'hsl(217 91% 60%)' : 'hsl(0 0% 98%)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {!loading && user && (
                <button onClick={() => { setMobileOpen(false); setDropdownOpen(!dropdownOpen) }} className="p-1">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>
              )}

              <button
                className="p-2 transition-colors"
                style={{ color: 'hsl(0 0% 98%)' }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Drawer Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
              style={{ backgroundColor: 'hsl(0 0% 8%)', borderBottom: '1px solid hsl(217 91% 60% / 0.2)' }}
            >
              <div className="px-6 py-6 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium uppercase tracking-widest py-2 transition-colors"
                    style={{ color: 'hsl(0 0% 75%)', borderBottom: '1px solid hsl(0 0% 14%)' }}
                  >
                    {link.name}
                  </Link>
                ))}

                {!loading && (
                  user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-6 py-3 mt-3 text-xs font-bold uppercase tracking-widest transition-colors"
                      style={{ color: 'hsl(0 0% 65%)', border: '1px solid hsl(0 0% 25%)' }}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); setAuthOpen(true) }}
                      className="cyber-clip-button inline-flex items-center justify-center px-6 py-3 mt-3 text-xs font-bold uppercase tracking-widest"
                      style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
                    >
                      Login
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
