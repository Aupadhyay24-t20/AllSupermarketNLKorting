import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Aanbiedingen', to: '/aanbiedingen' },
  { label: 'Over Ons', to: '/over-ons' },
]

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full flex items-center justify-between px-6"
      style={{
        backgroundColor: '#111614',
        borderBottom: '1px solid #2d5a3d',
        height: '72px',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <span>🌿</span>
        <span style={{ color: '#ffffff' }}>Super</span>
        <span style={{ color: '#eeb717' }}>Deal</span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `text-base font-medium transition-colors duration-200 ${
                isActive ? 'text-[#4caf50]' : 'text-white hover:text-[#4caf50]'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Hamburger icon (mobile only, no dropdown) */}
      <button
        className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
        aria-label="Open menu"
      >
        <span className="block h-0.5 w-6" style={{ backgroundColor: '#ffffff' }} />
        <span className="block h-0.5 w-6" style={{ backgroundColor: '#ffffff' }} />
        <span className="block h-0.5 w-6" style={{ backgroundColor: '#ffffff' }} />
      </button>
    </header>
  )
}
