import { useState } from 'react'
import { motion } from 'framer-motion'

function parsePrice(discount_raw) {
  if (!discount_raw) return null
  const vanVoor = discount_raw.match(/van\s+([\d.,]+)\s+voor\s+([\d.,]+)/i)
  if (vanVoor) {
    return {
      type: 'van_voor',
      original: parseFloat(vanVoor[1].replace(',', '.')),
      deal: parseFloat(vanVoor[2].replace(',', '.')),
    }
  }
  const voorOnly = discount_raw.match(/(?:^|uitgelicht\s+)voor\s+([\d.,]+)/i)
  if (voorOnly) {
    return { type: 'voor_only', deal: parseFloat(voorOnly[1].replace(',', '.')) }
  }
  return null
}

function fmtPrice(n) {
  return '€' + n.toFixed(2).replace('.', ',')
}

function cleanDiscount(text) {
  if (!text) return ''
  return text.replace(/\s*\*M\.u\.v\.[^*]*/g, '').trim()
}

export default function DealCard({
  product,
  discount_raw,
  image_url,
  link,
  store_name,
  store_logo_url,
  end_date,
}) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const price = parsePrice(discount_raw)
  const showBadge = !price && discount_raw
  const savings = price?.type === 'van_voor'
    ? Math.round((price.original - price.deal) * 100) / 100
    : null

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
      style={{
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        cursor: 'pointer',
        background: '#1c1c1c',
        border: hovered
          ? '1px solid rgba(34,197,94,0.4)'
          : '1px solid rgba(255,255,255,0.09)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(34,197,94,0.1), 0 16px 36px rgba(0,0,0,0.5)'
          : '0 2px 12px rgba(0,0,0,0.35)',
        transition: 'border 0.25s, box-shadow 0.25s',
      }}
    >
      {/* ── Image ── */}
      <div style={{
        height: '148px',
        flexShrink: 0,
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        {image_url && !imgError ? (
          <img
            src={image_url}
            alt={product}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ color: '#999999', fontSize: '0.75rem' }}>Geen afbeelding</span>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '0.875rem',
        gap: '0.6rem',
      }}>

        {/* Store row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {store_logo_url && (
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <img
                src={store_logo_url}
                alt={store_name}
                style={{ width: '14px', height: '14px', objectFit: 'contain' }}
              />
            </div>
          )}
          {store_name && (
            <span style={{ fontSize: '0.7rem', color: '#666666', fontWeight: 500 }}>
              {store_name}
            </span>
          )}
        </div>

        {/* Product name */}
        <p style={{
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.85rem',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.38rem',
          margin: 0,
        }}>
          {product}
        </p>

        {/* ── Discount info (below product name) ── */}
        <div style={{ minHeight: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {price?.type === 'van_voor' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  {fmtPrice(price.deal)}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#555555', textDecoration: 'line-through' }}>
                  {fmtPrice(price.original)}
                </span>
              </div>
              {savings != null && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#22c55e',
                  color: '#000000',
                  fontSize: '0.67rem',
                  fontWeight: 700,
                }}>
                  Bespaar {fmtPrice(savings)}
                </span>
              )}
            </div>
          )}

          {price?.type === 'voor_only' && (
            <div>
              <span style={{ fontSize: '0.68rem', color: '#666666', display: 'block' }}>Aanbiedingsprijs</span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                {fmtPrice(price.deal)}
              </span>
            </div>
          )}

          {showBadge && (
            <span style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {cleanDiscount(discount_raw) || discount_raw}
            </span>
          )}
        </div>

        {/* Validity */}
        <p style={{
          fontSize: '0.7rem',
          color: '#555555',
          margin: 0,
          visibility: end_date ? 'visible' : 'hidden',
        }}>
          {end_date ? `Geldig t/m ${end_date}` : '—'}
        </p>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={e => {
            e.stopPropagation()
            link && window.open(link, '_blank', 'noopener,noreferrer')
          }}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: '9999px',
            border: 'none',
            background: hovered ? '#16a34a' : '#22c55e',
            color: '#000000',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
            letterSpacing: '0.01em',
            marginTop: '0.25rem',
          }}
        >
          Bekijk deal →
        </motion.button>
      </div>
    </motion.div>
  )
}
