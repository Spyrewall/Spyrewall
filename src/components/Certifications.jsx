import { motion } from 'framer-motion'
import { BadgeCheck, ShoppingCart, Check, Clock, BookOpen, BarChart3, Ban } from 'lucide-react'
import { COURSES, formatPrice } from '../data/courses'
import { useCart } from '../context/CartContext'

export default function Certifications() {
  const { addItem, isInCart } = useCart()

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
          {COURSES.map((cert, i) => {
            const inCart = isInCart(cert.id)
            const isSoldOut = cert.soldOut
            const discount = Math.round(((cert.originalPrice - cert.price) / cert.originalPrice) * 100)
            
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="cyber-clip p-6 transition-all duration-300 group flex flex-col h-full relative"
                style={{
                  backgroundColor: 'hsl(0 0% 4%)',
                  border: isSoldOut ? '1px solid hsl(0 0% 15%)' : '1px solid hsl(0 0% 15%)',
                  opacity: isSoldOut ? 0.85 : 1,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isSoldOut ? 'hsl(0 70% 50% / 0.4)' : 'hsl(217 91% 60% / 0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'}
              >
                {/* Sold out overlay tag */}
                {isSoldOut && (
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1"
                      style={{
                        backgroundColor: 'hsl(0 75% 50% / 0.15)',
                        color: 'hsl(0 85% 65%)',
                        border: '1px solid hsl(0 75% 50% / 0.4)',
                      }}
                    >
                      <Ban className="w-3 h-3" /> SOLD OUT
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isSoldOut ? 'hsl(0 0% 15%)' : 'hsl(217 91% 60% / 0.1)',
                      border: isSoldOut ? '1px solid hsl(0 0% 25%)' : '1px solid hsl(217 91% 60% / 0.3)',
                    }}
                  >
                    <BadgeCheck className="w-6 h-6" style={{ color: isSoldOut ? 'hsl(0 0% 50%)' : 'hsl(217 91% 60%)' }} />
                  </div>
                  <div className="pr-16">
                    <h3 className="font-display font-bold uppercase tracking-wide mb-2 text-sm" style={{ color: isSoldOut ? 'hsl(0 0% 80%)' : 'hsl(0 0% 98%)' }}>
                      {cert.name}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                      {cert.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-1" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 65%)' }}>
                    <Clock className="w-3 h-3" /> {cert.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-1" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 65%)' }}>
                    <BarChart3 className="w-3 h-3" /> {cert.level}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-1" style={{ backgroundColor: 'hsl(0 0% 12%)', color: 'hsl(0 0% 65%)' }}>
                    <BookOpen className="w-3 h-3" /> {cert.modules} Mods
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-1"
                      style={{
                        backgroundColor: isSoldOut ? 'hsl(0 0% 15%)' : 'hsl(217 91% 60% / 0.1)',
                        color: isSoldOut ? 'hsl(0 0% 60%)' : 'hsl(217 91% 60%)',
                        border: isSoldOut ? '1px solid hsl(0 0% 25%)' : '1px solid hsl(217 91% 60% / 0.3)',
                      }}
                    >
                      {cert.provider}
                    </span>
                    <div className="text-right flex flex-col">
                      {discount > 0 && (
                        <div className="flex items-center gap-2 justify-end mb-0.5">
                          <span className="text-[10px] line-through" style={{ color: 'hsl(0 0% 40%)' }}>
                            {formatPrice(cert.originalPrice)}
                          </span>
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded-sm" style={{ backgroundColor: 'hsl(142 71% 45% / 0.1)', color: 'hsl(142 71% 45%)' }}>
                            {discount}% OFF
                          </span>
                        </div>
                      )}
                      <span className="text-lg font-bold font-mono" style={{ color: isSoldOut ? 'hsl(0 0% 60%)' : 'hsl(0 0% 98%)' }}>
                        {formatPrice(cert.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => !isSoldOut && !inCart && addItem(cert)}
                    disabled={isSoldOut || inCart}
                    className="w-full py-3 px-4 flex items-center justify-center gap-2 cyber-clip-button font-mono uppercase tracking-widest text-xs transition-all duration-300"
                    style={{
                      backgroundColor: isSoldOut
                        ? 'hsl(0 0% 12%)'
                        : inCart
                        ? 'hsl(142 71% 45% / 0.1)'
                        : 'hsl(217 91% 60% / 0.1)',
                      color: isSoldOut
                        ? 'hsl(0 0% 50%)'
                        : inCart
                        ? 'hsl(142 71% 45%)'
                        : 'hsl(217 91% 60%)',
                      border: `1px solid ${
                        isSoldOut
                          ? 'hsl(0 0% 20%)'
                          : inCart
                          ? 'hsl(142 71% 45% / 0.3)'
                          : 'hsl(217 91% 60% / 0.3)'
                      }`,
                      cursor: isSoldOut || inCart ? 'not-allowed' : 'pointer',
                      opacity: isSoldOut ? 0.6 : inCart ? 0.8 : 1,
                    }}
                  >
                    {isSoldOut ? (
                      <>
                        <Ban className="w-4 h-4" /> SOLD OUT
                      </>
                    ) : inCart ? (
                      <>
                        <Check className="w-4 h-4" /> IN CART
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> ADD TO CART
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
