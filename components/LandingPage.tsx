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
    a: "AI levert sterke structuur, frameworks en taalinspiratie — maar de specifieke context van jouw organisatie, sector en cultuur moet je zelf toevoegen. FAINL's gezamenlijke aanpak verhoogt betrouwbaarheid doordat modellen elkaars output kritisch toetsen, elkaars fouten corrigeren en argumenten uitwisselen. Het resultaat is dieper, gebalanceerder en aantoonbaar betrouwbaarder dan welk single-model antwoord ook.",
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
        "AI-platform dat meerdere AI-modellen (Gemini, GPT-4, Claude, Llama) tegelijk inzet voor diepgaande analyse, live debat en gewogen eindoordelen.",
      featureList: [
        "Multi-model Gezamenlijk Oordeel",
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
        <span className="font-black text-base md:text-xl uppercase tracking-tight text-black dark:text-white group-hover:text-black transition-colors">
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




// ── Static Comparison Banner ────────────────────────────────────────────────
const HeroComparisonBanner: FC = () => {  
  return (
    <div className="relative z-10 w-full mb-12">
      <div className="relative flex flex-col md:flex-row bg-white border-y-2 md:border-2 border-black overflow-hidden shadow-2xl">
        
        {/* Central Transition Badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white border-4 border-black rounded-full items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.1)] z-20 group/badge">
          <ArrowRight className="w-8 h-8 text-black group-hover/badge:translate-x-1 transition-transform duration-300" />
        </div>
        
        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col items-center justify-center text-center border-b-2 md:border-b-0 md:border-r-2 border-black bg-zinc-50">
          <div className="flex items-center justify-center mb-10">
            <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center shadow-[8px_8px_0_0_black]">
              <Lightbulb className="w-10 h-10 text-black" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">
            Beperkte Visie
          </h3>
          <p className="text-black/30 font-black text-xs uppercase tracking-[0.4em] mb-12">
            De status quo van AI
          </p>
          <div className="space-y-6 text-left w-full max-w-sm">
            <p className="text-lg font-bold text-black/70 leading-relaxed italic">
              "Eén model klinkt vaak overtuigend, maar blijft een geïsoleerde mening — gevoelig voor bias, fouten en onvolledigheid."
            </p>
            <div className="pt-8 space-y-4 border-t border-black/10">
              <div className="flex items-center gap-4 text-[11px] font-black text-black/40 uppercase tracking-widest">
                <span className="w-6 h-6 flex items-center justify-center bg-zinc-200">01</span> Hallucinatie Risico
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black text-black/40 uppercase tracking-widest">
                <span className="w-6 h-6 flex items-center justify-center bg-zinc-200">02</span> Gebrek aan verificatie
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black text-black/40 uppercase tracking-widest">
                <span className="w-6 h-6 flex items-center justify-center bg-zinc-200">03</span> Inconsistente logica
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 5 AI Models (FAINL) */}
        <div className="w-full md:w-1/2 bg-black p-12 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

          <div className="flex justify-center items-center mb-10 relative z-10">
            <div className="flex -space-x-5 items-center">
               <div className="w-12 h-12 bg-zinc-900 border-2 border-white/20 flex items-center justify-center z-10 opacity-40">
                 <img src="/ai-logos/mistral.svg" alt="Mistral AI" className="w-6 h-6 object-contain invert"/>
               </div>
               <div className="w-16 h-16 bg-zinc-900 border-2 border-white/40 flex items-center justify-center z-20 opacity-70">
                 <img src="/ai-logos/claude.svg" alt="Claude" className="w-8 h-8 object-contain invert"/>
               </div>
               <div className="w-24 h-24 bg-white border-8 border-black flex flex-col items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.15)] z-40 transform group-hover:scale-105 transition-transform duration-700">
                 <span className="font-black text-black text-3xl leading-none">90%</span>
                 <span className="font-black text-black text-[8px] uppercase tracking-widest mt-1">Accuratie</span>
               </div>
               <div className="w-16 h-16 bg-zinc-900 border-2 border-white/40 flex items-center justify-center z-20 opacity-70">
                 <img src="/ai-logos/openai.svg" alt="OpenAI" className="w-8 h-8 object-contain invert"/>
               </div>
               <div className="w-12 h-12 bg-zinc-900 border-2 border-white/20 flex items-center justify-center z-10 opacity-40">
                 <img src="/ai-logos/gemini-color.svg" alt="Gemini" className="w-6 h-6 object-contain invert"/>
               </div>
            </div>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4 relative z-10">
            Het Eindoordeel
          </h3>
          <p className="text-white/30 font-black text-xs uppercase tracking-[0.4em] mb-12 relative z-10">
            De FAINL Standaard
          </p>
          
          <div className="space-y-6 text-left w-full max-w-sm relative z-10">
            <p className="text-lg font-bold text-white leading-relaxed">
              Activeer 5 parallelle intelligenties. Laat ze debatteren. Krijg het best haalbare antwoord (90% accuratie).
            </p>
            <div className="pt-8 space-y-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-widest">
                <CheckCircle2 className="w-5 h-5 text-white" /> Maximale Validatie
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-widest">
                <CheckCircle2 className="w-5 h-5 text-white" /> Autonome Correctie
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black text-white uppercase tracking-widest">
                <CheckCircle2 className="w-5 h-5 text-white" /> Gegarandeerd Inzicht
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
export const LandingPage: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="FAINL — AI Eindoordeel Engine | Meerdere AI's. Één Antwoord."
        description="FAINL laat Gemini, GPT-4, Claude en Llama tegelijk jouw vraag analyseren, live debatteren en samen één scherp, gewogen eindoordeel geven. Twee sessies gratis, geen account nodig."
        canonical="/"
        keywords="AI eindoordeel engine, meerdere AI modellen vergelijken, AI debat tool, ChatGPT alternatief Nederland, Gemini GPT-4 Claude samen, AI beslissingstool, kunstmatige intelligentie tool gratis, multi-model AI"
        ogTitle="FAINL — Laat meerdere AI's voor jou debatteren"
        ogDescription="Gemini, GPT-4, Claude én Llama analyseren tegelijk jouw vraag en debatteren live. FAINL synthetiseert het scherpste AI-oordeel. Gratis proberen."
        jsonLd={JSON_LD}
      />

      {/* ══ HERO ══ */}
      <section
        aria-label="Introductie"
        className="relative w-full overflow-hidden bg-white text-[#0d1322] pt-24 md:pt-40 pb-20 md:pb-32 flex flex-col items-center group/hero"
      >

        <h1 className="relative z-10 text-[40px] sm:text-[80px] md:text-[140px] font-black uppercase tracking-[-0.04em] leading-[0.85] text-center max-w-[95%] mx-auto mb-8 sm:mb-10">
          EÉN AI IS<br />
          <span className="text-black/5">EEN MENING.</span><br />
          <span className="text-black">FAINL DE STANDAARD.</span>
        </h1>
        <p className="relative z-10 text-base md:text-2xl font-black uppercase tracking-[0.2em] text-black/20 mb-12 md:mb-20 text-center max-w-4xl mx-auto px-6 leading-tight">
          Activeer het enige protocol dat collectieve intelligentie omzet in absolute helderheid.
        </p>

        {/* Static Comparison Banner */}
        <HeroComparisonBanner />

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-6 w-full max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => navigate("/mission")}
            className="w-full sm:w-auto px-12 py-6 bg-black text-white font-black text-lg uppercase tracking-[0.2em] border-4 border-black hover:bg-white hover:text-black transition-all duration-300 group shadow-[10px_10px_0_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Start gratis sessie
            <ArrowRight className="inline-block ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>
          
          <Link
            to="/cookbook"
            className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black text-lg uppercase tracking-[0.2em] border-4 border-black hover:bg-zinc-100 transition-all duration-300 text-center shadow-[10px_10px_0_0_rgba(0,0,0,0.05)]"
          >
            Voorbeeldvragen
          </Link>
        </div>
      </section>

      {/* ══ FAINL BREAKDOWN ══ */}
      <section className="w-full bg-white py-20 border-t border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black mb-6">
              Intelligence<br />Redefined.
            </h2>
            <p className="text-xl font-bold text-black/60 leading-relaxed">
              FAINL staat voor <span className="text-black">Fully Autonomous Intelligence Network & Logic</span>. Een nieuwe standaard voor redenering en betrouwbaarheid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-4xl font-black text-black/10">01</div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">De Limiet van Eén</h3>
              <p className="text-sm font-bold text-black/50 leading-relaxed">
                Eén AI-model kan sterk klinken, maar blijft vatbaar voor hallucinaties en blinde vlekken. Het is een mening, geen fundament.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-black text-black/10">02</div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">Collectieve Kracht</h3>
              <p className="text-sm font-bold text-black/50 leading-relaxed">
                Wij zetten meerdere top-modellen tegelijk aan het werk. Geen beïnvloeding, maar pure parallelle intelligentie.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-black text-black/10">03</div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">Het FAINL Protocol</h3>
              <p className="text-sm font-bold text-black/50 leading-relaxed">
                Debat en verificatie zitten in ons DNA. Modellen corrigeren elkaar live, nog voordat jij het antwoord ziet.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-black text-black/10">04</div>
              <h3 className="text-lg font-black uppercase tracking-tight text-black">90% Accuratie</h3>
              <p className="text-sm font-bold text-black/50 leading-relaxed">
                Het resultaat is een reductie van 80% op vage antwoorden en een sprong naar 90% correcte, gemotiveerde beantwoording.
              </p>
            </div>
          </div>
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
              desc: "Elke vraag werkt — zakelijk, filosofisch, juridisch, persoonlijk. Geen limiet op de lengte van je vraag.",
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
              className="group flex items-start gap-5 p-6 md:p-8 bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/10 rounded-2xl hover:border-black hover:shadow-[6px_6px_0px_0px_black] transition-all duration-200"
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
                title: "Multimodel-eindoordeel",
                desc: "Geen enkel AI-model heeft altijd gelijk. FAINL bundelt de kracht van Gemini, Claude, GPT, Llama en andere modellen in één slim protocol dat antwoorden vergelijkt, aanscherpt en samenbrengt tot een sterker eindresultaat.",
              },
              {
                icon: Swords,
                title: "Live debatruimte",
                desc: "Laat AI-modellen live met elkaar in discussie gaan terwijl jij direct meeleest, meespreekt of bijstuurt. Elk argument wordt in real time getest, bevraagd en aangescherpt.",
              },
              {
                icon: Mic,
                title: "Spraakherkenning",
                desc: "Spreek je input eenvoudig in. FAINL zet je woorden direct om naar tekst en brengt ze meteen in het live debat, voor snelle en moeiteloze interactie.",
              },
              {
                icon: Eye,
                title: "Volledige transparantie",
                desc: "Zie exact hoe ieder model redeneert, zonder verborgen filters of onzichtbare bewerking. Jij ziet de afzonderlijke output en bepaalt zelf welk inzicht het meeste vertrouwen verdient.",
              },
              {
                icon: Lock,
                title: "Privacy-first",
                desc: "Jouw instellingen en sessiegeschiedenis blijven lokaal in je browser. Vragen worden anoniem via onze proxy verstuurd naar AI-providers, zonder accountkoppeling en zonder profilering.",
              },
              {
                icon: BarChart3,
                title: "Gewogen eindoordeel",
                desc: "Voorzitter Victor brengt alle inzichten samen tot één helder en onderbouwd eindoordeel, gericht op resultaat, scherpte en direct toepasbare inzichten.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-zinc-50 dark:bg-zinc-900 border-2 border-black rounded-none p-6 md:p-8 hover:shadow-[6px_6px_0px_0px_black] transition-all"
              >
                <div className="w-12 h-12 bg-black rounded-none flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
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
              <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-center text-black leading-tight">FAINL</span>
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
              className="underline hover:text-black transition-colors"
            >
              Bekijk de volledige FAQ
            </Link>{" "}
            of{" "}
            <Link
              to="/contact"
              className="underline hover:text-black transition-colors"
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
              className="flex flex-col items-center justify-center p-5 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 rounded-2xl hover:border-black hover:shadow-[6px_6px_0px_0_black] hover:-translate-y-0.5 transition-all text-black dark:text-white"
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
            className="flex flex-col items-center justify-center p-5 bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl hover:shadow-[6px_6px_0px_0px_black] hover:-translate-y-0.5 transition-all text-black dark:text-white relative"
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black text-white text-sm font-black uppercase tracking-widest rounded-full whitespace-nowrap">
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
            className="inline-flex items-center gap-1.5 underline hover:text-black transition-colors"
          >
            Bekijk alle pakketten
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section
        aria-label="Aan de slag met FAINL"
        className="w-full max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-32 flex flex-col items-center text-center"
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
          className="inline-flex items-center gap-3 px-12 py-6 bg-black text-white font-black text-lg uppercase tracking-[0.2em] border-2 border-black hover:bg-zinc-800 transition-all group"
        >
          Start gratis sessie
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>

      </section>
    </>
  );
};
