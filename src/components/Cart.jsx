import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/courses'

export default function Cart() {
  const { items, removeItem, totalPrice, totalOriginalPrice, itemCount } = useCart()
  const discount = totalOriginalPrice - totalPrice

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  }

  if (items.length === 0) {
    return (
      <section className="min-h-screen py-24 bg-[hsl(0,0%,4%)] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 cyber-clip bg-[hsl(0,0%,8%)] border border-[hsl(0,0%,15%)]"
        >
          <ShoppingCart className="w-24 h-24 text-[hsl(0,0%,30%)] mb-6" />
          <h2 className="text-2xl font-display text-[hsl(0,0%,98%)] mb-4 tracking-widest uppercase">Your Cart is Empty</h2>
          <p className="text-[hsl(0,0%,65%)] mb-8 font-inter">Looks like you haven't added any certifications to your cart yet.</p>
          <Link 
            to="/certifications"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[hsl(217,91%,60%)] text-white font-mono tracking-widest uppercase text-sm cyber-clip-button hover:bg-[hsl(217,91%,70%)] transition-colors group"
          >
            BROWSE COURSES <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="min-h-screen py-24 bg-[hsl(0,0%,4%)] relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end gap-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display text-[hsl(0,0%,98%)] tracking-widest uppercase">YOUR CART</h1>
          <div className="bg-[hsl(217,91%,60%)]/20 border border-[hsl(217,91%,60%)] text-[hsl(217,91%,60%)] px-3 py-1 text-sm font-mono tracking-widest flex items-center justify-center">
            {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-4"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="bg-[hsl(0,0%,8%)] border border-[hsl(0,0%,15%)] cyber-clip p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-[hsl(217,91%,60%)]/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-display text-[hsl(0,0%,98%)] mb-2 truncate">{item.name}</h3>
                    <p className="text-[hsl(0,0%,65%)] text-sm mb-4 line-clamp-2 font-inter">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs font-mono tracking-wider">
                      <span className="px-2 py-1 bg-[hsl(0,0%,12%)] text-[hsl(0,0%,70%)] border border-[hsl(0,0%,20%)]">
                        {item.duration}
                      </span>
                      <span className="px-2 py-1 bg-[hsl(0,0%,12%)] text-[hsl(0,0%,70%)] border border-[hsl(0,0%,20%)]">
                        {item.level}
                      </span>
                      <span className="px-2 py-1 bg-[hsl(0,0%,12%)] text-[hsl(0,0%,70%)] border border-[hsl(0,0%,20%)]">
                        {item.modules} MODULES
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                    <div className="text-right">
                      {item.originalPrice > item.price && (
                        <div className="text-sm text-[hsl(0,0%,50%)] line-through font-mono">
                          {formatPrice(item.originalPrice)}
                        </div>
                      )}
                      <div className="text-xl font-display text-[hsl(217,91%,60%)]">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-[hsl(0,0%,50%)] hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-96"
          >
            <div className="bg-[hsl(0,0%,8%)] border border-[hsl(0,0%,15%)] cyber-clip p-6 sticky top-24">
              <h2 className="text-xl font-display text-[hsl(0,0%,98%)] mb-6 tracking-widest border-b border-[hsl(0,0%,15%)] pb-4">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6 font-mono text-sm">
                <div className="flex justify-between items-center text-[hsl(0,0%,70%)]">
                  <span>SUBTOTAL</span>
                  <span>{formatPrice(totalOriginalPrice)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> DISCOUNT</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-[hsl(0,0%,15%)] flex justify-between items-end">
                  <span className="text-[hsl(0,0%,98%)] font-display tracking-widest">TOTAL</span>
                  <span className="text-3xl font-display text-[hsl(217,91%,60%)]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[hsl(217,91%,60%)] text-white font-mono tracking-widest uppercase text-sm cyber-clip-button hover:bg-[hsl(217,91%,70%)] transition-colors group"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/certifications"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-transparent text-[hsl(0,0%,70%)] font-mono tracking-widest uppercase text-sm cyber-clip-button hover:text-[hsl(0,0%,98%)] hover:bg-[hsl(0,0%,12%)] border border-[hsl(0,0%,20%)] transition-colors"
                >
                  CONTINUE BROWSING
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
