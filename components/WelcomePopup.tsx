import { FC, useState } from 'react';
import { Gift, Mail, X, Check, Sparkles } from 'lucide-react';

interface WelcomePopupProps {
  onClose: () => void;
}

export const WelcomePopup: FC<WelcomePopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Card */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/60">
          {/* Top gradient accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close welcome offer"
            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 transition-all z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {submitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-100 dark:border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">You're in!</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Your 15% voucher will arrive shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 pb-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-sm shadow-zinc-900/20">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200 uppercase tracking-widest">First-time offer</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-2">
                  Unlock 15%<br />Off Your First Order
                </h2>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
                  Subscribe to the FAINL newsletter and get an instant discount code for your first purchase.
                </p>
              </div>

              {/* Form */}
              <div className="px-6 pb-6 space-y-3">
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-violet w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Claim Discount
                  </button>
                </form>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
