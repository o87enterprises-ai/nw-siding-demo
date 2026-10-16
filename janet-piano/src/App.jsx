import { useEffect, useState } from 'react'
import { CartProvider, useCart } from './lib/cart'
import Hero from './components/Hero'
import Ambient from './components/Ambient'
import PlansPage from './components/PlansPage'
import LessonsPage from './components/LessonsPage'
import SingPage from './components/SingPage'
import LivePage from './components/LivePage'
import { PlanProvider } from './lib/plan'
import BookingPage from './components/BookingPage'
import { usePath } from './lib/router'
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
  const path = usePath()
  if (items.length === 0 && path !== '/plans' && path !== '/book') return null // keep the demo screens clean
  return (
    <button className="cart-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${items.length} items`}>
      🛒{items.length > 0 && <i>{items.length}</i>}
    </button>
  )
}

export default function App() {
  const path = usePath()
  return (
    <PlanProvider>
      <CartProvider>
        <Ambient dim={['/lessons', '/sing', '/live'].includes(path)} />
        <CartButton />
        <CheckoutBanner />
        {path === '/book' && <BookingPage />}
        {path === '/plans' && <PlansPage />}
        {path === '/lessons' && <LessonsPage />}
        {path === '/sing' && <SingPage />}
        {path === '/live' && <LivePage />}
        {!['/book', '/plans', '/lessons', '/sing', '/live'].includes(path) && (
          <>
            <main>
              <Hero />
            </main>
            <footer className="footer">© Janet Holmes</footer>
          </>
        )}
        <CartDrawer />
      </CartProvider>
    </PlanProvider>
  )
}
