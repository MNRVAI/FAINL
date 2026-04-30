import { FC } from 'react';
import { Shield, Lock, Server, CheckCircle } from 'lucide-react';

export const ApiKeysPage: FC = () => {
  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <Shield className="w-3.5 h-3.5" />
          Beveiliging
        </div>
        <h1 className="page-title">API-sleutels</h1>
        <p className="page-sub">
          FAINL beheert alle AI-verbindingen centraal en veilig via de backend.
        </p>
      </div>

      {/* Info banner */}
      <div className="info-banner" style={{ marginBottom: 24 }}>
        <Lock className="w-4 h-4 shrink-0" style={{ color: 'var(--ink-3)' }} />
        <p>
          Jouw API-sleutels zijn <strong>nooit zichtbaar</strong> in de browser.
          Ze worden uitsluitend beheerd door de server — buiten bereik van elke gebruiker.
        </p>
      </div>

      {/* Explanation cards */}
      <div style={{ display: 'grid', gap: 16 }}>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Server className="w-5 h-5" style={{ color: 'var(--ink-3)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
              Server-side beheer
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              Alle AI-verzoeken verlopen via een beveiligde backend proxy (Supabase Edge Function).
              De Google Gemini API-sleutel staat uitsluitend in de serveromgeving — onzichtbaar voor browsers,
              DevTools en netwerkverzoeken.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Shield className="w-5 h-5" style={{ color: 'var(--ink-3)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
              Wat dit betekent voor jou
            </p>
            <ul style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
              <li>Je hoeft geen eigen API-sleutels aan te schaffen of te beheren</li>
              <li>Jouw gebruik is veilig afgeschermd van andere gebruikers</li>
              <li>Elke aanvraag vereist een geldig inlog-token</li>
              <li>Credits worden per sessie afgetrokken voor eerlijk gebruik</li>
            </ul>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--ink-3)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>
              Actief model
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6 }}>
              FAINL maakt gebruik van <strong>Google Gemini</strong> — één van de meest capabele
              en kostenefficiënte AI-modellen beschikbaar. Jij kiest de naam en persoonlijkheid
              van de nodes; wij zorgen voor de verbinding.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
