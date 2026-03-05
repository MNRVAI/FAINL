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
import { ScrambleText } from './ScrambleText';

const FAQS = [
  {
    q: "What makes FAINL different from standard chat models?",
    a: "FAINL is an autonomous orchestration layer that triggers a multi-agent consensus protocol. It forces multiple high-performance models to debate and critique each other, eliminating single-point bias and logical hallucinations.",
    icon: Cpu
  },
  {
    q: "Is my mission data secure and private?",
    a: "FAINL follows a Zero-Knowledge architecture. Your API keys and session history are stored exclusively in your browser's local storage. We do not have access to your data, ensuring total sovereignty.",
    icon: Lock
  },
  {
    q: "Why is there a paywall after one turn?",
    a: "Executing multiple advanced models (Google, OpenAI, Anthropic) simultaneously requires significant compute resources. The paywall ensures we can provide the full multi-node intelligence experience without compromise.",
    icon: Coins
  },
  {
    q: "Can I use FAINL offline?",
    a: "The logic orchestration happens in your browser, but the neural nodes require an internet connection to reach their respective API providers. Local model integration is a high-priority feature for Phase 2.",
    icon: Globe
  },
  {
    q: "How does the Consensus Protocol work?",
    a: "When a query is submitted, multiple AI agents generate independent solutions. These solutions are then peer-reviewed and debated until a high-integrity, authoritative verdict is reached by the Council.",
    icon: MessageSquare
  },
  {
    q: "Can I customize the Council members?",
    a: "Yes. Advanced users can select specific neural nodes and define the roles of each council member in the Settings panel, tailoring the debate logic to their specific mission requirements.",
    icon: Zap
  },
  {
    q: "What are 'Turns' and 'Credits'?",
    a: "Turns represent full consensus sessions where the council debates a query. Credits are used for specific high-intensity operations like deep-dive peer reviews or extended debates.",
    icon: HelpCircle
  },
  {
    q: "How is the ranking in the Cookbook determined?",
    a: "The Cookbook rankings are entirely community-driven. Users upvote directives that provide high value, which influences their visibility and priority within the collective database.",
    icon: ShieldCheck
  }
];

export const FAQPage: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-16 md:mb-24">
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
                    <ScrambleText text="Internal Protocol" />
                </h1>
                <p className="max-w-2xl mx-auto text-black/50 dark:text-white/50 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
                    Access the foundational logic and operational guidelines of the FAINL Orchestration Layer. Understand the mechanics of decentralized consensus and neural governance.
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
                                <div className="pt-6 border-t-2 border-black/5 dark:border-white/5 text-xs md:text-sm font-bold text-black/60 dark:text-white/60 leading-relaxed uppercase tracking-widest">
                                    {faq.a}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <p className="text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-[0.5em]">System Revision 4.2.0 • Consensus Priority 0</p>
            </div>
        </div>
    );
};
