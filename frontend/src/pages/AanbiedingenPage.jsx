import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { CategoryStrip } from '../components/ds/CategoryStrip'
import { StoreChip } from '../components/ds/StoreChip'
import { EmptyState } from '../components/ds/EmptyState'
import { SearchInput } from '../components/ds/SearchInput'
import DealGrid from '../components/deals/DealGrid'
import { normalizeStoreName } from '../utils/storeName'

export default function AanbiedingenPage() {
  const [searchParams] = useSearchParams()
  const [allDeals, setAllDeals] = useState(undefined)
  const [activeStore, setActiveStore] = useState(searchParams.get('store') || 'all')
  const [activeCat, setActiveCat] = useState('Alles')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/deals/`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => setAllDeals(Array.isArray(data.data) ? data.data : []))
      .catch(() => setAllDeals([]))
  }, [])

  // Real deals carry no category field — only "Alles" can ever match.
  const filteredDeals = allDeals === undefined ? undefined : allDeals.filter(deal => {
    if (activeStore !== 'all' && normalizeStoreName(deal.stores?.name) !== activeStore) return false
    if (activeCat !== 'Alles') return false
    return true
  })

  const count = filteredDeals?.length ?? 0
  const title = activeCat !== 'Alles' ? activeCat : 'Alle Aanbiedingen'
  const subtitle = activeCat !== 'Alles' ? `${count} deals in ${activeCat}` : 'Bekijk alle deals van AH en Jumbo'

  return (
    <Layout>
      <Helmet>
        <title>Aanbiedingen — Fresco</title>
      </Helmet>

      <div style={{ background: 'var(--c-bg)', borderBottom: '1px solid var(--c-border)', padding: '1.25rem var(--layout-pad)' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <SearchInput />
        </div>
      </div>

      <CategoryStrip active={activeCat} onChange={setActiveCat} />

      <div style={{ maxWidth: 'var(--layout-max)', margin: '0 auto', padding: '2.5rem var(--layout-pad) 4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.01em', color: 'var(--c-text)' }}>{title}</h1>
            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--c-text-subtle)' }}>{subtitle}</p>
          </div>

          <div style={{ background: 'var(--c-surface-alt)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-pill)', padding: '3px 12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text-subtle)' }}>
              {allDeals === undefined ? '—' : count} deals
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <StoreChip value="all" active={activeStore === 'all'} onClick={() => setActiveStore('all')}>Alle supermarkten</StoreChip>
            <StoreChip value="Albert Heijn" active={activeStore === 'Albert Heijn'} onClick={() => setActiveStore('Albert Heijn')}>Albert Heijn</StoreChip>
            <StoreChip value="Jumbo" active={activeStore === 'Jumbo'} onClick={() => setActiveStore('Jumbo')}>Jumbo</StoreChip>
          </div>
        </motion.div>

        {filteredDeals !== undefined && filteredDeals.length === 0 ? (
          <EmptyState />
        ) : (
          <DealGrid deals={filteredDeals} />
        )}
      </div>
    </Layout>
  )
}
