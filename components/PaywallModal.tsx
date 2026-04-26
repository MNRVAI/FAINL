import { FC } from 'react';
import { Coins, X, ArrowRight } from 'lucide-react';
import { TOKEN_PACKAGES } from '../constants';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/70 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-sm shadow-zinc-900/20">
              <Coins className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Tokens Nodig</h2>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Koop tokens om verder te gaan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Sluiten"
            aria-label="Paywall sluiten"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/15 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}>
            {TOKEN_PACKAGES.map((pkg) => (
              <a
                key={pkg.tokens}
                href={pkg.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '20px 12px 16px',
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
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'var(--ink)',
                  letterSpacing: '-0.03em',
                }}>
                  {pkg.tokens}
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-3)',
                }}>
                  {pkg.tokens === 1 ? 'TOKEN' : 'TOKENS'}
                </div>
                <div style={{ width: '100%', height: 1, background: 'var(--line)', margin: '2px 0' }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
                  €{pkg.price}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 10, fontWeight: 600, color: 'var(--ink-3)',
                }}>
                  Kopen <ArrowRight style={{ width: 10, height: 10 }} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Veilig afrekenen via Stripe</p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
