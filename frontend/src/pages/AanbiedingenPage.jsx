import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'
import { CategoryStrip } from '../components/ds/CategoryStrip'
import { StoreChip } from '../components/ds/StoreChip'
import { EmptyState } from '../components/ds/EmptyState'
import { SearchInput } from '../components/ds/SearchInput'
import DealGrid from '../components/deals/DealGrid'
import { normalizeStoreName } from '../utils/storeName'
import { expandQuery } from '../utils/searchSynonyms'
import { trackSearch } from '../utils/analytics'

export default function AanbiedingenPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [allDeals, setAllDeals] = useState(undefined)
  const [activeStore, setActiveStore] = useState(searchParams.get('store') || 'all')
  const [activeCat, setActiveCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/deals/`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => setAllDeals(Array.isArray(data.data) ? data.data : []))
      .catch(() => setAllDeals([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      if (searchQuery.trim()) trackSearch(searchQuery.trim())
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchTerms = expandQuery(debouncedQuery)

  const filteredDeals = allDeals === undefined ? undefined : allDeals.filter(deal => {
    if (activeStore !== 'all' && normalizeStoreName(deal.stores?.name) !== activeStore) return false
    if (activeCat !== 'all') return false
    if (searchTerms.length > 0) {
      const productLower = (deal.product ?? '').toLowerCase()
      if (!searchTerms.some(term => productLower.includes(term))) return false
    }
    return true
  })

  const count = filteredDeals?.length ?? 0
  const title = activeCat !== 'all' ? t(`cats.${activeCat}`) : t('deals.title')
  const subtitle = debouncedQuery.trim()
    ? t('deals.count', { count })
    : activeCat !== 'all'
    ? t('deals.cat_subtitle', { count, cat: t(`cats.${activeCat}`) })
    : t('deals.subtitle')

  return (
    <Layout>
      <Helmet>
        <title>{t('deals.page_title')}</title>
        <meta name="description" content={t('deals.subtitle')} />
        <meta property="og:title" content={t('deals.page_title')} />
        <meta property="og:description" content={t('deals.subtitle')} />
      </Helmet>

      <div style={{ background: 'var(--c-bg)', borderBottom: '1px solid var(--c-border)', padding: '1.25rem var(--layout-pad)' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('search.placeholder')}
          />
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
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--c-text-subtle)' }}>
              {t('deals.store_notice')}
            </p>
          </div>

          <div style={{ background: 'var(--c-surface-alt)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-pill)', padding: '3px 12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text-subtle)' }}>
              {allDeals === undefined ? '—' : t('deals.count', { count })}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <StoreChip value="all" active={activeStore === 'all'} onClick={() => setActiveStore('all')}>{t('deals.all_stores')}</StoreChip>
            <StoreChip value="Albert Heijn" active={activeStore === 'Albert Heijn'} onClick={() => setActiveStore('Albert Heijn')}>Albert Heijn</StoreChip>
            <StoreChip value="Jumbo" active={activeStore === 'Jumbo'} onClick={() => setActiveStore('Jumbo')}>Jumbo</StoreChip>
          </div>
        </motion.div>

        {filteredDeals !== undefined && filteredDeals.length === 0 ? (
          debouncedQuery.trim() ? (
            <p style={{ textAlign: 'center', padding: '4rem 0', fontSize: '0.875rem', color: 'var(--c-text-subtle)' }}>
              {t('deals.no_results', { query: debouncedQuery.trim() })}
            </p>
          ) : (
            <EmptyState />
          )
        ) : (
          <DealGrid deals={filteredDeals} />
        )}
      </div>
    </Layout>
  )
}
