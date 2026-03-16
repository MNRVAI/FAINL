import { FC, useEffect, useState, useRef } from 'react';
import { CheckCircle, Tv } from 'lucide-react';
import { ADSENSE } from '../constants';

interface AdRewardModalProps {
  isOpen: boolean;
  onRewardEarned: () => void;
  onDismiss: () => void;
}

const AD_DURATION = 15;

export const AdRewardModal: FC<AdRewardModalProps> = ({ isOpen, onRewardEarned, onDismiss }) => {
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [canProceed, setCanProceed] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(AD_DURATION);
      setCanProceed(false);
      return;
    }

    // Push AdSense display ad — only if not already initialized on this element
    try {
      const el = insRef.current;
      if (el && !el.getAttribute('data-adsbygoogle-status')) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (_) {}


    // Start countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanProceed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-sm shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-black px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-yellow-400 rounded-lg">
              <Tv className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.25em] text-white/60">
              2e Gratis Sessie
            </span>
          </div>
          {!canProceed && (
            <div className="w-9 h-9 rounded-full border-4 border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm tabular-nums">{countdown}</span>
            </div>
          )}
        </div>

        {/* Ad container */}
        <div className="bg-zinc-50 min-h-[260px] flex items-center justify-center overflow-hidden">
          <ins
            ref={insRef}
            className="adsbygoogle block w-full min-h-[260px]"
            data-ad-client={ADSENSE.PUBLISHER_ID}
            data-ad-slot={ADSENSE.REWARD_GATE_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t-4 border-black">
          {canProceed ? (
            <button
              type="button"
              onClick={onRewardEarned}
              className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Start Sessie
            </button>
          ) : (
            <div className="py-2 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-black">
                Nog {countdown} seconden
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="w-full mt-2 py-2 font-black text-sm uppercase tracking-[0.3em] text-black/25 hover:text-black/50 transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
};
