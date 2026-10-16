// The documents that go with the service agreement: invoice, client checklist, recommendations.
// Uses native <details> so each section opens and closes without any scripting.

const PDF_URL = '/NW-Siding-Service-Agreement.pdf'

const DOCS = [
  {
    title: 'Invoice',
    intro: 'Due when the agreement is signed.',
    groups: [
      {
        items: [
          'Non-refundable retainer deposit, 30-day free trial: $100.00',
          'Total due: $100.00',
          'Nothing else is billed. The retainer is not credited toward any later fee.',
          'Invoice number, date and payment instructions are finalized when the agreement is signed.',
        ],
      },
    ],
  },
  {
    title: 'Attachment A: What we need from you',
    intro: 'Share access through each platform’s own sharing feature. Never send passwords by email or text.',
    groups: [
      {
        heading: 'Domain and hosting (GoDaddy)',
        items: [
          'Invite o87Enterprises through GoDaddy “delegate access” (you invite us from your GoDaddy account and can limit or remove it later).',
          'Which GoDaddy products you have (domain, hosting, website builder, email), their renewal dates, and what you pay per year.',
          'Who the domain is registered to and the email on the registration.',
          'Where your business email is hosted. Changing domain settings can interrupt email, so we check this before any change.',
          'If we later move the domain: it must be unlocked, with a transfer code from GoDaddy.',
          'A copy of your current site’s pages, images and text, or access so we can copy them.',
        ],
      },
      {
        heading: 'Search and measurement accounts',
        items: [
          'Google Search Console: add our Google email under Settings, then Users and permissions (“Full user” is enough to view data).',
          'Google Analytics (GA4): add us as a user if you have it; if not, we create one in your name.',
          'Google Business Profile: add us as a manager, not owner, so you keep control.',
          'Bing Webmaster Tools, Facebook, Yelp, BBB, Nextdoor and similar listings: which exist, and shared access where possible.',
          'Any ad accounts and call-tracking numbers.',
        ],
      },
      {
        heading: 'Business details',
        items: [
          'Legal business name, phone, address, hours, and the email where lead alerts should go.',
          'Contractor license number(s) and any insurance or bonding details you want shown.',
          'Your real service area: the cities and ZIP codes you will travel to. We discussed Albany through Bend through Medford and will confirm what is realistic for your crews.',
          'Services and siding materials you install, brands you prefer, and what you do not do.',
          'Typical job sizes, and which jobs you most want more of.',
          'Warranty terms, financing options and manufacturer certifications.',
          'Project photos, crew photos and logo files, with permission to use them.',
          'Customer reviews and testimonials, and past customers who might leave reviews (with their permission).',
          'How leads are handled today: who answers the phone, how fast, how quotes are tracked.',
          'Competitors you respect or want to beat, and your social accounts and any videos.',
        ],
      },
      {
        heading: 'Decisions only you can make',
        items: [
          'Approve the CRM and the automatic review and reply tool before we set anything up.',
          'Approve any affiliate links and which products you are comfortable recommending.',
          'At day 30, share leads, jobs booked, and this month’s revenue compared with last month (honor system). Keep a simple count of calls, quotes and booked jobs during the trial.',
          'Choose one person who approves content and answers questions during the trial.',
        ],
      },
    ],
  },
  {
    title: 'Attachment B: Recommendations',
    intro: 'Research as of October 2026. Where sources disagree or we could not confirm something, it says so. Prices should be verified on each company’s own page before committing.',
    groups: [
      {
        heading: 'Hosting',
        items: [
          'Cloudflare Pages (free): commercial use allowed; 500 builds a month, 20,000 files per site, 25 MiB per file. Bandwidth is reported as unmetered by third-party sites but not confirmed on Cloudflare’s own limits page. This preview already runs here.',
          'Netlify (free): commercial use allowed; credit-based billing since September 2025, with about 30 GB of bandwidth on the free tier per one source. Overage is reported as expensive. A reasonable backup.',
          'Vercel (Hobby): the free plan is limited to non-commercial use, so a business site would need a paid plan. Not recommended for a free commercial site.',
          'Staying with GoDaddy: we cannot compare until we know your current plan and renewal price.',
          'Domain: Cloudflare Registrar transfers are at cost with no markup. A transfer needs the domain to be at least 60 days old, no registration-contact change in the last 60 days, and a transfer code from GoDaddy. It can take several days.',
          'First step: confirm email is safe before pointing the domain anywhere new.',
        ],
      },
      {
        heading: 'Lead capture',
        items: [
          'A short quote-request form on every page plus click-to-call, with an instant email alert to you.',
          'A missed-call text-back so unanswered calls get an automatic text. Dedicated tools exist (one lists from $399 a month per a third-party listing; we did not confirm other prices).',
          'Track where every lead came from, so the 30-day review uses real numbers.',
        ],
      },
      {
        heading: 'Local search strategy (SEO, answer-engine and AI search)',
        items: [
          'Phase by region: Eugene and Albany first, then Bend, then Medford, once each area has pages and reviews.',
          'One page per service per city or ZIP cluster, with real project photos and local detail.',
          'A complete Google Business Profile with service areas, project posts and steady review requests.',
          'Answer-first content (cost, lifespan, materials, permits), FAQ and local-business structured data, and the same name, address and phone everywhere.',
          'A monthly report from Search Console and Analytics.',
          'The high-income, high-development ZIP list will be built from Census income data and county building-permit data, then checked against where your crews will go. No ZIP codes have been chosen yet.',
        ],
      },
      {
        heading: 'Affiliate and referral programs',
        items: [
          'Home Depot (through Impact): rates reported from about 1% to 8% depending on category, and they vary by source. Unconfirmed.',
          'Lowe’s: reported at up to about 2% on most products; some sources say rates are not published. Unconfirmed.',
          'Amazon Associates: most 2026 sources put Home Improvement and Tools at 3%; one says 4%.',
          'James Hardie ALLIANCE: not an affiliate program. It is a contractor network with reward points on qualifying products, homeowner referrals and marketing support.',
          'LP SmartSide: no referral or affiliate program found in our search; worth asking Louisiana-Pacific directly.',
          'Any affiliate link will be clearly disclosed, and you should only recommend products you actually use.',
        ],
      },
      {
        heading: 'Other digital revenue ideas (not yet researched)',
        items: [
          'Referral partnerships with other trades such as roofing, windows, gutters and painting (we will check Oregon rules on referral fees first).',
          'Financing-partner referral fees.',
          'A downloadable siding buyer’s guide as a lead magnet.',
          'Maintenance or inspection plans for past customers.',
          'Sponsored placements once traffic is established.',
        ],
      },
      {
        heading: 'CRM, automatic review requests and replies',
        items: [
          'NiceJob: review requests with a Housecall Pro integration; one contractor site lists about $75 a month.',
          'Podium: includes missed-call text-back; listed from $399 a month by one third-party source.',
          'Reviewflowz (for Housecall Pro users): pay per message.',
          'Jobber and Housecall Pro are common contractor CRMs; we have not confirmed current plan prices.',
          'Recommendation: choose the CRM first based on how you already quote and invoice, then add reviews and replies on top, with your approval.',
        ],
      },
      {
        heading: 'Influencer ideas and inspiration clips',
        items: [
          { text: 'DxmnItBobby on YouTube', href: 'https://www.youtube.com/@DxmnItBobby' },
          'More clips and creators to be added, with how each could apply to Northwest Siding.',
        ],
      },
    ],
  },
]

const label = {
  fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'var(--gold)',
}

export default function AgreementDocs() {
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
        <div style={{ height: '1px', width: '24px', background: 'var(--gold-line)', flexShrink: 0 }} />
        <span style={label}>Included documents</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {DOCS.map((doc) => (
          <details key={doc.title} className="agreement-doc">
            <summary>{doc.title}</summary>
            <div className="agreement-doc-body">
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.9rem' }}>{doc.intro}</p>
              {doc.groups.map((g, gi) => (
                <div key={gi} style={{ marginBottom: '0.9rem' }}>
                  {g.heading && (
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>{g.heading}</div>
                  )}
                  <ul>
                    {g.items.map((it, ii) => (
                      <li key={ii}>
                        {typeof it === 'string' ? it : (
                          <a href={it.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{it.text}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      <a href={PDF_URL} download className="agreement-pdf-link">
        Download the full agreement with attachments (PDF)
      </a>
    </div>
  )
}
