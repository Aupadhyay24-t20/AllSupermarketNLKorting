import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'

const STORES = ['Albert Heijn', 'Jumbo']
const TYPES = ['1+1 gratis', '2e gratis', '% Korting', 'Combikorting']

function FilterGroup({ label, options, selected, onChange }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#444444',
        marginBottom: '0.75rem',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {options.map(option => {
          const active = selected.includes(option)
          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: active ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.15)',
                background: active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.07)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s, border 0.2s',
                width: '100%',
              }}
            >
              {/* checkbox */}
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '5px',
                border: active ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.35)',
                background: active ? '#22c55e' : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {active && <span style={{ color: '#090909', fontSize: '0.6rem', fontWeight: 900 }}>✓</span>}
              </span>
              <span style={{ fontSize: '0.85rem', color: active ? '#ffffff' : '#666666', fontWeight: active ? 600 : 400 }}>
                {option}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function AanbiedingenPage() {
  const [allDeals, setAllDeals] = useState(undefined)
  const [selectedStores, setSelectedStores] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/deals/`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setAllDeals(Array.isArray(data.data) ? data.data : []))
      .catch(() => setAllDeals([]))
  }, [])

  function toggle(value, setList) {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  function clearFilters() {
    setSelectedStores([])
    setSelectedTypes([])
  }

  const hasFilters = selectedStores.length > 0 || selectedTypes.length > 0

  const filteredDeals = allDeals === undefined ? undefined : allDeals.filter(deal => {
    if (selectedStores.length > 0 && !selectedStores.includes(deal.stores?.name)) return false
    if (selectedTypes.length > 0 && !selectedTypes.some(t => deal.discount_raw?.includes(t))) return false
    return true
  })

  const count = filteredDeals?.length ?? 0

  return (
    <Layout>
      <Helmet>
        <title>Aanbiedingen — SuperDeal NL</title>
      </Helmet>

      <div style={{ display: 'flex', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
        {/* ── Sidebar ── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            width: '240px',
            flexShrink: 0,
            padding: '2rem 1.25rem',
            background: '#111111',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: '68px',
            height: 'calc(100vh - 68px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Filters</p>
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearFilters}
                  style={{
                    fontSize: '0.72rem',
                    color: '#22c55e',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Wissen
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <FilterGroup
            label="Supermarkt"
            options={STORES}
            selected={selectedStores}
            onChange={v => toggle(v, setSelectedStores)}
          />

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '0.25rem 0 1.5rem' }} />

          <FilterGroup
            label="Korting type"
            options={TYPES}
            selected={selectedTypes}
            onChange={v => toggle(v, setSelectedTypes)}
          />
        </motion.aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, padding: '2rem 1.75rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ marginBottom: '1.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                Alle Aanbiedingen
              </h1>
              {allDeals !== undefined && (
                <motion.span
                  key={count}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#444444',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    padding: '2px 10px',
                  }}
                >
                  {count} deals
                </motion.span>
              )}
            </div>
            <p style={{ fontSize: '0.825rem', color: '#444444', marginTop: '4px' }}>
              Bekijk alle deals van AH en Jumbo
            </p>
          </motion.div>

          <DealGrid deals={filteredDeals} />
        </main>
      </div>
    </Layout>
  )
}
