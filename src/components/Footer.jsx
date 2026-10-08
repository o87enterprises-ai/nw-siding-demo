import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 6rem) 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gap: '3rem',
          marginBottom: '4rem',
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <Logo size={34} showTagline={true} />
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              maxWidth: '240px',
              marginBottom: '1.5rem',
            }}>
              Exclusive Preferred Remodeler of James Hardie® Siding Products
              for Eugene-Springfield. 25+ years. 2,000+ homes.
            </p>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              display: 'inline-block',
            }}>
              CCB #136733
            </div>
          </div>

          {/* Services */}
          <FooterCol title="Services" links={[
            { label: 'Fiber Cement Siding', href: '#' },
            { label: 'Cedar Siding', href: '#' },
            { label: 'Replacement Windows', href: '#' },
            { label: 'Seamless Gutters', href: '#' },
            { label: 'Painting & Trim', href: '#' },
          ]} />

          {/* Areas */}
          <FooterCol title="Service Areas" links={[
            { label: 'Eugene', href: '#' },
            { label: 'Springfield', href: '#' },
            { label: 'Albany', href: '#' },
            { label: 'Creswell', href: '#' },
            { label: 'Roseburg', href: '#' },
          ]} />

          {/* Company */}
          <FooterCol title="Company" links={[
            { label: 'About Us', href: '#' },
            { label: 'Portfolio', href: '#portfolio' },
            { label: 'Financing', href: '#' },
            { label: 'Incentive Programs', href: '#' },
            { label: 'Contact', href: '#contact' },
          ]} />
        </div>

        {/* Gold divider */}
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2rem' }} />

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            © {year} Northwest Siding Contractors of Eugene, Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use'].map(link => (
              <a key={link} href="#" style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '1.2rem',
      }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              style={{
                fontSize: '0.83rem',
                color: 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
