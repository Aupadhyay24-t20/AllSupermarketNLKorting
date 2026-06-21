import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DealCard from './DealCard'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        height: '18rem',
      }}
    />
  )
}

export default function DealGrid({ deals: dealsProp, limit }) {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (dealsProp !== undefined) {
      setDeals(dealsProp)
      setLoading(false)
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/deals`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
        setDeals(list)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [dealsProp])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center py-16 text-sm" style={{ color: '#444444' }}>
        Kon deals niet laden, probeer het later opnieuw.
      </p>
    )
  }

  if (!deals.length) {
    return (
      <p className="text-center py-16 text-sm" style={{ color: '#444444' }}>
        Geen aanbiedingen gevonden.
      </p>
    )
  }

  const visible = limit ? deals.slice(0, limit) : deals

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {visible.map((deal, i) => (
        <motion.div key={deal.id ?? i} variants={cardVariants} style={{ height: '100%' }}>
          <DealCard
            product={deal.product}
            discount_raw={deal.discount_raw}
            image_url={deal.image_url}
            link={deal.link}
            store_name={deal.stores?.name}
            store_logo_url={deal.stores?.logo_url}
            end_date={deal.end_date}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
