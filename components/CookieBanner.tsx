import { FC, useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Cookie, ExternalLink } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface CookieConsent {
  functional: boolean;   // Always true – required for app to work
  analytics: boolean;    // Optional usage tracking
  marketing: boolean;    // Optional personalisation
}

interface Props {
  onAcceptAll: (consent: CookieConsent) => void;
  onRejectAll: (consent: CookieConsent) => void;
  onSavePreferences: (consent: CookieConsent) => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export const CookieBanner: FC<Props> = ({ onAcceptAll, onRejectAll, onSavePreferences }) => {
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const buildConsent = (all: boolean): CookieConsent => ({
    functional: true,
    analytics: all ? true : analytics,
    marketing: all ? true : marketing,
  });

  return (
    <div className="cookie-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      {/* Backdrop blur */}
      <div className="cookie-backdrop" />

      <div className="cookie-banner">
        {/* Header */}
        <div className="cookie-header">
          <span className="cookie-icon-wrap">
            <Cookie className="cookie-icon" aria-hidden="true" />
          </span>
          <div>
            <h2 id="cookie-title" className="cookie-title">Wij gebruiken cookies</h2>
            <p className="cookie-sub">
              FAINL gebruikt cookies om de applicatie goed te laten werken en uw ervaring te verbeteren.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="cookie-body">
          <p className="cookie-desc">
            Door op <strong>Alles accepteren</strong> te klikken, stemt u in met het gebruik van alle cookies.
            U kunt ook uw <button className="cookie-link" onClick={() => setExpanded(e => !e)}>
              voorkeuren aanpassen
            </button> per categorie.
          </p>

          {/* Expandable preferences */}
          <div className="cookie-prefs">
            <button
              className="cookie-prefs-toggle"
              onClick={() => setExpanded(e => !e)}
              aria-expanded={expanded}
              aria-controls="cookie-prefs-detail"
            >
              <span>Cookievoorkeuren</span>
              {expanded ? <ChevronUp className="cookie-chevron" /> : <ChevronDown className="cookie-chevron" />}
            </button>

            {expanded && (
              <div id="cookie-prefs-detail" className="cookie-prefs-detail">
                {/* Functional – always on */}
                <div className="cookie-category">
                  <div className="cookie-category-info">
                    <span className="cookie-category-name">
                      <Shield className="cookie-category-icon" aria-hidden="true" />
                      Functioneel (verplicht)
                    </span>
                    <p className="cookie-category-desc">
                      Noodzakelijk voor de werking van de applicatie. Kan niet worden uitgeschakeld.
                    </p>
                  </div>
                  <div className="cookie-toggle cookie-toggle--on cookie-toggle--disabled" aria-label="Functionele cookies zijn altijd actief" />
                </div>

                {/* Analytics */}
                <div className="cookie-category">
                  <div className="cookie-category-info">
                    <span className="cookie-category-name">Analyse</span>
                    <p className="cookie-category-desc">
                      Helpt ons begrijpen hoe u de applicatie gebruikt, zodat wij deze kunnen verbeteren.
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={analytics}
                    aria-label="Analysecookies in-/uitschakelen"
                    className={`cookie-toggle ${analytics ? 'cookie-toggle--on' : ''}`}
                    onClick={() => setAnalytics(a => !a)}
                  />
                </div>

                {/* Marketing */}
                <div className="cookie-category">
                  <div className="cookie-category-info">
                    <span className="cookie-category-name">Marketing</span>
                    <p className="cookie-category-desc">
                      Wordt gebruikt voor gepersonaliseerde aanbevelingen en relevante content.
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={marketing}
                    aria-label="Marketingcookies in-/uitschakelen"
                    className={`cookie-toggle ${marketing ? 'cookie-toggle--on' : ''}`}
                    onClick={() => setMarketing(m => !m)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="cookie-footer">
          <div className="cookie-links">
            <a href="#" onClick={e => { e.preventDefault(); }} className="cookie-policy-link">
              Privacybeleid <ExternalLink className="cookie-ext-icon" aria-hidden="true" />
            </a>
            <a href="#" onClick={e => { e.preventDefault(); }} className="cookie-policy-link">
              Cookiebeleid <ExternalLink className="cookie-ext-icon" aria-hidden="true" />
            </a>
          </div>
          <div className="cookie-actions">
            <button className="cookie-btn cookie-btn--ghost" onClick={() => onRejectAll(buildConsent(false))}>
              Alleen functioneel
            </button>
            {expanded && (
              <button className="cookie-btn cookie-btn--secondary" onClick={() => onSavePreferences(buildConsent(false))}>
                Opslaan
              </button>
            )}
            <button className="cookie-btn cookie-btn--primary" onClick={() => onAcceptAll(buildConsent(true))}>
              Alles accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
