
import { FC, useState } from 'react';
import { Gift, Mail, X, Zap } from 'lucide-react';

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
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_1px_rgba(255,255,255,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Top bar */}
        <div className="bg-black dark:bg-white p-6 md:p-8 relative">
          <button 
            onClick={onClose} 
            title="Close welcome offer"
            aria-label="Close welcome offer"
            className="absolute top-4 right-4 p-2 text-white/40 dark:text-black/40 hover:text-white dark:hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-400 rounded-xl">
              <Gift className="w-5 h-5 text-black" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 dark:text-black/60">First-Time User Protocol</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white dark:text-black leading-tight">
            Unlock 15%<br/>Neural Discount
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {!submitted ? (
            <>
              <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed mb-6">
                Subscribe to the FAINL newsletter and receive an immediate protocol voucher for your first access tier.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="YOUR_EMAIL@NODE.LOCAL"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-4 border-black/10 dark:border-white/10 rounded-xl md:rounded-2xl px-5 py-4 font-black uppercase tracking-widest text-[10px] text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 outline-none focus:bg-white dark:focus:bg-zinc-700 transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  <Mail className="w-4 h-4" />
                  Claim Discount
                </button>
              </form>
              <button onClick={onClose} className="w-full mt-3 py-3 font-black text-[10px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
                Skip for now
              </button>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white mb-2">Protocol Synced</h3>
              <p className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">Your voucher will arrive shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
