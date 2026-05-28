import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'

const STORES = ['Albert Heijn', 'Jumbo']
const TYPES = ['1+1 gratis', '2e gratis', '% Korting', 'Combikorting']

function FilterSection({ label, options, selected, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase mb-2 mt-4" style={{ color: '#a0b8a8' }}>
        {label}
      </p>
      <div className="flex flex-col gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onChange(option)}
              className="accent-[#4caf50]"
            />
            <span className="text-sm text-white">{option}</span>
          </label>
        ))}
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

  function toggle(value, list, setList) {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function clearFilters() {
    setSelectedStores([])
    setSelectedTypes([])
  }

  const filteredDeals = allDeals === undefined ? undefined : allDeals.filter(deal => {
    if (selectedStores.length > 0 && !selectedStores.includes(deal.stores?.name)) return false
    if (selectedTypes.length > 0 && !selectedTypes.some(t => deal.discount_raw?.includes(t))) return false
    return true
  })

  return (
    <Layout>
      <Helmet>
        <title>Aanbiedingen — SuperDeal NL</title>
      </Helmet>

      <div
        className="flex w-full min-h-screen"
        style={{ backgroundColor: '#111614' }}
      >
        {/* Sidebar */}
        <aside
          className="flex-shrink-0 flex flex-col"
          style={{
            width: '220px',
            padding: '1.5rem',
            backgroundColor: '#1a3d2b',
            minHeight: '100vh',
          }}
        >
          <p className="font-bold text-white mb-4">Filters</p>

          <FilterSection
            label="Supermarkt"
            options={STORES}
            selected={selectedStores}
            onChange={v => toggle(v, selectedStores, setSelectedStores)}
          />

          <FilterSection
            label="Korting type"
            options={TYPES}
            selected={selectedTypes}
            onChange={v => toggle(v, selectedTypes, setSelectedTypes)}
          />

          <button
            className="mt-auto w-full text-sm py-2 rounded-lg transition-colors hover:bg-[#111614]"
            style={{
              border: '1px solid #2d5a3d',
              color: '#a0b8a8',
              marginTop: '2rem',
            }}
            onClick={clearFilters}
          >
            Filters wissen
          </button>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Alle Aanbiedingen</h1>
          <p className="text-sm mb-4" style={{ color: '#a0b8a8' }}>
            Bekijk alle deals van AH en Jumbo
          </p>

          <DealGrid deals={filteredDeals} />
        </main>
      </div>
    </Layout>
  )
}
