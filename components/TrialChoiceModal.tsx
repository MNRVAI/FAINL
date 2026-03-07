import { FC, useState, useEffect } from "react";
import { X, Zap, Play, Coins, Shield, Clock, CheckCircle2 } from "lucide-react";
import { ScrambleText } from "./ScrambleText";

interface TrialChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onBuyTokens: () => void;
}

export const TrialChoiceModal: FC<TrialChoiceModalProps> = ({
  isOpen,
  onClose,
  onWatchAd,
  onBuyTokens,
}) => {
  const [view, setView] = useState<"choice" | "ad">("choice");
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (view === "ad" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (view === "ad" && timeLeft === 0) {
      setTimeout(() => {
        onWatchAd();
        onClose();
      }, 1000);
    }
  }, [view, timeLeft, onWatchAd, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={view === "choice" ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border-4 border-black dark:border-white/10 rounded-[2.5rem] shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {view === "choice" ? (
          <>
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="absolute top-6 right-6 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-black/50 dark:text-white/50" />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-yellow-400 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
                  <ScrambleText text="Second Chance Protocol" />
                </h2>
              </div>

              <p className="text-sm md:text-base font-bold text-black/60 dark:text-white/40 uppercase tracking-widest leading-relaxed mb-12">
                Je eerste AI-consenssessie is voltooid. Om een tweede sessie te
                starten, heb je twee keuzes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buy Tokens Option */}
                <button
                  onClick={onBuyTokens}
                  className="group relative flex flex-col items-start p-8 bg-black dark:bg-white text-white dark:text-black rounded-3xl transition-transform hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Coins className="w-16 h-16" />
                  </div>
                  <CheckCircle2 className="w-8 h-8 mb-4 text-yellow-400 dark:text-yellow-600" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-50">
                    Snelste Route
                  </span>
                  <span className="text-xl font-black uppercase tracking-tight">
                    Koop Tokens
                  </span>
                  <span className="mt-4 text-[10px] font-bold opacity-70 leading-relaxed uppercase">
                    Krijg direct toegang tot 10, 30 of 100 extra sessies.
                  </span>
                </button>

                {/* Watch Ad Option */}
                <button
                  onClick={() => setView("ad")}
                  className="group relative flex flex-col items-start p-8 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/10 text-black dark:text-white rounded-3xl transition-transform hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                    <Play className="w-16 h-16" />
                  </div>
                  <Clock className="w-8 h-8 mb-4 text-black dark:text-white" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-50">
                    Eenmalig Extra
                  </span>
                  <span className="text-xl font-black uppercase tracking-tight">
                    Bekijk Ad
                  </span>
                  <span className="mt-4 text-[10px] font-bold opacity-70 leading-relaxed uppercase">
                    Bekijk een korte advertentie voor één extra gratis sessie.
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 md:p-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-10 relative">
              <div className="absolute inset-0 border-8 border-black/5 dark:border-white/5 rounded-full" />
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * timeLeft) / 10}
                  className="text-yellow-400 transition-all duration-1000 linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-black dark:text-white">
                {timeLeft}
              </div>
            </div>

            <div className="space-y-4 max-w-sm">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
                Consensus in de wachtrij...
              </h3>
              <p className="text-xs font-bold text-black/50 dark:text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                Bedankt voor het bekijken van deze korte update. Je sessie wordt
                over enkele seconden vrijgegeven.
              </p>
            </div>

            <div className="mt-12 w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-3xl border-4 border-black dark:border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent animate-pulse" />
              <Shield className="w-12 h-12 text-black/20 dark:text-white/10" />
              <span className="absolute bottom-4 left-4 text-[8px] font-black uppercase tracking-widest text-black/20 dark:text-white/20">
                SPONSORED UPDATE :: FAINL HQ
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
