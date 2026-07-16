import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Logo } from '../ds/Logo'
import { LanguageSwitcher } from '../ds/LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.deals'), to: '/aanbiedingen' },
    { label: t('nav.about'), to: '/over-ons' },
    { label: t('nav.app'), to: '/get-app' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--header-height)',
          background: 'var(--c-bg)',
          borderBottom: '1px solid var(--c-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--layout-pad)',
          gap: '1.25rem',
          transition: 'box-shadow 0.25s',
          boxShadow: scrolled ? 'var(--shadow-header)' : 'none',
        }}
      >
        <Link to="/" style={{ flexShrink: 0 }}>
          <Logo />
        </Link>

        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '0.2rem', flexShrink: 0, marginLeft: 'auto' }}>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--r-pill)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
                color: isActive ? 'var(--c-brand)' : 'var(--c-text-muted)',
                background: isActive ? 'var(--c-brand-bg)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <LanguageSwitcher />

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="flex md:hidden"
          style={{
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            background: 'transparent',
            border: '1.5px solid var(--c-border-strong)',
            flexDirection: 'column',
            gap: 5,
            padding: 0,
            flexShrink: 0,
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={
                menuOpen
                  ? i === 0
                    ? { translateY: 6.5, rotate: 45 }
                    : i === 1
                    ? { opacity: 0, scaleX: 0 }
                    : { translateY: -6.5, rotate: -45 }
                  : { translateY: 0, rotate: 0, opacity: 1, scaleX: 1 }
              }
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'block', width: 16, height: 1.5, background: 'var(--c-text-muted)', borderRadius: 2, transformOrigin: 'center' }}
            />
          ))}
        </button>
      </header>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'block',
              position: 'fixed',
              top: 'var(--header-height)',
              left: 0,
              right: 0,
              background: 'var(--c-bg)',
              borderBottom: '1px solid var(--c-border)',
              padding: '1.25rem 1.5rem 1.5rem',
              zIndex: 150,
              boxShadow: 'var(--shadow-popover)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    padding: '0.7rem 0.9rem',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--c-brand)' : 'var(--c-text-muted)',
                    background: isActive ? 'var(--c-brand-bg)' : 'transparent',
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
