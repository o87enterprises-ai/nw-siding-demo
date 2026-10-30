import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import PaymentPanel from '../components/payment/PaymentPanel'

const field = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  padding: '0.75rem 1rem',
  borderRadius: '2px',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: '100%',
}
const labelStyle = { fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '0.35rem' }} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          style={{
            fontSize: '2rem',
            lineHeight: 1,
            color: (hover || value) >= n ? 'var(--gold)' : 'var(--text-subtle)',
            transition: 'color 0.15s',
            padding: 0,
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function PayPage() {
  const [params] = useSearchParams()
  const type = (params.get('type') || 'invoice').toLowerCase() // 'invoice' | 'deposit'
  const isInvoice = type === 'invoice'

  const [invoice, setInvoice] = useState(params.get('invoice') || '')
  const [customerName, setCustomerName] = useState(params.get('name') || '')
  const [amount, setAmount] = useState(params.get('amount') || '')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [done, setDone] = useState(null)

  const amountCents = useMemo(() => {
    const n = Math.round(parseFloat(amount) * 100)
    return Number.isFinite(n) ? n : 0
  }, [amount])

  // Invoice payments are gated behind a rating + brief review.
  const reviewComplete = rating > 0 && review.trim().length >= 10
  const gateOpen = isInvoice ? reviewComplete : true
  const amountValid = amountCents >= 50

  const metadata = {
    type,
    invoice: invoice || undefined,
    customerName: customerName || undefined,
    rating: isInvoice ? rating : undefined,
    review: isInvoice ? review.trim() : undefined,
  }

  return (
    <PageShell
      eyebrow={isInvoice ? 'Invoice Payment' : 'Project Deposit'}
      title={isInvoice ? 'Complete Your Project' : 'Secure Your Project Deposit'}
      intro={
        isInvoice
          ? 'Share a quick rating and a few words about your experience, then settle your final invoice securely.'
          : 'Place a deposit to reserve your spot on our schedule. The deposit is applied to your final invoice.'
      }
    >
      {done ? (
        <SuccessCard done={done} amount={amount} isInvoice={isInvoice} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Row>
            <Labeled label="Your Name">
              <input style={field} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Gary Smith" />
            </Labeled>
            <Labeled label={isInvoice ? 'Invoice # (optional)' : 'Reference (optional)'}>
              <input style={field} value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder={isInvoice ? 'INV-1024' : 'Project address'} />
            </Labeled>
          </Row>

          <Labeled label={isInvoice ? 'Amount Due (USD)' : 'Deposit Amount (USD)'}>
            <input
              style={field}
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="0.00"
            />
          </Labeled>

          {isInvoice && (
            <div style={{
              background: 'var(--surface-2)',
              border: `1px solid ${reviewComplete ? 'var(--gold-line)' : 'var(--border)'}`,
              borderRadius: '4px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'border-color 0.3s',
            }}>
              <div>
                <div style={{ ...labelStyle, color: 'var(--gold)' }}>Before You Pay</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '0.5rem' }}>
                  How did we do? A quick rating and short review unlocks your invoice.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={labelStyle}>Your Rating *</span>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <Labeled label="Brief Review * (min 10 characters)">
                <textarea
                  style={{ ...field, resize: 'vertical', lineHeight: 1.6 }}
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us how the project went…"
                />
              </Labeled>
              {!reviewComplete && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ★ Add a rating and a few words to unlock payment.
                </p>
              )}
            </div>
          )}

          {!amountValid && amount.length > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>Minimum payment is $0.50.</p>
          )}

          <div style={{ opacity: gateOpen && amountValid ? 1 : 0.55, pointerEvents: gateOpen && amountValid ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
            <PaymentPanel
              amountCents={amountCents}
              metadata={metadata}
              disabled={!gateOpen || !amountValid}
              buttonLabel={isInvoice ? 'Pay Invoice' : 'Pay Deposit'}
              onSuccess={(pi) => setDone(pi)}
            />
          </div>
        </div>
      )}
    </PageShell>
  )
}

function SuccessCard({ done, amount, isInvoice }) {
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'var(--gold-dim)', border: '1px solid var(--gold)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
        Payment Received — Thank You!
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 1.5rem' }}>
        We’ve received your {isInvoice ? 'invoice payment' : 'deposit'} of <strong style={{ color: 'var(--gold)' }}>${amount}</strong>.
        A receipt is on its way. We appreciate your business.
      </p>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Confirmation: {done.id}</p>
    </div>
  )
}

// ── Layout helpers ────────────────────────────────────────────────────────────
function PageShell({ eyebrow, title, intro, children }) {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(5rem, 10vw, 7rem) clamp(1.5rem, 6vw, 4rem) 4rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}><Logo size={34} /></div>
        <span className="gold-line" />
        <span className="label">{eyebrow}</span>
        <h1 className="section-title" style={{ marginTop: '1rem', marginBottom: '1rem' }}>{title}</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}>{intro}</p>
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          {children}
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>← Back to northwestsiding.com</Link>
        </div>
      </div>
    </main>
  )
}

function Row({ children }) {
  return <div className="pay-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>
}

function Labeled({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  )
}
