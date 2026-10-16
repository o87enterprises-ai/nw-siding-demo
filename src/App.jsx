import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProposalPage from './pages/ProposalPage'
import ServiceAgreementGate from './components/ServiceAgreementGate'
import { O87Watermark } from './components/O87'

function ProposalCTA() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1525 50%, #0A0F1E 100%)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Gold glow behind */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Gold top bar */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '120px', height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{
          fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem',
        }}>
          Prepared Exclusively for Northwest Siding
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
          fontWeight: 700, color: 'var(--text)',
          lineHeight: 1.1, marginBottom: '1rem',
        }}>
          Your Custom Growth Plan <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Is Ready.</em>
        </h2>

        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          color: 'var(--text-muted)', lineHeight: 1.75,
          maxWidth: '520px', margin: '0 auto 2.5rem',
        }}>
          See exactly what we'd build, how it grows your leads, and what it costs —
          three tiers, full pricing, no pressure.
        </p>

        <Link to="/proposal" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          background: 'var(--gold)',
          color: 'var(--bg)',
          padding: 'clamp(1rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem)',
          borderRadius: '4px',
          fontWeight: 700,
          fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          boxShadow: '0 0 40px rgba(201,169,110,0.25), 0 4px 20px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(201,169,110,0.38), 0 8px 30px rgba(0,0,0,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(201,169,110,0.25), 0 4px 20px rgba(0,0,0,0.4)' }}
        >
          View Your Proposal
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 9h16M9 1l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div style={{
          marginTop: '1.8rem',
          fontSize: '0.72rem', color: 'var(--text-subtle)',
          letterSpacing: '0.1em',
        }}>
          3 tiers · Full pricing · Website always included
        </div>
      </motion.div>
    </section>
  )
}

function HomePage() {
  return (
    <div style={{ position: 'relative' }}>
      <O87Watermark />
      <Hero />
      <ProposalCTA />
      <Stats />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ServiceAgreementGate>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proposal" element={<ProposalPage />} />
        </Routes>
      </ServiceAgreementGate>
    </BrowserRouter>
  )
}
