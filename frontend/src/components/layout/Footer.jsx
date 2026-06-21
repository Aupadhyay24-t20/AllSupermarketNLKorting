import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '2.5rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌿</span>
            <span style={{
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 40%, #22c55e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>SuperDeal NL</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#444444', maxWidth: '220px', lineHeight: 1.6 }}>
            Alle supermarkt aanbiedingen op één plek.
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Aanbiedingen', to: '/aanbiedingen' },
            { label: 'Over Ons', to: '/over-ons' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{ fontSize: '0.8rem', color: '#666666', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <p style={{ fontSize: '0.75rem', color: '#444444' }}>
          © 2026 SuperDeal NL
        </p>
        <p style={{ fontSize: '0.75rem', color: '#444444' }}>
          Prijzen kunnen afwijken — controleer altijd de supermarkt
        </p>
      </div>
    </footer>
  )
}
