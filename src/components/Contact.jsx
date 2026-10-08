import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const CONTACT_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1920&q=80',
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="contact"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SectionBackground
        images={CONTACT_IMAGES}
        gradient="linear-gradient(160deg, rgba(8,12,20,0.90) 0%, rgba(13,18,32,0.82) 100%)"
      />

      {/* Architectural grid lines overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent 0px, transparent 79px,
          rgba(201,169,110,0.03) 79px, rgba(201,169,110,0.03) 80px
        )`,
        pointerEvents: 'none',
      }} />

      <div
        ref={ref}
        className="contact-grid"
        style={{
          maxWidth: '1200px', margin: '0 auto',
          position: 'relative', zIndex: 2,
          display: 'grid',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
        }}
      >
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="gold-line" />
            <span className="label">Get Started</span>
            <h2
              className="section-title"
              style={{ marginTop: '1rem', marginBottom: '1.5rem' }}
            >
              Ready to Transform <em>Your Home?</em>
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: '420px',
            }}>
              We respond within one business day and can have an estimate in your
              hands within 24 hours. No pressure, no hard sell — just a straightforward
              conversation about your project.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            {/* Phone */}
            <a
              href="tel:5416882997"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.2rem 1.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-line)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--gold-dim)', border: '1px solid var(--gold-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V13a1 1 0 01-1 1h-2C7.82 14 2 8.18 2 3z" fill="var(--gold)"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Call Us</div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>(541) 688-2997</div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:sidinggurus@northwestsiding.com"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.2rem 1.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-line)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--gold-dim)', border: '1px solid var(--gold-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.5 4A1.5 1.5 0 013 2.5h10A1.5 1.5 0 0114.5 4v8A1.5 1.5 0 0113 13.5H3A1.5 1.5 0 011.5 12V4zm1.5 0l5 3.5L13 4M3 12h10V5.5L8 9 3 5.5V12z" fill="var(--gold)"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Email Us</div>
                <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.88rem' }}>sidinggurus@northwestsiding.com</div>
              </div>
            </a>

            {/* Address */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.2rem 1.5rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--gold-dim)', border: '1px solid var(--gold-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                  <path d="M7 1C4.24 1 2 3.24 2 6c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 115.5 6 1.5 1.5 0 017 7.5z" fill="var(--gold)"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Office</div>
                <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.88rem' }}>608 Startouch Dr, Eugene, OR 97405</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.4rem',
          }}>Request a Free Estimate</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            We respond within one business day. Usually faster.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="First Name" placeholder="Travis" />
              <FormField label="Last Name" placeholder="Prine" />
            </div>
            <FormField label="Phone Number" placeholder="(541) 000-0000" type="tel" />
            <FormField label="Email Address" placeholder="you@email.com" type="email" />
            <FormField label="ZIP Code" placeholder="97405" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Service Needed
              </label>
              <select style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '0.75rem 1rem',
                borderRadius: '2px',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}>
                <option>Fiber Cement Siding</option>
                <option>Cedar / Wood Siding</option>
                <option>Replacement Windows</option>
                <option>Seamless Gutters</option>
                <option>Painting & Trim</option>
                <option>Multiple Services</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem' }}
            >
              Submit Estimate Request
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.2rem' }}>
              Licensed · Bonded · Insured · CCB #136733
            </p>
          </form>
        </motion.div>
      </div>

    </section>
  )
}

function FormField({ label, placeholder, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        fontSize: '0.68rem', fontWeight: 500,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          padding: '0.75rem 1rem',
          borderRadius: '2px',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--gold-line)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}
