import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Instagram, Linkedin, Youtube } from 'lucide-react'

const WhatsAppIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const socials = [
  { name: 'Instagram', href: 'https://www.instagram.com/spyrewall.sec', icon: Instagram },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/spyder-sec/', icon: Linkedin },
  { name: 'YouTube', href: 'https://www.youtube.com/@spyrewall', icon: Youtube },
  { name: 'WhatsApp Community', href: 'https://whatsapp.com/channel/0029VbBR5MlJ93wcg5PX570u', icon: WhatsAppIcon },
]

const links = [
  { name: 'Services', to: '/services' },
  { name: 'Certifications', to: '/certifications' },
  { name: 'Careers', to: '/careers' },
  { name: 'Why Us', to: '/why-us' },
  { name: 'Team', to: '/team' },
  { name: 'Photo Gallery', to: '/gallery' },
  { name: 'Support', to: '/support' },
  { name: 'Feedback', to: '/feedback' },
]

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="relative py-16 overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 4%)', borderTop: '1px solid hsl(0 0% 15%)' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(217 91% 60% / 0.5), transparent)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <a href="/" className="flex items-center gap-3 mb-4" onClick={e => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              <div
                className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden"
                style={{ border: '1px solid hsl(217 91% 60% / 0.3)' }}
              >
                <img src="/spyrewall-logo.png" alt="Spyrewall Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg tracking-widest" style={{ color: 'hsl(0 0% 98%)' }}>
                SPYREWALL
              </span>
            </a>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
              "The Smarter You Are, The Safer You'll Be"
            </p>
            <p className="text-xs mt-3 font-mono" style={{ color: 'hsl(217 91% 60%)' }}>
              AES-256 ENCRYPTED
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                  style={{ border: '1px solid hsl(217 91% 60% / 0.3)', color: 'hsl(0 0% 65%)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'hsl(217 91% 60%)'; e.currentTarget.style.borderColor = 'hsl(217 91% 60%)'; e.currentTarget.style.boxShadow = '0 0 12px hsl(217 91% 60% / 0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'hsl(0 0% 65%)'; e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.3)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6" style={{ color: 'hsl(0 0% 98%)' }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {links.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm uppercase tracking-widest transition-colors"
                    style={{ color: 'hsl(0 0% 65%)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'hsl(217 91% 60%)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'hsl(0 0% 65%)'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-6" style={{ color: 'hsl(0 0% 98%)' }}>
              Contact
            </h4>
            <ul className="flex flex-col gap-3 text-sm" style={{ color: 'hsl(0 0% 65%)' }}>
              <li>📞 7665140660</li>
              <li>✉️ Spyrewall@gmail.com</li>
              <li>💬 WhatsApp: 7665140660</li>
            </ul>
            <div className="mt-6">
              <a
                href="https://wa.me/917665140660?text=Hello%2C%20I%20am%20interested%20to%20Enquire%20About%20Spyrewall"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-clip-button inline-flex px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid hsl(0 0% 15%)' }}>
          <p className="text-sm" style={{ color: 'hsl(0 0% 65%)' }}>
            © {new Date().getFullYear()} Spyrewall. All rights reserved.
          </p>
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'hsl(0 0% 65%)' }}>
            SYSTEM SECURE &amp; ONLINE
          </p>
        </div>
      </div>
    </footer>
  )
}
