const ACTIVE_STYLES = {
  all: { background: 'var(--c-brand)', borderColor: 'var(--c-brand)', color: '#fff' },
  'Albert Heijn': { background: '#fff7ed', borderColor: 'var(--c-ah)', color: 'var(--c-ah)' },
  Jumbo: { background: '#fff5f5', borderColor: 'var(--c-jumbo)', color: 'var(--c-jumbo)' },
}

export function StoreChip({ value, active, onClick, children }) {
  const activeStyle = active ? ACTIVE_STYLES[value] : null
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 16px',
        borderRadius: 'var(--r-pill)',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all var(--dur-base) var(--ease-out)',
        background: activeStyle?.background ?? 'var(--c-surface)',
        borderColor: activeStyle?.borderColor ?? 'var(--c-border-strong)',
        border: '1.5px solid',
        color: activeStyle?.color ?? 'var(--c-text-muted)',
      }}
    >
      {children}
    </button>
  )
}
