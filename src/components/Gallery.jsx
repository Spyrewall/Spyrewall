import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const photos = [
  { src: '/gallery1.jpg' },
  { src: '/gallery2.jpg' },
  { src: '/gallery3.jpg' },
  { src: '/gallery4.jpg' },
  { src: '/gallery5.jpg' },
  { src: '/gallery6.jpg' },
  { src: '/gallery-ryan1.jpeg' },
  { src: '/gallery-ryan2.jpeg' },
  { src: '/gallery-ryan3.jpeg' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="gallery" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(0 0% 12%)' }}>
      <div className="absolute inset-0 cyber-grid pointer-events-none" style={{ opacity: 0.1 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">
            Photo <span style={{ color: 'hsl(217 91% 60%)' }}>Gallery</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'hsl(217 91% 60%)' }} />
          <p style={{ color: 'hsl(0 0% 65%)' }} className="max-w-2xl mx-auto">
            Inside the world of Spyrewall — operations, training, and deployments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative group overflow-hidden cursor-pointer"
              style={{
                border: '1px solid hsl(217 91% 60% / 0.2)',
                aspectRatio: '16/9',
                transition: 'border-color 0.3s',
              }}
              onClick={() => setLightbox(photo.src)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(217 91% 60% / 0.2)'}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'hsl(0 0% 4% / 0.7)' }}
              >
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'hsl(0 0% 4% / 0.95)', backdropFilter: 'blur(8px)' }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 transition-colors"
              style={{ color: 'hsl(0 0% 98%)' }}
              onClick={() => setLightbox(null)}
            >
              <X size={32} />
            </button>
            <img
              src={lightbox}
              alt="Gallery"
              className="max-w-full object-contain"
              style={{
                maxHeight: '85vh',
                border: '1px solid hsl(217 91% 60% / 0.3)',
                boxShadow: '0 0 40px rgba(59,130,246,0.2)',
              }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
