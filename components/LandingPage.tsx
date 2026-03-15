import { FC, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2, Eye, Swords, Brain,
  Lock, ChevronDown, Mic, BarChart3,
  BookOpen, Lightbulb,
} from "lucide-react";
import { SEO } from "./SEO";
import { PRICING } from "../constants";

// ── FAQ Data ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Hoe werkt FAINL?",
    a: "FAINL stuurt jouw vraag tegelijk naar meerdere AI-modellen (Gemini, GPT-4, Claude, Llama en meer). Elk model analyseert de vraag onafhankelijk en geeft zijn eigen perspectief. Vervolgens debatteren ze live met elkaar — en jij kunt zelfs meedoen. De Voorzitter Victor synthetiseert alle inzichten tot één gewogen, gezaghebbend eindoordeel.",
  },
  {
    q: "Welke AI-modellen gebruikt FAINL?",
    a: "Standaard zijn er altijd 3 Google Gemini-nodes actief (gratis, geen sleutel nodig). Met de uitgebreide modus voeg je GPT-4, Anthropic Claude, Meta Llama via Groq, Mistral, DeepSeek en meer toe. Je kunt ook je eigen API-sleutels invoegen voor maximale controle.",
  },
  {
    q: "Is FAINL gratis te gebruiken?",
    a: "Ja! Nieuwe bezoekers krijgen twee volledige FAINL-sessies gratis — zonder account, zonder creditcard. Daarna kies je een creditpakket (vanaf €2,99 per credit) of een maandelijks abonnement.",
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
        "Lokale sessie-opslag",
        "Geen account vereist",
      ],
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        highPrice: "119.99",
        priceCurrency: "EUR",
        offerCount: "5",
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
        <span className="font-black text-base md:text-xl uppercase tracking-tight text-black group-hover:text-[#d1b411] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-6 h-6 shrink-0 text-black/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-lg md:text-xl text-black dark:text-white/80 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
};

