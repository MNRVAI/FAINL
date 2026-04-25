import { useState, FC } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Zap,
  Coins,
  Cpu,
  Lock,
  Globe,
  MessageSquare,
  Mail,
} from 'lucide-react';

const FAQS = [
  {
    q: "Wat maakt FAINL anders dan ChatGPT of Claude rechtstreeks gebruiken?",
    a: "FAINL is een consensus-orkestratielaag — je vraag wordt gelijktijdig door meerdere AI-modellen verwerkt (Gemini, GPT-4, Claude, Grok en meer) en er wordt één gezaghebbend antwoord gesynthetiseerd. Dit elimineert de bias van een enkel model en brengt meningsverschillen aan het licht, zodat je een evenwichtiger en betrouwbaarder perspectief krijgt.",
    icon: Cpu,
  },
  {
    q: "Is mijn data privé en veilig?",
    a: "Ja. FAINL werkt met een zero-knowledge architectuur. Je API-sleutels en sessiegeschiedenis worden uitsluitend opgeslagen in de lokale opslag van je browser. Wij hebben geen toegang tot je gegevens — niets verlaat je apparaat.",
    icon: Lock,
  },
  {
    q: "Waarom heb ik een API-sleutel nodig?",
    a: "FAINL orkestreert echte AI-modellen van Google, OpenAI, Anthropic en anderen. Deze providers vereisen API-sleutels voor toegang. Door je eigen sleutels te gebruiken, heb je volledige controle over je kosten en gegevens. Google Gemini biedt een ruimhartige gratis laag om mee te beginnen.",
    icon: Coins,
  },
  {
    q: "Kan ik FAINL offline gebruiken?",
    a: "De interface draait volledig in je browser, maar de AI-modellen vereisen een internetverbinding om de respectieve API-providers te bereiken. Ondersteuning voor lokale modellen is gepland voor een toekomstige release.",
    icon: Globe,
  },
  {
    q: "Hoe werkt het consensusproces?",
    a: "Wanneer je een vraag stelt, analyseren meerdere AI-agents deze zelfstandig en geven ze antwoord. Vervolgens kun je de Debatkamer openen waar de modellen elkaars redenering in realtime uitdagen. Ten slotte combineert een synthesizer alle perspectieven tot één coherent, evenwichtig verdict.",
    icon: MessageSquare,
  },
  {
    q: "Kan ik kiezen welke AI-modellen in de raad zitten?",
    a: "Ja. In het instellingenpaneel kun je kiezen welke AI-providers je wilt opnemen, hun rollen instellen en zelfs aangepaste systeemprompts definiëren voor elk raadslid — zodat je volledige controle hebt over de deliberatielogica.",
    icon: Zap,
  },
  {
    q: "Wat zijn Beurten en Credits?",
    a: "Een Beurt is één volledige consensussessie — van initiële analyse via debat tot het eindvonnis. Credits worden gebruikt wanneer je je eigen API-sleutels meeneemt en de FAINL-orkestratielaag bovenop je eigen provideraccounts wilt gebruiken.",
    icon: HelpCircle,
  },
  {
    q: "Hoe wordt de Inspiratie-ranking bepaald?",
    a: "Inspiratie-rankings zijn door de community gestuurd. Gebruikers stemmen op vragen die bijzonder inzichtelijke of waardevolle raadsverdicts opleveren, waardoor de meest nuttige prompts voor andere gebruikers naar boven komen.",
    icon: ShieldCheck,
  },
];

export const FAQPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="page-container animate-fade-in-up">

      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <HelpCircle className="w-3.5 h-3.5" />
          Veelgestelde vragen
        </div>
        <h1 className="page-title">FAQ</h1>
        <p className="page-sub">
          Alles wat je moet weten over hoe FAINL werkt, wat het kost en hoe jouw gegevens worden beheerd.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Vragen', value: FAQS.length, icon: HelpCircle },
          { label: 'Privacy-first', value: '100%', icon: Lock },
          { label: 'AI-modellen', value: '10+', icon: Cpu },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon"><Icon className="w-4 h-4" /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="faq-list">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`key-card faq-item ${isOpen ? 'faq-item--open' : ''}`}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="landing-section-header faq-trigger"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-label={faq.q}
              >
                <div className="landing-section-icon">
                  <faq.icon className="w-4 h-4" />
                </div>
                <div className="faq-question-text">
                  <div className="faq-q">{faq.q}</div>
                </div>
                <ChevronDown className={`faq-chevron ${isOpen ? 'faq-chevron--open' : ''}`} />
              </button>

              {isOpen && (
                <div className="landing-section-body faq-answer">
                  <p className="faq-answer-text">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="page-cta faq-cta">
        <Mail className="w-7 h-7 mx-auto mb-3 faq-mail-icon" />
        <h2 className="page-cta-title">Nog vragen?</h2>
        <p className="page-cta-text">Neem contact op via de contactpagina. We reageren doorgaans binnen 12 uur.</p>
      </div>
    </div>
  );
};
