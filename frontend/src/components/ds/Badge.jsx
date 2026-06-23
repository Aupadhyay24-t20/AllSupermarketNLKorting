/**
 * Eyebrow pill — dot + uppercase label. Used above hero headlines.
 */
export function Badge({ children, style }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--c-brand-tint)',
        border: '1px solid rgba(30,107,60,0.25)',
        borderRadius: 'var(--r-pill)',
        padding: '4px 14px',
        ...style,
      }}
    >
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-brand)' }} />
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          color: 'var(--c-brand-hover)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </div>
  )
}
