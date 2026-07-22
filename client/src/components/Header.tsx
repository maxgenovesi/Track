import { useState } from 'react'
import { AuthModal } from './AuthModal'
import './Header.css'

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <header className="header">
        <nav className="header__bar" aria-label="Primary">
          <a className="header__brand" href="/">
            Track
          </a>

          <div className="header__search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search tasks, projects, pages…"
              aria-label="Search"
            />
            <kbd className="header__kbd" aria-hidden="true">
              ⌘K
            </kbd>
          </div>

          <div className="header__nav">
            <a className="header__link" href="/docs">
              Docs
            </a>
            <a className="header__link" href="/contact">
              Contact
            </a>
            <button
              type="button"
              className="header__login"
              onClick={() => setAuthOpen(true)}
            >
              Log in
            </button>
          </div>
        </nav>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
