import { Search } from 'lucide-react'

/**
 * Header search field — presentational only (matches the Fresco prototype,
 * which ships this input with no event handler).
 */
export function SearchInput({ placeholder = 'Zoek producten, bijv. kaas of kip...', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <Search
        size={15}
        strokeWidth={2}
        aria-hidden
        style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-subtle)' }}
      />
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: '100%',
          borderRadius: 'var(--r-pill)',
          borderWidth: 1.5,
          borderStyle: 'solid',
          borderColor: 'var(--c-border-strong)',
          background: 'var(--c-bg)',
          padding: '9px 16px 9px 40px',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.82rem',
          color: 'var(--c-text)',
          outline: 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--c-brand)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,107,60,0.1)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'var(--c-border-strong)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
