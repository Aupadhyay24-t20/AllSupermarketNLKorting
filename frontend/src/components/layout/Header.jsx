import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Aanbiedingen', to: '/deals' },
  { label: 'Over Ons', to: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#1F2937] border-b border-[#374151]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: '#00833E' }}
        >
          SuperDeal NL
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[#00833E] ${
                  isActive ? 'text-[#00833E]' : 'text-[#9CA3AF]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`block h-0.5 w-6 bg-[#9CA3AF] transition-transform duration-200 ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#9CA3AF] transition-opacity duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#9CA3AF] transition-transform duration-200 ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t border-[#374151] bg-[#1F2937] px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#374151] hover:text-[#00833E] ${
                  isActive ? 'text-[#00833E] bg-[#00833E]/10' : 'text-[#9CA3AF]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
