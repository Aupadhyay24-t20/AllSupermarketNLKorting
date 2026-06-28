import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search, Heart, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'
import { Badge } from '../components/ds/Badge'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
}

export default function OverOnsPage() {
  const { t } = useTranslation()

  const PILLARS = [
    { num: '01', title: t('about.pillar1_title'), body: t('about.pillar1_body') },
    { num: '02', title: t('about.pillar2_title'), body: t('about.pillar2_body') },
    { num: '03', title: t('about.pillar3_title'), body: t('about.pillar3_body') },
  ]

  const STEPS = [
    { Icon: Search, title: t('about.step1_title'), body: t('about.step1_body') },
    { Icon: Heart, title: t('about.step2_title'), body: t('about.step2_body') },
    { Icon: Check, title: t('about.step3_title'), body: t('about.step3_body') },
  ]

  return (
    <Layout>
      <Helmet>
        <title>{t('about.page_title')}</title>
        <meta name="description" content={t('about.desc')} />
        <meta property="og:title" content={t('about.page_title')} />
        <meta property="og:description" content={t('about.desc')} />
      </Helmet>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,#f8faff 0%,#eef3ff 60%,#e4efff 100%)', padding: 'var(--pad-hero)', borderBottom: '1px solid var(--c-border)' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--layout-pad)' }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: '1.75rem' }}>
            <Badge>{t('about.badge')}</Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            style={{ margin: 0, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.01em', lineHeight: 1.1, color: 'var(--c-text)', marginBottom: '1.25rem' }}
          >
            {t('about.h1')} <em style={{ color: 'var(--c-brand)', fontStyle: 'italic' }}>{t('about.h1_accent')}</em>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.8, maxWidth: 560 }}>
            {t('about.desc')}
          </motion.p>
        </motion.div>
      </section>

      {/* Three pillars */}
      <section style={{ padding: 'var(--pad-section-lg)', borderBottom: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <div
            className="how-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'var(--c-border)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}
          >
            {PILLARS.map(p => (
              <div key={p.num} style={{ background: 'var(--c-surface)', padding: '2.5rem 2rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--c-brand-tint)', lineHeight: 1, marginBottom: '1.25rem' }}>{p.num}</div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--c-text)', marginBottom: '0.6rem' }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section style={{ padding: 'var(--pad-section-lg)', borderBottom: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)', marginBottom: '0.4rem' }}>{t('about.how_title')}</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-subtle)', marginBottom: '2.5rem' }}>{t('about.how_sub')}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {STEPS.map(({ Icon, title, body }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--c-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="white" strokeWidth={2} aria-hidden />
                </div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--c-text)' }}>{title}</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: 'var(--pad-section-sm)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <div style={{ background: 'var(--c-surface-alt)', border: '1px solid rgba(30,107,60,0.12)', borderRadius: 'var(--r-lg)', padding: '1.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text)', marginBottom: '0.5rem' }}>{t('about.disclaimer_title')}</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>
              {t('about.disclaimer_body')}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
