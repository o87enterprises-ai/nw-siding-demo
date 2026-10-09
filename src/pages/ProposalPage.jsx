import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { LogoMark } from '../components/Logo'
import { O87Logo, O87Credit } from '../components/O87'

/* ─────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────── */
const STRENGTHS = [
  {
    icon: '🏆',
    head: 'James Hardie® Exclusive Preferred Remodeler',
    body: 'James Hardie lists you as its Exclusive Preferred Remodeler for the Eugene-Springfield area — a credential that sets you apart before a homeowner reads a single review.',
  },
  {
    icon: '⭐',
    head: 'A Long, Well-Reviewed Track Record',
    body: 'Trust built over more than two decades and reflected in third-party customer reviews. A reputation like that takes years to earn — it\'s the strongest foundation any digital strategy can stand on.',
  },
  {
    icon: '🏠',
    head: '2,000+ Completed Homes',
    body: 'Every satisfied homeowner is a potential advocate. This track record is an enormous well of social proof — one the right systems can turn into sustained, visible momentum.',
  },
  {
    icon: '🎖️',
    head: 'Award-Winning Service',
    body: 'GuildQuality Master Award and consistently positive customer reviews. Recognition that validates what your customers already know — and that belongs front and center online.',
  },
  {
    icon: '📍',
    head: 'Deep Roots in the Eugene Community',
    body: 'Twenty-five years of serving local families creates relationships no newcomer can replicate. That trust is the story we tell — and the story homeowners want to hear.',
  },
]

const OPPORTUNITIES = [
  {
    icon: '⭐',
    head: 'Review Momentum',
    body: 'Your customer satisfaction rate is exceptional. A structured review program converts that goodwill into a visible, compounding advantage on Google and beyond.',
  },
  {
    icon: '🤖',
    head: 'AI Search Positioning',
    body: 'ChatGPT, Perplexity, and Google AI Overviews are the fastest-growing discovery channels in 2026. Early structured-data optimization means lasting first-mover advantage.',
  },
  {
    icon: '⚡',
    head: 'Instant Lead Response',
    body: 'Automated follow-up captures inquiries the moment they arrive — turning interest into booked estimates before a homeowner considers a second call.',
  },
  {
    icon: '📱',
    head: 'Social Portfolio Storytelling',
    body: 'Your completed projects are compelling visual content. An active social presence turns every finished job into an ongoing referral engine reaching homeowners you\'ve never met.',
  },
  {
    icon: '📝',
    head: 'Content Authority',
    body: 'Educational content — siding comparisons, cost guides, care tips — earns the trust of homeowners in the research phase, before anyone has called a single contractor.',
  },
]

const ADVANTAGES = [
  {
    num: '01',
    title: 'Exclusive James Hardie® Partnership',
    body: 'James Hardie lists you as its Exclusive Preferred Remodeler of Siding Products for the Eugene-Springfield area — a credential few local competitors can point to.',
  },
  {
    num: '02',
    title: 'A Strong Reputation Built Over Decades',
    body: 'GuildQuality Master Award and consistently positive customer reviews across more than two decades of work. This story sells itself.',
  },
  {
    num: '03',
    title: '2,000+ Homes & Counting',
    body: '2,000+ happy customers and a satisfaction rate that speaks for itself. That base of trust is your most powerful competitive asset.',
  },
]

const TIERS = [
  {
    num: 'TIER 01',
    name: 'The Foundation',
    color: '#4A7C59',
    tagline: 'A professional digital presence that works for you around the clock.',
    features: [
      'Luxury Framer Motion website — included with plan',
      'Schema markup + AI search readiness',
      'Managed hosting & daily backups',
      'Monthly SEO + Google Business updates',
      'Monthly rank tracking report',
    ],
    monthly: '$349/mo',
    scores: { visibility: 65, reviews: 45, leads: 55, ai: 60 },
  },
  {
    num: 'TIER 02',
    name: 'The Growth Engine',
    color: '#C9A96E',
    tagline: 'Actively grow inbound leads from Google, AI search, and social.',
    features: [
      'Everything in Tier 1 — website included',
      '5-min SMS auto-response on form fills',
      'CRM setup + 7-email lead nurture sequence',
      '50+ Google reviews campaign in 90 days',
      '2 blog posts/mo + Instagram & Facebook',
    ],
    monthly: '$899/mo',
    scores: { visibility: 78, reviews: 85, leads: 88, ai: 72 },
  },
  {
    num: 'TIER 03',
    name: 'The Full Suite',
    color: '#A855F7',
    tagline: 'Dominate Eugene across every channel — backed by 24/7 support.',
    features: [
      'Everything in Tiers 1 & 2 — website included',
      '24/7 emergency tech support (2-hr SLA)',
      '4 blog posts + quarterly case studies',
      'Google Local Services Ads + Facebook Ads',
      'Video content, competitor monitoring, strategy calls',
    ],
    monthly: '$2,000/mo',
    scores: { visibility: 92, reviews: 95, leads: 95, ai: 90 },
  },
]

