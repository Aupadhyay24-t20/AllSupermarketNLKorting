import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DealCard } from '../ds/DealCard'
import { mapDealToCardProps } from '../ds/mapDealToCardProps'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '1rem' }

function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'var(--c-surface-alt)',
        border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-md)',
        height: '18rem',
      }}
    />
  )
}

export default function DealGrid({ deals: dealsProp, limit, featureFirst = false }) {
  const [fetchedDeals, setFetchedDeals] = useState([])
  const [fetching, setFetching] = useState(dealsProp === undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (dealsProp !== undefined) return

    fetch(`${import.meta.env.VITE_API_URL}/deals`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
        setFetchedDeals(list)
        setFetching(false)
      })
      .catch(err => {
        setError(err.message)
        setFetching(false)
      })
  }, [dealsProp])

  const deals = dealsProp !== undefined ? dealsProp : fetchedDeals
  const loading = dealsProp === undefined && fetching

  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p style={{ textAlign: 'center', padding: '4rem 0', fontSize: '0.875rem', color: 'var(--c-text-subtle)' }}>
        Kon deals niet laden, probeer het later opnieuw.
      </p>
    )
  }

  if (!deals.length) {
    return (
      <p style={{ textAlign: 'center', padding: '4rem 0', fontSize: '0.875rem', color: 'var(--c-text-subtle)' }}>
        Geen aanbiedingen gevonden.
      </p>
    )
  }

  const visible = limit ? deals.slice(0, limit) : deals

  return (
    <motion.div style={gridStyle} variants={gridVariants} initial="hidden" animate="visible">
      {visible.map((deal, i) => (
        <motion.div key={deal.id ?? i} variants={cardVariants} style={{ height: '100%' }}>
          <DealCard {...mapDealToCardProps(deal)} featured={featureFirst && i === 0} />
        </motion.div>
      ))}
    </motion.div>
  )
}
