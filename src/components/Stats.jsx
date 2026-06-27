import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 1, suffix: '', label: 'Clients Protected' },
  { value: 99.9, suffix: '%', label: 'Uptime Guaranteed', decimals: 1 },
  { value: 24, suffix: '/7', label: 'Active Monitoring' },
  { value: 18, suffix: '', label: 'Students Certified' },
]

function AnimatedNumber({ value, suffix, decimals = 0 }) {
  const [display, setDisplay] = useState('0')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { damping: 60, stiffness: 100 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); motionVal.set(value) } },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, motionVal, started])

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(v.toFixed(decimals)))
  }, [spring, decimals])

  return <span ref={ref}>{display}{suffix}</span>
}

export default function Stats() {
  return (
    <section className="py-16 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 12%)', borderTop: '1px solid hsl(0 0% 15%)', borderBottom: '1px solid hsl(0 0% 15%)' }}>
      <div className="absolute inset-0 cyber-dots pointer-events-none" style={{ opacity: 0.3 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center px-4 flex flex-col items-center"
            >
              <div className="text-4xl md:text-5xl font-display font-black mb-2" style={{ color: 'hsl(0 0% 98%)' }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-sm font-mono uppercase tracking-widest" style={{ color: 'hsl(217 91% 60%)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
