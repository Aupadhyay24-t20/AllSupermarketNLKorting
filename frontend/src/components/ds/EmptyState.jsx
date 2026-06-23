export function EmptyState({
  title = 'Geen deals gevonden',
  description = 'Probeer een andere categorie of supermarkt.',
  action,
  style,
}) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0', ...style }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--c-text-muted)', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--c-text-subtle)' }}>{description}</p>
      {action && <div style={{ marginTop: '1.25rem' }}>{action}</div>}
    </div>
  )
}
