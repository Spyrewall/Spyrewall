import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, Clock, Star, LifeBuoy, MessageSquareQuote } from 'lucide-react'
import { triggerChatBot } from './ChatBox'

const contactInfo = [
  { icon: Phone, title: 'Phone Number', detail: '7665140660', sub: 'Call us anytime' },
  { icon: Mail, title: 'Email Support', detail: 'Spyrewall@gmail.com', sub: 'Response within 1 hour' },
  { icon: MessageCircle, title: 'WhatsApp Support', detail: '7665140660', sub: 'Chat with us on WhatsApp' },
  { icon: Clock, title: 'SLA Commitment', detail: '< 15 min', sub: 'Critical incident response time' },
]

const testimonials = [
  {
    name: 'Khushi Jain',
    company: 'Spyrewall',
    rating: 5,
    text: 'This was one of the best courses I have taken, Sir was very supportive, 5/5 Star',
  },
  {
    name: 'Anonymous',
    company: 'Spyrewall',
    rating: 5,
    text: 'Excellent cybersecurity training. The hands-on approach made complex concepts easy to understand.',
  },
  {
    name: 'Anonymous',
    company: 'Spyrewall',
    rating: 5,
    text: 'Professional team, great content and very helpful sessions. Highly recommended!',
  },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{ color: 'hsl(217 91% 60%)', fill: i < count ? 'hsl(217 91% 60%)' : 'transparent' }}
        />
      ))}
    </div>
  )
}

export default function Support() {
  return (
    <>
      {/* ───── 24/7 SUPPORT SECTION (TOP) ───── */}
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

          {/* Contact info cards */}
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

          {/* Raise Support Ticket via Bot CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto cyber-clip p-8 text-center"
            style={{ border: '1px solid hsl(217 91% 60% / 0.3)', backgroundColor: 'hsl(0 0% 8%)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'hsl(217 91% 60% / 0.15)', border: '2px solid hsl(217 91% 60% / 0.5)' }}
            >
              <LifeBuoy className="w-8 h-8" style={{ color: 'hsl(217 91% 60%)' }} />
            </div>
            <h3 className="font-display font-bold uppercase tracking-widest text-2xl mb-3" style={{ color: 'hsl(0 0% 98%)' }}>
              Need Assistance? <span style={{ color: 'hsl(217 91% 60%)' }}>Raise a Ticket</span>
            </h3>
            <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: 'hsl(0 0% 65%)' }}>
              To raise a technical support ticket or report an incident, launch our automated Spyrewall Chat Bot below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => triggerChatBot('ticket')}
                className="cyber-clip-button inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
              >
                <LifeBuoy className="w-4.5 h-4.5" />
                Raise Support Ticket via Bot
              </button>
              <a
                href="https://wa.me/917665140660?text=Hello%2C%20I%20need%20support%20from%20Spyrewall"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-clip-button inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ backgroundColor: 'hsl(0 0% 14%)', color: 'hsl(0 0% 90%)', border: '1px solid hsl(0 0% 25%)' }}
              >
                <MessageCircle className="w-4.5 h-4.5" style={{ color: '#25D366' }} />
                Direct WhatsApp Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── CLIENT FEEDBACK SECTION (MIDDLE / BOTTOM) ───── */}
      <section id="feedback" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 12%)' }}>
        <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.1 }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">
              Client <span style={{ color: 'hsl(217 91% 60%)' }}>Feedback</span>
            </h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
            <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto">
              Hear from those who trust Spyrewall to guard their digital frontier.
            </p>
          </motion.div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name + i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4 p-6 cyber-clip transition-all duration-300"
                style={{ border: '1px solid hsl(217 91% 60% / 0.2)', backgroundColor: 'hsl(0 0% 4%)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.5)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <StarRating count={t.rating} />
                <p className="text-sm leading-relaxed italic flex-1" style={{ color: 'hsl(0 0% 65%)' }}>
                  "{t.text}"
                </p>
                <div className="pt-4" style={{ borderTop: '1px solid hsl(0 0% 15%)' }}>
                  <p className="font-display font-bold text-sm" style={{ color: 'hsl(0 0% 98%)' }}>{t.name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(217 91% 60%)' }}>{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Share Feedback via Bot CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto cyber-clip p-8 text-center"
            style={{ border: '1px solid hsl(217 91% 60% / 0.3)', backgroundColor: 'hsl(0 0% 4%)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'hsl(217 91% 60% / 0.15)', border: '2px solid hsl(217 91% 60% / 0.5)' }}
            >
              <MessageSquareQuote className="w-8 h-8" style={{ color: 'hsl(217 91% 60%)' }} />
            </div>
            <h3 className="font-display font-bold uppercase tracking-widest text-2xl mb-3" style={{ color: 'hsl(0 0% 98%)' }}>
              Have an Experience to <span style={{ color: 'hsl(217 91% 60%)' }}>Share?</span>
            </h3>
            <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: 'hsl(0 0% 65%)' }}>
              We'd love to hear your feedback! Click below to share your experience directly via the Spyrewall Chat Bot.
            </p>
            <button
              onClick={() => triggerChatBot('feedback')}
              className="cyber-clip-button inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
            >
              <Star className="w-4.5 h-4.5 fill-current" />
              Share Feedback via Chat Bot
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
