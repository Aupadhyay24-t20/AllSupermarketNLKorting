import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import DealCard from '../components/deals/DealCard'
import client from '../api/client'

export default function HomePage() {
  const [deals, setDeals] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [dealsRes, storesRes] = await Promise.all([
          client.get('/deals'),
          client.get('/stores'),
        ])
        setDeals(dealsRes.data.data)
        setStores(storesRes.data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalDeals = deals.length
  const totalStores = stores.length
  const discountTypes = new Set(deals.map(d => d.discount_types?.label).filter(Boolean)).size

  const stats = [
    { label: 'Deals deze week', value: totalDeals },
    { label: 'Supermarkten', value: totalStores },
    { label: 'Soorten korting', value: discountTypes },
  ]

  const featuredDeals = deals.slice(0, 6)

  return (
    <Layout>
      <Helmet>
        <title>SuperDeal NL — Alle Supermarkt Aanbiedingen</title>
      </Helmet>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36">
        <h1 className="text-4xl md:text-6xl font-bold text-[#F9FAFB] max-w-3xl leading-tight">
          Vind de beste supermarkt deals
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[#9CA3AF] max-w-xl">
          Vergelijk aanbiedingen van Albert Heijn, Jumbo, Lidl en meer
        </p>
        <Link
          to="/deals"
          className="mt-10 inline-block px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-colors hover:opacity-90"
          style={{ backgroundColor: '#00833E' }}
        >
          Bekijk aanbiedingen
        </Link>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="bg-[#1F2937] rounded-2xl border border-[#374151] p-6 flex flex-col items-center text-center"
            >
              <span className="text-4xl font-extrabold text-[#F9FAFB]">
                {loading ? '—' : stat.value}
              </span>
              <span className="mt-1 text-sm text-[#9CA3AF]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-6">Beste deals deze week</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-[#374151] border-t-[#00833E] animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredDeals.map((deal, i) => (
                <DealCard
                  key={deal.id ?? i}
                  product={deal.product}
                  discountRaw={deal.discount_raw ?? deal.discountRaw}
                  discountType={deal.discount_types?.label ?? deal.discount}
                  store={deal.stores?.name ?? deal.store}
                  startDate={deal.start_date}
                  endDate={deal.end_date}
                  link={deal.link}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                to="/deals"
                className="px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-colors hover:opacity-90"
                style={{ backgroundColor: '#00833E' }}
              >
                Bekijk alle aanbiedingen
              </Link>
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}
