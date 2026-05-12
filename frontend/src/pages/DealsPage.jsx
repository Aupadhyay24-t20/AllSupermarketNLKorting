import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'
import DealSearch from '../components/deals/DealSearch'
import DealFilter from '../components/deals/DealFilter'
import DealGrid from '../components/deals/DealGrid'
import client from '../api/client'

export default function DealsPage() {
  const [deals, setDeals] = useState([])
  const [stores, setStores] = useState([])
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedDiscountType, setSelectedDiscountType] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [dealsRes, storesRes] = await Promise.all([
          client.get('/deals'),
          client.get('/stores'),
        ])
        setDeals(dealsRes.data.data)
        setTotal(dealsRes.data.total)
        setStores(storesRes.data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const storeNames = useMemo(
    () => stores.map(s => s.name),
    [stores]
  )

  const discountTypeLabels = useMemo(() => {
    const labels = deals.map(d => d.discount_types?.label).filter(Boolean)
    return [...new Set(labels)]
  }, [deals])

  const filteredDeals = useMemo(() => {
    const q = search.toLowerCase()
    return deals.filter(deal => {
      if (q && !deal.product?.toLowerCase().includes(q)) return false
      if (selectedStore && deal.stores?.name !== selectedStore) return false
      if (selectedDiscountType && deal.discount_types?.label !== selectedDiscountType) return false
      return true
    })
  }, [deals, search, selectedStore, selectedDiscountType])

  const weekRange = useMemo(() => {
    const first = deals[0]
    if (!first?.start_date || !first?.end_date) return null
    const fmt = dateStr =>
      new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })
    return `${fmt(first.start_date)} – ${fmt(first.end_date)}`
  }, [deals])

  return (
    <Layout>
      <Helmet>
        <title>Aanbiedingen — SuperDeal NL</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB]">
            Alle Aanbiedingen
          </h1>
          {weekRange && (
            <p className="mt-2 text-base font-medium text-[#00833E]">
              Week van {weekRange}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <DealSearch
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <DealFilter
            stores={storeNames}
            selectedStore={selectedStore}
            onStoreChange={setSelectedStore}
            discountTypes={discountTypeLabels}
            selectedDiscountType={selectedDiscountType}
            onDiscountTypeChange={setSelectedDiscountType}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-4 border-[#374151] border-t-[#00833E] animate-spin" />
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#9CA3AF]">
              {filteredDeals.length} aanbiedingen gevonden
            </p>
            <DealGrid deals={filteredDeals} />
          </>
        )}
      </div>
    </Layout>
  )
}