
import { FC } from 'react';
import {
  Shield,
  Zap,
  ArrowRight,
  RefreshCw,
  Crown,
} from 'lucide-react';
import { PRICING } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits?: (count: number) => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
    <path fill="#FDC700" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd" />
  </svg>
);

export const PricingPage: FC<PricingPageProps> = ({
  onPurchaseCredits,
}) => {
  const { language } = useLanguage();

  const handlePurchase = (count: number) => {
    if (onPurchaseCredits) {
      onPurchaseCredits(count);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-3 text-black dark:text-white">
          {language === 'nl' ? 'Credits & Toegang' : 'Credits & Access'}
        </h1>
        <p className="max-w-xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
          {language === 'nl'
            ? 'Betaal per credit of kies een maandelijks abonnement.'
            : 'Pay per credit or choose a monthly subscription.'}
        </p>
      </div>

      {/* One-time credits */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-10 justify-center sm:justify-start">
          <div className="bg-black dark:bg-zinc-800 p-3 border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Credits Kopen' : 'Buy Credits'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              {language === 'nl' ? 'Eenmalige credits, verlopen nooit.' : 'One-time credits, never expire.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRICING.CREDITS.map((pkg, idx) => (
            <div key={idx} className="card-fainl">
              <div className="card__badge">{pkg.count} {pkg.count === 1 ? 'CREDIT' : 'CREDITS'}</div>
              <span className="card__title">€{pkg.price}</span>
              <p className="card__subtitle">Multi-AI analyse.</p>

              <ul className="card__lists">
                <li className="card__list"><CheckIcon /> <span>Standaard</span></li>
                <li className="card__list"><CheckIcon /> <span>{pkg.count} {pkg.count === 1 ? 'credit = 1 vraag' : `credits = ${pkg.count} vragen`}</span></li>
                <li className="card__list"><CheckIcon /> <span>Complete analyse</span></li>
                <li className="card__list"><CheckIcon /> <span>Multi AI inzet</span></li>
                <li className="card__list"><CheckIcon /> <span>Opslaan &amp; delen</span></li>
              </ul>

              <button onClick={() => handlePurchase(pkg.count)} className="card__cta">
                {language === 'nl' ? `Koop ${pkg.count} ${pkg.count === 1 ? 'credit' : 'credits'}` : `Buy ${pkg.count} ${pkg.count === 1 ? 'credit' : 'credits'}`}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
          {language === 'nl'
            ? 'Alle pakketten worden direct verwerkt via Stripe.'
            : 'All packages processed instantly via Stripe.'}
        </p>
      </div>

      {/* Subscriptions */}
      <div>
        <div className="flex items-center gap-4 mb-10 justify-center sm:justify-start">
          <div className="bg-[#FDC700] p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Maandelijks Abonnement' : 'Monthly Subscription'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              {language === 'nl' ? 'Automatisch hernieuwd elke maand.' : 'Automatically renewed each month.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center sm:justify-start">
          {PRICING.SUBSCRIPTIONS.map((pkg, idx) => (
            <div key={idx} className="card-fainl !border-[#FDC700] hover:!shadow-[12px_12px_0_0_#FDC700]">
              <div className="card__badge !bg-[#FDC700] !text-black">{pkg.label}</div>
              <span className="card__title">€{pkg.price}<span className="text-sm lowercase ml-1">{pkg.period}</span></span>
              <p className="card__subtitle">{language === 'nl' ? 'Onbeperkt archief.' : 'Unlimited archive.'}</p>

              <ul className="card__lists">
                <li className="card__list"><CheckIcon /> <span>{pkg.count} {language === 'nl' ? 'Vragen p/m' : 'Queries p/m'}</span></li>
                <li className="card__list"><CheckIcon /> <span>{language === 'nl' ? 'Hogere prioriteit' : 'Higher priority'}</span></li>
                <li className="card__list"><CheckIcon /> <span>{language === 'nl' ? 'Directe beraadslaging' : 'Instant deliberation'}</span></li>
                <li className="card__list"><CheckIcon /> <span>Multi AI inzet</span></li>
                <li className="card__list"><CheckIcon /> <span>{language === 'nl' ? 'Exclusieve modellen' : 'Exclusive models'}</span></li>
              </ul>

              <button onClick={() => handlePurchase(pkg.count)} className="card__cta">
                {language === 'nl' ? `Start ${pkg.label}` : `Start ${pkg.label}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-[10px] font-black uppercase tracking-widest text-black/30 dark:text-white/30">
        {language === 'nl'
          ? 'Binnenkort meer niveaus · Veilig afrekenen via Stripe'
          : 'More tiers coming soon · Secure checkout via Stripe'}
      </p>
    </div>
  );
};
