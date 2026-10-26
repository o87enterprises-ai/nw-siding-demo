import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const CONTACT_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1920&q=80',
]

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  zip: '',
  service: 'Fiber Cement Siding',
  message: '',
  hp_website: '', // honeypot for spam bots
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please provide your first and last name.')
      setStatus('error')
      return
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMessage('Please provide at least a phone number or email address so we can reach you.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Failed to submit estimate request. Please try again or call us.')
      }

      setStatus('success')
    } catch (err) {
      console.error('Estimate submission error:', err)
      setStatus('error')
      setErrorMessage(err.message || 'Unable to submit your request at this time. Please call us directly at (541) 688-2997.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    setStatus('idle')
    setErrorMessage('')
  }

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

        {/* Right: form or success state */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            position: 'relative',
          }}
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                border: '1px solid var(--gold)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                color: 'var(--text)',
                marginBottom: '0.75rem',
              }}>
                Estimate Request Received!
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                maxWidth: '440px',
                margin: '0 auto 1.75rem',
              }}>
                Thank you, <strong style={{ color: 'var(--gold)' }}>{formData.firstName}</strong>. Gary and the Northwest Siding team have received your request for <strong>{formData.service}</strong>. We review all inquiries promptly and will contact you within one business day.
              </p>

              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '1.2rem',
                textAlign: 'left',
                marginBottom: '2rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <div><span style={{ color: 'var(--gold)', fontWeight: 600 }}>Project:</span> {formData.service}</div>
                {formData.phone && <div><span style={{ color: 'var(--gold)', fontWeight: 600 }}>Phone:</span> {formData.phone}</div>}
                {formData.email && <div><span style={{ color: 'var(--gold)', fontWeight: 600 }}>Email:</span> {formData.email}</div>}
                {formData.zip && <div><span style={{ color: 'var(--gold)', fontWeight: 600 }}>ZIP:</span> {formData.zip}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                <a
                  href="tel:5416882997"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Need Immediate Help? Call (541) 688-2997
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    padding: '0.5rem 1rem',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  Submit Another Estimate Request
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.4rem',
              }}>
                Request a Free Estimate
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                We respond within one business day. Usually faster.
              </p>

              {status === 'error' && errorMessage && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '3px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.82rem',
                  color: '#FCA5A5',
                  lineHeight: 1.5,
                }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Honeypot field - invisible to real users, catches bots */}
                <input
                  type="text"
                  name="hp_website"
                  value={formData.hp_website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                  aria-hidden="true"
                />

                <div className="form-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField
                    label="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Gary"
                    required
                    disabled={status === 'loading'}
                  />
                  <FormField
                    label="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Smith"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                <FormField
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(541) 000-0000"
                  type="tel"
                  required
                  disabled={status === 'loading'}
                />

                <FormField
                  label="Email Address *"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  type="email"
                  required
                  disabled={status === 'loading'}
                />

                <FormField
                  label="ZIP Code *"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="97405"
                  required
                  disabled={status === 'loading'}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="service-select" style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Service Needed
                  </label>
                  <select
                    id="service-select"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      padding: '0.75rem 1rem',
                      borderRadius: '2px',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                    }}
                  >
                    <option value="Fiber Cement Siding">Fiber Cement Siding (James Hardie®)</option>
                    <option value="Cedar / Wood Siding">Cedar / Wood Siding</option>
                    <option value="Replacement Windows">Replacement Windows (Milgard®)</option>
                    <option value="Seamless Gutters">Seamless Gutters</option>
                    <option value="Painting & Trim">Painting & Trim</option>
                    <option value="Multiple Services">Multiple Services / Complete Exterior</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="project-notes" style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Project Details or Scope (Optional)
                  </label>
                  <textarea
                    id="project-notes"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your home (e.g., approximate home size, current siding material, timeline, or dry rot concerns)..."
                    rows={3}
                    disabled={status === 'loading'}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      padding: '0.75rem 1rem',
                      borderRadius: '2px',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--gold-line)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '0.5rem',
                    padding: '1rem',
                    opacity: status === 'loading' ? 0.75 : 1,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'loading' ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit Estimate Request</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.2rem' }}>
                  Licensed · Bonded · Insured · CCB #136733
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>

    </section>
  )
}

function FormField({ label, name, value, onChange, placeholder, type = 'text', required = false, disabled = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label
        htmlFor={name}
        style={{
          fontSize: '0.68rem', fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
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
