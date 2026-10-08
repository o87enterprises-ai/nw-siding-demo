import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoMark } from './Logo'

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1920&q=80', label: 'James Hardie® Fiber Cement · Eugene, OR' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80', label: 'Complete Exterior Renovation · Springfield, OR' },
  { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80', label: 'Premium Cedar Siding · Albany, OR' },
  { url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1920&q=80', label: 'Seamless Steel Gutters · Roseburg, OR' },
  { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80', label: 'Full Exterior Remodel · Creswell, OR' },
]

const INTERVAL = 7000

const STATS = [
  { value: '25+',    label: 'Years in Business' },
  { value: '2,000+', label: 'Homes Completed' },
  { value: 'A+',     label: 'BBB Rating' },
  { value: '4.9★',   label: 'Customer Rating' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = Date.now()
    let raf
    const tick = () => {
      const elapsed = Date.now() - start
      if (Math.floor(elapsed / INTERVAL) > Math.floor((elapsed - 16) / INTERVAL)) {
        setCurrent(c => (c + 1) % SLIDES.length)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="hero-section">
      {/* ── Ken Burns background ── */}
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1.07 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5, ease: 'easeInOut' }, scale: { duration: INTERVAL / 1000 + 1.5, ease: 'linear' } }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${SLIDES[current].url})`,
            backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `linear-gradient(180deg,
          rgba(8,12,20,0.72) 0%,
          rgba(8,12,20,0.45) 30%,
          rgba(8,12,20,0.70) 65%,
          rgba(8,12,20,0.93) 100%)`,
      }} />

      {/* Siding-board stripe texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(180deg,
          transparent 0px, transparent 47px,
          rgba(201,169,110,0.03) 47px, rgba(201,169,110,0.03) 50px)`,
      }} />

      {/* Gold radial glow */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* ── Hero content ── */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div className="hero-inner">

          {/* Brand logo */}
          <motion.div
            className="hero-logo-wrap"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoMark size={180} />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="hero-divider"
          />

          {/* Headline */}
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="hero-h1"
            >
              Eugene's Exterior
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}
              className="hero-h1 hero-h1-gold"
            >
              Gold Standard.
            </motion.h1>
          </div>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-paragraph"
          >
            The only James Hardie® Exclusive Preferred Remodeler serving
            Eugene‑Springfield. Twenty‑five years. Over 2,000 homes. A BBB A+
            record with zero complaints.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.12, ease: [0.22, 1, 0.36, 1] }}
            className="hero-buttons"
          >
            <a href="#contact" className="btn-primary">
              Get Free Estimate
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#portfolio" className="btn-ghost">View Our Work</a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stats"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="hero-stat">
                <div className="hero-stat-value">{value}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', right: 'clamp(1rem, 4vw, 4rem)',
        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem',
      }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)' }}
          >
            {SLIDES[current].label}
          </motion.span>
        </AnimatePresence>
        <div style={{ display: 'flex', gap: '5px' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? '20px' : '5px', height: '3px',
              borderRadius: '2px', background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.22)',
              border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.4s',
            }} />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{ position: 'absolute', bottom: '1.5rem', left: 'clamp(1rem, 4vw, 4rem)', display: 'flex', alignItems: 'center', gap: '0.6rem', zIndex: 10 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '30px', background: 'linear-gradient(180deg, var(--gold) 0%, transparent 100%)' }}
        />
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
      </motion.div>
    </section>
  )
}
