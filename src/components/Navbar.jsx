import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Services', to: '/services' },
  { name: 'Certifications', to: '/certifications' },
  { name: 'Careers', to: '/careers' },
  { name: 'Why Us', to: '/why-us' },
  { name: 'Team', to: '/team' },
  { name: 'Photo Gallery', to: '/gallery' },
  { name: 'Support', to: '/support' },
  { name: 'Feedback', to: '/feedback' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const goHome = (e) => {
    e.preventDefault()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3'
          : 'py-5 bg-transparent'
      }`}
      style={scrolled ? { backgroundColor: 'hsl(0 0% 4% / 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid hsl(217 91% 60% / 0.2)' } : {}}
    >
      <motion.div
        className="absolute bottom-0 left-0 h-px w-24"
        style={{ backgroundColor: 'hsl(217 91% 60% / 0.8)', filter: 'blur(1px)' }}
        animate={{ x: ['-100px', '100vw'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" onClick={goHome} className="flex items-center gap-3 group">
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300"
              style={{ border: '1px solid hsl(217 91% 60% / 0.3)' }}
            >
              <img src="/spyrewall-logo.png" alt="Spyrewall Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl tracking-widest transition-colors">
              <span style={{ color: 'hsl(0 0% 98%)' }}>SPYRE</span><span style={{ color: '#3b82f6' }}>WALL</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-sm font-medium uppercase tracking-widest transition-colors duration-200"
                  style={{ color: active ? 'hsl(217 91% 60%)' : 'hsl(0 0% 65%)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                  onMouseLeave={e => e.currentTarget.style.color = active ? 'hsl(217 91% 60%)' : 'hsl(0 0% 65%)'}
                >
                  {link.name}
                </Link>
              )
            })}
            <a
              href="https://wa.me/917665140660?text=Hello%2C%20I%20am%20interested%20to%20Enquire%20About%20Spyrewall"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-clip-button px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all duration-300"
              style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
            >
              Enquiry
            </a>
          </nav>

          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: 'hsl(0 0% 98%)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: 'hsl(0 0% 12%)', borderBottom: '1px solid hsl(217 91% 60% / 0.2)' }}
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium uppercase tracking-widest p-2 transition-colors"
                  style={{ color: 'hsl(0 0% 65%)', borderBottom: '1px solid hsl(0 0% 15%)' }}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/917665140660?text=Hello%2C%20I%20am%20interested%20to%20Enquire%20About%20Spyrewall"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="cyber-clip-button inline-flex items-center justify-center px-6 py-3 mt-4 text-sm font-bold uppercase tracking-widest"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
              >
                Enquiry
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
