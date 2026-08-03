import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'How do I connect with Spyrewall?',
    a: 'Reach us anytime through phone or WhatsApp at 7665140660, or email Spyrewall@gmail.com',
  },
  {
    q: 'Can we invite Spyrewall to our school, college, university, NGO, or organization?',
    a: "Yes — we regularly partner with educational institutions and organizations for training sessions and awareness programs. Reach out through our support channels with your requirements and we'll help you set it up.",
  },
  {
    q: 'Does Spyrewall do webinars, seminars, workshops, and awareness campaigns?',
    a: 'Yes. We run workshops, webinars, seminars, CTF challenges, and career counselling sessions — all hands-on, pairing theory with live labs and real exploits rather than just lectures.',
  },
  {
    q: 'What does Spyrewall actually do?',
    a: "We're an end-to-end cybersecurity partner — we secure your systems through audits and penetration testing, keep you compliant with standards like SOC2, ISO27001, HIPAA, and GDPR, and train your team through workshops and certification courses.",
  },
  {
    q: 'How is Spyrewall different from other security firms?',
    a: 'Most firms either train you or test your systems — we do both. We turn learners into defenders and defenders into offensive experts, all under one roof.',
  },
  {
    q: 'What will I actually get from a certification course?',
    a: 'Every course pairs theory with live labs, real exploits, and CTF challenges — practical skills you can put directly on your resume, not just theory.',
  },
  {
    q: 'Do your certifications lead to real job opportunities?',
    a: 'Yes. Our curriculum maps to certifications and the skills employers are actually hiring for, and we also run a careers page connecting learners with internships and job openings from recruiters.',
  },
  {
    q: 'What happens if we\'re hit with a security incident?',
    a: 'Our support team is available 24/7 by phone, email, and WhatsApp.',
  },
  {
    q: 'Can Spyrewall handle our compliance requirements?',
    a: 'Yes , our compliance management service helps you meet regulatory standards like SOC2, ISO27001, HIPAA, and GDPR with automated governance, so you\'re audit-ready.',
  },
  {
    q: 'We\'re not big on cybersecurity — where do we start?',
    a: 'Start with a security audit. We\'ll assess your architecture and configuration, flag vulnerabilities, and recommend next steps.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section id="faq" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 6%)' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.08 }} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)', color: 'hsl(217 91% 60%)', border: '1px solid hsl(217 91% 60% / 0.3)' }}>
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4" style={{ color: 'hsl(0 0% 98%)' }}>
            EVERYTHING YOU NEED TO <span style={{ color: 'hsl(217 91% 60%)' }}>KNOW</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
          <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto text-base">
            Have questions about our training, security audits, or partnership programs? Here are the answers.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="cyber-clip transition-all duration-300 overflow-hidden"
                style={{
                  backgroundColor: 'hsl(0 0% 9%)',
                  border: isOpen ? '1px solid hsl(217 91% 60% / 0.6)' : '1px solid hsl(0 0% 16%)',
                  boxShadow: isOpen ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors"
                >
                  <span className="font-display font-semibold text-base md:text-lg uppercase tracking-wide" style={{ color: isOpen ? 'hsl(217 91% 60%)' : 'hsl(0 0% 98%)' }}>
                    {faq.q}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: isOpen ? 'hsl(217 91% 60% / 0.2)' : 'hsl(0 0% 14%)',
                      border: '1px solid ' + (isOpen ? 'hsl(217 91% 60% / 0.5)' : 'hsl(0 0% 22%)'),
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: isOpen ? 'hsl(217 91% 60%)' : 'hsl(0 0% 70%)' }} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div
                        className="px-6 pb-6 pt-2 text-sm leading-relaxed font-inter"
                        style={{ color: 'hsl(0 0% 70%)', borderTop: '1px solid hsl(0 0% 14%)' }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
