import { FC } from 'react';
import { Coins, ArrowRight } from 'lucide-react';
import { TOKEN_PACKAGES } from '../constants';

export const PricingPage: FC = () => {
  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <Coins className="w-3.5 h-3.5" />
          Tokens
        </div>
        <h1 className="page-title">Koop Tokens</h1>
        <p className="page-sub">Kies het aantal tokens dat je nodig hebt. Eenmalige betaling — geen abonnement.</p>
      </div>

      {/* Token grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}>
        {TOKEN_PACKAGES.map((pkg) => (
          <a
            key={pkg.tokens}
            href={pkg.stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="token-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '28px 16px 20px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--ink-3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Big token number */}
            <div style={{
              fontFamily: 'var(--f-display)',
              fontSize: '3.2rem',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
            }}>
              {pkg.tokens}
            </div>

            {/* Token label */}
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-3)',
            }}>
              {pkg.tokens === 1 ? 'TOKEN' : 'TOKENS'}
            </div>

            {/* Divider */}
            <div style={{
              width: '100%',
              height: 1,
              background: 'var(--line)',
              margin: '4px 0',
            }} />

            {/* Price */}
            <div style={{
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--ink)',
            }}>
              €{pkg.price}
            </div>

            {/* CTA */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--ink-3)',
              marginTop: 4,
            }}>
              Kopen <ArrowRight style={{ width: 11, height: 11 }} />
            </div>
          </a>
        ))}
      </div>

    </div>
  );
};
