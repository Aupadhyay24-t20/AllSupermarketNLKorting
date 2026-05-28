import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'
import DealGrid from '../components/deals/DealGrid'

export default function HomePage() {
  const [query, setQuery] = useState('')

  return (
    <Layout>
      <Helmet>
        <title>SuperDeal NL — Alle Supermarkt Aanbiedingen</title>
      </Helmet>

      {/* Hero */}
      <section
        className="w-full flex flex-col md:flex-row items-center pl-4 md:pl-16 pr-4 md:pr-8 py-12 md:py-0 gap-10 min-h-screen"
        style={{ backgroundColor: '#111614' }}
      >
        {/* Left: 60% */}
        <div className="w-full md:w-3/5 flex flex-col gap-6 pl-0 md:pl-16 justify-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-white">Vind de beste</span>
            <br />
            <span style={{ color: '#4caf50' }}>supermarkt deals</span>
          </h1>

          <p className="text-lg" style={{ color: '#a0b8a8' }}>
            ML-powered deals &amp; stats
          </p>

          {/* Search bar */}
          <div
            className="flex items-center w-full max-w-lg rounded-full overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Zoek een product..."
              className="flex-1 px-5 py-3 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              className="px-5 py-3 text-sm font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: '#4caf50' }}
            >
              Zoeken
            </button>
          </div>

          {/* CTA */}
          <div>
            <Link
              to="/aanbiedingen"
              className="inline-block px-8 py-3 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#4caf50' }}
            >
              Bekijk aanbiedingen
            </Link>
          </div>
        </div>

        {/* Right: 40% */}
        <div className="w-full md:w-2/5" style={{ maxWidth: '500px' }}>
          <DealGrid limit={4} />
        </div>
      </section>

      {/* Beste deals deze week */}
      <section
        className="w-full pl-16 pr-8 py-12"
        style={{ backgroundColor: '#111614' }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Beste deals deze week
        </h2>
        <DealGrid limit={8} />
      </section>
    </Layout>
  )
}
