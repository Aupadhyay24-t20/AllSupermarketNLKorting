import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Aanbiedingen', to: '/aanbiedingen' },
  { label: 'Over Ons', to: '/over-ons' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(20,20,20,0.94)' : '#1a1a1a',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.7)' : '0 2px 12px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <span style={{ fontSize: '1.25rem' }}>🌿</span>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #ffffff 30%, #22c55e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          SuperDeal
        </span>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: '#fbbf24',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}>NL</span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
              color: isActive ? '#22c55e' : '#666666',
              background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          flexDirection: 'column',
          gap: '5px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
        }}
        className="mobile-menu-btn"
      >
        {[0, 1, 2].map(i => (
          <span key={i} style={{ display: 'block', width: '22px', height: '2px', background: '#ffffff', borderRadius: '2px' }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              background: 'rgba(20,20,20,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '1rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  padding: '0.75rem 0',
                  fontSize: '1rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#22c55e' : '#ffffff',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
