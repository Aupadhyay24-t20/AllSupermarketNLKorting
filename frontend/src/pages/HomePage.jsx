import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'
import { Badge } from '../components/ds/Badge'
import { Button } from '../components/ds/Button'
import ahLogo from '../assets/AH-logo.jpg'
import jumboLogo from '../assets/Jumbo-2.jpg'

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
}

const STORES = [
  {
    key: 'ah',
    name: 'Albert Heijn',
    logo: ahLogo,
    color: 'var(--c-ah)',
    hoverBorder: 'rgba(30,107,60,0.3)',
    to: '/aanbiedingen?store=Albert+Heijn',
  },
  {
    key: 'jumbo',
    name: 'Jumbo',
    logo: jumboLogo,
    color: 'var(--c-jumbo)',
    hoverBorder: 'rgba(220,38,38,0.25)',
    to: '/aanbiedingen?store=Jumbo',
  },
]

export default function HomePage() {
  const { t } = useTranslation()
  const [allDeals, setAllDeals] = useState(null)

  const STATS = [
    { value: '500+', label: t('home.stat_deals_label') },
    { value: '2', label: t('home.stat_stores_label') },
    { value: t('home.stat_free_value'), label: t('home.stat_free_label'), accent: true },
  ]

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/deals/featured`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => setAllDeals(Array.isArray(data.data) ? data.data : []))
      .catch(() => setAllDeals([]))
  }, [])

  return (
    <Layout>
      <Helmet>
        <title>{t('home.page_title')}</title>
        <meta name="description" content={t('home.desc')} />
        <meta property="og:title" content={t('home.page_title')} />
        <meta property="og:description" content={t('home.desc')} />
      </Helmet>

      {/* ── Hero ── */}
      <section
        style={{
          background: 'linear-gradient(160deg,#ffffff 0%,#f2f9f5 50%,#e8f4ec 100%)',
          padding: 'var(--pad-hero)',
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
            {t('home.h1_line1')}
            <br />
            <em style={{ color: 'var(--c-brand)', fontStyle: 'italic' }}>{t('home.h1_line2')}</em>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.8, maxWidth: 440, marginBottom: '0.6rem' }}>
            {t('home.desc')}
          </motion.p>
          <motion.p variants={fadeUp} style={{ margin: 0, fontSize: '0.78rem', color: 'var(--c-text-subtle)', marginBottom: '2.25rem' }}>
            {t('deals.store_notice')}
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/aanbiedingen"><Button variant="ghost" size="lg">{t('home.btn_deals')}</Button></Link>
            <Link to="/over-ons"><Button variant="ghost" size="lg">{t('home.btn_about')}</Button></Link>
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
      <section style={{ padding: 'var(--pad-section)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)' }}>{t('home.featured_title')}</h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--c-text-subtle)' }}>{t('home.featured_sub')}</p>
            </div>
            <Link to="/aanbiedingen"><Button variant="secondary" size="sm">{t('home.all_deals_btn')}</Button></Link>
          </div>
          <DealGrid deals={allDeals} />
        </div>
      </section>

      {/* ── Store section ── */}
      <section style={{ padding: 'var(--pad-section)', background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)', marginBottom: '0.4rem' }}>{t('home.stores_title')}</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-subtle)', marginBottom: '2.25rem' }}>
            {t('home.stores_sub')}
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
                <div style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--c-border)' }}>
                  <img src={s.logo} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--c-text)', marginBottom: '0.4rem' }}>{s.name}</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--c-text-muted)', lineHeight: 1.65, marginBottom: '1.5rem' }}>{t(`home.${s.key}_desc`)}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--c-text-subtle)' }}>{t(`home.${s.key}_count`)}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: s.color }}>{t('home.view_deals')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
