import { FC } from 'react';
import {
  Zap,
  Shield,
  Key,
  ArrowRight,
  Infinity as InfinityIcon,
  CreditCard,
  Check,
} from 'lucide-react';
import { PRICING } from '../constants';
import { ScrambleText } from './ScrambleText';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({
  hasOwnKeys,
  onPurchaseTurns,
  onPurchaseCredits,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-fade-in-up">

      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-wide mb-4">
          <Zap className="w-3.5 h-3.5" />
          Access Tiers
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          <ScrambleText text="Simple Pricing" />
        </h1>
        <p className="max-w-sm mx-auto text-zinc-400 dark:text-zinc-500 text-sm md:text-base leading-relaxed">
          Choose your access tier and start deliberating with the council.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Standard Turns */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-sm shadow-zinc-900/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Standard Access</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Full consensus turns included</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRICING.TURNS.map((pkg, idx) => (
              <button
                key={idx}
                onClick={() => onPurchaseTurns(pkg.count)}
                className={`group relative flex flex-col items-start p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden ${
                  pkg.count === Infinity
                    ? 'col-span-2 sm:col-span-3 bg-gradient-to-br from-zinc-800 to-zinc-900 border-transparent text-white shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/15 hover:scale-[1.02]'
                    : 'glass-card card-shadow hover:card-shadow-hover hover:scale-[1.02] text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {pkg.count === Infinity && (
                  <div className="absolute top-2.5 right-[-2rem] bg-yellow-400 text-black px-8 py-0.5 text-[9px] font-bold uppercase tracking-wider rotate-45">
                    Best
                  </div>
                )}

                {/* Subtle accent top line for regular cards */}
                {pkg.count !== Infinity && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
                )}

                <div className="text-2xl font-bold mb-0.5 flex items-center gap-1.5">
                  {pkg.count === Infinity
                    ? <InfinityIcon className="w-6 h-6" />
                    : pkg.count
                  }
                  {pkg.count !== Infinity && (
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">turns</span>
                  )}
                </div>

                <div className={`text-base font-bold ${pkg.count === Infinity ? 'text-yellow-300' : 'text-zinc-800 dark:text-zinc-200'}`}>
                  €{pkg.price}
                </div>

                <div className={`mt-3 flex items-center gap-1 text-[10px] font-semibold ${pkg.count === Infinity ? 'text-white/50' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  Select
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* BYO API Keys */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl glass-card card-shadow flex items-center justify-center">
              <Key className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">BYO Experience</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">1 credit = 1 full network turn</p>
            </div>
          </div>

          <div className="glass-card card-shadow rounded-2xl overflow-hidden">
            <div className="p-4 md:p-5 border-b border-zinc-100 dark:border-white/[0.06]">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Use your own API keys. Pay only for the orchestration layer — keep full control.
              </p>
              {!hasOwnKeys && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Connect API keys in Settings to unlock this tier.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 md:p-5 space-y-2.5">
              {PRICING.CREDITS.map((pkg, idx) => (
                <button
                  key={idx}
                  onClick={() => onPurchaseCredits(pkg.count)}
                  disabled={!hasOwnKeys}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:border-zinc-300 dark:hover:border-white/15 transition-all group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-zinc-100 dark:disabled:hover:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                    </div>
                    <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{pkg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">€{pkg.price}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value props */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'End-to-End Encrypted', desc: 'Your sessions and keys are stored locally only.' },
          { icon: Zap, label: 'Multi-Provider', desc: 'Orchestrate across 10+ AI providers simultaneously.' },
          { icon: Check, label: 'No Subscription', desc: 'Pay once, use as needed. No hidden fees.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="glass-card card-shadow rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">{label}</p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
