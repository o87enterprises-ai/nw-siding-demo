import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import PaymentPanel from '../components/payment/PaymentPanel'

const field = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  padding: '0.75rem 1rem',
  borderRadius: '2px',
  fontSize: '1rem',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: '100%',
}
const labelStyle = { fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }

/**
 * In-app POS for face-to-face card payments — Gary takes the customer's card on
 * his phone, on site. (Native "Tap to Pay" using the phone's NFC reader requires
 * a mobile app build with the Stripe Terminal SDK; this web POS handles card
 * entry today and the same backend powers both.)
 */
export default function PosPage() {
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [note, setNote] = useState('')
  const [done, setDone] = useState(null)

  const amountCents = useMemo(() => {
    const n = Math.round(parseFloat(amount) * 100)
    return Number.isFinite(n) ? n : 0
  }, [amount])
  const amountValid = amountCents >= 50

  const reset = () => {
    setAmount(''); setCustomerName(''); setNote(''); setDone(null)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'clamp(4rem, 9vw, 6rem) clamp(1.25rem, 6vw, 3rem) 4rem' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}><Logo size={32} /></div>
        <span className="gold-line" />
        <span className="label">On-Site POS</span>
        <h1 className="section-title" style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontSize: 'clamp(1.6rem, 6vw, 2.2rem)' }}>
          Take a Payment
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Charge a customer’s card face-to-face, right from your phone.
        </p>

        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: 'clamp(1.5rem, 5vw, 2rem)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--gold-dim)', border: '1px solid var(--gold)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Approved — ${amount}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Confirmation: {done.id}</p>
              <button type="button" onClick={reset} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                New Sale
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={labelStyle}>Amount (USD)</span>
                <input
                  style={{ ...field, fontSize: '1.6rem', fontWeight: 600, textAlign: 'center', letterSpacing: '0.02em' }}
                  value={amount ? `$${amount}` : ''}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  inputMode="decimal"
                  placeholder="$0.00"
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={labelStyle}>Customer (optional)</span>
                <input style={field} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={labelStyle}>Note (optional)</span>
                <input style={field} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Job address / description" />
              </div>

              {!amountValid && amount.length > 0 && (
                <p style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>Minimum charge is $0.50.</p>
              )}

              <div style={{ opacity: amountValid ? 1 : 0.55, pointerEvents: amountValid ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
                <PaymentPanel
                  amountCents={amountCents}
                  metadata={{ type: 'pos', customerName: customerName || undefined, note: note || undefined }}
                  disabled={!amountValid}
                  buttonLabel="Charge"
                  onSuccess={(pi) => setDone(pi)}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>← Back to site</Link>
        </div>
      </div>
    </main>
  )
}
