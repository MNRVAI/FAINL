import { FC, useState, useEffect } from "react";
import { Shield, X, ChevronDown, ChevronUp } from "lucide-react";

const CONSENT_KEY = "fainl_cookie_consent";

interface ConsentState {
  decided: boolean;
  analytics: boolean;
}

function fireConsentEvent(analytics: boolean) {
  window.dispatchEvent(
    new CustomEvent("fainl:cookie-consent", { detail: { analytics } }),
  );
}

export const CookieConsent: FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved) {
      const parsed: ConsentState = JSON.parse(saved);
      if (parsed.decided && parsed.analytics) {
        // Re-fire consent event for returning visitors who already accepted
        fireConsentEvent(true);
      }
      return;
    }
    // First visit — show banner after short delay
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    const state: ConsentState = { decided: true, analytics: true };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    fireConsentEvent(true);
    setVisible(false);
  };

  const decline = () => {
    const state: ConsentState = { decided: true, analytics: false };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    fireConsentEvent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie toestemming"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:max-w-lg z-[200] animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <div className="bg-white dark:bg-zinc-950 border-4 border-black dark:border-white/20 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-black dark:text-white">
              Privacy & Cookies
            </span>
          </div>
          <button
            onClick={decline}
            aria-label="Sluit en weiger cookies"
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-black/50 dark:text-white/50" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          <p className="text-xs text-black/70 dark:text-white/60 leading-relaxed">
            Wij gebruiken{" "}
            <strong className="text-black dark:text-white">
              noodzakelijke cookies
            </strong>{" "}
            voor een correcte werking van deze site. Met jouw toestemming
            plaatsen we ook{" "}
            <strong className="text-black dark:text-white">
              analytische cookies
            </strong>{" "}
            (Google Analytics) om onze dienst te verbeteren.
          </p>

          {/* Expandable details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {expanded ? "Verberg details" : "Meer details"}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 text-[10px] text-black/60 dark:text-white/50 leading-relaxed border-t-2 border-black/10 dark:border-white/10 pt-3">
              <div>
                <span className="font-black text-black dark:text-white uppercase">
                  Noodzakelijk (altijd actief)
                </span>
                <p className="mt-0.5">
                  Sessie-instellingen, thema-voorkeur, trial-toestand. Geen
                  persoonsgegevens naar derden.
                </p>
              </div>
              <div>
                <span className="font-black text-black dark:text-white uppercase">
                  Analytisch (alleen met toestemming)
                </span>
                <p className="mt-0.5">
                  Google Analytics 4 — anoniem paginagebruik. Rechtsgrond:
                  toestemming (Art. 6.1.a AVG). Bewaartermijn: 14 maanden.
                </p>
              </div>
              <a
                href="/privacy"
                className="underline text-black dark:text-white font-black"
              >
                Volledige privacyverklaring →
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={decline}
            className="flex-1 px-4 py-3 border-4 border-black dark:border-white/20 text-black dark:text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Alleen noodzakelijk
          </button>
          <button
            onClick={accept}
            className="flex-1 px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
          >
            Accepteer alles
          </button>
        </div>
      </div>
    </div>
  );
};
