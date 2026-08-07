import { useState, useRef } from 'react'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import './Header.css'

const NAV_LINKS = ['About', 'What we do', 'Investors', 'Sustainability', 'Careers', 'News', 'Suppliers']

export default function Header({ searchTerm = '', onSearchTermChange }) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const resultsSection = document.querySelector('#results')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.hash = '#results'
    }
  }

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      const next = !prev
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 20)
      }
      return next
    })
  }

  return (
    <header className="header">
      <div className="header__bar container">
        <button
          className="header__icon-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <a href="#top" className="header__logo" aria-label="BHP home">
          BHP
        </a>

        <div className="header__right">
          <form className="header__search" onSubmit={handleSearchSubmit}>
            <button
              type="button"
              className="header__icon-btn"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              onClick={handleSearchToggle}
            >
              <Search size={19} />
            </button>
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="search"
                className="header__search-input"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(event) => onSearchTermChange?.(event.target.value)}
              />
            )}
          </form>
          <a href="#contact" className="header__link header__link--desktop">
            Contact us
          </a>
          <button className="header__lang">
            English <ChevronDown size={15} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="header__menu" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item}>
                <a href="#top" onClick={() => setOpen(false)}>{item}</a>
              </li>
            ))}
            <li className="header__menu-contact">
              <a href="#contact" onClick={() => setOpen(false)}>Contact us</a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
