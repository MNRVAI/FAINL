import { useState, FC } from 'react';
import { Shield, Mail, ArrowRight, Loader2, X, MessageSquare } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface Props {
  pendingQuery: string;
  onClose: () => void;
  onLoginSuccess: () => void; // Called after successful auth — parent triggers the query
}

export const LoginGateModal: FC<Props> = ({ pendingQuery, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ── Google OAuth ─────────────────────────────────────────── */
  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
      // Google redirects away — save pending query to sessionStorage so it
      // survives the OAuth round-trip and App.tsx picks it up on return.
      sessionStorage.setItem('fainl_pending_query', pendingQuery);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsLoading(false);
    }
  };

  /* ── Magic-link e-mail ────────────────────────────────────── */
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsLoading(true);
      setMessage(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href },
      });
      if (error) throw error;
      sessionStorage.setItem('fainl_pending_query', pendingQuery);
      setMessage({
        type: 'success',
        text: 'Controleer je e-mail — we sturen je een inloglink. Je vraag wordt automatisch hervat.',
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="login-gate-overlay" role="dialog" aria-modal="true" aria-labelledby="lgate-title">
      {/* Backdrop */}
      <div className="login-gate-backdrop" onClick={onClose} />

      <div className="login-gate-card">
        {/* Close */}
        <button className="login-gate-close" onClick={onClose} aria-label="Sluiten">
          <X />
        </button>

        {/* Question preview */}
        <div className="login-gate-query-wrap">
          <span className="login-gate-query-label">
            <MessageSquare className="login-gate-query-icon" aria-hidden="true" />
            Jouw vraag wordt bewaard
          </span>
          <blockquote className="login-gate-query-text">"{pendingQuery}"</blockquote>
        </div>

        {/* Header */}
        <div className="login-gate-header">
          <div className="login-gate-logo">
            <Shield className="login-gate-logo-icon" aria-hidden="true" />
          </div>
          <h2 id="lgate-title" className="login-gate-title">Inloggen om door te gaan</h2>
          <p className="login-gate-sub">
            Log in of maak een account aan. Jouw vraag wordt daarna automatisch verwerkt — je hoeft niets opnieuw in te typen.
          </p>
        </div>

        {/* Feedback message */}
        {message && (
          <div className={`login-gate-msg login-gate-msg--${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        {/* Google */}
        <div className="login-gate-social">
          <button
            className="login-gate-social-btn"
            onClick={handleGoogle}
            disabled={isLoading}
            aria-label="Inloggen met Google"
          >
            {isLoading ? (
              <Loader2 className="login-gate-spin" aria-hidden="true" />
            ) : (
              <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="" aria-hidden="true" />
            )}
            Doorgaan met Google
          </button>
        </div>

        {/* Divider */}
        <div className="login-gate-divider" aria-hidden="true">
          <span className="login-gate-divider-label">of via e-mail</span>
        </div>

        {/* Email form */}
        <form className="login-gate-form" onSubmit={handleEmail} noValidate>
          <div className="login-gate-input-wrap">
            <Mail className="login-gate-input-icon" aria-hidden="true" />
            <input
              id="lgate-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jouw@email.com"
              className="login-gate-input"
              autoComplete="email"
              required
              aria-label="E-mailadres"
            />
          </div>
          <button
            type="submit"
            className="login-gate-submit"
            disabled={isLoading || !email}
            aria-label="Stuur magische inloglink"
          >
            {isLoading ? (
              <Loader2 className="login-gate-spin" aria-hidden="true" />
            ) : (
              <>Stuur inloglink <ArrowRight className="login-gate-arrow" aria-hidden="true" /></>
            )}
          </button>
        </form>

        <p className="login-gate-fine">
          Veilige authenticatie via Supabase. Wij slaan geen wachtwoorden op.
        </p>
      </div>
    </div>
  );
};
