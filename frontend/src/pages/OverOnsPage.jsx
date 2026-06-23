import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search, Heart, Check } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Badge } from '../components/ds/Badge'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
}

const PILLARS = [
  { num: '01', title: 'Wekelijks bijgewerkt', body: 'Elke week worden alle nieuwe aanbiedingen van AH en Jumbo automatisch verzameld en gepubliceerd. Altijd actueel, nooit verouderd.' },
  { num: '02', title: 'Altijd gratis', body: 'Fresco is en blijft volledig gratis voor iedereen. Geen account aanmaken, geen abonnement — gewoon direct de beste deals bekijken.' },
  { num: '03', title: 'Alle supermarkten op één plek', body: 'Vergelijk deals van Albert Heijn en Jumbo naast elkaar. Zo weet je altijd waar je het meeste bespaart op je boodschappen.' },
]

const STEPS = [
  { Icon: Search, title: 'Zoek of blader', body: 'Gebruik de zoekbalk of filter op categorie om de deals te vinden die jij nodig hebt. Van vlees tot verzorging — alles is er.' },
  { Icon: Heart, title: 'Vergelijk en kies', body: 'Bekijk de aanbiedingen van AH en Jumbo naast elkaar. Zie in één oogopslag hoeveel je bespaart op elk product.' },
  { Icon: Check, title: 'Ga naar de winkel', body: 'Klik op "Bekijk deal" om direct naar de aanbieding op de website van AH of Jumbo te gaan. Altijd de actuele prijs, zonder omwegen.' },
]

export default function OverOnsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Over Ons — Fresco</title>
      </Helmet>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg,#f8faff 0%,#eef3ff 60%,#e4efff 100%)', padding: '5rem 0 4rem', borderBottom: '1px solid var(--c-border)' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          style={{ maxWidth: 720, margin: '0 auto', padding: '0 var(--layout-pad)' }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: '1.75rem' }}>
            <Badge>Over Fresco</Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            style={{ margin: 0, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.01em', lineHeight: 1.1, color: 'var(--c-text)', marginBottom: '1.25rem' }}
          >
            Verse deals, <em style={{ color: 'var(--c-brand)', fontStyle: 'italic' }}>elke week.</em>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.8, maxWidth: 560 }}>
            Fresco is een onafhankelijk platform dat wekelijks alle supermarkt aanbiedingen van
            Albert Heijn en Jumbo verzamelt op één overzichtelijke plek. Geen registratie, geen
            kosten — gewoon de beste deals, direct beschikbaar.
          </motion.p>
        </motion.div>
      </section>

      {/* Three pillars */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--c-border)' }}>
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
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--c-border)' }}>
        <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <h2 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)', marginBottom: '0.4rem' }}>Hoe werkt Fresco?</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-subtle)', marginBottom: '2.5rem' }}>In drie stappen naar de beste deals van de week</p>

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
      <section style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 var(--layout-pad)' }}>
          <div style={{ background: 'var(--c-surface-alt)', border: '1px solid rgba(30,107,60,0.12)', borderRadius: 'var(--r-lg)', padding: '1.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--c-text)', marginBottom: '0.5rem' }}>Een noot over prijzen</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>
              Fresco verzamelt informatie van openbaar beschikbare bronnen. Prijzen en
              beschikbaarheid kunnen afwijken — controleer altijd de website of app van de
              betreffende supermarkt voor de meest actuele informatie.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
