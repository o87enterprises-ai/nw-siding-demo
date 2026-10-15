import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
const KEY = 'janet-cart-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage unavailable */ }
  }, [items])

  const value = useMemo(() => ({
    items,
    open,
    setOpen,
    total: items.reduce((s, i) => s + i.price, 0),
    add: (item) => {
      setItems((prev) => (prev.some((p) => p.uid === item.uid) ? prev : [...prev, item]))
      setOpen(true)
    },
    remove: (uid) => setItems((prev) => prev.filter((p) => p.uid !== uid)),
    clear: () => setItems([]),
  }), [items, open])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
