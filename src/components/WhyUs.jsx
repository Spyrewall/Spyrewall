import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Terminal, Trophy, HandshakeIcon, ChevronRight } from 'lucide-react'

const reasons = [
  {
    title: 'Industry-Certified Mentors',
    desc: 'Learn directly from active penetration testers, auditors, and CTF champions — not classroom-only instructors.',
    icon: Users,
  },
  {
    title: 'Hands-On Cyber Ranges',
    desc: 'Every workshop and course pairs theory with live labs, real exploits, and CTF challenges you can put on a resume.',
    icon: Terminal,
  },
  {
    title: 'Career-Aligned Curriculum',
    desc: 'Our programs map to globally recognized certifications and the skills employers actually hire for in 2026.',
    icon: Trophy,
  },
  {
    title: 'End-to-End Security Partner',
    desc: 'From awareness sessions for your team to full penetration testing of your stack, we cover every layer of defense.',
    icon: HandshakeIcon,
  },
]

export default function WhyUs({ showVisual = true }) {
  if (!showVisual) {
    return (
      <section id="why-us" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, hsl(217 91% 60% / 0.03) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] mb-4 inline-block" style={{ color: 'hsl(217 91% 60%)' }}>
              // Why Spyrewall
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4" style={{ color: 'hsl(0 0% 98%)' }}>
              SECURITY THAT{' '}
              <span style={{ color: 'hsl(217 91% 60%)', textShadow: '0 0 20px hsl(217 91% 60% / 0.6)' }}>
                TEACHES
              </span>{' '}
              &amp; DEFENDS
            </h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
            <p className="max-w-2xl mx-auto text-lg" style={{ color: 'hsl(0 0% 65%)' }}>
              Most firms either train you or test your systems. Spyrewall does both — turning learners into
              defenders and defenders into offensive experts, all under one roof.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                className="flex flex-col gap-3 p-8 cyber-clip transition-all duration-300"
                style={{ backgroundColor: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'}
              >
                <div className="flex items-center gap-3">
                  <reason.icon className="w-6 h-6" style={{ color: 'hsl(217 91% 60%)' }} />
                  <h4 className="font-display font-bold uppercase tracking-wide" style={{ color: 'hsl(0 0% 98%)' }}>
                    {reason.title}
                  </h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="cyber-clip-button inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 group"
              style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
            >
              Explore Programs
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/support"
              className="cyber-clip-button inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300"
              style={{ border: '1px solid hsl(217 91% 60% / 0.5)', color: 'hsl(0 0% 98%)' }}
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="why-us" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 4%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, hsl(217 91% 60% / 0.03) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Pulsing logo visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative flex items-center justify-center aspect-square w-full max-w-[460px] mx-auto">
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)', filter: 'blur(60px)' }}
              />
              <div
                className="absolute inset-4 rounded-full overflow-hidden z-20 pointer-events-none"
                style={{ mixBlendMode: 'screen', opacity: 0.5 }}
              >
                <motion.div
                  className="w-full h-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0%, rgba(255, 0, 0, 0.1) 80%, rgba(255, 0, 0, 0.8) 100%)',
                    willChange: 'transform',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <motion.img
                src="/spyrewall-logo.png"
                alt="Spyrewall Logo"
                className="relative z-10 w-full h-full object-cover rounded-full"
                style={{ border: '2px solid hsl(217 91% 60% / 0.4)' }}
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    'drop-shadow(0 0 30px rgba(255,30,30,0.6))',
                    'drop-shadow(0 0 50px rgba(59,130,246,0.9))',
                    'drop-shadow(0 0 30px rgba(255,30,30,0.6))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* RIGHT: Why Spyrewall content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center order-1 lg:order-2"
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] mb-4" style={{ color: 'hsl(217 91% 60%)' }}>
              // Why Spyrewall
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-6" style={{ color: 'hsl(0 0% 98%)' }}>
              SECURITY THAT{' '}
              <span style={{ color: 'hsl(217 91% 60%)', textShadow: '0 0 20px hsl(217 91% 60% / 0.6)' }}>
                TEACHES
              </span>{' '}
              &amp; DEFENDS
            </h2>
            <p
              className="mb-10 text-lg pl-4"
              style={{ color: 'hsl(0 0% 65%)', borderLeft: '2px solid hsl(217 91% 60% / 0.5)' }}
            >
              Most firms either train you or test your systems. Spyder Sec does both — turning learners into
              defenders and defenders into offensive experts, all under one roof.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {reasons.map((reason, i) => (
                <motion.div
                  key={reason.title}
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="flex items-center gap-3">
                    <reason.icon className="w-6 h-6" style={{ color: 'hsl(217 91% 60%)' }} />
                    <h4 className="font-display font-bold uppercase tracking-wide" style={{ color: 'hsl(0 0% 98%)' }}>
                      {reason.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                    {reason.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="cyber-clip-button inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 group"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
              >
                Explore Programs
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/support"
                className="cyber-clip-button inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ border: '1px solid hsl(217 91% 60% / 0.5)', color: 'hsl(0 0% 98%)' }}
              >
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
