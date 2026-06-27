import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react'

const contactInfo = [
  { icon: Phone, title: 'Phone Number', detail: '7665140660', sub: 'Call us anytime' },
  { icon: Mail, title: 'Email Support', detail: 'Spyrewall@gmail.com', sub: 'Response within 1 hour' },
  { icon: MessageCircle, title: 'WhatsApp Support', detail: '7665140660', sub: 'Chat with us on WhatsApp' },
  { icon: Clock, title: 'SLA Commitment', detail: '< 15 min', sub: 'Critical incident response time' },
]

const ADMIN_EMAIL = 'Spyrewall@gmail.com'

export default function Support() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [fields, setFields] = useState({ name: '', email: '', priority: '', message: '' })

  const set = (k) => (e) => setFields(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `[Support Ticket] ${fields.priority.toUpperCase()} — ${fields.name}`,
          _template: 'box',
          Name: fields.name,
          Email: fields.email,
          Priority: fields.priority,
          Message: fields.message,
        }),
      })
    } catch { /* best-effort */ }
    setSending(false)
    setSubmitted(true)
  }

  return (
    <section id="support" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <div className="absolute inset-0 cyber-dots pointer-events-none" style={{ opacity: 0.1 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">
            24/7 <span style={{ color: 'hsl(217 91% 60%)' }}>Support</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
          <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto">
            We never sleep so you don't have to worry. Our team is always on standby.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 cyber-clip group transition-all duration-300"
              style={{ border: '1px solid hsl(217 91% 60% / 0.2)', backgroundColor: 'hsl(0 0% 12%)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.6)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full mb-4 transition-all duration-300"
                style={{ border: '2px solid hsl(217 91% 60% / 0.4)', backgroundColor: 'hsl(217 91% 60% / 0.1)' }}
              >
                <item.icon className="w-6 h-6" style={{ color: 'hsl(217 91% 60%)' }} />
              </div>
              <h3 className="font-display font-bold uppercase tracking-wide text-sm mb-2" style={{ color: 'hsl(0 0% 98%)' }}>
                {item.title}
              </h3>
              <p className="font-mono font-bold text-lg" style={{ color: 'hsl(217 91% 60%)' }}>
                {item.detail}
              </p>
              <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 65%)' }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto cyber-clip p-8"
          style={{ border: '1px solid hsl(217 91% 60% / 0.2)', backgroundColor: 'hsl(0 0% 12%)' }}
        >
          <h3 className="font-display font-bold uppercase tracking-widest text-xl mb-6 text-center" style={{ color: 'hsl(0 0% 98%)' }}>
            Submit a <span style={{ color: 'hsl(217 91% 60%)' }}>Support Ticket</span>
          </h3>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)', border: '2px solid hsl(217 91% 60%)' }}>
                <span className="text-2xl">✓</span>
              </div>
              <h4 className="font-display font-bold uppercase tracking-widest mb-2" style={{ color: 'hsl(0 0% 98%)' }}>
                TRANSMISSION SECURE
              </h4>
              <p className="text-sm" style={{ color: 'hsl(0 0% 65%)' }}>
                Your ticket has been received. We'll respond within 15 minutes.
              </p>
            </motion.div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={fields.name}
                onChange={set('name')}
                className="w-full outline-none px-4 py-3 text-sm font-mono transition-colors"
                style={{ backgroundColor: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 15%)', color: 'hsl(0 0% 98%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(217 91% 60%)'}
                onBlur={e => e.target.style.borderColor = 'hsl(0 0% 15%)'}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={fields.email}
                onChange={set('email')}
                className="w-full outline-none px-4 py-3 text-sm font-mono transition-colors"
                style={{ backgroundColor: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 15%)', color: 'hsl(0 0% 98%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(217 91% 60%)'}
                onBlur={e => e.target.style.borderColor = 'hsl(0 0% 15%)'}
              />
              <select
                required
                value={fields.priority}
                onChange={set('priority')}
                className="w-full outline-none px-4 py-3 text-sm font-mono transition-colors"
                style={{ backgroundColor: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 15%)', color: 'hsl(0 0% 98%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(217 91% 60%)'}
                onBlur={e => e.target.style.borderColor = 'hsl(0 0% 15%)'}
              >
                <option value="">Select Priority</option>
                <option value="critical">Critical — Active Breach</option>
                <option value="high">High — Suspected Compromise</option>
                <option value="medium">Medium — Vulnerability Found</option>
                <option value="low">Low — General Inquiry</option>
              </select>
              <textarea
                placeholder="Describe your issue..."
                rows={4}
                required
                value={fields.message}
                onChange={set('message')}
                className="w-full outline-none px-4 py-3 text-sm font-mono transition-colors resize-none"
                style={{ backgroundColor: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 15%)', color: 'hsl(0 0% 98%)' }}
                onFocus={e => e.target.style.borderColor = 'hsl(217 91% 60%)'}
                onBlur={e => e.target.style.borderColor = 'hsl(0 0% 15%)'}
              />
              <button
                type="submit"
                disabled={sending}
                className="cyber-clip-button w-full py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)', opacity: sending ? 0.7 : 1 }}
              >
                {sending ? 'Transmitting…' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: 'hsl(0 0% 65%)' }}>Prefer direct contact?</p>
          <a
            href="https://wa.me/917665140660?text=Hello%2C%20I%20need%20support%20from%20Spyrewall"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-clip-button inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300"
            style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
