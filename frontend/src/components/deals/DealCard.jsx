import { useState } from 'react'

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

  // Only match "voor X" when preceded by start-of-string or "uitgelicht" — not a number
  const voorOnly = discount_raw.match(/(?:^|uitgelicht\s+)voor\s+([\d.,]+)/i)
  if (voorOnly) {
    return {
      type: 'voor_only',
      deal: parseFloat(voorOnly[1].replace(',', '.')),
    }
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
  const price = parsePrice(discount_raw)
  const showBadge = !price && discount_raw

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '1rem',
        maxWidth: '260px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.5rem',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Top section: image + name + date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        {/* Product image with logo overlay */}
        <div
          style={{
            height: '160px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {store_logo_url && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <img
                src={store_logo_url}
                alt={store_name}
                style={{ width: '30px', height: '30px', objectFit: 'contain', transform: 'scale(1.1)' }}
              />
            </div>
          )}

          <div style={{ position: 'relative', zIndex: 0, width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {image_url && !imgError ? (
              <img
                src={image_url}
                alt={product}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <span style={{ color: '#a0b8a8', fontSize: '0.75rem' }}>Geen afbeelding</span>
            )}
          </div>
        </div>

        {/* Product name */}
        <p
          style={{
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: '1.375',
            minHeight: '2.5rem',
            textAlign: 'center',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
            width: '100%',
          }}
        >
          {product}
        </p>

        {/* Validity */}
        {end_date && (
          <p style={{ color: '#888888', fontSize: '0.75rem', textAlign: 'center', margin: 0, width: '100%' }}>
            Geldig t/m {end_date}
          </p>
        )}
      </div>

      {/* Bottom section: price/badge + button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'flex-start' }}>

        {/* Price: van X voor Y */}
        {price?.type === 'van_voor' && (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a1a' }}>
                {fmtPrice(price.deal)}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#999999', textDecoration: 'line-through' }}>
                {fmtPrice(price.original)}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#4caf50', fontWeight: 600 }}>
              Bespaar {fmtPrice(Math.round((price.original - price.deal) * 100) / 100)}
            </p>
          </div>
        )}

        {/* Price: voor X / uitgelicht voor X */}
        {price?.type === 'voor_only' && (
          <div style={{ width: '100%' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#888888' }}>Aanbiedingsprijs</p>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a1a' }}>
              {fmtPrice(price.deal)}
            </span>
          </div>
        )}

        {/* Discount badge — only when no price parsed */}
        {showBadge && (
          <div style={{ width: '100%' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#4caf50',
                borderRadius: '999px',
                padding: '4px 12px',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#ffffff',
                maxWidth: '100%',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            >
              {cleanDiscount(discount_raw) || discount_raw}
            </span>
          </div>
        )}

        {/* CTA button */}
        <button
          style={{
            width: '100%',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.5rem 0',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#43a047')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4caf50')}
          onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
        >
          Bekijk deal
        </button>
      </div>
    </div>
  )
}
