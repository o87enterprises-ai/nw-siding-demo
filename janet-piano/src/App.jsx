import { lazy, Suspense } from 'react'
import { CartProvider, useCart } from './lib/cart'
import Hero from './components/Hero'
import About from './components/About'
import Path from './components/Path'
import Booking from './components/Booking'
import CartDrawer from './components/CartDrawer'

const Backdrop = lazy(() => import('./components/Backdrop'))

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
