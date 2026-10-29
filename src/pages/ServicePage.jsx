import Contact from '../components/Contact'
import Footer from '../components/Footer'

const crumbLink = { color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '3px', display: 'inline-block', padding: '0.5rem 0' }

export default function ServicePage({ page }) {
  return (
    <div style={{ position: 'relative' }}>
      <main
        style={{
          background: 'var(--bg)',
          padding: 'calc(var(--nav-h, 76px) + clamp(2.5rem, 5vw, 4rem)) clamp(1.5rem, 6vw, 6rem) clamp(3rem, 6vw, 5rem)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <a href="/" style={crumbLink}>Home</a>
            {page.breadcrumb.map((b, i) => (
              <span key={b}>
                {' / '}
                {i === page.breadcrumb.length - 1 ? <span aria-current="page">{b}</span> : <a href="/#services" style={crumbLink}>{b}</a>}
              </span>
            ))}
          </nav>

          <span className="gold-line" />
          <span className="label">{page.kicker}</span>
          <h1 className="section-title" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>{page.h1}</h1>

          {page.intro.map((p) => (
            <p key={p} style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.1rem' }}>{p}</p>
          ))}

          <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '3rem 0 1.2rem' }}>{page.benefitsTitle}</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: 0 }}>
            {page.benefits.map(([t, d]) => (
              <li key={t} style={{ borderLeft: '2px solid var(--gold-line)', paddingLeft: '1rem', fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text)' }}>{t}.</strong> {d}
              </li>
            ))}
          </ul>

          <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '3rem 0 1.2rem' }}>Products we install</h2>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', listStyle: 'none', padding: 0 }}>
            {page.products.map((p) => (
              <li key={p} style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: '2px', padding: '0.5rem 0.9rem', fontSize: '0.8rem', color: 'var(--text)' }}>{p}</li>
            ))}
          </ul>

          <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '3rem 0 1.2rem' }}>{page.whyTitle}</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
            {page.why.map((w) => <li key={w}>{w}</li>)}
          </ul>

          <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '3rem 0 1.2rem' }}>Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {page.faqs.map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Contact />
      <Footer />
    </div>
  )
}
