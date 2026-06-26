import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LABELS = { nl: 'Nederlands', en: 'English' }

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = i18n.language

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchTo(lang) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.3rem 0.65rem',
          borderRadius: 'var(--r-pill)',
          border: '1.5px solid var(--c-border-strong)',
          background: 'transparent',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--c-text-muted)',
          cursor: 'pointer',
          transition: 'border-color var(--dur-base)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-brand)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border-strong)'}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span>{current.toUpperCase()}</span>
        <span style={{ fontSize: '0.6rem', opacity: 0.7, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--c-bg)',
            border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow-popover)',
            overflow: 'hidden',
            minWidth: 130,
            zIndex: 200,
          }}
        >
          {['nl', 'en'].map(lang => (
            <button
              key={lang}
              onClick={() => switchTo(lang)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.6rem 0.9rem',
                background: lang === current ? 'var(--c-brand-bg)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: lang === current ? 600 : 400,
                color: lang === current ? 'var(--c-brand)' : 'var(--c-text-muted)',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (lang !== current) e.currentTarget.style.background = 'var(--c-surface-alt)' }}
              onMouseLeave={e => { if (lang !== current) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ flex: 1 }}>{LABELS[lang]}</span>
              {lang === current && <span style={{ fontSize: '0.7rem' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
