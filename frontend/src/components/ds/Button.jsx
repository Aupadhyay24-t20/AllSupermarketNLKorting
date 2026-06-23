export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: '8px 18px', fontSize: '0.8rem' },
    md: { padding: '11px 24px', fontSize: '0.875rem' },
    lg: { padding: '13px 30px', fontSize: '0.95rem' },
  }
  const borderColors = {
    primary: 'var(--c-brand)',
    secondary: 'rgba(30,107,60,0.3)',
    ghost: 'var(--c-border-strong)',
  }
  const variants = {
    primary: { background: 'var(--c-brand)', color: '#fff', border: `1.5px solid ${borderColors.primary}` },
    secondary: { background: 'transparent', color: 'var(--c-brand)', border: `1.5px solid ${borderColors.secondary}` },
    ghost: { background: 'transparent', color: 'var(--c-text-muted)', border: `1.5px solid ${borderColors.ghost}` },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderRadius: 'var(--r-pill)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? '100%' : 'auto',
        justifyContent: fullWidth ? 'center' : 'flex-start',
        transition: `background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-fast) var(--ease-spring)`,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px) scale(0.97)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseEnter={e => {
        if (disabled) return
        e.currentTarget.style.borderColor = 'var(--c-brand)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.borderColor = borderColors[variant]
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
