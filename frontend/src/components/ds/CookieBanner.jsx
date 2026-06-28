import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { initGA } from '../../utils/analytics'

const STORAGE_KEY = 'cookie_consent'

export function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted') { initGA(); return }
    if (stored === 'declined') return
    setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    initGA()
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 998,
        background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 16px rgba(15,23,42,0.06), 0 32px 80px rgba(15,23,42,0.18)',
          maxWidth: 580,
          width: '100%',
          padding: '2rem',
          border: '1px solid rgba(15,23,42,0.06)',
        }}>

          {/* Icon + heading row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--c-brand-bg)',
              border: '1px solid var(--c-brand-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={22} color="var(--c-brand)" strokeWidth={1.75} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-text)', lineHeight: 1.2 }}>
                {t('cookie.title')}
              </h2>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--c-text-subtle)', marginTop: 2 }}>
                {t('cookie.subtitle')}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--c-border)', margin: '0 0 1.1rem' }} />

          {/* Description */}
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.855rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>
            {t('cookie.text')}
          </p>

          {/* Meer info link */}
          <Link
            to="/cookies"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--c-brand)',
              display: 'inline-block',
              marginBottom: '1.5rem',
            }}
          >
            {t('cookie.link')} →
          </Link>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={decline}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 'var(--r-pill)',
                border: '1.5px solid var(--c-border-strong)',
                background: 'transparent',
                color: 'var(--c-text-muted)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-text-subtle)'; e.currentTarget.style.color = 'var(--c-text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border-strong)'; e.currentTarget.style.color = 'var(--c-text-muted)' }}
            >
              {t('cookie.decline')}
            </button>
            <button
              onClick={accept}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                background: 'var(--c-brand)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(30,107,60,0.3)',
                transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-brand-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,107,60,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-brand)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,107,60,0.3)' }}
            >
              {t('cookie.accept')}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
