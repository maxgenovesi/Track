import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AuthModal.css";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

// Login / sign-up modal. The form calls Supabase directly; the AuthProvider's
// onAuthStateChange listener captures the resulting session, so on success we
// just close the modal.
export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    onClose();
  }

  if (!open) return null;

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

        <h2 className="modal__title">
          {mode === "signin" ? "Log in" : "Sign up"}
        </h2>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__field">
            <span className="modal__label">Email</span>
            <input
              type="email"
              value={email}
              required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="modal__field">
            <span className="modal__label">Password</span>
            <input
              type="password"
              value={password}
              required
              minLength={6}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="modal__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="modal__submit" disabled={busy}>
            {busy
              ? "Working…"
              : mode === "signin"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className="modal__switch"
          onClick={() => {
            setError(null);
            setMode(mode === "signin" ? "signup" : "signin");
          }}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
