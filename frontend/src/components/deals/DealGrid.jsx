import { useState, useEffect } from 'react'
import DealCard from './DealCard'

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ backgroundColor: '#1a3d2b', height: '16rem' }}
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center py-16 text-sm" style={{ color: '#a0b8a8' }}>
        Kon deals niet laden, probeer het later opnieuw.
      </p>
    )
  }

  if (!deals.length) {
    return (
      <p className="text-center py-16 text-sm" style={{ color: '#a0b8a8' }}>
        Geen aanbiedingen gevonden.
      </p>
    )
  }

  const visible = limit ? deals.slice(0, limit) : deals

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {visible.map((deal, i) => (
        <DealCard
          key={deal.id ?? i}
          product={deal.product}
          discount_raw={deal.discount_raw}
          image_url={deal.image_url}
          link={deal.link}
          store_name={deal.stores?.name}
          store_logo_url={deal.stores?.logo_url}
          end_date={deal.end_date}
        />
      ))}
    </div>
  )
}
