
import { FC } from 'react';
import {
  Shield,
  CheckCircle,
  X,
  Star,
  Zap
} from 'lucide-react';
import { PRICING } from '../constants';

interface PaywallModalProps {
  isOpen: boolean;
  hasOwnKeys: boolean;
  isLoading?: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits?: (count: number) => void;
  onClose: () => void;
}

export const PaywallModal: FC<PaywallModalProps> = ({
  isOpen,
  isLoading,
  onPurchaseTurns,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
      <div className="bg-[#c3cdde] dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] dark:shadow-[32px_32px_0px_1px_rgba(255,255,255,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b-4 border-black dark:border-white/20 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-4">
            <div className="bg-black dark:bg-white p-3 rounded-xl shadow-lg text-white dark:text-black">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black dark:text-white">Intelligence Access Required</h2>
              <p className="text-[10px] md:text-xs font-black text-black/40 dark:text-white/40 uppercase mt-1 tracking-widest flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                Premium Neural Consensus Link
              </p>
            </div>
          </div>
          <button onClick={onClose} title="Close Paywall" aria-label="Close Paywall" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all text-black dark:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">

          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-black dark:text-white text-center">Select Your Access Tier</h3>
            <p className="text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed text-center">
              Unlock high-performance autonomous neural networks via Stripe's secure checkout.
            </p>
          </div>

          {/* 3-tier grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRICING.TURNS.map((pkg, idx) => (
              <button
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 text-black/30 dark:text-white/30 mb-3 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <div className="text-3xl font-black mb-1 text-black dark:text-white">{pkg.count}</div>
                <div className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">Turns</div>
                <div className="text-xl font-black text-black dark:text-white">€{pkg.price}</div>
                <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">{pkg.label}</div>
                {isLoading && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-white/50 dark:bg-zinc-950/50 border-4 border-black dark:border-white/20 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-black dark:text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Multi-Node Consensus</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Local Logic</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Zero Data Training</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t-4 border-black dark:border-white/20 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em]">Secure Checkout via Stripe • Encrypted Protocol 2.5.1</p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            I'll decide later
          </button>
        </div>
      </div>
    </div>
  );
};
