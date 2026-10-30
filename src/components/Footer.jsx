import Logo from './Logo'

const FACEBOOK_URL = 'https://www.facebook.com/share/1FwLX3Bnfx/'
import { O87Logo, O87Credit } from './O87'

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
            <div style={{ marginTop: '1.2rem' }}>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Northwest Siding on Facebook (opens in a new tab)"
                className="social-link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <FooterCol title="Services" links={[
            { label: 'Fiber Cement Siding', href: '/siding/fiber-cement-siding/' },
            { label: 'Cedar Siding', href: '#' },
            { label: 'Replacement Windows', href: '#' },
            { label: 'Seamless Gutters', href: '#' },
            { label: 'Roofing', href: '#' },
            { label: 'Decks & Additions', href: '#' },
            { label: 'Fencing & Gates', href: '#' },
            { label: 'Interior & Exterior Painting', href: '#' },
          ]} />

          {/* Areas */}
          <FooterCol title="Service Areas" links={[
            { label: 'Eugene', href: '#' },
            { label: 'Junction City', href: '#' },
            { label: 'Cottage Grove', href: '#' },
            { label: 'Springfield', href: '#' },
            { label: 'Albany', href: '#' },
            { label: 'Creswell', href: '#' },
            { label: 'Roseburg', href: '#' },
          ]} />

          {/* Company */}
          <FooterCol title="Company" links={[
            { label: 'About Us', href: '/#about' },
            { label: 'Project Gallery', href: '/gallery/' },
            { label: '10% Fall–Winter Discount', href: '#contact' },
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
          <a href="#" aria-label="o87 Enterprises" style={{ display: 'block' }}>
            <O87Logo height={34} />
          </a>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use'].map(link => (
              <a key={link} href="#" style={{
                display: 'inline-block',
                padding: '0.5rem 0',
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

      <O87Credit style={{ marginTop: '1.5rem', paddingBottom: 0 }} />
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
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              style={{
                display: 'inline-block',
                padding: '0.4rem 0',
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
