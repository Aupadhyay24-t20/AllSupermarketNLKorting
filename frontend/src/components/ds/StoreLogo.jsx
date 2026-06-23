import ahLogo from '../../assets/AH-logo.jpg'
import jumboLogo from '../../assets/Jumbo-2.jpg'

const STORE_LOGOS = {
  'Albert Heijn': { src: ahLogo },
  Jumbo: { src: jumboLogo },
}

export function StoreLogo({ store, size = 34, style }) {
  const logo = STORE_LOGOS[store]
  if (!logo) return null
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--r-sm)',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 6px rgba(15,23,42,0.18)',
        padding: 3,
        flexShrink: 0,
        ...style,
      }}
    >
      <img src={logo.src} alt={store} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </span>
  )
}
