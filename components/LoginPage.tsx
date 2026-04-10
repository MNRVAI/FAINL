import { useState, FC } from 'react';
import { Shield, Github, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Magic link sent! Check your email to continue.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="glow-orb w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 animate-float-slow opacity-30" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="glass-card card-shadow rounded-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />

          {/* Header */}
          <div className="p-7 pb-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-zinc-900/15">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Sign In to FAINL
            </h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-snug">
              Access your session history and saved question results
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-5 mb-5 p-3.5 rounded-xl text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          {/* Social Buttons */}
          <div className="px-5 pb-4 space-y-2.5">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-all disabled:opacity-50 hover:border-zinc-300 dark:hover:border-white/15"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition-all disabled:opacity-50 hover:border-zinc-300 dark:hover:border-white/15"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/[0.06]" />
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-600">or</span>
            <div className="h-px flex-1 bg-zinc-100 dark:bg-white/[0.06]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="px-5 pb-6 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="btn-violet w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="px-5 pb-5 text-center text-[11px] text-zinc-400 dark:text-zinc-600 leading-relaxed">
            Authentication is handled securely by Supabase. Your sessions remain encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};
