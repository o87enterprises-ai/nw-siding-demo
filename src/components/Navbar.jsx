import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const links = ['Services', 'Portfolio', 'About', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          height: 'var(--nav-h)',
          background: scrolled ? 'rgba(8,12,20,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        {/* Wordmark */}
        <Link to="/">
          <Logo size={36} showTagline={true} showBackground={false} />
        </Link>

        {/* Desktop nav */}
        <div style={{ alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{
              fontSize: '0.72rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--text-muted)', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{link}</a>
          ))}

          <a href="#contact" className="btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.68rem' }}>
            Book a Free Estimate
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1.5px',
              background: 'var(--text)', transition: 'transform 0.3s, opacity 0.3s',
              transformOrigin: 'center',
              transform: menuOpen
                ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-6.5px) rotate(-45deg)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 99,
              background: 'rgba(8,12,20,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '2rem clamp(1.5rem, 5vw, 4rem)',
              display: 'flex', flexDirection: 'column', gap: '1.5rem',
            }}
          >
            {links.map((link, i) => (
              <motion.a key={link} href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}
              >{link}</motion.a>
            ))}
            <a href="#contact" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
              Book a Free Estimate
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
