import { FC } from 'react';
import {
  Zap,
  Shield,
  Check,
  X,
  CreditCard,
  Infinity as InfinityIcon,
  Key,
  Loader2,
} from 'lucide-react';
import { PRICING } from '../constants';

interface PaywallModalProps {
  isOpen: boolean;
  hasOwnKeys: boolean;
  isLoading?: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
  onClose: () => void;
}

export const PaywallModal: FC<PaywallModalProps> = ({
  isOpen,
  hasOwnKeys,
  isLoading,
  onPurchaseTurns,
  onPurchaseCredits,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/70 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-sm shadow-zinc-900/20">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Access Required</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Unlock the full FAINL consensus engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close paywall"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Turns Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-zinc-700" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Standard Turns</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {PRICING.TURNS.map((pkg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPurchaseTurns(pkg.count)}
                    disabled={isLoading}
                    className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] ${
                      pkg.count === Infinity
                        ? 'col-span-2 bg-gradient-to-br from-zinc-800 to-zinc-900 border-transparent text-white shadow-md shadow-zinc-900/20'
                        : 'border-zinc-100 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] hover:border-zinc-300 dark:hover:border-white/15'
                    }`}
                  >
                    {pkg.count === Infinity && (
                      <div className="absolute top-2 right-[-2rem] bg-yellow-400 text-black px-8 py-0.5 text-[9px] font-bold uppercase tracking-wider rotate-45">
                        Best
                      </div>
                    )}
                    <div className={`text-xl font-bold mb-0.5 ${pkg.count === Infinity ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {pkg.count === Infinity ? <InfinityIcon className="w-5 h-5" /> : pkg.count}
                      {pkg.count !== Infinity && <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 ml-1">turns</span>}
                    </div>
                    <div className={`text-base font-bold ${pkg.count === Infinity ? 'text-yellow-300' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      €{pkg.price}
                    </div>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Credits Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">BYO Credits</h3>
              </div>

              {!hasOwnKeys && (
                <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-snug">
                    Connect API keys in Settings to unlock credit billing.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {PRICING.CREDITS.map((pkg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPurchaseCredits(pkg.count)}
                    disabled={!hasOwnKeys || isLoading}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] hover:border-zinc-300 dark:hover:border-white/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{pkg.label}</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">€{pkg.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="flex flex-wrap gap-3">
            {['Multi-Node Consensus', 'Local Encryption', 'No Subscription'].map(label => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Secure checkout · End-to-end encrypted</p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
