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
} from 'lucide-react';

const FAQS = [
  {
    q: "What makes FAINL different from using ChatGPT or Claude directly?",
    a: "FAINL is a consensus orchestration layer — it runs your question through multiple AI models simultaneously (Gemini, GPT-4, Claude, Grok, and more) and synthesizes one authoritative answer. This eliminates single-model bias and surfaces disagreements, giving you a more balanced and reliable perspective.",
    icon: Cpu,
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. FAINL uses a zero-knowledge architecture. Your API keys and session history are stored exclusively in your browser's local storage. We have no access to your data whatsoever — nothing leaves your device.",
    icon: Lock,
  },
  {
    q: "Why do I need an API key?",
    a: "FAINL orchestrates real AI models from Google, OpenAI, Anthropic, and others. These providers require API keys for access. By using your own keys, you have full control over your costs and data. Google Gemini offers a generous free tier to get started.",
    icon: Coins,
  },
  {
    q: "Can I use FAINL offline?",
    a: "The interface runs entirely in your browser, but the AI models require an internet connection to reach their respective API providers. Local model support is planned for a future release.",
    icon: Globe,
  },
  {
    q: "How does the consensus process work?",
    a: "When you submit a question, multiple AI agents independently analyze and respond. You can then open the Debate Room where the models challenge each other's reasoning in real time. Finally, a synthesizer combines all perspectives into one coherent, balanced verdict.",
    icon: MessageSquare,
  },
  {
    q: "Can I customize which AI models are in the council?",
    a: "Yes. In the Settings panel you can choose which AI providers to include, set their roles, and even define custom system prompts for each council member — giving you full control over the deliberation logic.",
    icon: Zap,
  },
  {
    q: "What are Turns and Credits?",
    a: "A Turn is one complete consensus session — from initial analysis through debate to final verdict. Credits are used when you bring your own API keys and want to use the FAINL orchestration layer on top of your own provider accounts.",
    icon: HelpCircle,
  },
  {
    q: "How is the Cookbook ranking determined?",
    a: "Cookbook rankings are community-driven. Users upvote questions that produce especially insightful or high-value council verdicts, surfacing the most useful prompts for other users.",
    icon: ShieldCheck,
  },
];

export const FAQPage: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-fade-in-up">

      {/* Header */}
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          FAQ
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="max-w-md mx-auto text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
          Everything you need to know about how FAINL works, what it costs, and how your data is handled.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-2.5">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 ${
              openIndex === idx ? 'card-shadow-hover' : 'card-shadow'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 group"
              aria-expanded={openIndex === idx}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  openIndex === idx
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-1000/10 group-hover:text-zinc-800 dark:group-hover:text-zinc-500'
                }`}>
                  <faq.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
                  {faq.q}
                </h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-zinc-700' : ''}`}
              />
            </button>

            {openIndex === idx && (
              <div className="px-5 pb-5 pt-1 animate-in slide-in-from-top-2 duration-200">
                <div className="pl-11">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-center text-[11px] text-zinc-400 dark:text-zinc-600 font-medium">
        Still have questions?{' '}
        <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Reach out via the Contact page.</span>
      </p>
    </div>
  );
};
