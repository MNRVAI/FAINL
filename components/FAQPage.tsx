import { useState, FC } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Coins,
  Cpu,
  Lock,
  Globe,
  MessageSquare
} from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

export const FAQPage: FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: language === 'nl' ? "Wat doet FAINL precies?" : "What exactly does FAINL do?",
      a: language === 'nl' ? "FAINL is een orchestratielaag. In plaats van je vraag aan één AI te stellen, stuurt FAINL jouw vraag naar meerdere toonaangevende AI's tegelijk (zoals OpenAI, Google en Anthropic). Ze analyseren, debatteren en controleren elkaars werk. Jij krijgt vervolgens één gecheckt antwoord." : "FAINL is an orchestration layer. Instead of asking one AI, FAINL sends your query to multiple leading AIs simultaneously (like OpenAI, Google, and Anthropic). They analyze, debate, and verify each other's work. You receive one verified answer.",
      icon: Cpu
    },
    {
      q: language === 'nl' ? "Waarom is één AI niet genoeg?" : "Why is one AI not enough?",
      a: language === 'nl' ? "Omdat één AI fouten maakt (hallucinaties), blinde vlekken heeft en context kan missen. Door meerdere AI's elkaars werk te laten controleren, filter je zwaktes eruit." : "Because one AI makes mistakes (hallucinations), has blind spots, and can miss context. By having multiple AIs cross-check each other's work, weaknesses are filtered out.",
      icon: ShieldCheck
    },
    {
      q: language === 'nl' ? "Hoeveel kost het?" : "How much does it cost?",
      a: language === 'nl' ? "De eerste 2 opdrachten zijn helemaal gratis — zonder account. Daarna kun je credits kopen vanaf €2,99. Geen abonnement verplicht, je betaalt alleen voor wat je gebruikt." : "The first 2 missions are completely free — no account required. After that, you can purchase credits from €2.99. No subscription required, pay only for what you use.",
      icon: Coins
    },
    {
      q: language === 'nl' ? "Welke AI-modellen gebruiken jullie?" : "Which AI models do you use?",
      a: language === 'nl' ? "Op dit moment orkestreren we de beste modellen van OpenAI, Anthropic, Google en DeepSeek. De samenstelling past zich aan voor het beste resultaat." : "Currently we orchestrate the best models from OpenAI, Anthropic, Google, and DeepSeek. The composition adapts for the best result.",
      icon: Zap
    },
    {
      q: language === 'nl' ? "Heb ik technische kennis nodig?" : "Do I need technical skills?",
      a: language === 'nl' ? "Nee. Je gebruikt FAINL precies zoals je ChatGPT gebruikt: je typt je vraag. Wij doen het ingewikkelde werk op de achtergrond." : "No. You use FAINL exactly like ChatGPT: you type your query. We handle the complex orchestration in the background.",
      icon: MessageSquare
    },
    {
      q: language === 'nl' ? "Is mijn data veilig?" : "Is my data secure?",
      a: language === 'nl' ? "Ja. FAINL verwerkt je missies versleuteld. We trainen geen eigen modellen op jouw data en slaan niets centraal op." : "Yes. FAINL processes your missions encrypted. We do not train proprietary models on your data and store nothing centrally.",
      icon: Lock
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16 md:mb-24">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
          {language === 'nl' ? 'Veelgestelde Vragen' : 'Internal Protocol'}
        </h1>
        <p className="max-w-2xl mx-auto text-black/60 dark:text-white/60 font-bold text-base md:text-lg leading-relaxed">
          {language === 'nl'
            ? 'Lees hier hoe FAINL precies werkt, wat het kost en hoe we jouw data beschermen.'
            : 'Access the foundational logic and operational guidelines of the FAINL Orchestration Layer. Understand the mechanics of decentralized consensus and neural governance.'}
        </p>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_1px_rgba(255,255,255,0.05)] ${openIndex === idx ? 'ring-2 ring-yellow-400' : ''}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-6 md:p-10 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 md:gap-8">
                <div className={`p-3 rounded-xl transition-colors ${openIndex === idx ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-black/5 dark:bg-white/5 text-black dark:text-white'}`}>
                  <faq.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight text-black dark:text-white">{faq.q}</h3>
              </div>
              <div className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-white opacity-20 group-hover:opacity-100" />
              </div>
            </button>
            {openIndex === idx && (
              <div className="px-6 md:px-10 pb-6 md:pb-10 animate-in slide-in-from-top-4 duration-300">
                <div className="pt-6 border-t-2 border-black/5 dark:border-white/5 text-base md:text-lg font-medium text-black/70 dark:text-white/70 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-sm font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">
          {language === 'nl' ? 'Systeemrevisie 4.2.0 • Consensus Prioriteit 0' : 'System Revision 4.2.0 • Consensus Priority 0'}
        </p>
      </div>
    </div>
  );
};
