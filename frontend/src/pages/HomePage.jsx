import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'
import { Badge } from '../components/ds/Badge'
import { Button } from '../components/ds/Button'

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
}

const STATS = [
  { value: '500+', label: 'Actieve deals' },
  { value: '2', label: 'Supermarkten' },
  { value: 'Gratis', label: 'Altijd & voor iedereen', accent: true },
]

const STORES = [
  {
    name: 'Albert Heijn',
    initials: 'AH',
    color: 'var(--c-ah)',
    bg: '#eff6ff',
    border: 'rgba(30,107,60,0.15)',
    hoverBorder: 'rgba(30,107,60,0.3)',
    desc: 'Alle bonusdeals van AH — van verse groenten tot huishoudproducten. Elke week bijgewerkt.',
    count: '~120 deals deze week',
    to: '/aanbiedingen?store=Albert+Heijn',
  },
  {
    name: 'Jumbo',
    initials: 'JUMBO',
    color: 'var(--c-jumbo)',
    bg: '#fff5f5',
    border: 'rgba(220,38,38,0.12)',
    hoverBorder: 'rgba(220,38,38,0.25)',
    desc: 'Alle weekaanbiedingen van Jumbo — van vers vlees tot zuivel en dranken. Nooit een deal missen.',
    count: '~107 deals deze week',
    to: '/aanbiedingen?store=Jumbo',
  },
]

export default function HomePage() {
  const [allDeals, setAllDeals] = useState(undefined)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/deals/`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => setAllDeals(Array.isArray(data.data) ? data.data : []))
      .catch(() => setAllDeals([]))
  }, [])

  return (
    <Layout>
      <Helmet>
        <title>Fresco — Verse supermarkt deals</title>
      </Helmet>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'linear-gradient(160deg,#ffffff 0%,#f2f9f5 50%,#e8f4ec 100%)',
          padding: '5.5rem 0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', right: -120, top: -80, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,107,60,0.06) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', left: '35%', bottom: -120, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 68%)', pointerEvents: 'none' }} />

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)', position: 'relative' }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: '1.75rem' }}>
            <Badge>Wekelijks bijgewerkt · Altijd gratis</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              margin: 0,
              fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.04,
              color: 'var(--c-text)',
              marginBottom: '1.1rem',
              maxWidth: 640,
            }}
          >
            Verse deals
            <br />
            <em style={{ color: 'var(--c-brand)', fontStyle: 'italic' }}>van AH &amp; Jumbo.</em>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.8, maxWidth: 440, marginBottom: '2.25rem' }}>
            Alle supermarkt aanbiedingen op één plek. Bespaar elke week zonder moeite — voor iedereen, altijd gratis.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/aanbiedingen"><Button variant="ghost" size="lg">Bekijk aanbiedingen →</Button></Link>
            <Link to="/over-ons"><Button variant="ghost" size="lg">Hoe werkt het?</Button></Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(15,23,42,0.08)', flexWrap: 'wrap' }}
          >
            {STATS.map(({ value, label, accent }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: accent ? 'var(--c-amber)' : 'var(--c-text)' }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--c-text-subtle)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Featured deals ── */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)' }}>Beste deals deze week</h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--c-text-subtle)' }}>Wekelijks vernieuwd van AH &amp; Jumbo</p>
            </div>
            <Link to="/aanbiedingen"><Button variant="secondary" size="sm">Alle aanbiedingen →</Button></Link>
          </div>
          <DealGrid deals={allDeals} limit={8} featureFirst />
        </div>
      </section>

      {/* ── Store section ── */}
      <section style={{ padding: '4rem 0', background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)', marginBottom: '0.4rem' }}>Onze supermarkten</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-subtle)', marginBottom: '2.25rem' }}>
            Deals van twee van de grootste supermarkten in Nederland
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {STORES.map(s => (
              <Link
                key={s.name}
                to={s.to}
                style={{
                  background: 'var(--c-bg)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'var(--c-border)',
                  borderRadius: 'var(--r-xl)',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
                  display: 'block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = s.hoverBorder
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--c-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: s.initials.length > 2 ? '0.65rem' : '0.75rem', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.initials}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--c-text)', marginBottom: '0.4rem' }}>{s.name}</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--c-text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--c-text-subtle)' }}>{s.count}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: s.color }}>Bekijk deals →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
