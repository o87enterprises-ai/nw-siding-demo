import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#EDE9E2',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#6B7A96' },
      iconColor: '#C9A96E',
    },
    invalid: { color: '#FCA5A5', iconColor: '#FCA5A5' },
  },
}

const wrap = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '3px',
  padding: '0.9rem 1rem',
}

function CheckoutForm({ amountCents, currency, metadata, disabled, buttonLabel, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amountLabel = (amountCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || disabled) return
    setError('')

    if (!Number.isInteger(amountCents) || amountCents < 50) {
      setError('Please enter a valid amount (minimum $0.50).')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountCents, currency: currency || 'usd', metadata: metadata || {} }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not start payment. Please try again.')

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })

      if (confirmError) {
        setError(confirmError.message)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent)
      } else {
        setError('Payment did not complete. Please try another card.')
      }
    } catch (err) {
      setError(err.message || 'Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Card Details
        </label>
        <div style={wrap}>
          <CardElement options={CARD_OPTIONS} />
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '3px',
          padding: '0.75rem 1rem',
          fontSize: '0.82rem',
          color: '#FCA5A5',
          lineHeight: 1.5,
        }}>{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '1rem',
          opacity: loading || disabled ? 0.65 : 1,
          cursor: loading || disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing…' : `${buttonLabel || 'Pay'} ${amountLabel}`}
      </button>

      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Secured by Stripe · We never store your card details.
      </p>
    </form>
  )
}

/**
 * PaymentPanel — fetches public payment config, loads Stripe, and renders the
 * card form. Backend endpoints are the Open Pay contract ported to Pages Functions.
 */
export default function PaymentPanel({ amountCents, currency = 'usd', metadata, disabled, buttonLabel, onSuccess }) {
  const [config, setConfig] = useState(null)
  const [configError, setConfigError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/payment-config')
      .then((r) => r.json())
      .then((c) => { if (active) setConfig(c) })
      .catch(() => { if (active) setConfigError('Could not load payment configuration.') })
    return () => { active = false }
  }, [])

  const stripePromise = useMemo(
    () => (config && config.configured && config.publishableKey ? loadStripe(config.publishableKey) : null),
    [config]
  )

  if (configError) {
    return <Notice>{configError}</Notice>
  }
  if (!config) {
    return <Notice>Loading secure payment…</Notice>
  }
  if (!config.configured || !stripePromise) {
    return (
      <Notice>
        Online payments aren’t live yet. Please call <a href="tel:5416882997" style={{ color: 'var(--gold)' }}>(541)&nbsp;688-2997</a> to pay by phone,
        or we’ll send a secure payment link.
      </Notice>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amountCents={amountCents}
        currency={currency}
        metadata={metadata}
        disabled={disabled}
        buttonLabel={buttonLabel}
        onSuccess={onSuccess}
      />
    </Elements>
  )
}

function Notice({ children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '3px',
      padding: '1.1rem 1.25rem',
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      lineHeight: 1.6,
    }}>{children}</div>
  )
}
