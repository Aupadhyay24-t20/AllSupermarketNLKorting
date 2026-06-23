import { Link } from 'react-router-dom'
import { Logo } from '../ds/Logo'

const navCol = [
  { label: 'Home', to: '/' },
  { label: 'Aanbiedingen', to: '/aanbiedingen' },
  { label: 'Over Ons', to: '/over-ons' },
]

const storeCol = [
  { label: 'Albert Heijn', to: '/aanbiedingen?store=Albert+Heijn' },
  { label: 'Jumbo', to: '/aanbiedingen?store=Jumbo' },
]

const colLabel = {
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--c-text-subtle)',
  marginBottom: '0.25rem',
}

const colLink = { fontSize: '0.82rem', color: 'var(--c-text-muted)' }

export default function Footer() {
  return (
    <footer style={{ background: 'var(--c-bg)', borderTop: '1px solid var(--c-border)', padding: '3rem var(--layout-pad) 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Logo size={24} />
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--c-text-subtle)', maxWidth: 200, lineHeight: 1.6 }}>
            Alle supermarkt aanbiedingen op één plek.
          </p>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={colLabel}>Navigatie</span>
            {navCol.map(l => (
              <Link key={l.to} to={l.to} style={colLink}>{l.label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={colLabel}>Supermarkten</span>
            {storeCol.map(l => (
              <Link key={l.to} to={l.to} style={colLink}>{l.label}</Link>
            ))}
          </div>
        </nav>
      </div>

      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.73rem', color: 'var(--c-text-subtle)' }}>© 2026 Fresco</span>
        <span style={{ fontSize: '0.73rem', color: 'var(--c-text-subtle)' }}>Prijzen kunnen afwijken — controleer altijd de supermarkt</span>
      </div>
    </footer>
  )
}