// ── AI Ticker Models ─────────────────────────────────────────────────────────
const AI_MODELS = [
  { name: "Google Gemini",    icon: <img src="/ai-logos/gemini-color.svg" alt="Google Gemini"    className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "OpenAI",           icon: <img src="/ai-logos/openai.svg"        alt="OpenAI"           className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Anthropic Claude", icon: <img src="/ai-logos/claude.svg"        alt="Anthropic Claude" className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Mistral AI",       icon: <img src="/ai-logos/mistral.svg"       alt="Mistral AI"       className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "DeepSeek",         icon: <img src="/ai-logos/deepseek.svg"      alt="DeepSeek"         className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Groq",             icon: <img src="/ai-logos/groq.svg"          alt="Groq"             className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Grok",             icon: <img src="/ai-logos/grok.svg"          alt="Grok"             className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Perplexity",       icon: <img src="/ai-logos/perplexity.svg"    alt="Perplexity"       className="w-6 h-6 flex-shrink-0 object-contain" /> },
  { name: "Qwen",             icon: <img src="/ai-logos/qwen.svg"          alt="Qwen"             className="w-6 h-6 flex-shrink-0 object-contain" /> },
];

// ── Hero Aura Background (Premium Dynamic Look) ──────────────────────────────
const HeroAura: FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes aura-float-1 {
          0%   { transform: translate(-10%, -10%) scale(1);   opacity: 0.4; }
          33%  { transform: translate(10%, 15%) scale(1.1);  opacity: 0.6; }
          66%  { transform: translate(-15%, 5%) scale(0.9);   opacity: 0.5; }
          100% { transform: translate(-10%, -10%) scale(1);  opacity: 0.4; }
        }
        @keyframes aura-float-2 {
          0%   { transform: translate(20%, 30%) scale(1.1);  opacity: 0.3; }
          50%  { transform: translate(-10%, -10%) scale(1);  opacity: 0.5; }
          100% { transform: translate(20%, 30%) scale(1.1);  opacity: 0.3; }
        }
        .aura-blob {
          filter: blur(120px);
          border-radius: 50%;
          position: absolute;
          will-change: transform, opacity;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .gold-material-btn {
          background: linear-gradient(135deg, #d4af37 0%, #f9d976 50%, #d4af37 100%);
          background-size: 200% 100%;
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.4), 0 8px 10px -6px rgba(212, 175, 55, 0.4);
        }
        .gold-material-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 35px -5px rgba(212, 175, 55, 0.5), 0 10px 10px -5px rgba(212, 175, 55, 0.3);
          background-position: 100% 0;
        }
        .gold-material-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0s;
        }
        .gold-material-btn:hover::after {
          left: 150%;
          transition: 0.7s;
        }
      `}</style>
      
      {/* Primary Gold Aura */}
      <div 
        className="aura-blob w-[600px] h-[600px] bg-[#d1b411]/40 top-[-10%] left-[-10%]" 
        style={{ animation: 'aura-float-1 20s ease-in-out infinite' }}
      />
      
      {/* Secondary Neutral Aura */}
      <div 
        className="aura-blob w-[800px] h-[800px] bg-slate-200/50 bottom-[-20%] right-[-10%]" 
        style={{ animation: 'aura-float-2 30s ease-in-out infinite' }}
      />

      {/* Subtle Third Blob for depth */}
      <div 
        className="aura-blob w-[500px] h-[500px] bg-[#d1b411]/20 top-[40%] right-[10%]" 
        style={{ animation: 'aura-float-1 35s ease-in-out infinite reverse' }}
      />

      {/* Extra Golden Flare */}
      <div 
        className="aura-blob w-[300px] h-[300px] bg-[#d1b411]/25 top-[20%] left-[40%]" 
        style={{ animation: 'aura-float-2 15s ease-in-out infinite alternate' }}
      />
    </div>
  );
};


// ── Static Comparison Banner ────────────────────────────────────────────────
const HeroComparisonBanner: FC = () => {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="relative flex flex-col md:flex-row bg-[#e8eef3] rounded-[32px] overflow-hidden shadow-sm border border-black/5">
        
        {/* VS Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full items-center justify-center font-black text-[10px] text-black/30 shadow-sm z-20">
          VS
        </div>
        
        {/* Left Side: 1 AI Model */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col items-center justify-center text-center border-b border-black/5 md:border-b-0 md:border-r">
          <div className="flex items-center justify-center mb-5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-black/5">
              <Lightbulb className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1e293b] mb-1">
            1 AI model
          </h3>
          <p className="text-[#64748b] font-bold text-sm md:text-base uppercase tracking-widest">
            = 1 Antwoord
          </p>
        </div>

        {/* Right Side: 5 AI Models (FAINL) */}
        <div className="w-full md:w-1/2 bg-[#1e293b] p-8 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          {/* Background flair */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d1b411]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>

          <div className="flex justify-center items-center mb-5 relative z-10">
            <div className="flex -space-x-3 items-center">
               <div className="w-8 h-8 rounded-full bg-[#283548] border-2 border-[#1e293b] flex items-center justify-center z-10 opacity-70">
                 <img src="/ai-logos/mistral.svg" alt="Mistral AI" className="w-4 h-4 object-contain brightness-0 invert opacity-50"/>
               </div>
               <div className="w-10 h-10 rounded-full bg-[#283548] border-2 border-[#1e293b] flex items-center justify-center z-20 opacity-80">
                 <img src="/ai-logos/claude.svg" alt="Claude" className="w-5 h-5 object-contain brightness-0 invert opacity-60"/>
               </div>
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d1b411] to-yellow-600 border-2 border-[#1e293b] flex items-center justify-center shadow-md shadow-[#d1b411]/20 z-30 font-black text-white text-[10px] sm:text-xs">
                 FAINL
               </div>
               <div className="w-10 h-10 rounded-full bg-[#283548] border-2 border-[#1e293b] flex items-center justify-center z-20 opacity-80">
                 <img src="/ai-logos/openai.svg" alt="OpenAI" className="w-5 h-5 object-contain brightness-0 invert opacity-60"/>
               </div>
               <div className="w-8 h-8 rounded-full bg-[#283548] border-2 border-[#1e293b] flex items-center justify-center z-10 opacity-70">
                 <img src="/ai-logos/gemini-color.svg" alt="Gemini" className="w-4 h-4 object-contain brightness-0 invert opacity-50"/>
               </div>
            </div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-1 relative z-10">
            5 AI Modellen
          </h3>
          <p className="text-[#d1b411] font-bold text-sm md:text-base uppercase tracking-widest relative z-10">
            = Het beste antwoord
          </p>
        </div>

      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
export const LandingPage: FC = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0];
      setMousePos({ x: touch.clientX, y: touch.clientY });
    } else {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <>
      <SEO
        title="FAINL — AI Consensus Engine | Meerdere AI's. Één Antwoord."
        description="FAINL laat Gemini, GPT-4, Claude en Llama tegelijk jouw vraag analyseren, live debatteren en samen één scherp, gewogen eindoordeel geven. Twee sessies gratis, geen account nodig."
        canonical="/"
        keywords="AI consensus engine, meerdere AI modellen vergelijken, AI debat tool, ChatGPT alternatief Nederland, Gemini GPT-4 Claude samen, AI beslissingstool, kunstmatige intelligentie tool gratis, multi-model AI"
        ogTitle="FAINL — Laat meerdere AI's voor jou debatteren"
        ogDescription="Gemini, GPT-4, Claude én Llama analyseren tegelijk jouw vraag en debatteren live. FAINL synthetiseert het scherpste AI-oordeel. Gratis proberen."
        jsonLd={JSON_LD}
      />

      {/* ══ HERO ══ */}
      <section
        aria-label="Introductie"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className="relative w-full overflow-hidden bg-white text-[#0d1322] pt-16 sm:pt-24 md:pt-32 pb-16 md:pb-24 flex flex-col items-center group/hero"
      >
        <HeroAura />
        
        {/* Interactive Interactive Glow Layer */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-0 group-hover/hero:opacity-100"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(209, 180, 17, 0.12), transparent 80%)`
          }}
        />
        <h1 className="relative z-10 text-[32px] sm:text-[50px] md:text-[68px] font-black uppercase tracking-tighter leading-[1.02] text-center max-w-4xl mx-auto mb-10 md:mb-12">
          Jouw vraag<br />
          verdient meer dan<br />
          <span className="text-[#d1b411]">één AI-model.</span>
        </h1>

        {/* Static Comparison Banner */}
        <HeroComparisonBanner />

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 px-4 w-full flex-1 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => navigate("/mission")}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 sm:py-5 gold-material-btn text-black font-black text-[13px] sm:text-[15px] uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-xl group"
          >
            Start gratis
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <Link
            to="/cookbook"
            className="w-full flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-[#1e2532] text-slate-400 font-bold text-xs sm:text-[13px] uppercase tracking-widest rounded-lg hover:bg-[#283243] hover:text-white transition-all shadow-md"
          >
            <BookOpen className="w-4 h-4 opacity-70" />
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
                <span className="text-sm font-black uppercase tracking-[0.18em] text-black/50 dark:text-white/40 whitespace-nowrap">
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
        <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 md:mb-16 max-w-xl mx-auto leading-relaxed">
          Van jouw vraag tot het meest onderbouwde antwoord — in vijf
          geautomatiseerde stappen.
        </p>

        <ol className="space-y-4">
          {[
            {
              img: "/general icons/question-icon.png",
              title: "Stel je vraag",
              desc: "Elke vraag werkt — zakelijk, filosofisch, juridisch, persoonlijk. FAINL verwerkt alles tot 4.000 tekens.",
            },
            {
              img: "/general icons/AI-Analyse-icon.png",
              title: "AI's analyseren parallel",
              desc: "Meerdere modellen analyseren jouw vraag tegelijk en onafhankelijk. Geen beïnvloeding, geen tunnelvisie.",
            },
            {
              img: "/general icons/reading-icon.png",
              title: "Lees elk model apart",
              desc: "Volledig transparant: zie exact wat elk AI-model heeft geconcludeerd, zonder filters of aggregatie.",
            },
            {
              img: "/general icons/live-debate-icon.png",
              title: "Live debat — doe mee",
              desc: "De modellen debatteren live met elkaar. Jij kunt meeschrijven of -spreken en jouw perspectief direct inbrengen.",
            },
            {
              img: "/general icons/verdict-icon.png",
              title: "Chairman's Verdict",
              desc: "Victor analyseert alle argumenten en synthetiseert het meest complete, gewogen eindoordeel.",
            },
          ].map(({ img, title, desc }) => (
            <li
              key={title}
              className="group flex items-start gap-5 p-6 md:p-8 bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/10 rounded-2xl hover:border-[#d1b411] hover:shadow-[6px_6px_0px_0px_#d1b411] transition-all duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black dark:bg-white rounded-xl group-hover:scale-110 transition-transform">
                <img src={img} alt={title} className="w-6 h-6 md:w-7 md:h-7 object-contain invert dark:invert-0" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-xl md:text-2xl font-medium text-black dark:text-white/70 leading-relaxed">
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
          <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 md:mb-16 max-w-xl mx-auto leading-relaxed">
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
                desc: "Je instellingen en sessiegeschiedenis blijven lokaal in jouw browser. Je vragen worden anoniem via onze proxy naar de AI-providers gestuurd — geen account koppeling, geen profiling.",
              },
              {
                icon: BarChart3,
                title: "Gewogen eindoordeel",
                desc: "De Voorzitter Victor synthetiseert alle bevindingen tot één Chairman's Verdict — gefocust op consensus en actionable insights.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 hover:bg-black/10 dark:hover:bg-white/10 hover:border-[#d1b411] transition-all"
              >
                <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="font-black text-lg md:text-xl uppercase tracking-tight text-black dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-lg md:text-xl text-black dark:text-white/70 leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
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
          <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 leading-relaxed">
            Waarom is één model nooit genoeg?
          </p>

          <div className="rounded-2xl border-2 border-black dark:border-white/20 overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_1px_rgba(255,255,255,0.1)]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_72px_72px] sm:grid-cols-[1fr_120px_120px] bg-black dark:bg-zinc-800 text-white px-4 sm:px-6 py-4 gap-2">
              <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-white/60">Eigenschap</span>
              <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-center text-white/60 leading-tight">Gewone<br/>AI</span>
              <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-center text-[#d1b411] leading-tight">FAINL</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-black/8 dark:divide-white/8 bg-white dark:bg-zinc-900">
              {([
                ["Meerdere AI-modellen parallel", false, true],
                ["Live debat tussen modellen", false, true],
                ["Blinde vlekken gecorrigeerd", false, true],
                ["Transparantie per model", false, true],
                ["Eigen perspectief inbrengen", false, true],
                ["Gewogen eindvonnis", false, true],
                ["Privacy (geen server-opslag)", "Wisselend", true],
                ["Gratis te proberen", true, true],
              ] as [string, boolean | string, boolean][]).map(([label, single, fainl]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_72px_72px] sm:grid-cols-[1fr_120px_120px] items-center px-4 sm:px-6 py-4 gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-black dark:text-white leading-snug pr-2">
                    {label}
                  </span>
                  <span className="flex items-center justify-center">
                    {single === true ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    ) : single === false ? (
                      <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 font-black text-xs">✕</span>
                    ) : (
                      <span className="text-[11px] sm:text-xs text-black/40 dark:text-white/40 font-bold text-center leading-tight">{single}</span>
                    )}
                  </span>
                  <span className="flex items-center justify-center">
                    {fainl ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    ) : (
                      <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 font-black text-xs">✕</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
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
          <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 leading-relaxed">
            Alles wat je wil weten over FAINL.
          </p>

          <div className="bg-white border-2 border-black/10 rounded-2xl px-6 md:px-8">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <p className="text-center mt-8 text-base md:text-lg text-black font-bold">
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
        <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 leading-relaxed">
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
              <div className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
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
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#d1b411] text-black text-sm font-black uppercase tracking-widest rounded-full whitespace-nowrap">
              Abonnement
            </div>
            <div className="text-base font-black uppercase tracking-tight mb-0.5">
              {PRICING.SUBSCRIPTIONS[0].name}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              {PRICING.SUBSCRIPTIONS[0].creditsPerMonth} credits/mo
            </div>
            <div className="text-lg font-black">€{PRICING.SUBSCRIPTIONS[0].price}</div>
            <div className="text-sm font-black text-black/30 dark:text-white/30 mt-0.5">
              / maand
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-black/30 dark:text-white/20 font-bold">
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
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.95] mb-6">
          Klaar voor het scherpste AI-oordeel?
        </h2>
        <p className="text-xl md:text-2xl font-semibold text-black dark:text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
          Stel jouw vraag. Laat de modellen strijden. Ontvang de waarheid.
          Twee sessies gratis — geen account, geen creditcard.
        </p>

        <button
          type="button"
          onClick={() => navigate("/mission")}
          className="inline-flex items-center gap-3 px-12 py-6 gold-material-btn text-black font-black text-lg uppercase tracking-[0.2em] rounded-xl group"
        >
          Start gratis sessie
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>

      </section>
    </>
  );
};