/* Public-data audit of northwestsiding.com, 8 Oct 2026. Each category is a
   checklist with a point value per check; items that could not be measured
   (Google Business Profile, Google review counts, auto-response) are left
   out of both the earned and possible totals. */
const WEB_AUDIT = {
  date: 'October 8, 2026',
  categories: [
    { label: 'Speed & mobile',            earned: 11, possible: 20 },
    { label: 'Technical health',          earned: 8,  possible: 10 },
    { label: 'On-page SEO',               earned: 15, possible: 20 },
    { label: 'Local search visibility',   earned: 6,  possible: 14 },
    { label: 'Lead capture',              earned: 7,  possible: 9  },
    { label: 'Trust signals',             earned: 8,  possible: 10 },
    { label: 'AI-search readiness',       earned: 5,  possible: 8  },
  ],
}
const WEB_SCORE = Math.round(
  100 * WEB_AUDIT.categories.reduce((a, c) => a + c.earned, 0) /
        WEB_AUDIT.categories.reduce((a, c) => a + c.possible, 0)
)
const scoreBand = pct =>
  pct >= 90 ? { name: 'Excellent', color: '#4A7C59' }
  : pct >= 75 ? { name: 'Good', color: '#4A7C59' }
  : pct >= 60 ? { name: 'Needs Improvement', color: '#C9A96E' }
  : { name: 'Failing', color: '#D9534F' }

/* ─────────────────────────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────────────────────────── */
const slideVariants = {
  enter: dir => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: dir => ({ x: dir < 0 ? '60%' : '-60%', opacity: 0, transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] } }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────────────────────────
   Slide components
───────────────────────────────────────────────────────────────── */

