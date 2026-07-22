import { useEffect } from 'react'
import './AuthModal.css'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

// Placeholder shell for the login flow. The Supabase sign-in form lands here
// next; for now it just proves the open/close interaction.
export function AuthModal({ open, onClose }: AuthModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Log in">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel">
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="modal__title">Log in</h2>
        <p className="modal__note">
          Sign-in isn’t wired up yet. The Supabase auth form will live here next.
        </p>
      </div>
    </div>
  )
}
