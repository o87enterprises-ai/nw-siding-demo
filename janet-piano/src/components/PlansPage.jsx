import SiteHeader from './SiteHeader'
import { PLANS, money } from '../lib/catalog'
import { useCart } from '../lib/cart'
import { usePlan } from '../lib/plan'
import { Link } from '../lib/router'

export default function PlansPage() {
  const { add } = useCart()
  const { plan, setPlan } = usePlan()
  return (
    <>
      <SiteHeader />
      <main className="plans-page">
        <h1>Plans</h1>
        <div className="plan-grid">
          <div className="plan-card">
            <h2>Free</h2>
            <p className="price">$0</p>
            <ul><li>Demo piano</li></ul>
            <Link className="btn" to="/">Try it</Link>
          </div>
          {PLANS.map((p) => (
            <div key={p.id} className={`plan-card ${p.id === 'plan-premium' ? 'feature' : ''}`}>
              <h2>{p.title}</h2>
              <p className="price">{money(p.price)}<small>/mo</small></p>
              <ul>{p.perks.map((x) => <li key={x}>{x}</li>)}</ul>
              <button
                className="btn primary"
                disabled={(plan === 'premium') || (plan === 'lessons' && p.id === 'plan-lessons')}
                onClick={() => add({ uid: p.id, id: p.id, title: p.title, detail: p.detail, price: p.price })}
              >
                {(plan === 'premium' || (plan === 'lessons' && p.id === 'plan-lessons')) ? 'Active' : 'Choose'}
              </button>
            </div>
          ))}
        </div>
        <p className="fine">Preview: checkout unlocks instantly and charges nothing. {plan !== 'none' && <button className="link" onClick={() => setPlan('none')}>Reset</button>}</p>
      </main>
    </>
  )
}
