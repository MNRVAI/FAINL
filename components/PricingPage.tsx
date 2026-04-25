import { FC } from 'react';
import { Zap, Shield, Key, ArrowRight, Infinity as InfinityIcon, CreditCard, Check } from 'lucide-react';
import { PRICING } from '../constants';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits: (count: number) => void;
}

export const PricingPage: FC<PricingPageProps> = ({ hasOwnKeys, onPurchaseTurns, onPurchaseCredits }) => {
  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <Zap className="w-3.5 h-3.5" />
          Toegangsniveaus
        </div>
        <h1 className="page-title">Transparante Prijzen</h1>
        <p className="page-sub">Kies jouw toegangsniveau en start het debat met de AI-raad. Geen abonnementen — betaal alleen wat je gebruikt.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Providers', value: '10+', icon: Zap },
          { label: 'Verborgen kosten', value: '€0', icon: Check },
          { label: 'Lokale opslag', value: '100%', icon: Shield },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Two column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28 }}>

        {/* Standaard beurten */}
        <div className="key-card" style={{ gap: 16 }}>
          <div className="key-card-header">
            <div>
              <span className="key-label">
                <Shield className="w-4 h-4 inline mr-1.5" style={{ verticalAlign: -3 }} />
                Standaard Toegang
              </span>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>Volledige consensussessies inbegrepen</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {PRICING.TURNS.filter(p => p.count !== Infinity).map((pkg, idx) => (
              <button key={idx} onClick={() => onPurchaseTurns(pkg.count)}
                style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--ink-3)')}
                onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--line)')}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--ink)' }}>{pkg.count}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)', marginBottom: 8 }}>beurten</div>
                <div style={{ fontWeight: 700, color: 'var(--ink-2)', fontSize: 14 }}>€{pkg.price}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                  Kies <ArrowRight style={{ width: 10, height: 10 }} />
                </div>
              </button>
            ))}
          </div>

          {/* Lifetime */}
          {PRICING.TURNS.filter(p => p.count === Infinity).map((pkg, idx) => (
            <button key={idx} onClick={() => onPurchaseTurns(pkg.count)}
              style={{ width: '100%', background: 'var(--ink)', color: 'var(--canvas)', border: 'none', borderRadius: 'var(--r-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 700 }}>
                  <InfinityIcon style={{ width: 20, height: 20 }} /> Levenslang
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Onbeperkt gebruik, altijd</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>€{pkg.price}</div>
                <div style={{ fontSize: 10, opacity: 0.5 }}>Eenmalig</div>
              </div>
            </button>
          ))}
        </div>

        {/* Eigen sleutels */}
        <div className="key-card" style={{ gap: 16 }}>
          <div className="key-card-header">
            <div>
              <span className="key-label">
                <Key className="w-4 h-4 inline mr-1.5" style={{ verticalAlign: -3 }} />
                Eigen API-sleutels
              </span>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>1 credit = 1 volledige netwerksessie</div>
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>
            Gebruik jouw eigen sleutels. Betaal alleen voor de orchestratielaag — volledige controle.
          </p>

          {!hasOwnKeys && (
            <div className="info-banner" style={{ marginBottom: 0 }}>
              <Zap className="w-4 h-4 shrink-0" style={{ color: 'var(--ink-3)' }} />
              <p>Voeg API-sleutels in via <strong>Instellingen</strong> om dit niveau te ontgrendelen.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRICING.CREDITS.map((pkg, idx) => (
              <button key={idx} onClick={() => onPurchaseCredits(pkg.count)} disabled={!hasOwnKeys}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-md)', cursor: hasOwnKeys ? 'pointer' : 'not-allowed',
                  opacity: hasOwnKeys ? 1 : 0.45, transition: 'all 0.15s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="stat-icon" style={{ width: 30, height: 30, margin: 0, flexShrink: 0 }}>
                    <CreditCard style={{ width: 14, height: 14 }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{pkg.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>€{pkg.price}</span>
                  <ArrowRight style={{ width: 14, height: 14, color: 'var(--ink-4)' }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Value props */}
      <div className="stats-row" style={{ marginBottom: 0 }}>
        {[
          { icon: Shield, label: 'Lokaal versleuteld', desc: 'Sessies en sleutels worden alleen lokaal opgeslagen.' },
          { icon: Zap, label: 'Multi-Provider', desc: 'Orchestreer 10+ AI-providers tegelijk.' },
          { icon: Check, label: 'Geen abonnement', desc: 'Betaal eenmalig. Geen verborgen kosten.' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="stat-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <div className="stat-icon" style={{ margin: 0 }}><Icon className="w-4 h-4" /></div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
