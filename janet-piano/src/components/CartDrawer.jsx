import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../lib/cart'
import { money } from '../lib/catalog'
import { startCheckout } from '../lib/checkout'

export default function CartDrawer() {
  const { items, open, setOpen, total, remove, clear } = useCart()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const checkout = async () => {
    setBusy(true); setMsg('')
    try {
      const r = await startCheckout(items)
      if (r.demo) setMsg('demo')
    } catch (e) {
      setMsg(e.message)
    } finally { setBusy(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="drawer" role="dialog" aria-label="Shopping cart" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <header><h3>Cart</h3><button className="link" onClick={() => setOpen(false)} aria-label="Close cart">✕</button></header>
            <div className="drawer-body">
              {items.length === 0 && <p className="muted">Empty.</p>}
              {items.map((i) => (
                <div key={i.uid} className="line">
                  <div><b>{i.title}</b><small>{i.detail}</small></div>
                  <div className="right"><span>{money(i.price)}</span><button className="link" onClick={() => remove(i.uid)} aria-label="Remove">✕</button></div>
                </div>
              ))}
            </div>
            <footer>
              <div className="total"><span /><b>{money(total)}</b></div>
              <button className="btn primary block" disabled={!items.length || busy} onClick={checkout}>{busy ? '…' : 'Checkout'}</button>
              {msg === 'demo' && (
                <p className="notice">Demo mode: nothing charged. <button className="link" onClick={() => { clear(); setMsg(''); setOpen(false) }}>Clear</button></p>
              )}
              {msg && msg !== 'demo' && <p className="notice err">{msg}</p>}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
