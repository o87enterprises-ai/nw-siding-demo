import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const TESTIMONIAL_IMAGES = [
  'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1920&q=80',
]

const TESTIMONIALS = [
  {
    quote: "Outstanding work from start to finish. The crew was experienced, friendly, and professional. Our home looks completely transformed and we couldn't be more pleased.",
    author: 'Sherry M.',
    location: 'Eugene, OR',
    service: 'Fiber Cement Siding',
  },
  {
    quote: "Gary's team was exceptional. They estimated materials perfectly, the crew was respectful and efficient, and the final result was beyond our expectations.",
    author: 'Steven H.',
    location: 'Springfield, OR',
    service: 'Siding & Painting',
  },
  {
    quote: "Professionalism and attention to detail from every single person on this project. I've never had a contractor experience this smooth — not even close.",
    author: 'Joe A.',
    location: 'Albany, OR',
    service: 'James Hardie® Installation',
  },
  {
    quote: "They handled everything — dry rot repairs, new siding, painting, and trim. One crew, one contact, zero headaches. Will absolutely recommend to everyone I know.",
    author: 'Suzanne K.',
    location: 'Eugene, OR',
    service: 'Full Exterior Remodel',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5500)
    return () => clearInterval(t)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <SectionBackground
        images={TESTIMONIAL_IMAGES}
        gradient="linear-gradient(135deg, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.70) 100%)"
      />

      {/* Decorative large quote mark */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '5%', right: '3%',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(12rem, 20vw, 22rem)',
        fontWeight: 700,
        color: 'rgba(201,169,110,0.06)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1,
      }}>"</div>

      <div
        ref={ref}
        style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3.5rem' }}
        >
          <span className="gold-line" />
          <span className="label">Client Testimonials</span>
          <h2 className="section-title" style={{ marginTop: '1rem' }}>
            Words from <em>Happy Homeowners</em>
          </h2>
        </motion.div>

        {/* Testimonial carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="var(--gold)">
                  <path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.4l4.2-.8L8 1z"/>
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--text)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}>
              "{t.quote}"
            </blockquote>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                border: '1px solid var(--gold-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--gold)',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {t.author[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                  {t.author}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  {t.location} · {t.service}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <div style={{ display: 'flex', gap: '0.2rem', marginTop: 'calc(3rem - 10px)' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
              aria-current={i === active ? 'true' : undefined}
              style={{
                // 4px-tall bar with padding: the tap target is ~24px tall, the look is unchanged
                boxSizing: 'content-box',
                width: i === active ? '28px' : '8px',
                height: '4px',
                padding: '10px 4px',
                backgroundClip: 'content-box',
                backgroundColor: i === active ? 'var(--gold)' : 'rgba(237,233,226,0.28)',
                transition: 'all 0.3s var(--ease-out)',
                cursor: 'pointer',
                border: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
