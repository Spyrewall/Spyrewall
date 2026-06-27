import { motion } from 'framer-motion'
import { BookOpen, ShieldCheck, Award, Search, ClipboardCheck, GraduationCap, Globe } from 'lucide-react'

const services = [
  {
    title: 'Website Development',
    description: 'We design and build fast, secure, and professional websites — from landing pages to full-featured web applications tailored to your business needs.',
    icon: Globe,
    delay: 0.1,
  },
  {
    title: 'Workshops & Awareness Programs',
    description: 'We offer workshops, webinars, seminars, CTF challenges and Career counselling.',
    icon: BookOpen,
    delay: 0.2,
  },
  {
    title: 'Penetration Testing',
    description: 'Our team performs comprehensive security assessments to uncover vulnerabilities and deliver technical reporting for proactive risk mitigation.',
    icon: ShieldCheck,
    delay: 0.3,
  },
  {
    title: 'Badges & Honors',
    description: 'We provide comprehensive courses in Cybersecurity, AI, Software Development, and core Engineering disciplines.',
    icon: Award,
    delay: 0.4,
  },
  {
    title: 'Security Audits',
    description: 'Comprehensive analysis of your security posture, identifying weaknesses in architecture and configuration.',
    icon: Search,
    delay: 0.5,
  },
  {
    title: 'Compliance Management',
    description: 'Ensure your systems meet regulatory standards (SOC2, ISO27001, HIPAA, GDPR) with automated governance.',
    icon: ClipboardCheck,
    delay: 0.6,
  },
  {
    title: 'Security Training',
    description: 'Empower your workforce. Social engineering simulations and operational security training for personnel.',
    icon: GraduationCap,
    delay: 0.7,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 relative" style={{ backgroundColor: 'hsl(0 0% 4%)', borderTop: '1px solid hsl(0 0% 15%)' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(217 91% 60% / 0.5), transparent)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            SERVICES <span style={{ color: 'hsl(217 91% 60%)' }}>WE OFFER</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
          <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto">
            We track, trap, and terminate cyber threats.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: service.delay, duration: 0.5, ease: 'easeOut' }}
              className="group relative cyber-clip cyber-panel-decoration p-8 transition-all duration-300"
              style={{
                backgroundColor: 'hsl(0 0% 7%)',
                border: '1px solid hsl(0 0% 15%)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'}
            >
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, transparent, transparent)' }} />
              <div
                className="w-14 h-14 flex items-center justify-center mb-6 transition-colors"
                style={{ backgroundColor: 'hsl(0 0% 12%)', border: '1px solid hsl(0 0% 15%)' }}
              >
                <service.icon className="w-7 h-7" style={{ color: 'hsl(217 91% 60%)' }} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 uppercase tracking-wide" style={{ color: 'hsl(0 0% 98%)' }}>
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                {service.description}
              </p>
              <div className="mt-6 flex items-center text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'hsl(217 91% 60%)' }}>
                <span className="mr-2">_</span> INITIATE PROTOCOL <span className="ml-2 animate-pulse">_</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