function SlideCover() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible"
      style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}
    >
      {/* Logo mark — centered, prominent on cover */}
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <LogoMark size={100} />
      </motion.div>
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
        <O87Logo height={56} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-line)' }} />
          <span className="label">Prepared by o87Enterprises · September 2026</span>
          <div style={{ height: '1px', width: '60px', background: 'var(--gold-line)' }} />
        </div>
      </motion.div>
      <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 700, color: 'var(--text)', lineHeight: 1.0, display: 'block',
        }}>Digital Growth</span>
        <span style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 700, fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.0, display: 'block',
        }}>Proposal</span>
      </motion.div>
      <motion.p variants={fadeUp} style={{
        marginTop: '2rem', fontSize: '1rem',
        color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '480px', margin: '2rem auto 0',
      }}>
        For <strong style={{ color: 'var(--text)' }}>Northwest Siding Contractors of Eugene</strong>
        <br />A strategy to amplify your existing strengths and grow leads, visibility, and revenue.
      </motion.p>
      <motion.div variants={fadeUp} className="cover-stats" style={{
        display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem 2rem',
        marginTop: '3.5rem', paddingTop: '2.5rem',
        borderTop: '1px solid var(--border)',
      }}>
        {['25+ Years', 'GuildQuality Master', '2,000+ Homes', 'Licensed · CCB #136733'].map(s => (
          <div key={s} style={{
            fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>{s}</div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function WebScoreCard() {
  const band = scoreBand(WEB_SCORE)
  return (
    <motion.div variants={fadeUp} style={{
      marginTop: '1.5rem',
      background: 'var(--surface-2)', border: '1px solid var(--gold-line)',
      borderRadius: '4px', padding: 'clamp(1.1rem, 4vw, 1.8rem)',
    }}>
      <div className="label" style={{ marginBottom: '1rem' }}>Your Current Website · Web Presence Score</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1.2rem, 4vw, 2.2rem)', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: '8.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 12vw, 4.2rem)',
            fontWeight: 700, color: band.color, lineHeight: 1,
          }}>{WEB_SCORE}%</div>
          <div style={{
            marginTop: '0.5rem', fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: band.color,
          }}>{band.name}</div>
          <div style={{ marginTop: '0.4rem', fontSize: '0.64rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            100% perfect · 59% failing · 0% invisible
          </div>
        </div>
        <div style={{ flex: '1 1 14rem', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {WEB_AUDIT.categories.map(c => {
            const pct = Math.round(100 * c.earned / c.possible)
            const b = scoreBand(pct)
            return (
              <div key={c.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>{c.label}</span>
                  <span style={{ color: b.color, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: b.color, borderRadius: '3px', opacity: 0.9 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <p style={{ marginTop: '1.1rem', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
        Audit of northwestsiding.com on {WEB_AUDIT.date}, using public data only: a phone test on a slow connection and on a normal one, page and search-engine setup, contact paths, and how the business shows up in search.
        Not measured: your Google Business Profile and Google review counts.
        Strongest areas: a clear call button, a page for every service and service area, and visible credentials.
        Biggest gaps: page speed on phones, search results that favor directory listings over your own site, and missing business details for search engines and AI assistants.
      </p>
    </motion.div>
  )
}

/* ── Strengths slide (replaces Audit / "current state" negatives) ── */
function SlideStrengths() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: '100%', maxWidth: '860px', margin: '0 auto' }}>
      <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
        <span className="gold-line" />
        <span className="label">Your Platform</span>
        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>
          A 25-Year Foundation <em>Worth Amplifying</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '540px', marginTop: '0.8rem' }}>
          Before we talk about what's next, here's what you've already built — and why it's the strongest starting point in the Eugene market.
        </p>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
        {STRENGTHS.map((s, i) => (
          <motion.div key={i} variants={fadeUp} style={{
            display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.75rem, 3vw, 1.5rem)',
            padding: 'clamp(1rem, 3.5vw, 1.4rem) clamp(1rem, 4vw, 1.8rem)',
            background: 'var(--surface-2)',
          }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{s.head}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.body}</div>
            </div>
            <div style={{
              marginLeft: 'auto', flexShrink: 0,
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'rgba(74,124,89,0.15)', border: '1px solid rgba(74,124,89,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2 2 4-4" stroke="#4A7C59" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
      <WebScoreCard />
    </motion.div>
  )
}

/* ── Opportunities slide (replaces "Problems / Hiding in Plain Sight") ── */
function SlideOpportunities() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: '100%', maxWidth: '860px', margin: '0 auto' }}>
      <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
        <span className="gold-line" />
        <span className="label">The Growth Strategy</span>
        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>
          Five High-Impact <em>Opportunities</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '540px', marginTop: '0.8rem' }}>
          Each of these areas represents a clear, actionable path to more visibility, more leads, and more revenue — built on the foundation you've already established.
        </p>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
        {OPPORTUNITIES.map((o, i) => (
          <motion.div key={i} variants={fadeUp} style={{
            display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.75rem, 3vw, 1.5rem)',
            padding: 'clamp(1rem, 3.5vw, 1.4rem) clamp(1rem, 4vw, 1.8rem)',
            background: 'var(--surface-2)',
          }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{o.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{o.head}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{o.body}</div>
            </div>
            <div style={{
              marginLeft: 'auto', flexShrink: 0,
              fontSize: '0.7rem', fontWeight: 700,
              color: 'var(--gold)', letterSpacing: '0.06em',
              paddingTop: '2px',
            }}>0{i + 1}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function SlideAdvantages() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
      <motion.div variants={fadeUp} style={{ marginBottom: '3rem' }}>
        <span className="gold-line" />
        <span className="label">The Differentiators</span>
        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>
          Your Real <em>Advantages</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '540px', marginTop: '0.8rem' }}>
          Few contractors in Eugene can point to this combination. These are the pillars of every strategy we build together.
        </p>
      </motion.div>
      <div className="advantages-grid" style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
        {ADVANTAGES.map((a) => (
          <motion.div key={a.num} variants={fadeUp} style={{
            background: 'var(--surface-2)', padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1.2rem, 4vw, 2rem)',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: '3.5rem',
              fontWeight: 700, color: 'var(--text-subtle)', lineHeight: 1,
            }}>{a.num}</span>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
              fontWeight: 700, color: 'var(--text)', lineHeight: 1.25,
            }}>{a.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{a.body}</p>
            <div style={{
              marginTop: 'auto', paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.65rem', fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
              Key Differentiator
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function SlideTier({ tier }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible"
      style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}
    >
      <motion.div variants={fadeUp} style={{ marginBottom: '2.5rem' }}>
        <span className="gold-line" />
        <span className="label" style={{ color: tier.color }}>{tier.num}</span>
        <h2 className="section-title" style={{ marginTop: '0.8rem' }}>
          <em style={{ color: tier.color }}>{tier.name}</em>
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.8rem', lineHeight: 1.7 }}>
          {tier.tagline}
        </p>
      </motion.div>

      <div className="tier-grid" style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Features */}
        <motion.div variants={fadeUp} style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: '4px', padding: 'clamp(1.2rem, 4vw, 2rem)',
        }}>
          <div className="label" style={{ marginBottom: '1.2rem' }}>What's Included</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tier.features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: `${tier.color}22`, border: `1px solid ${tier.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke={tier.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Pricing */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Website build — included */}
          <div style={{
            background: `${tier.color}0D`,
            border: `1px solid ${tier.color}44`,
            borderRadius: '4px', padding: 'clamp(1rem, 4vw, 1.4rem) clamp(1.1rem, 4vw, 1.8rem)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '10px', right: '-20px',
              background: tier.color, color: '#fff',
              fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', padding: '0.2rem 2rem',
              transform: 'rotate(35deg)',
            }}>INCLUDED</div>

            <div className="label" style={{ marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Website Build</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '2.4rem',
                fontWeight: 700, color: tier.color, lineHeight: 1,
              }}>FREE</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                with any plan
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem', lineHeight: 1.55 }}>
              A luxury Framer Motion site — cinematic animations, before/after showcases, schema markup, full mobile optimization — included at no charge.
            </p>
          </div>

          {/* Monthly retainer */}
          <div style={{
            background: `${tier.color}0D`,
            border: `1px solid ${tier.color}55`,
            borderRadius: '4px', padding: 'clamp(1rem, 4vw, 1.4rem) clamp(1.1rem, 4vw, 1.8rem)', flexGrow: 1,
          }}>
            <div className="label" style={{ marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Monthly Retainer</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontSize: '2.8rem',
                fontWeight: 700, color: tier.color, lineHeight: 1,
              }}>{tier.monthly}</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: `${tier.color}18`, border: `1px solid ${tier.color}33`,
              borderRadius: '2px', padding: '0.3rem 0.75rem',
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: tier.color,
            }}>
              No long-term contract required
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Projected growth bars (T1 / T2 / T3 only — no assumptions) ── */
function MetricBar({ label, t1, t2, t3, inView }) {
  const bars = [
    { val: t1, color: '#4A7C59', tag: 'T1' },
    { val: t2, color: '#C9A96E', tag: 'T2' },
    { val: t3, color: '#A855F7', tag: 'T3' },
  ]
  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {bars.map(({ val, color, tag }) => (
          <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', color, width: '22px', flexShrink: 0 }}>{tag}</span>
            <div style={{ flex: 1, height: '10px', background: 'var(--surface-2)', borderRadius: '5px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${val}%` } : { width: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: color, borderRadius: '5px', opacity: 0.85 }}
              />
            </div>
            <span style={{ fontSize: '0.62rem', color, fontWeight: 600, width: '28px', flexShrink: 0 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideProjections() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate="visible"
      style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}
    >
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <span className="gold-line" />
        <span className="label">Projected Performance</span>
        <h2 className="section-title" style={{ marginTop: '0.6rem', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
          What Growth <em>Looks Like — By Tier</em>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '560px', marginTop: '0.8rem' }}>
          Each tier unlocks a specific set of capabilities. These projections reflect conservative, real-world performance estimates across four key dimensions.
        </p>
      </motion.div>

      {/* Tier legend */}
      <motion.div variants={fadeUp} style={{
        display: 'flex', gap: '1.5rem', marginBottom: '1.8rem', flexWrap: 'wrap',
      }}>
        {[['Tier 1 — The Foundation','#4A7C59'],['Tier 2 — Growth Engine','#C9A96E'],['Tier 3 — Full Suite','#A855F7']].map(([l,c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c, flexShrink: 0 }} />
            {l}
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} style={{
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: '4px', padding: 'clamp(1.1rem, 4vw, 1.8rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <MetricBar label="Google Search Visibility"   t1={65} t2={78} t3={92} inView={inView} />
        <MetricBar label="Review Presence & Volume"   t1={45} t2={85} t3={95} inView={inView} />
        <MetricBar label="Lead Capture Speed"         t1={55} t2={88} t3={95} inView={inView} />
        <MetricBar label="AI Search Visibility"       t1={60} t2={72} t3={90} inView={inView} />
      </motion.div>

      {/* Callout */}
      <motion.div variants={fadeUp} style={{
        marginTop: '1.5rem',
        background: 'var(--surface-2)', border: '1px solid var(--gold-line)',
        borderRadius: '4px', padding: 'clamp(1rem, 4vw, 1.2rem) clamp(1rem, 4vw, 1.8rem)',
        display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '1.4rem' }}>💡</div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>
            Every tier includes the luxury website build at no charge.
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The right tier depends on your growth goals. We're happy to walk through each option together.
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SlideSummary() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible"
      style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}
    >
      <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="gold-line" style={{ margin: '0 auto 1rem' }} />
        <span className="label">The Offer</span>
        <h2 className="section-title" style={{ marginTop: '0.6rem' }}>
          Website <em>Always Included.</em> Pick Your Plan.
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
          Every plan includes the full luxury Framer Motion website build at no charge.
          Start where it makes sense. Scale when you're ready.
        </p>
      </motion.div>

      {/* 3 pricing cards */}
      <motion.div variants={fadeUp} className="summary-pricing-grid" style={{
        display: 'grid',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {TIERS.map((t, i) => (
          <div key={t.num} style={{
            background: i === 2 ? `${t.color}10` : 'var(--surface-2)',
            border: `1px solid ${i === 2 ? t.color + '55' : 'var(--border)'}`,
            borderRadius: '4px', padding: 'clamp(1.2rem, 4vw, 1.8rem) clamp(1.1rem, 4vw, 1.5rem)',
            position: 'relative', overflow: 'hidden',
          }}>
            {i === 2 && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '3px', background: t.color,
              }} />
            )}
            <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: t.color, marginBottom: '0.3rem' }}>{t.num}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>{t.name}</div>

            {/* Website build free */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Website Build</div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: t.color }}>FREE</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Included</span>
            </div>

            {/* Monthly */}
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Monthly</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: t.color, lineHeight: 1 }}>{t.monthly}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Next steps */}
      <motion.div variants={fadeUp} style={{
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: '4px', padding: 'clamp(1.1rem, 4vw, 1.6rem) clamp(1rem, 4vw, 2rem)',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          What Happens Next
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }} className="next-steps-grid">
          {[
            ['01', 'Pick your tier', 'Choose the plan that fits your goals.'],
            ['02', 'Strategy call', 'A quick 30-min walkthrough of scope and timeline.'],
            ['03', 'Build begins', 'Deposit kicks off the site build — live in 3–4 weeks.'],
            ['04', 'Growth starts', 'Monthly work begins the first month after launch.'],
          ].map(([n, title, desc]) => (
            <div key={n}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.5rem', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.35rem' }}>{title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Slides registry
───────────────────────────────────────────────────────────────── */
const SLIDES_CONFIG = [
  { id: 'cover',        label: 'Cover',         component: SlideCover },
  { id: 'strengths',    label: 'Your Platform', component: SlideStrengths },
  { id: 'opportunities',label: 'Opportunities', component: SlideOpportunities },
  { id: 'advantages',  label: 'Differentiators',component: SlideAdvantages },
  { id: 'projections', label: 'Growth',         component: SlideProjections },
  { id: 'tier1',       label: 'Tier 1',         component: () => <SlideTier tier={TIERS[0]} /> },
  { id: 'tier2',       label: 'Tier 2',         component: () => <SlideTier tier={TIERS[1]} /> },
  { id: 'tier3',       label: 'Tier 3',         component: () => <SlideTier tier={TIERS[2]} /> },
  { id: 'summary',     label: 'The Offer',      component: SlideSummary },
]

/* ─────────────────────────────────────────────────────────────────
   Main proposal page
───────────────────────────────────────────────────────────────── */
export default function ProposalPage() {
  const [[page, direction], setPage] = useState([0, 0])

  const go = useCallback((delta) => {
    setPage(([p]) => {
      const next = Math.max(0, Math.min(SLIDES_CONFIG.length - 1, p + delta))
      return [next, delta]
    })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const SlideComponent = SLIDES_CONFIG[page].component

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--nav-h)',
      position: 'relative',
      overflowX: 'clip',
    }}>
      {/* Architectural grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 79px, var(--border) 80px),
          repeating-linear-gradient(90deg, transparent, transparent 79px, var(--border) 80px)
        `,
        opacity: 0.2,
      }} />

      {/* Slide counter */}
      <div className="proposal-counter-top" style={{
        position: 'fixed', top: 'calc(var(--nav-h) + 1rem)', right: '2rem',
        zIndex: 20, alignItems: 'center', gap: '0.5rem',
        fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>
        <span style={{ color: 'var(--gold)' }}>{String(page + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(SLIDES_CONFIG.length).padStart(2, '0')}</span>
        <span style={{ marginLeft: '0.5rem' }}>{SLIDES_CONFIG[page].label}</span>
      </div>

      {/* Main slide area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(1.25rem, 4vw, 4rem) clamp(1rem, 5vw, 5rem)',
        paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))',
        position: 'relative', zIndex: 1, minHeight: 'calc(100vh - var(--nav-h))', minWidth: 0,
      }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: '100%', minWidth: 0, display: 'flex', justifyContent: 'center' }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        {/* Ownership line — just above the fixed nav bar */}
        <O87Credit style={{
          position: 'absolute', left: 0, right: 0,
          bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))', padding: '0.3rem 1rem',
        }} />
      </div>

      {/* Navigation bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(8,12,20,0.95)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        padding: '0.75rem clamp(1rem, 3vw, 2rem)',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
        zIndex: 20,
      }}>
        {/* Dot nav */}
        <div style={{ display: 'flex', gap: '0px', alignItems: 'center', minWidth: 0 }}>
          {SLIDES_CONFIG.map((s, i) => (
            <button key={i} onClick={() => setPage([i, i > page ? 1 : -1])}
              title={s.label} aria-label={`Go to slide ${i + 1}: ${s.label}`}
              style={{
                height: '24px', padding: '0 3px', border: 'none', background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
            >
              <span style={{
                display: 'block', height: '4px', borderRadius: '2px',
                width: i === page ? '28px' : '6px',
                background: i === page ? 'var(--gold)' : 'var(--border)',
                transition: 'all 0.3s var(--ease-out)',
              }} />
            </button>
          ))}
        </div>

        <span className="proposal-counter-bar" style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.14em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--gold)' }}>{String(page + 1).padStart(2, '0')}</span> / {String(SLIDES_CONFIG.length).padStart(2, '0')}
        </span>

        <span className="proposal-keyboard-hint" style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
          ← → Arrow keys to navigate
        </span>

        {/* Prev / Next */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => go(-1)} disabled={page === 0}
            style={{
              width: '44px', height: '44px',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '3px', cursor: page === 0 ? 'not-allowed' : 'pointer',
              opacity: page === 0 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { if (page > 0) e.currentTarget.style.borderColor = 'var(--gold-line)' }}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 1L3 7l6 6" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => go(1)} disabled={page === SLIDES_CONFIG.length - 1}
            style={{
              width: '44px', height: '44px',
              background: page === SLIDES_CONFIG.length - 1 ? 'var(--surface-2)' : 'var(--gold)',
              border: '1px solid var(--border)',
              borderRadius: '3px', cursor: page === SLIDES_CONFIG.length - 1 ? 'not-allowed' : 'pointer',
              opacity: page === SLIDES_CONFIG.length - 1 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 1l6 6-6 6" stroke={page === SLIDES_CONFIG.length - 1 ? 'var(--text)' : 'var(--bg)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
