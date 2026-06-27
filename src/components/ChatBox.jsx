import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/917665140660?text=Hello%2C%20I%20am%20interested%20to%20Enquire%20About%20Spyrewall'

const QUICK_REPLIES = [
  { id: 'services', label: 'What services do you offer?' },
  { id: 'training', label: 'Tell me about training & certifications' },
  { id: 'pentest', label: 'I need a penetration test' },
  { id: 'contact', label: 'How do I contact you?' },
]

const BOT_REPLIES = {
  services: "We offer two main lines of work:\n\n• Cybersecurity Training & Certifications — hands-on courses with cyber ranges and live labs.\n• Penetration Testing & Security Audits — real-world offensive testing for companies.\n\nWant details on a specific area?",
  training: "Our training programs are led by industry-certified mentors (active pen testers, auditors, CTF champs). Every course pairs theory with live labs and CTF challenges you can put on a resume. Check the Certifications page for the full list.",
  pentest: "Great — our pen-testing engagements are scoped to your environment (web apps, networks, cloud, internal). We deliver a clear report with reproduction steps and remediation guidance.\n\nThe fastest way to start is a quick chat — tap the button below to message us on WhatsApp.",
  contact: "You can reach us anytime:\n\n📞 +91 7665140660\n✉️ Spyrewall@gmail.com\n💬 WhatsApp: tap the button below\n\nWe usually reply within a few hours.",
}

export default function ChatBox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Spyder Bot 🕷️ — ask me about our training, pen-testing services, or how to get in touch." },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const sendBotReply = (key, userText) => {
    setMessages(prev => [...prev, { from: 'user', text: userText }])
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: BOT_REPLIES[key] }])
    }, 400)
  }

  const handleQuickReply = (reply) => {
    sendBotReply(reply.id, reply.label)
  }

  const handleSend = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: "Thanks! For a detailed answer, our team can reply directly on WhatsApp — tap the green button below to continue the conversation there.",
      }])
    }, 500)
  }

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed z-[90] flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
        style={{
          bottom: '1.5rem',
          right: '1.5rem',
          backgroundColor: 'hsl(217 91% 60%)',
          color: 'hsl(0 0% 4%)',
          boxShadow: '0 0 20px hsl(217 91% 60% / 0.6), 0 4px 20px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[90] flex flex-col"
            style={{
              bottom: '5.5rem',
              right: '1.5rem',
              width: 'min(360px, calc(100vw - 3rem))',
              height: 'min(520px, calc(100vh - 8rem))',
              backgroundColor: 'hsl(0 0% 8%)',
              border: '1px solid hsl(217 91% 60% / 0.4)',
              boxShadow: '0 0 30px hsl(217 91% 60% / 0.25), 0 8px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: '1px solid hsl(217 91% 60% / 0.3)',
                backgroundColor: 'hsl(0 0% 6%)',
              }}
            >
              <div
                className="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden"
                style={{ border: '1px solid hsl(217 91% 60% / 0.5)' }}
              >
                <img src="/spyrewall-logo.png" alt="Spyrewall" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm uppercase tracking-widest" style={{ color: 'hsl(0 0% 98%)' }}>
                  Spyder Bot
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#22c55e' }}>
                  ● Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="px-3 py-2 text-sm whitespace-pre-line"
                    style={{
                      maxWidth: '85%',
                      backgroundColor: m.from === 'user' ? 'hsl(217 91% 60%)' : 'hsl(0 0% 14%)',
                      color: m.from === 'user' ? 'hsl(0 0% 4%)' : 'hsl(0 0% 92%)',
                      border: m.from === 'bot' ? '1px solid hsl(0 0% 20%)' : 'none',
                      borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      lineHeight: 1.45,
                    }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Quick replies — only show at the start */}
              {messages.length <= 1 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {QUICK_REPLIES.map(qr => (
                    <button
                      key={qr.id}
                      onClick={() => handleQuickReply(qr)}
                      className="px-3 py-1.5 text-xs uppercase tracking-wider font-mono transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'hsl(217 91% 70%)',
                        border: '1px solid hsl(217 91% 60% / 0.4)',
                        borderRadius: '999px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(217 91% 60% / 0.15)'; e.currentTarget.style.borderColor = 'hsl(217 91% 60%)' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.4)' }}
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mx-4 mb-2 py-2 text-sm font-bold uppercase tracking-widest transition-all"
              style={{
                backgroundColor: '#25D366',
                color: '#fff',
                borderRadius: '6px',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Continue on WhatsApp
            </a>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-3 py-3"
              style={{ borderTop: '1px solid hsl(0 0% 18%)', backgroundColor: 'hsl(0 0% 6%)' }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: 'hsl(0 0% 12%)',
                  color: 'hsl(0 0% 92%)',
                  border: '1px solid hsl(0 0% 20%)',
                  borderRadius: '6px',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'hsl(0 0% 20%)'}
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex items-center justify-center w-10 h-10 transition-all"
                style={{
                  backgroundColor: 'hsl(217 91% 60%)',
                  color: 'hsl(0 0% 4%)',
                  borderRadius: '6px',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
