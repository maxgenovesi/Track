import { useState } from 'react'
import { AuthModal } from './AuthModal'
import './Header.css'

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <div className="masthead">
        {/* Logo. Swap this wordmark for an <img> when the logo asset lands. */}
        <a className="masthead__brand" href="/" aria-label="Track — home">
          Track
        </a>

        <nav className="masthead__nav" aria-label="Primary">
          <div className="masthead__search">
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
            <kbd className="masthead__kbd" aria-hidden="true">
              ⌘K
            </kbd>
          </div>

          <div className="masthead__links">
            <a className="masthead__link" href="/docs">
              Docs
            </a>
            <a className="masthead__link" href="/contact">
              Contact
            </a>
            <button
              type="button"
              className="masthead__login"
              onClick={() => setAuthOpen(true)}
            >
              Log in
            </button>
          </div>
        </nav>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
