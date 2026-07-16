import { useState } from 'react'
import { StoreLogo } from './StoreLogo'
import { trackDealClick } from '../../utils/analytics'

const STORE_COLORS = { 'Albert Heijn': 'var(--c-ah)', Jumbo: 'var(--c-jumbo)' }

function CornerBadge({ discount }) {
  if (!discount.corner) return null
  return (
    <div
      style={{
        position: 'absolute',
        top: 9,
        left: 9,
        borderRadius: 'var(--r-sm)',
        padding: '4px 9px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 38,
        background: discount.cornerBg,
      }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', lineHeight: 1.05 }}>
        {discount.corner[0]}
      </span>
      <span
        style={
          discount.cornerPriceSub
            ? { fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', lineHeight: 1.05 }
            : { fontFamily: 'var(--font-sans)', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', marginTop: 1 }
        }
      >
        {discount.corner[1]}
      </span>
    </div>
  )
}

function PriceArea({ discount }) {
  const mainStyle = { fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--c-text)', lineHeight: 1.1 }
  if (discount.multi) return <span style={mainStyle}>{discount.multi}</span>
  if (discount.price) return <span style={mainStyle}>{discount.price}</span>
  if (discount.other) return <span style={{ ...mainStyle, fontSize: '1rem', lineHeight: 1.3 }}>{discount.other}</span>
  if (discount.corner) return <span style={{ ...mainStyle, fontSize: '1rem', lineHeight: 1.3 }}>{discount.corner.join(' ')}</span>
  return null
}

/**
 * DealCard — Fresco product card. Ported from the prototype's renderCard():
 * tinted image area with corner badge, store-colored label, product name,
 * price/discount area, bottom badge, validity, CTA.
 */
export function DealCard({ id, product, imageUrl, store, endDate, link, discount, featured = false, style }) {
  const [imgError, setImgError] = useState(false)
  const open = () => {
    if (!link) return
    trackDealClick(product, store)
    if (id) fetch(`${import.meta.env.VITE_API_URL}/deals/${id}/click`, { method: 'POST' }).catch(() => {})
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={open}
      style={{
        background: 'var(--c-surface)',
        borderRadius: 'var(--r-md)',
        borderWidth: featured ? 1.5 : 1,
        borderStyle: 'solid',
        borderColor: featured ? 'var(--c-brand)' : 'var(--c-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: featured ? 'var(--shadow-featured)' : 'var(--shadow-card)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
        ...style,
      }}
      onMouseEnter={e => {
        if (!featured) e.currentTarget.style.borderColor = 'rgba(30,107,60,0.3)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        if (!featured) e.currentTarget.style.borderColor = 'var(--c-border)'
        e.currentTarget.style.boxShadow = featured ? 'var(--shadow-featured)' : 'var(--shadow-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div
        style={{
          height: 130,
          borderBottom: '1px solid var(--c-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--tint-default)',
        }}
      >
        {featured && (
          <div
            style={{
              position: 'absolute',
              top: 9,
              right: 9,
              background: 'var(--c-amber)',
              borderRadius: 'var(--r-pill)',
              padding: '2px 10px',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#000',
              zIndex: 1,
            }}
          >
            Top deal
          </div>
        )}
        <CornerBadge discount={discount} />
        {store && <StoreLogo store={store} style={{ position: 'absolute', bottom: 9, right: 9, zIndex: 1 }} />}
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }}
          />
        ) : (
          <span style={{ color: 'var(--c-text-subtle)', fontSize: '0.68rem' }}>Geen afbeelding</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
        {store && (
          <span style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: STORE_COLORS[store] ?? 'var(--c-text-subtle)' }}>
            {store}
          </span>
        )}
        <p
          style={{
            margin: 0,
            fontSize: '0.82rem',
            fontWeight: 500,
            color: 'var(--c-text)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.3rem',
          }}
        >
          {product}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <PriceArea discount={discount} />
          {discount.bottom && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 'var(--r-xs)',
                padding: '2px 8px',
                fontSize: '0.63rem',
                fontWeight: 700,
                marginTop: 3,
                background: discount.botBg,
                color: discount.botClr,
                width: 'fit-content',
              }}
            >
              {discount.bottom}
            </span>
          )}
        </div>
        {endDate && <p style={{ margin: 0, fontSize: '0.67rem', color: 'var(--c-text-subtle)' }}>Geldig t/m {endDate}</p>}
        <button
          onClick={e => {
            e.stopPropagation()
            open()
          }}
          style={{
            width: '100%',
            padding: '9px 0',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            background: 'var(--c-brand)',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 600,
            marginTop: 'auto',
            cursor: 'pointer',
            transition: 'background var(--dur-base) var(--ease-out)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-brand-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-brand)')}
        >
          Bekijk deal →
        </button>
      </div>
    </div>
  )
}
