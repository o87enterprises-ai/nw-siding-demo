import { useEffect, useState } from 'react'
import { CartProvider, useCart } from './lib/cart'
import Hero from './components/Hero'
import About from './components/About'
import Path from './components/Path'
import Booking from './components/Booking'
import CartDrawer from './components/CartDrawer'

// Shown after Stripe redirects back. The cart is cleared on success.
function CheckoutBanner() {
  const { clear } = useCart()
  const [status, setStatus] = useState(() => new URLSearchParams(window.location.search).get('checkout'))
  useEffect(() => {
    if (!status) return
    if (status === 'success') clear()
    window.history.replaceState({}, '', window.location.pathname + window.location.hash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!status) return null
  return (
    <div className={`banner ${status}`} role="status">
      {status === 'success' ? 'Thank you.' : 'Cancelled.'}
      <button className="link" onClick={() => setStatus(null)} aria-label="Dismiss">✕</button>
    </div>
  )
}

function CartButton() {
  const { items, setOpen } = useCart()
  return (
    <button className="cart-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${items.length} items`}>
      🛒{items.length > 0 && <i>{items.length}</i>}
    </button>
  )
}

export default function App() {
  return (
    <CartProvider>
      <CartButton />
      <CheckoutBanner />
      <main>
        <Hero />
        <About />
        <Path />
        <Booking />
      </main>
      <footer className="footer">© Janet Holmes</footer>
      <CartDrawer />
    </CartProvider>
  )
}
