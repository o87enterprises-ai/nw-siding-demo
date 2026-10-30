// Answers use only facts already stated elsewhere on the site. Edit here; the FAQ schema is generated from the same list.
const FAQS = [
  {
    q: 'What areas does Northwest Siding serve?',
    a: 'We are based in Eugene and also serve from Junction City and Cottage Grove. We work throughout Eugene, Springfield, Junction City, Cottage Grove, Albany, Roseburg and Creswell, Oregon.',
  },
  {
    q: 'Is Northwest Siding licensed, bonded and insured?',
    a: 'Yes. Northwest Siding is licensed, bonded and insured in Oregon, CCB #136733.',
  },
  {
    q: 'Do you install James Hardie fiber cement siding?',
    a: "Yes. We are James Hardie's Exclusive Preferred Remodeler for Eugene-Springfield. We install HardiePlank, HardieShingle and HardiePanel siding to factory specification, with the manufacturer warranty to match.",
  },
  {
    q: 'What services do you offer?',
    a: 'Fiber cement siding, cedar and wood siding, replacement windows, seamless gutters, roofing, decks, additions, fencing and gates, and interior and exterior painting.',
  },
  {
    q: 'Do you offer financing or discounts?',
    a: 'We do not offer financing. Projects booked October through January get 10% off.',
  },
  {
    q: 'What window brands do you install?',
    a: 'We install Milgard Tuscany, Montecito and Style Line Series windows, using certified technicians.',
  },
  {
    q: 'Do you make seamless gutters on site?',
    a: 'Yes. We custom-fabricate 5-inch K-Style and 6-inch fascia-style seamless steel gutters on site. They are measured, cut and installed in a single visit.',
  },
  {
    q: 'How quickly can I get an estimate?',
    a: 'Estimates are free. We respond within one business day and can usually have an estimate in your hands within 24 hours.',
  },
  {
    q: 'Do you offer a warranty on your work?',
    a: 'Yes. We back our work with a 3-year workmanship warranty, and James Hardie products carry the manufacturer warranty.',
  },
  {
    q: 'How long has Northwest Siding been in business?',
    a: 'More than 25 years. We have completed over 2,000 homes and are a GuildQuality Master Award winner.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function FAQ() {
  return (
    <section
      id="faq"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 6rem)',
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <span className="gold-line" />
        <span className="label">Common Questions</span>
        <h2 className="section-title" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
          Siding &amp; Exterior <em>FAQs</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
