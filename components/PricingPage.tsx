
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
import { SEO } from './SEO';

interface PricingPageProps {
  hasOwnKeys: boolean;
  onPurchaseTurns: (count: number) => void;
  onPurchaseCredits?: (count: number) => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
    <path fill="currentColor" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd" />
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
    <>
    <SEO
      title="Prijzen & Credits — FAINL AI Consensus"
      description="Betaal per credit of kies een maandelijks abonnement. Gebruik meerdere AI-modellen tegelijk voor één gewogen antwoord."
      canonical="/tokens"
      keywords="FAINL prijzen, AI credits kopen, AI abonnement Nederland, meerdere AI modellen prijs"
    />
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white leading-none">
          {language === 'nl' ? 'Prijzen & Credits' : 'Pricing & Credits'}
        </h1>
        <p className="max-w-2xl mx-auto text-black dark:text-white/70 font-bold text-xl md:text-3xl leading-tight">
          {language === 'nl'
            ? 'Betaal per credit of kies een maandelijks abonnement voor onbeperkte mogelijkheden.'
            : 'Pay per credit or choose a monthly subscription for unlimited possibilities.'}
        </p>
      </div>

      {/* One-time credits */}
      <div className="mb-32">
        <div className="flex items-center gap-6 mb-12 justify-center sm:justify-start">
          <div className="bg-[#004f57] p-5 border-4 border-black shadow-[8px_8px_0_0_black] transition-all">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Credits Kopen' : 'Buy Credits'}
            </h2>
            <p className="text-xl font-black uppercase tracking-[0.2em] text-[#004f57]">
              {language === 'nl' ? 'Eenmalige credits, verlopen nooit.' : 'One-time credits, never expire.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRICING.CREDITS.map((pkg, idx) => (
            <div key={idx} className="card-fainl bg-white dark:bg-black border-4 border-black dark:border-[#004f57] rounded-none p-8 shadow-[12px_12px_0_0_#004f57] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="bg-black text-[#004f57] text-lg font-black px-4 py-2 uppercase tracking-widest inline-block mb-6">{pkg.count} {pkg.count === 1 ? 'CREDIT' : 'CREDITS'}</div>
              <div className="text-6xl font-black text-black dark:text-white mb-2">€{pkg.price}</div>
              <p className="text-xl font-bold text-black dark:text-white/40 mb-8 lowercase tracking-widest">Multi-AI analyse.</p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-lg font-bold text-black dark:text-white"><CheckIcon /> <span>Standaard</span></li>
                <li className="flex items-center gap-3 text-lg font-bold text-black dark:text-white"><CheckIcon /> <span>{pkg.count} {pkg.count === 1 ? 'credit = één vraag' : `credits = ${pkg.count} vragen`}</span></li>
                <li className="flex items-center gap-3 text-lg font-bold text-black dark:text-white"><CheckIcon /> <span>Complete analyse</span></li>
                <li className="flex items-center gap-3 text-lg font-bold text-black dark:text-white"><CheckIcon /> <span>Multi AI inzet</span></li>
                <li className="flex items-center gap-3 text-lg font-bold text-black dark:text-white"><CheckIcon /> <span>Opslaan &amp; delen</span></li>
              </ul>

              <button onClick={() => handlePurchase(pkg.count)} className="w-full bg-black text-[#004f57] hover:bg-[#004f57] hover:text-black p-5 font-black text-xl uppercase tracking-widest transition-all border-4 border-black shadow-[6px_6px_0_0_black]">
                {language === 'nl' ? `Koop ${pkg.count}` : `Buy ${pkg.count}`}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-base font-black uppercase tracking-widest text-black dark:text-white/30">
          {language === 'nl'
            ? 'Alle pakketten worden direct verwerkt via Stripe.'
            : 'All packages processed instantly via Stripe.'}
        </p>
      </div>


      {/* Subscriptions */}
      <div>
        <div className="flex items-center gap-6 mb-12 justify-center sm:justify-start">
          <div className="bg-black p-5 border-4 border-[#004f57] shadow-[8px_8px_0_0_#004f57] transition-all text-[#004f57]">
            <Zap className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">
              {language === 'nl' ? 'Maandelijks Abonnement' : 'Monthly Subscription'}
            </h2>
            <p className="text-xl font-black uppercase tracking-[0.2em] text-[#004f57]">
              {language === 'nl' ? 'Automatisch hernieuwd elke maand.' : 'Automatically renewed each month.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center sm:justify-start">
          {PRICING.SUBSCRIPTIONS.map((pkg, idx) => (
            <div key={idx} className="card-fainl bg-black text-white border-4 border-[#004f57] rounded-none p-10 shadow-[15px_15px_0_0_#004f57] hover:scale-105 transition-all">
              <div className="bg-[#004f57] text-black text-lg font-black px-6 py-2 uppercase tracking-widest inline-block mb-8">{pkg.label}</div>
              <div className="text-7xl font-black text-white mb-3">€{pkg.price}<span className="text-xl font-bold lowercase opacity-40 ml-2">/{pkg.period}</span></div>
              <p className="text-xl font-bold text-[#004f57] mb-10 tracking-widest uppercase">{language === 'nl' ? 'Onbeperkt archief.' : 'Unlimited archive.'}</p>

              <ul className="space-y-5 mb-12">
                <li className="flex items-center gap-4 text-xl font-bold"><CheckIcon /> <span>{pkg.count} {language === 'nl' ? 'Vragen p/m' : 'Queries p/m'}</span></li>
                <li className="flex items-center gap-4 text-xl font-bold"><CheckIcon /> <span>{language === 'nl' ? 'Hogere prioriteit' : 'Higher priority'}</span></li>
                <li className="flex items-center gap-4 text-xl font-bold"><CheckIcon /> <span>{language === 'nl' ? 'Directe beraadslaging' : 'Instant deliberation'}</span></li>
                <li className="flex items-center gap-4 text-xl font-bold"><CheckIcon /> <span>Multi AI inzet</span></li>
                <li className="flex items-center gap-4 text-xl font-bold"><CheckIcon /> <span>{language === 'nl' ? 'Exclusieve modellen' : 'Exclusive models'}</span></li>
              </ul>

              <button onClick={() => handlePurchase(pkg.count)} className="w-full bg-[#004f57] text-black hover:bg-white p-7 font-black text-2xl uppercase tracking-[0.2em] transition-all border-4 border-black shadow-[10px_10px_0_0_black]">
                {language === 'nl' ? `Start ${pkg.label}` : `Start ${pkg.label}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-base font-black uppercase tracking-widest text-black dark:text-white/30">
        {language === 'nl'
          ? 'Binnenkort meer niveaus · Veilig afrekenen via Stripe'
          : 'More tiers coming soon · Secure checkout via Stripe'}
      </p>
    </div>
    </>
  );
};
