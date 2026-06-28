import { Search, X } from 'lucide-react'

export function SearchInput({ value = '', onChange, placeholder = 'Zoek producten...', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <Search
        size={15}
        strokeWidth={2}
        aria-hidden
        style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-subtle)', pointerEvents: 'none' }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          borderRadius: 'var(--r-pill)',
          borderWidth: 1.5,
          borderStyle: 'solid',
          borderColor: 'var(--c-border-strong)',
          background: 'var(--c-bg)',
          padding: value ? '9px 36px 9px 40px' : '9px 16px 9px 40px',
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
      {value && (
        <button
          onClick={() => onChange?.('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--c-surface-alt)',
            border: 'none',
            borderRadius: '50%',
            width: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--c-text-subtle)',
            padding: 0,
          }}
        >
          <X size={11} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
