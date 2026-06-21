import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const STATS = [
  { value: '500+', label: 'Actieve deals' },
  { value: '2', label: 'Supermarkten' },
  { value: 'Gratis', label: 'Altijd & voor iedereen' },
]

export default function HomePage() {
  return (
    <Layout>
      <Helmet>
        <title>SuperDeal NL — Alle Supermarkt Aanbiedingen</title>
      </Helmet>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        {/* Background orbs */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(34,197,94,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(251,191,36,0.05) 0%, transparent 70%)',
        }} />
        {/* Grid overlay */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.25,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 4rem' }}>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '680px' }}
          >
            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ color: '#ffffff' }}>Vind de beste</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #86efac 60%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                supermarkt deals
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '480px' }}
            >
              Alle aanbiedingen van Albert Heijn en Jumbo op één plek. Bespaar elke week zonder moeite.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <motion.div
                whileHover={{ scale: 1.03, backgroundColor: '#16a34a' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-block',
                  borderRadius: '9999px',
                  background: '#22c55e',
                  padding: '12px 24px',
                }}
              >
                <Link
                  to="/aanbiedingen"
                  style={{
                    display: 'block',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Bekijk aanbiedingen →
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              flexWrap: 'wrap',
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>{value}</span>
                <span style={{ fontSize: '0.78rem', color: '#444444' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Beste deals ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{ padding: '4rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '4px' }}>
              Beste deals deze week
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#444444' }}>Wekelijks vernieuwd van AH &amp; Jumbo</p>
          </div>
          <motion.div
            whileHover={{ backgroundColor: '#16a34a' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-block', borderRadius: '9999px', background: '#22c55e' }}
          >
            <Link
              to="/aanbiedingen"
              style={{
                display: 'block',
                fontSize: '0.825rem',
                color: '#000000',
                textDecoration: 'none',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '12px 24px',
              }}
            >
              Alle aanbiedingen →
            </Link>
          </motion.div>
        </div>
        <DealGrid limit={8} />
      </motion.section>
    </Layout>
  )
}
