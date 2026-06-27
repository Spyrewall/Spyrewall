import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  const line1 = 'WE SECURE THE'.split(' ')
  const line2 = 'UNSEEN THREATS'.split(' ')

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.svg" alt="" className="w-full h-full object-cover" style={{ opacity: 0.7 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(0 0% 4% / 0.4), hsl(0 0% 4% / 0.8), hsl(0 0% 4%))' }} />
        <div className="absolute inset-0 cyber-grid" style={{ opacity: 0.2 }} />
        <motion.div
          className="absolute inset-0 h-[10%]"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.05), transparent)' }}
          animate={{ y: ['-100%', '1000%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded w-fit"
              style={{ border: '1px solid hsl(217 91% 60% / 0.3)', backgroundColor: 'hsl(217 91% 60% / 0.05)' }}
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inline-flex h-full w-full rounded-full"
                  style={{ backgroundColor: 'hsl(217 91% 60%)' }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'hsl(0 0% 65%)' }}>
                SYSTEM SECURE &amp; ONLINE
              </span>
            </motion.div>

            <div className="flex flex-col gap-2">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-display font-black uppercase leading-none tracking-tight">
                {line1.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="inline-block mr-4"
                    style={{ color: 'hsl(0 0% 98%)' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-display font-black uppercase leading-none tracking-tight">
                {line2.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="inline-block mr-4"
                    style={{ color: 'hsl(217 91% 60%)' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg max-w-md leading-relaxed italic"
              style={{ color: 'hsl(0 0% 65%)' }}
            >
              "The Smarter You Are, The Safer You'll Be"
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/services"
                className="cyber-clip-button px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ backgroundColor: 'hsl(217 91% 60%)', color: 'hsl(0 0% 4%)' }}
              >
                Initiate Defense
              </Link>
              <Link
                to="/support"
                className="cyber-clip-button px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300"
                style={{ border: '1px solid hsl(217 91% 60% / 0.5)', color: 'hsl(0 0% 98%)' }}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ping-${i}`}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid hsl(217 91% 60%)', willChange: 'transform, opacity' }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
                />
              ))}

              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid hsl(217 91% 60% / 0.2)',
                  borderTopColor: 'hsl(217 91% 60%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full"
                style={{
                  border: '1px solid rgba(68, 136, 255, 0.2)',
                  borderRightColor: '#4488ff',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-8 rounded-full"
                style={{
                  border: '1px solid hsl(217 91% 60% / 0.1)',
                  borderBottomColor: 'hsl(217 91% 60%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              <div
                className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden z-10"
                style={{
                  border: '2px solid hsl(217 91% 60% / 0.4)',
                  boxShadow: '0 0 30px rgba(59,130,246,0.5), inset 0 0 30px rgba(59,130,246,0.2)',
                  filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.4))',
                }}
              >
                <motion.img
                  src="/spyrewall-logo.png"
                  alt="Spyrewall Logo"
                  className="w-full h-full object-cover"
                  style={{ transform: 'scale(1.1)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="absolute top-4 right-2 sm:right-4 px-3 py-1 text-xs font-mono uppercase tracking-widest z-20"
                style={{ backgroundColor: 'hsl(0 0% 7%)', border: '1px solid hsl(217 91% 60% / 0.3)', color: 'hsl(0 0% 65%)' }}>
                THREAT LEVEL<br />
                <span style={{ color: 'hsl(217 91% 60%)' }}>NEUTRALIZED</span>
              </div>
              <div className="absolute bottom-4 left-2 sm:left-4 px-3 py-1 text-xs font-mono z-20"
                style={{ backgroundColor: 'hsl(0 0% 7%)', border: '1px solid hsl(217 91% 60% / 0.3)', color: 'hsl(0 0% 65%)' }}>
                🔒 ENCRYPTION<br />
                <span style={{ color: 'hsl(0 0% 98%)' }}>AES-256 ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
