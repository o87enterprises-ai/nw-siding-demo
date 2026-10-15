import { lazy, Suspense, useEffect, useState } from 'react'
import { CartProvider, useCart } from './lib/cart'
import Hero from './components/Hero'
import About from './components/About'
import Path from './components/Path'
import Booking from './components/Booking'
import CartDrawer from './components/CartDrawer'

const Backdrop = lazy(() => import('./components/Backdrop'))

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
      {status === 'success' ? 'Thank you! Your payment went through. Janet will confirm your lesson details by email.' : 'Checkout cancelled. Your cart is still saved.'}
      <button className="link" onClick={() => setStatus(null)}>Dismiss</button>
    </div>
  )
}

function Nav() {
  const { items, setOpen } = useCart()
  return (
    <header className="nav">
      <a href="#top" className="brand">Janet Holmes <span>Piano</span></a>
      <nav>
        <a href="#about">About</a>
        <a href="#path">Path</a>
        <a href="#book">Book</a>
        <button className="cart-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${items.length} items`}>
          🛒{items.length > 0 && <i>{items.length}</i>}
        </button>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Suspense fallback={null}><Backdrop /></Suspense>
      <Nav />
      <CheckoutBanner />
      <main>
        <Hero />
        <About />
        <Path />
        <Booking />
      </main>
      <footer className="footer">
        <p className="brand">Janet Holmes <span>Piano</span></p>
        <p>Beginner · Intermediate · Adult learners · Recital preparation · Music theory</p>
        <small>© {new Date().getFullYear()} Janet Holmes. All rights reserved.</small>
      </footer>
      <CartDrawer />
    </CartProvider>
  )
}
