
import { FC } from 'react';
import {
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { PRICING } from '../constants';
import { ScrambleText } from './ScrambleText';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits?: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({
  onPurchaseTurns,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
          <ScrambleText text="Neural Access Tiers" />
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
          Select your protocol access tier to begin deliberation. Secure checkout via Stripe.
        </p>
      </div>

      {/* Standard turns */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-black dark:bg-zinc-800 p-3 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-black dark:text-white">Standard Access</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Full consensus turns · One-time purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {PRICING.TURNS.map((pkg, idx) => (
            <button
              key={idx}
              onClick={() => onPurchaseTurns(pkg.count)}
              className="group flex flex-col items-start p-6 md:p-8 border-4 rounded-2xl bg-white dark:bg-zinc-900 border-black dark:border-white/20 text-black dark:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              <Zap className="w-5 h-5 text-black/20 dark:text-white/20 mb-4 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <div className="text-4xl font-black mb-1 text-black dark:text-white">{pkg.count}</div>
              <div className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Turns</div>
              <div className="text-2xl font-black text-black dark:text-white">€{pkg.price}</div>
              <div className="mt-6 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30">
                {pkg.label} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          More tiers coming soon · Secure checkout via Stripe
        </p>
      </div>
    </div>
  );
};
