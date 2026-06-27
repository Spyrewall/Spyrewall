import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

const certs = [
  {
    name: 'Introduction To Operating System',
    full: 'Foundations of OS concepts and architecture',
    body: 'Spyrewall',
  },
  {
    name: 'Basic Fundamentals of Cyber Security',
    full: 'Beginner friendly for people who want to start their journey in cyber security.',
    body: 'Spyrewall',
  },
  {
    name: 'Programming Languages',
    full: 'Learn essential programming languages used in cybersecurity and ethical hacking.',
    body: 'Spyrewall',
  },
  {
    name: 'SOC Analyst',
    full: 'Security Operations Center analyst skills, threat monitoring and incident response.',
    body: 'Spyrewall',
  },
  {
    name: 'Penetration Testing',
    full: 'Ethical hacking and penetration testing methodologies for real-world assessments.',
    body: 'Spyrewall',
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 12%)' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.1 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">
            Our <span style={{ color: 'hsl(217 91% 60%)' }}>Certifications</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
          <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto">
            Industry-recognized credentials that validate our expertise and commitment to cybersecurity excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="cyber-clip p-6 transition-all duration-300 group"
              style={{
                backgroundColor: 'hsl(0 0% 4%)',
                border: '1px solid hsl(0 0% 15%)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-full shrink-0 transition-all duration-300"
                  style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)', border: '1px solid hsl(217 91% 60% / 0.3)' }}
                >
                  <BadgeCheck className="w-6 h-6" style={{ color: 'hsl(217 91% 60%)' }} />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase tracking-wide mb-2 text-sm" style={{ color: 'hsl(0 0% 98%)' }}>
                    {cert.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'hsl(0 0% 65%)' }}>
                    {cert.full}
                  </p>
                  <span
                    className="inline-block text-xs font-mono uppercase tracking-widest px-2 py-1"
                    style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)', color: 'hsl(217 91% 60%)', border: '1px solid hsl(217 91% 60% / 0.3)' }}
                  >
                    {cert.body}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
