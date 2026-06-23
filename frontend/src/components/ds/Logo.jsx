/**
 * Fresco wordmark — gradient leaf tile + serif name. Used in Header + Footer.
 */
export function Logo({ size = 30, showName = true, nameColor = 'var(--c-text)', style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, ...style }}>
      <div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg,#1e6b3c,#2a8a4e)',
          borderRadius: size >= 28 ? 8 : 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 28 28" fill="none">
          <path d="M4 21C4 10 14 3 14 3s10 7 10 18c0 3.3-4.5 5-10 5S4 24.3 4 21Z" fill="white" />
          <line x1="14" y1="26" x2="14" y2="15" stroke="var(--c-brand)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      {showName && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: size >= 28 ? '1.25rem' : '1.05rem', color: nameColor }}>
          Fresco
        </span>
      )}
    </div>
  )
}
