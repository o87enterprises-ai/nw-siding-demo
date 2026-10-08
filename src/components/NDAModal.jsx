import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const SESSION_KEY = 'nw-o87-nda-agreed'

const TERMS = [
  'This design concept, proposal, and all visual assets shown herein are the exclusive intellectual property of o87 Dev and are provided in confidence for evaluation purposes only.',
  'The website design, layout, copy, and branding concepts remain the sole property of o87 Dev until a signed services agreement and deposit are received.',
  'You agree not to reproduce, repurpose, share with third parties, or instruct any other party to replicate these designs or concepts without written authorization from o87 Dev.',
]

export default function NDAGate({ children }) {
  const [agreed, setAgreed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'yes'
  )
  const [checked, setChecked] = useState(false)
  const [declined, setDeclined] = useState(false)

  const handleAgree = () => {
    sessionStorage.setItem(SESSION_KEY, 'yes')
    setAgreed(true)
  }

  if (agreed) return children

  return (
    <>
      {/* Blurred background hint */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'var(--bg)',
        filter: 'blur(0px)',
      }} />

      <AnimatePresence>
        <motion.div
          key="nda-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(4, 6, 12, 0.97)',
            backdropFilter: 'blur(24px)',
            padding: 'clamp(1rem, 4vw, 3rem)',
          }}
        >
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(26,34,54,0.5) 80px),
              repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(26,34,54,0.5) 80px)
            `,
            opacity: 0.3,
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', zIndex: 1,
              background: 'var(--surface)',
              border: '1px solid var(--gold-line)',
              borderRadius: '6px',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.08)',
            }}
          >
            {/* Gold accent top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              borderRadius: '6px 6px 0 0',
            }} />

            {/* Logo */}
            <div style={{ marginBottom: '2rem' }}>
              <Logo size={36} showTagline={false} />
            </div>

            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div style={{ height: '1px', width: '32px', background: 'var(--gold-line)', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap',
              }}>Confidential Preview</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700, color: 'var(--text)',
              lineHeight: 1.1, marginBottom: '0.6rem',
            }}>
              Non-Use Agreement
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>
              This is a proprietary design concept and proposal prepared exclusively for
              <strong style={{ color: 'var(--text)' }}> Northwest Siding Contractors of Eugene</strong>.
              Please review the terms below before proceeding.
            </p>

            {/* Terms */}
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '1.4rem 1.6rem',
              marginBottom: '1.8rem',
              display: 'flex', flexDirection: 'column', gap: '1.1rem',
            }}>
              {TERMS.map((term, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: '1px solid var(--gold-line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px',
                    fontSize: '0.55rem', fontWeight: 700, color: 'var(--gold)',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    {term}
                  </p>
                </div>
              ))}
            </div>

            {/* Checkbox */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
              cursor: 'pointer', marginBottom: '1.6rem',
            }}>
              <div
                onClick={() => setChecked(c => !c)}
                style={{
                  width: '20px', height: '20px', borderRadius: '3px', flexShrink: 0,
                  border: `1.5px solid ${checked ? 'var(--gold)' : 'var(--border)'}`,
                  background: checked ? 'var(--gold)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s var(--ease-out)',
                  cursor: 'pointer', marginTop: '1px',
                }}
              >
                {checked && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l2.5 2.5 5.5-5.5"
                      stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55, userSelect: 'none' }}
                onClick={() => setChecked(c => !c)}
              >
                I have read and agree to the terms above. I understand that all designs,
                content, and concepts shown remain the intellectual property of o87 Dev
                until a services agreement is in effect.
              </span>
            </label>

            {declined && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '3px', padding: '0.75rem 1rem',
                fontSize: '0.78rem', color: 'rgba(239,68,68,0.8)',
                marginBottom: '1.2rem', lineHeight: 1.5,
              }}>
                You must agree to the terms to view this confidential preview.
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={checked ? handleAgree : () => setDeclined(true)}
                style={{
                  flex: 1, padding: '0.9rem 1.5rem',
                  background: checked ? 'var(--gold)' : 'var(--surface-2)',
                  border: `1px solid ${checked ? 'transparent' : 'var(--border)'}`,
                  borderRadius: '3px', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: checked ? 'var(--bg)' : 'var(--text-muted)',
                  transition: 'all 0.25s var(--ease-out)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                I Agree — View Preview
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setDeclined(true)}
                style={{
                  padding: '0.9rem 1.2rem',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '3px', cursor: 'pointer',
                  fontSize: '0.72rem', fontWeight: 500,
                  color: 'var(--text-muted)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                Decline
              </button>
            </div>

            {/* Footer note */}
            <p style={{
              marginTop: '1.4rem', fontSize: '0.65rem',
              color: 'var(--text-subtle)', lineHeight: 1.5, textAlign: 'center',
            }}>
              Prepared exclusively for Northwest Siding Contractors of Eugene · o87 Dev · 2026
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
