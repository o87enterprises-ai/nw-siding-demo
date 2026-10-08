import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const INTERVAL = 6500

export default function SectionBackground({ images, overlay = 0.82, gradient }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % images.length), INTERVAL)
    return () => clearInterval(t)
  }, [images.length])

  const overlayStyle = gradient
    ? { background: gradient }
    : { background: `rgba(8,12,20,${overlay})` }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.8, ease: 'easeInOut' },
            scale: { duration: INTERVAL / 1000 + 2, ease: 'linear' },
          }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${images[current]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>
      {/* Dark overlay to keep content readable */}
      <div style={{ position: 'absolute', inset: 0, ...overlayStyle }} />
    </div>
  )
}
