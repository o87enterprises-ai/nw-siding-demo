import { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'
import { O87Logo, O87Credit } from './O87'
import AgreementDocs from './AgreementDocs'

const SEEN_KEY = 'nw-o87-sa-seen'
const AGREE_KEY = 'nw-o87-sa-agreed'

const TERMS = [
  {
    title: 'Services',
    text: 'Website hosting, a lead-capture form, a local search strategy (SEO, answer-engine and AI search) for your service area, search reporting so results can be measured, a review of affiliate and other digital-revenue options, and a CRM with automatic review requests and replies.',
  },
  {
    title: 'Retainer',
    text: 'A $100 non-refundable retainer begins the work. It is a retainer only: it is not credited toward any fee agreed later. Work starts once the signed agreement and the retainer are received.',
  },
  {
    title: '30-day free trial',
    text: 'The first 30 days are free. At day 30 we review three things together: leads generated, jobs booked, and this month’s revenue compared with the previous month, on the honor system. If the results show value, the fee is calculated after that value is determined and agreed together in writing.',
  },
  {
    title: 'Ownership and credit',
    text: 'Once the agreement and retainer are in place, the finished website is jointly owned. o87Enterprises stays credited and may use the work in its portfolio and reuse the underlying design as a template. Your branding is never reused: your name, logo, photos, testimonials, license details and content stay yours, as do your domain and accounts. Until then, the design remains the property of o87Enterprises.',
  },
  {
    title: 'Your part',
    text: 'Share access to your domain, search, and analytics accounts through each platform’s own sharing feature, never by sending passwords, and give us the business details we ask for.',
  },
]

function read(storage, key) {
  try { return storage.getItem(key) } catch { return null }
}
function write(storage, key, value) {
  try { storage.setItem(key, value) } catch { /* storage can be blocked; the page still works */ }
}

export default function ServiceAgreementGate({ children }) {
  const [seen, setSeen] = useState(() => read(sessionStorage, SEEN_KEY) === 'yes')
  const [agreed, setAgreed] = useState(() => read(sessionStorage, AGREE_KEY) === 'yes')

  if (seen) return children

  const agree = () => {
    write(sessionStorage, AGREE_KEY, 'yes')
    setAgreed(true)
  }
  const proceed = () => {
    write(sessionStorage, SEEN_KEY, 'yes')
    setSeen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        background: 'rgba(4, 6, 12, 0.97)',
        padding: 'clamp(0.75rem, 4vw, 3rem)',
        paddingBottom: 'max(clamp(0.75rem, 4vw, 3rem), env(safe-area-inset-bottom, 0px))',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          background: 'var(--surface)',
          border: '1px solid var(--gold-line)',
          borderRadius: '6px',
          padding: 'clamp(1.25rem, 5vw, 3.5rem)',
          maxWidth: '600px',
          width: '100%',
          margin: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.08)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          borderRadius: '6px 6px 0 0',
        }} />

        <div style={{
          marginBottom: 'clamp(1.2rem, 4vw, 2rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>
          <Logo size={36} showTagline={false} />
          <O87Logo height={44} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
          <div style={{ height: '1px', width: '32px', background: 'var(--gold-line)', flexShrink: 0 }} />
          <span style={{
            fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap',
          }}>Draft for review</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700, color: 'var(--text)',
          lineHeight: 1.1, marginBottom: '0.6rem',
        }}>
          Service Agreement
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 'clamp(1.2rem, 4vw, 2rem)' }}>
          A summary of how we would work together, prepared for
          <strong style={{ color: 'var(--text)' }}> Northwest Siding Contractors of Eugene</strong>.
          Take a look, then continue to the preview.
        </p>

        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: 'clamp(1rem, 4vw, 1.4rem) clamp(1rem, 4vw, 1.6rem)',
          marginBottom: '1.4rem',
          display: 'flex', flexDirection: 'column', gap: '1.1rem',
        }}>
          {TERMS.map((term, i) => (
            <div key={term.title} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '1px solid var(--gold-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '1px',
                fontSize: '0.55rem', fontWeight: 700, color: 'var(--gold)',
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{term.title}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{term.text}</p>
              </div>
            </div>
          ))}
        </div>

        <AgreementDocs />

        <p style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
          This is a placeholder draft. The final agreement, including liability and governing-law terms,
          is reviewed and signed separately. Clicking “Yes, I agree” is a courtesy acknowledgment and is not required to view the preview.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={agree}
            aria-pressed={agreed}
            style={{
              flex: '1 1 12rem', padding: '0.9rem 1.5rem', minHeight: '48px',
              background: agreed ? 'rgba(201,169,110,0.15)' : 'var(--gold)',
              border: `1px solid ${agreed ? 'var(--gold)' : 'transparent'}`,
              borderRadius: '3px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: agreed ? 'var(--gold)' : 'var(--bg)',
              transition: 'all 0.25s var(--ease-out)',
            }}
          >
            {agreed ? 'Thank you, noted' : 'Yes, I agree'}
          </button>
          <button
            type="button"
            onClick={proceed}
            style={{
              flex: '1 1 12rem', padding: '0.9rem 1.5rem', minHeight: '48px',
              background: 'transparent',
              border: '1px solid var(--gold-line)',
              borderRadius: '3px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            Continue to Preview
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p style={{
          marginTop: '1.4rem', fontSize: '0.65rem',
          color: 'var(--text-subtle)', lineHeight: 1.5, textAlign: 'center',
        }}>
          Prepared exclusively for Northwest Siding Contractors of Eugene · o87Enterprises · 2026
        </p>
        <O87Credit style={{ padding: '0.6rem 0 0' }} />
      </motion.div>
    </motion.div>
  )
}
