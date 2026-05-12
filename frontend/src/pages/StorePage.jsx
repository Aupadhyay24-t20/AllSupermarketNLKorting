import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'
import DealSearch from '../components/deals/DealSearch'
import DealGrid from '../components/deals/DealGrid'
import client from '../api/client'

function DiscountTypeFilter({ options, selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {['Alle', ...options].map(option => {
        const isSelected = option === 'Alle' ? !selected : selected === option
        return (
          <button
            key={option}
            onClick={() => onChange(option === 'Alle' ? null : option)}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
            style={
              isSelected
                ? { backgroundColor: '#00833E', borderColor: '#00833E', color: '#fff' }
                : { backgroundColor: '#374151', borderColor: '#4B5563', color: '#9CA3AF' }
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default function StorePage() {
  const { storeName } = useParams()
  const decodedName = decodeURIComponent(storeName)

  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedDiscountType, setSelectedDiscountType] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setNotFound(false)
      try {
        const storesRes = await client.get('/stores')
        const store = storesRes.data.find(
          s => s.name.toLowerCase() === decodedName.toLowerCase()
        )
        if (!store) {
          setNotFound(true)
          return
        }
        const dealsRes = await client.get('/deals', { params: { store_id: store.id } })
        setDeals(dealsRes.data.data)
      } catch (err) {
        console.error('Failed to fetch store deals:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [decodedName])

  const discountTypes = useMemo(() => {
    const labels = deals.map(d => d.discount_types?.label).filter(Boolean)
    return [...new Set(labels)]
  }, [deals])

  const filteredDeals = useMemo(() => {
    const q = search.toLowerCase()
    return deals.filter(deal => {
      if (q && !deal.product?.toLowerCase().includes(q)) return false
      if (selectedDiscountType && deal.discount_types?.label !== selectedDiscountType) return false
      return true
    })
  }, [deals, search, selectedDiscountType])

  return (
    <Layout>
      <Helmet>
        <title>{decodedName} — SuperDeal NL</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] capitalize">
            {decodedName}
          </h1>
          {!loading && !notFound && (
            <p className="mt-1 text-sm text-[#9CA3AF]">
              {deals.length} aanbiedingen deze week
            </p>
          )}
        </div>

        {notFound ? (
          <p className="text-[#9CA3AF]">Winkel niet gevonden.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-8">
              <DealSearch
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {discountTypes.length > 0 && (
                <DiscountTypeFilter
                  options={discountTypes}
                  selected={selectedDiscountType}
                  onChange={setSelectedDiscountType}
                />
              )}
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
          </>
        )}
      </div>
    </Layout>
  )
}
