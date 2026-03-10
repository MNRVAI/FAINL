import { FC, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, Users, Gavel, Globe,
  CheckCircle2, Eye, Swords, PenLine, Brain,
  Lock, Star, ChevronDown, Mic, BarChart3,
  BookOpen, Lightbulb, Building2, GraduationCap,
} from "lucide-react";
import { SEO } from "./SEO";
import { PRICING } from "../constants";

// ── FAQ Data ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Hoe werkt FAINL?",
    a: "FAINL stuurt jouw vraag tegelijk naar meerdere AI-modellen (Gemini, GPT-4, Claude, Llama en meer). Elk model analyseert de vraag onafhankelijk en geeft zijn eigen perspectief. Vervolgens debatteren ze live met elkaar — en jij kunt zelfs meedoen. De Protocol Chairman synthetiseert alle inzichten tot één gewogen, gezaghebbend eindoordeel.",
  },
  {
    q: "Welke AI-modellen gebruikt FAINL?",
    a: "Standaard zijn er altijd 3 Google Gemini-nodes actief (gratis, geen sleutel nodig). Met de uitgebreide modus voeg je GPT-4, Anthropic Claude, Meta Llama via Groq, Mistral, DeepSeek en meer toe. Je kunt ook je eigen API-sleutels invoegen voor maximale controle.",
  },
  {
    q: "Is FAINL gratis te gebruiken?",
    a: "Ja! Nieuwe bezoekers krijgen 2 volledige FAINL-sessies gratis — zonder account, zonder creditcard. Daarna kies je een creditpakket (vanaf €2,99 per credit) of een maandelijks abonnement.",
  },
  {
    q: "Waarom is FAINL beter dan één AI gebruiken?",
    a: "Eén AI-model heeft altijd blinde vlekken, trainingsbias en beperkte perspectieven. FAINL laat meerdere modellen tegelijk jouw vraag aanpakken, elkaars fouten corrigeren en argumenten uitwisselen. Het resultaat is dieper, gebalanceerder en aantoonbaar betrouwbaarder dan welk single-model antwoord ook.",
  },
  {
    q: "Worden mijn vragen en gegevens opgeslagen?",
    a: "Nee. Alle data wordt uitsluitend lokaal in jouw browser opgeslagen via localStorage. Er wordt niets naar onze servers gestuurd — tenzij je een account aanmaakt voor cloud-sessiehistorie. FAINL is privacy-first gebouwd.",
  },
  {
    q: "Kan ik zelf deelnemen aan het AI-debat?",
    a: "Absoluut. In de Live Debate Room kun je real-time meeschrijven of -spreken via je microfoon. De AI-nodes reageren direct op jouw input, adresseren jouw argumenten en passen hun redenering aan. Jij bent een volwaardige deelnemer.",
  },
  {
    q: "Voor wie is FAINL bedoeld?",
    a: "FAINL is ontworpen voor iedereen die complexe vragen stelt: ondernemers die strategische beslissingen nemen, studenten die onderzoek doen, journalisten die feiten checken, professionals die juridische of medische kwesties verkennen, en nieuwsgierige mensen die de diepste antwoorden willen.",
  },
];

