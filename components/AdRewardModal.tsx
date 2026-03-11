import { FC, useEffect, useState } from 'react';
import { Play, CheckCircle, XCircle, Tv } from 'lucide-react';

interface AdRewardModalProps {
  isOpen: boolean;
  onRewardEarned: () => void;
  onDismiss: () => void;
}

type AdStatus = 'idle' | 'loading' | 'success' | 'failed' | 'dismissed';

declare global {
  interface Window {
    adBreak?: (opts: Record<string, unknown>) => void;
  }
}

export const AdRewardModal: FC<AdRewardModalProps> = ({ isOpen, onRewardEarned, onDismiss }) => {
  const [status, setStatus] = useState<AdStatus>('idle');

  useEffect(() => {
    if (isOpen) setStatus('idle');
  }, [isOpen]);

  const loadAndShowAd = () => {
    setStatus('loading');

    if (typeof window.adBreak !== 'function') {
      // AdSense niet geladen of ad blocker actief
      setStatus('failed');
      return;
    }

    window.adBreak({
      type: 'reward',
      name: 'second_session',
      beforeAd: () => setStatus('loading'),
      adViewed: () => {
        setStatus('success');
        setTimeout(() => onRewardEarned(), 1500);
      },
      adDismissed: () => setStatus('dismissed'),
      afterAd: () => {},
      beforeReward: (showAdFn: unknown) => {
        if (typeof showAdFn === 'function') showAdFn();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black rounded-[2rem] w-full max-w-md shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-black p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-400 rounded-xl">
              <Tv className="w-5 h-5 text-black" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">2e Gratis Sessie</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-tight">
            Bijna Klaar
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {status === 'idle' && (
            <>
              <p className="text-sm font-bold text-black/60 leading-relaxed mb-6">
                Bekijk een korte advertentie en unlock jouw 2e gratis AI-consensus sessie. Daarna is betaling vereist voor verdere toegang.
              </p>
              <button
                type="button"
                onClick={loadAndShowAd}
                className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                <Play className="w-4 h-4" />
                Bekijk Advertentie
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="w-full mt-3 py-3 font-black text-[10px] uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors"
              >
                Niet nu
              </button>
            </>
          )}

          {status === 'loading' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Advertentie laden...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-2">Toegang Verleend</h3>
              <p className="text-xs font-bold text-black/50 uppercase tracking-widest">Sessie wordt gestart...</p>
            </div>
          )}

          {(status === 'failed' || status === 'dismissed') && (
            <>
              <div className="py-4 text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-sm font-bold text-black/60 leading-relaxed">
                  {status === 'dismissed'
                    ? 'Advertentie niet voltooid. Bekijk de volledige advertentie om toegang te krijgen.'
                    : 'Advertentie kon niet worden geladen. Controleer of je een ad blocker hebt of probeer opnieuw.'}
                </p>
              </div>
              <button
                type="button"
                onClick={loadAndShowAd}
                className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4" />
                Probeer Opnieuw
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="w-full mt-3 py-3 font-black text-[10px] uppercase tracking-[0.3em] text-black/30 hover:text-black transition-colors"
              >
                Niet nu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
