const CATS = ['Alles', 'Groenten & Fruit', 'Vlees & Vis', 'Zuivel', 'Dranken', 'Snacks & Koek', 'Huishouden', 'Diepvries']

/**
 * Sticky category filter strip — ported verbatim from the Fresco prototype.
 * Real deals carry no category field, so picking anything but "Alles"
 * naturally yields zero results; that's the literal prototype behavior,
 * not a bug to special-case.
 */
export function CategoryStrip({ active, onChange }) {
  return (
    <div
      style={{
        background: 'var(--c-bg)',
        borderBottom: '1px solid var(--c-border)',
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 99,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--layout-max)',
          margin: '0 auto',
          padding: '9px var(--layout-pad)',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '0.45rem', width: 'max-content', margin: '0 auto' }}>
          {CATS.map(c => {
            const isActive = c === active
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                style={{
                  padding: '7px 17px',
                  borderRadius: 'var(--r-pill)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--dur-base) var(--ease-out)',
                  color: isActive ? '#fff' : 'var(--c-text-muted)',
                  background: isActive ? 'var(--c-brand)' : 'var(--c-surface)',
                  border: `1.5px solid ${isActive ? 'var(--c-brand)' : 'var(--c-border-strong)'}`,
                  boxShadow: isActive ? '0 2px 8px rgba(30,107,60,0.22)' : 'none',
                }}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