// ── JSON-LD ─────────────────────────────────────────────────────────────────
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "FAINL",
      url: "https://fainl.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      description:
        "AI Consensus Engine die meerdere AI-modellen (Gemini, GPT-4, Claude, Llama) tegelijk inzet voor diepgaande analyse, live debat en gewogen eindoordelen.",
      featureList: [
        "Multi-model AI consensus",
        "Live AI debatroom",
        "Spraakherkenning",
        "Chairman's Verdict synthese",
        "Privacy-first lokale opslag",
        "Geen account vereist",
      ],
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        highPrice: "119.99",
        priceCurrency: "EUR",
        offerCount: "5",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "247",
      },
    },
    {
      "@type": "Organization",
      name: "FAINL",
      url: "https://fainl.com",
      logo: "https://fainl.com/favicon.png",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

// ── FAQItem ─────────────────────────────────────────────────────────────────
const FAQItem: FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10 dark:border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-black text-sm md:text-base uppercase tracking-tight text-black dark:text-white group-hover:text-[#d1b411] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-black/40 dark:text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-base md:text-lg text-black leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
};

// ── AI Ticker Models ─────────────────────────────────────────────────────────
const AI_MODELS = [
  {
    name: "Google Gemini",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 8.6 7.6 12 2 12C7.6 12 12 16.4 12 22C12 16.4 16.4 12 22 12C16.4 12 12 8.6 12 2Z" fill="#4285F4"/>
      </svg>
    ),
  },
  {
    name: "OpenAI GPT-4",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 2L13.8 8.2L20.2 8.2L15.2 12L17 18.2L12 14.4L7 18.2L8.8 12L3.8 8.2L10.2 8.2L12 2Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Anthropic Claude",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 3L21 20H3L12 3Z" fill="#CC785C"/>
      </svg>
    ),
  },
  {
    name: "Meta Llama",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M6 8.5C3.5 8.5 2 10.2 2 12C2 14 3.5 15.5 6 15.5C8 15.5 9.5 14 12 12C14.5 10 16 8.5 18 8.5C20.5 8.5 22 10 22 12C22 14 20.5 15.5 18 15.5C16 15.5 14.5 14 12 12C9.5 10 8 8.5 6 8.5Z" stroke="#0081FB" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    name: "Mistral AI",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 21 21">
        <rect x="0"  y="0"  width="6" height="6" fill="#FF6B35"/>
        <rect x="7.5" y="0"  width="6" height="6" fill="#FF6B35" opacity="0.5"/>
        <rect x="15" y="0"  width="6" height="6" fill="#FF6B35"/>
        <rect x="0"  y="7.5" width="6" height="6" fill="#FF6B35" opacity="0.5"/>
        <rect x="7.5" y="7.5" width="6" height="6" fill="#FF6B35"/>
        <rect x="15" y="7.5" width="6" height="6" fill="#FF6B35" opacity="0.5"/>
        <rect x="0"  y="15" width="6" height="6" fill="#FF6B35"/>
        <rect x="15" y="15" width="6" height="6" fill="#FF6B35"/>
      </svg>
    ),
  },
  {
    name: "DeepSeek",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="10" r="5.5" stroke="#4D6BFE" strokeWidth="2.5"/>
        <path d="M14.5 14.5L21 21" stroke="#4D6BFE" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Groq",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#111"/>
        <path d="M16 10H11C10 10 9 10.9 9 12C9 13.1 10 14 11 14H14V12.5H12" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Ollama",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#374151"/>
        <circle cx="9"  cy="10.5" r="1.5" fill="white"/>
        <circle cx="15" cy="10.5" r="1.5" fill="white"/>
        <path d="M9.5 15C10.5 16 13.5 16 14.5 15" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ── Main Component ───────────────────────────────────────────────────────────
export const LandingPage: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="FAINL — AI Consensus Engine | Meerdere AI's. Één Antwoord."
        description="FAINL laat Gemini, GPT-4, Claude en Llama tegelijk jouw vraag analyseren, live debatteren en samen één scherp, gewogen eindoordeel geven. 2 sessies gratis, geen account nodig."
        canonical="/"
        keywords="AI consensus engine, meerdere AI modellen vergelijken, AI debat tool, ChatGPT alternatief Nederland, Gemini GPT-4 Claude samen, AI beslissingstool, kunstmatige intelligentie tool gratis, multi-model AI"
        ogTitle="FAINL — Laat meerdere AI's voor jou debatteren"
        ogDescription="Gemini, GPT-4, Claude én Llama analyseren tegelijk jouw vraag en debatteren live. FAINL synthetiseert het scherpste AI-oordeel. Gratis proberen."
        jsonLd={JSON_LD}
      />

      {/* ══ HERO ══ */}
      <section
        aria-label="Introductie"
        className="w-full max-w-4xl mx-auto px-5 sm:px-8 md:px-10 pt-10 sm:pt-16 md:pt-28 pb-10 md:pb-20 text-center"
      >
        <h1 className="text-[2.4rem] leading-[1.06] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-black uppercase tracking-tighter text-black max-w-3xl mx-auto mb-5 sm:mb-6 md:mb-8">
          Jouw vraag verdient meer dan één{" "}
          <span className="text-[#d1b411]">AI-model.</span>
        </h1>

        <p className="max-w-lg sm:max-w-xl mx-auto text-base sm:text-lg md:text-xl font-semibold text-black leading-relaxed mb-8 sm:mb-10 md:mb-14">
          Eén model geeft een antwoord. Meerdere modellen doorgronden de kern.
          Met FAINL krijg je het best haalbare antwoord — aangedreven door AI-modellen
          die concurreren, toetsen en samensmelten tot één superieur eindresultaat.
        </p>

        <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/mission")}
            className="w-full xs:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-black text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] active:scale-95 transition-all shadow-lg"
          >
            Start gratis
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <Link
            to="/cookbook"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-4 sm:py-5 border-2 border-black/20 text-black/60 font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:border-[#d1b411] hover:text-[#d1b411] transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Voorbeeldvragen
          </Link>
        </div>
      </section>

      {/* ══ AI TICKER ══ */}
      <section
        aria-label="Ondersteunde AI-modellen"
        className="relative w-full border-y border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900/50 py-5 overflow-hidden"
      >
        <style>{`
          @keyframes ai-ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .ai-ticker-track {
            animation: ai-ticker 40s linear infinite;
            will-change: transform;
          }
          .ai-ticker-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent z-10" />
        <div className="flex overflow-hidden">
          <div className="ai-ticker-track flex items-center min-w-max">
            {[...AI_MODELS, ...AI_MODELS].map((model, i) => (
              <div key={i} className="flex items-center gap-2.5 px-7">
                {model.icon}
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-black/50 dark:text-white/40 whitespace-nowrap">
                  {model.name}
                </span>
                <span className="ml-4 text-black/15 dark:text-white/15 select-none text-sm">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOE HET WERKT ══ */}
      <section
        aria-label="Hoe FAINL werkt"
        className="w-full max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-28"
      >
        <h2 className="text-center text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4">
          Hoe werkt het?
        </h2>
        <p className="text-center text-base md:text-lg text-black font-semibold mb-12 md:mb-16 max-w-xl mx-auto">
          Van jouw vraag tot het meest onderbouwde antwoord — in vijf
          geautomatiseerde stappen.
        </p>

        <ol className="space-y-4">
          {[
            {
              icon: PenLine,
              title: "Stel je vraag",
              desc: "Elke vraag werkt — zakelijk, filosofisch, juridisch, persoonlijk. FAINL verwerkt alles tot 4.000 tekens.",
            },
            {
              icon: Users,
              title: "AI's analyseren parallel",
              desc: "Meerdere modellen analyseren jouw vraag tegelijk en onafhankelijk. Geen beïnvloeding, geen tunnelvisie.",
            },
            {
              icon: Eye,
              title: "Lees elk model apart",
              desc: "Volledig transparant: zie exact wat elk AI-model heeft geconcludeerd, zonder filters of aggregatie.",
            },
            {
              icon: Swords,
              title: "Live debat — doe mee",
              desc: "De modellen debatteren live met elkaar. Jij kunt meeschrijven of -spreken en jouw perspectief direct inbrengen.",
            },
            {
              icon: Gavel,
              title: "Chairman's Verdict",
              desc: "De Protocol Chairman analyseert alle argumenten en synthetiseert het meest complete, gewogen eindoordeel.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="group flex items-start gap-5 p-6 md:p-8 bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/5 rounded-2xl hover:border-[#d1b411] dark:hover:border-[#d1b411] hover:shadow-[6px_6px_0px_0px_#d1b411] transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black dark:bg-white rounded-xl group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black dark:text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-base md:text-lg font-medium text-black leading-relaxed">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ WAAROM FAINL ══ */}
      <section
        aria-label="Kernfuncties van FAINL"
        className="w-full bg-white dark:bg-zinc-950 py-16 md:py-28 border-t border-black/5 dark:border-white/5"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
            Waarom FAINL?
          </h2>
          <p className="text-center text-base md:text-lg text-black font-semibold mb-12 md:mb-16 max-w-xl mx-auto">
            Gebouwd voor wie niet genoeg heeft aan een gewoon AI-antwoord.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Brain,
                title: "Multi-model consensus",
                desc: "Geen enkele AI heeft het bij het rechte eind. FAINL combineert de sterktes van Gemini, Claude, GPT-4 én Llama in één protocol.",
              },
              {
                icon: Swords,
                title: "Live debatroom",
                desc: "AI-nodes debatteren live — en jij kunt meeschrijven of -spreken. Real-time adversarial testing van elk argument.",
              },
              {
                icon: Mic,
                title: "Spraakherkenning",
                desc: "Spreek je argument in — FAINL zet het om naar tekst en gooit het live in het debat. Hands-free reasoning.",
              },
              {
                icon: Eye,
                title: "Volledige transparantie",
                desc: "Zie exact wat elk afzonderlijk model denkt, zonder aggregatie of filtering. Jij kiest wat je vertrouwt.",
              },
              {
                icon: Lock,
                title: "Privacy-first",
                desc: "Alles blijft in jouw browser. Geen server-opslag, geen datamining, geen profiling. Jouw gedachten zijn van jou.",
              },
              {
                icon: BarChart3,
                title: "Gewogen eindoordeel",
                desc: "De Protocol Chairman synthetiseert alle bevindingen tot één Chairman's Verdict — gefocust op consensus en actionable insights.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 hover:bg-black/10 dark:hover:bg-white/10 hover:border-[#d1b411] dark:hover:border-[#d1b411] transition-all"
              >
                <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-black dark:text-white" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-tight text-black dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-base text-black leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USE CASES ══ */}
      <section
        aria-label="Toepassingen van FAINL"
        className="w-full max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-28"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
          Voor wie?
        </h2>
        <p className="text-center text-base md:text-lg text-black font-semibold mb-12 md:mb-16 max-w-xl mx-auto">
          FAINL werkt voor elke situatie waar één perspectief niet genoeg is.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Building2,
              label: "Zakelijk",
              title: "Strategische beslissingen",
              examples: [
                "Welke markt moet ik betreden in 2026?",
                "Kopen of huren voor ons kantoor?",
                "Is deze businesscase realistisch?",
              ],
              color: "border-blue-500 dark:border-blue-400",
            },
            {
              icon: GraduationCap,
              label: "Onderzoek",
              title: "Academisch & journalistiek",
              examples: [
                "Wat zijn de ethische implicaties van AGI?",
                "Klopt deze statistiek over klimaatverandering?",
                "Vergelijk drie filosofische stromingen over vrije wil.",
              ],
              color: "border-purple-500 dark:border-purple-400",
            },
            {
              icon: Lightbulb,
              label: "Persoonlijk",
              title: "Grote levensvragen",
              examples: [
                "Moet ik van baan wisselen?",
                "Is een vegan dieet gezonder?",
                "Zijn of niet zijn — dat is de vraag.",
              ],
              color: "border-amber-500 dark:border-amber-400",
            },
            {
              icon: Globe,
              label: "Maatschappij",
              title: "Complexe maatschappelijke kwesties",
              examples: [
                "Is kernenergie de oplossing voor de energiecrisis?",
                "Wat is het eerlijkste belastingsysteem?",
                "Hoe pakt Europa migratie het best aan?",
              ],
              color: "border-emerald-500 dark:border-emerald-400",
            },
          ].map(({ icon: Icon, label, title, examples, color }) => (
            <article
              key={title}
              className={`bg-white dark:bg-zinc-900 border-2 ${color} rounded-2xl p-6 md:p-8`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-black dark:text-white" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                  {label}
                </span>
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight text-black dark:text-white mb-4">
                {title}
              </h3>
              <ul className="space-y-2">
                {examples.map((ex) => (
                  <li
                    key={ex}
                    className="flex items-start gap-2 text-base text-black"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black/30 dark:text-white/30" />
                    <span className="italic">"{ex}"</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate("/mission")}
                className="mt-6 text-[10px] font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black/20 dark:border-white/20 hover:border-[#d1b411] hover:text-[#d1b411] dark:hover:border-[#d1b411] dark:hover:text-[#d1b411] transition-colors pb-0.5"
              >
                Probeer gratis →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ══ VERGELIJKING ══ */}
      <section
        aria-label="FAINL versus gewone AI-tools"
        className="w-full bg-white dark:bg-zinc-900/50 border-t border-black/5 dark:border-white/5 py-16 md:py-28"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
            FAINL vs. gewone AI
          </h2>
          <p className="text-center text-base md:text-lg text-black font-semibold mb-12">
            Waarom is één model nooit genoeg?
          </p>

          <div className="overflow-x-auto rounded-2xl border-2 border-black dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-black">
                  <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                    Eigenschap
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                    ChatGPT / Gemini alone
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center text-[#d1b411]">
                    FAINL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-zinc-900">
                {[
                  ["Meerdere AI-modellen parallel", false, true],
                  ["Live debat tussen modellen", false, true],
                  ["Blinde vlekken gecorrigeerd", false, true],
                  ["Transparantie per model", false, true],
                  ["Eigen perspectief inbrengen", false, true],
                  ["Gewogen eindvonnis", false, true],
                  ["Privacy (geen server-opslag)", "Wisselend", true],
                  ["Gratis te proberen", true, true],
                ].map(([label, single, fainl]) => (
                  <tr
                    key={String(label)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-black dark:text-white">
                      {label}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {single === true ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : single === false ? (
                        <span className="text-red-400 font-black text-lg">✕</span>
                      ) : (
                        <span className="text-xs text-black/40 dark:text-white/40 font-bold">
                          {single}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fainl ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-red-400 font-black text-lg">✕</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section
        aria-label="Veelgestelde vragen over FAINL"
        className="w-full bg-white dark:bg-zinc-900/50 border-t border-black/5 dark:border-white/5 py-16 md:py-28"
      >
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
            Veelgestelde vragen
          </h2>
          <p className="text-center text-base md:text-lg text-black font-semibold mb-12">
            Alles wat je wil weten over FAINL.
          </p>

          <div className="bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-2xl px-6 md:px-8">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-black font-bold">
            Meer vragen?{" "}
            <Link
              to="/faq"
              className="underline hover:text-[#d1b411] transition-colors"
            >
              Bekijk de volledige FAQ
            </Link>{" "}
            of{" "}
            <Link
              to="/contact"
              className="underline hover:text-[#d1b411] transition-colors"
            >
              neem contact op
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ══ PRIJZEN ══ */}
      <section
        aria-label="Prijzen en abonnementen"
        className="w-full max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-28"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
          Eerlijke prijs
        </h2>
        <p className="text-center text-base md:text-lg text-black font-semibold mb-12">
          Begin gratis. Betaal alleen als je meer wilt.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {PRICING.CREDITS.slice(0, 3).map((pkg) => (
            <button
              key={pkg.count}
              type="button"
              onClick={() => window.open(pkg.stripeUrl, "_blank")}
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-2xl hover:border-[#d1b411] hover:shadow-[6px_6px_0px_0px_#d1b411] hover:-translate-y-0.5 transition-all text-black dark:text-white"
            >
              <div className="text-3xl font-black mb-0.5">{pkg.count}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
                Credits
              </div>
              <div className="text-lg font-black">€{pkg.price}</div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => window.open(PRICING.SUBSCRIPTIONS[0].stripeUrl, "_blank")}
            className="flex flex-col items-center justify-center p-5 bg-white dark:bg-zinc-900 border-2 border-[#d1b411] rounded-2xl hover:shadow-[6px_6px_0px_0px_#d1b411] hover:-translate-y-0.5 transition-all text-black dark:text-white relative"
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#d1b411] text-black text-[8px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
              Abonnement
            </div>
            <div className="text-base font-black uppercase tracking-tight mb-0.5">
              {PRICING.SUBSCRIPTIONS[0].name}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              {PRICING.SUBSCRIPTIONS[0].creditsPerMonth} credits/mo
            </div>
            <div className="text-lg font-black">€{PRICING.SUBSCRIPTIONS[0].price}</div>
            <div className="text-[9px] font-black text-black/30 dark:text-white/30 mt-0.5">
              / maand
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-black/30 dark:text-white/20 font-bold">
          <Link
            to="/tokens"
            className="inline-flex items-center gap-1.5 underline hover:text-[#d1b411] transition-colors"
          >
            Bekijk alle pakketten
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section
        aria-label="Aan de slag met FAINL"
        className="w-full max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center"
      >
        <div className="inline-flex items-center gap-1.5 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#d1b411] text-[#d1b411]" />
          ))}
          <span className="ml-2 text-xs font-black text-black uppercase tracking-widest">
            4.8 / 5 — 247 gebruikers
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.95] mb-6">
          Klaar voor het scherpste AI-oordeel?
        </h2>
        <p className="text-lg md:text-xl font-semibold text-black mb-10 max-w-xl mx-auto leading-relaxed">
          Stel jouw vraag. Laat de modellen strijden. Ontvang de waarheid.
          Twee sessies gratis — geen account, geen creditcard.
        </p>

        <button
          type="button"
          onClick={() => navigate("/mission")}
          className="inline-flex items-center gap-3 px-12 py-6 bg-black dark:bg-white text-white dark:text-black font-black text-base uppercase tracking-[0.2em] rounded-xl hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] active:scale-95 transition-all shadow-xl"
        >
          Start nu gratis
          <ArrowRight className="w-6 h-6" />
        </button>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-black/50">
          Gebruik je eigen API-sleutels? Dan is FAINL altijd 100% gratis.
        </p>
      </section>
    </>
  );
};
