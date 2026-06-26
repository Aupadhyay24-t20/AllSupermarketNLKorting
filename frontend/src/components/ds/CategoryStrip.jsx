import { useTranslation } from 'react-i18next'

const CAT_KEYS = ['all', 'groenten', 'vlees', 'zuivel', 'dranken', 'snacks', 'huishouden', 'diepvries']

export function CategoryStrip({ active, onChange }) {
  const { t } = useTranslation()

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
          {CAT_KEYS.map(key => {
            const isActive = key === active
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
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
                {t(`cats.${key}`)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
