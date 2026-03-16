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
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white border-4 border-[#03B390] rounded-full items-center justify-center z-20 group/badge">
          <ArrowRight className="w-10 h-10 text-[#03B390] group-hover/badge:translate-x-2 transition-transform duration-300" />
        </div>
        
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col items-center justify-center text-center border-b-2 md:border-b-0 md:border-r-2 border-black bg-white">
          <div className="flex items-center justify-center mb-12">
            <div className="w-24 h-24 bg-black border-4 border-black flex items-center justify-center shadow-[10px_10px_0_0_#f4f4f5]">
              <Lightbulb className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-4">
            Beperkte Visie
          </h3>
          <p className="text-[#03B390] font-black text-lg md:text-xl uppercase tracking-[0.4em] mb-12">
            Single AI-Model Beperking
          </p>
          <div className="space-y-8 text-left w-full max-w-md">
            <p className="text-xl font-bold text-black leading-tight italic">
              "Eén model klinkt vaak overtuigend, maar blijft een geïsoleerde mening — gevoelig voor fouten en onvolledigheid."
            </p>
            <div className="pt-10 space-y-5 border-t-2 border-black">
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-black uppercase tracking-widest">
                <span className="w-8 h-8 flex items-center justify-center bg-black text-white">01</span> Hallucinatie Risico
              </div>
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-black uppercase tracking-widest">
                <span className="w-8 h-8 flex items-center justify-center bg-black text-white">02</span> Gebrek aan verificatie
              </div>
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-black uppercase tracking-widest">
                <span className="w-8 h-8 flex items-center justify-center bg-black text-white">03</span> Inconsistente logica
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 5 AI Models (FAINL) */}
        <div className="w-full md:w-1/2 bg-black p-12 md:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#03B390] opacity-5 pointer-events-none" />

          <div className="flex justify-center items-center mb-12 relative z-10">
            <div className="flex -space-x-6 items-center">
               <div className="w-14 h-14 bg-black border-2 border-[#03B390] flex items-center justify-center z-10 opacity-60">
                 <img src="/ai-logos/mistral.svg" alt="Mistral AI" className="w-7 h-7 object-contain invert"/>
               </div>
               <div className="w-20 h-20 bg-black border-2 border-[#03B390] flex items-center justify-center z-20">
                 <img src="/ai-logos/claude.svg" alt="Claude" className="w-10 h-10 object-contain invert"/>
               </div>
               <div className="w-32 h-32 bg-[#03B390] border-8 border-black flex flex-col items-center justify-center z-40 transform group-hover:scale-110 transition-transform duration-700">
                 <span className="font-black text-black text-5xl leading-none">90%</span>
                 <span className="font-black text-black text-[18px] uppercase tracking-[0.2em] mt-2">Accuratie</span>
               </div>
               <div className="w-20 h-20 bg-black border-2 border-[#03B390] flex items-center justify-center z-20">
                 <img src="/ai-logos/openai.svg" alt="OpenAI" className="w-10 h-10 object-contain invert"/>
               </div>
               <div className="w-14 h-14 bg-black border-2 border-[#03B390] flex items-center justify-center z-10 opacity-60">
                 <img src="/ai-logos/gemini-color.svg" alt="Gemini" className="w-7 h-7 object-contain invert"/>
               </div>
            </div>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4 relative z-10">
            De FAINL Standaard
          </h3>
          <p className="text-[#03B390] font-black text-lg md:text-xl uppercase tracking-[0.4em] mb-12 relative z-10">
            Maximale Validatie Protocol
          </p>
          
          <div className="space-y-8 text-left w-full max-w-md relative z-10">
            <p className="text-xl font-bold text-white leading-tight">
              Activeer 5 parallelle intelligenties. Laat ze debatteren. Krijg het best haalbare antwoord met 90% accuratie.
            </p>
            <div className="pt-10 space-y-5 border-t-2 border-[#03B390]">
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-[#03B390] uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6" /> Maximale Validatie
              </div>
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-[#03B390] uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6" /> Autonome Correctie
              </div>
              <div className="flex items-center gap-5 text-lg md:text-xl font-black text-[#03B390] uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6" /> Gegarandeerde Focus
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

        <h1 className="relative z-10 text-[clamp(40px,15vw,160px)] font-black uppercase tracking-[-0.04em] leading-[0.8] text-center max-w-[98%] mx-auto mb-10 sm:mb-12">
          EÉN AI IS<br />
          <span className="text-black">EEN MENING.</span><br />
          <span className="text-black">FAINL <span className="text-[#03B390]">DE STANDAARD.</span></span>
        </h1>
        <p className="relative z-10 text-lg md:text-3xl font-black uppercase tracking-[0.2em] text-black/30 mb-16 md:mb-24 text-center max-w-5xl mx-auto px-6 leading-tight">
          Het enige protocol dat collectieve intelligentie omzet in absolute helderheid.
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
      <section className="w-full bg-white py-24 md:py-32 border-t border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-8 leading-[0.9]">
              INTELLIGENCE<br />
              <span className="text-[#03B390]">REDEFINED.</span>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-black/60 leading-relaxed max-w-2xl">
              FAINL staat voor <span className="text-black">Fully Autonomous Intelligence Network & Logic</span>. De enige standaard voor wie geen genoegen neemt met "waarschijnlijk waar".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="group">
              <div className="text-7xl font-black text-black/10 group-hover:text-[#03B390] transition-colors duration-500 mb-4">01</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-4">De Limiet van Eén</h3>
              <p className="text-lg font-bold text-black/60 leading-relaxed">
                Eén AI-model is een tunnelvisie. Zelfs de beste modellen hallucineren. FAINL doorbreekt de isolatie van single-model antwoorden.
              </p>
            </div>
            <div className="group">
              <div className="text-7xl font-black text-black/10 group-hover:text-[#03B390] transition-colors duration-500 mb-4">02</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-4">Collectieve Kracht</h3>
              <p className="text-lg font-bold text-black/60 leading-relaxed">
                Wij zetten 5 top-modellen parallel aan het work. Geen beïnvloeding, maar pure, rauwe intelligentie uit verschillende bronnen.
              </p>
            </div>
            <div className="group">
              <div className="text-7xl font-black text-black/10 group-hover:text-[#03B390] transition-colors duration-500 mb-4">03</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-4">Het FAINL Protocol</h3>
              <p className="text-lg font-bold text-black/60 leading-relaxed">
                Debat en verificatie zitten in ons DNA. Modellen corrigeren elkaar live, nog voordat jij het antwoord ziet.
              </p>
            </div>
            <div className="group">
              <div className="text-7xl font-black text-black/10 group-hover:text-[#03B390] transition-colors duration-500 mb-4">04</div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-[#03B390] mb-4">90% Accuratie</h3>
              <p className="text-lg font-bold text-black/60 leading-relaxed">
                Een reductie van 80% op vage antwoorden en een sprong naar 90% correcte, diep gewogen en gemotiveerde beantwoording.
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
                <span className="text-lg font-black uppercase tracking-[0.18em] text-black/60 dark:text-white/60 whitespace-nowrap">
                  {model.name}
                </span>
                <span className="ml-4 text-black/30 dark:text-white/30 select-none text-lg">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOE HET WERKT ══ */}
      {/* ══ HOE HET WERKT ══ */}
      <section
        aria-label="Hoe FAINL werkt"
        className="w-full max-w-5xl mx-auto px-4 md:px-6 py-24 md:py-32"
      >
        <h2 className="text-center text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-6">
          HOE WERKT HET?
        </h2>
        <p className="text-center text-xl md:text-2xl text-black/60 dark:text-white/60 font-bold mb-16 md:mb-24 max-w-2xl mx-auto leading-relaxed">
          Van jouw vraag tot het ultieme eindoordeel — in vijf geavanceerde, geautomatiseerde stappen door het FAINL protocol.
        </p>

        <ol className="grid grid-cols-1 gap-6">
          {[
            {
              img: "/general icons/question-icon.png",
              title: "Stel je vraag",
              desc: "Zakelijk, juridisch of strategisch. Het maakt niet uit. Onze engine herkent de diepste context van je input.",
            },
            {
              img: "/general icons/AI-Analyse-icon.png",
              title: "Parallelle Analyse",
              desc: "5 AI-modellen worden tegelijk geactiveerd. Ze analyseren je vraag onafhankelijk van elkaar om tunnelvisie te voorkomen.",
            },
            {
              img: "/general icons/reading-icon.png",
              title: "Volledige Transparantie",
              desc: "Zie live wat elk model concludeert. Wij filteren niets. Jij hebt de controle over wie wat zegt.",
            },
            {
              img: "/general icons/live-debate-icon.png",
              title: "Live Debat Protocol",
              desc: "De modellen vallen elkaars logica aan. Zwakke argumenten worden verworpen, sterke inzichten blijven staan.",
            },
            {
              img: "/general icons/verdict-icon.png",
              title: "Het Eindoordeel",
              desc: "Voorzitter Victor weegt alle argumenten en levert één messcherpe, onderbouwde conclusie.",
            },
          ].map(({ img, title, desc }, idx) => (
            <li
              key={title}
              className="group flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-12 bg-white dark:bg-black border-2 border-black rounded-none hover:border-[#03B390] hover:shadow-[10px_10px_0_0_#03B390] transition-all duration-300"
            >
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-black text-white relative">
                 <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#03B390] text-black font-black flex items-center justify-center text-sm">0{idx+1}</span>
                <img src={img} alt={title} className="w-10 h-10 object-contain invert" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-4">
                  {title}
                </h3>
                <p className="text-lg md:text-xl font-bold text-black/60 dark:text-white/60 leading-relaxed">
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
        className="w-full bg-white dark:bg-black py-24 md:py-32 border-t border-black/5"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-6 text-center">
            WAAROM FAINL?
          </h2>
          <p className="text-center text-xl md:text-2xl text-black/60 dark:text-white/60 font-bold mb-16 md:mb-24 max-w-2xl mx-auto leading-relaxed">
            Gebouwd voor wie niet genoeg heeft aan een "waarschijnlijk" antwoord. Expertise door collectie.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Multimodel Protocol",
                desc: "Geen enkel model heeft altijd gelijk. FAINL bundelt Gemini, Claude, GPT en Llama in één slim protocol dat antwoorden vergelijkt en aanscherpt.",
              },
              {
                icon: Swords,
                title: "Live Debatruimte",
                desc: "Laat AI-modellen live met elkaar in discussie gaan. Elk argument wordt in real time getest, bevraagd en aangescherpt door de concurrentie.",
              },
              {
                icon: Mic,
                title: "Spraakherkenning",
                desc: "Spreek je input eenvoudig in. FAINL zet je woorden direct om naar tekst en brengt ze meteen in het live debat voor snelle interactie.",
              },
              {
                icon: Eye,
                title: "Volledige Transparantie",
                desc: "Zie exact hoe ieder model redeneert. Geen verborgen filters. Jij ziet de afzonderlijke output en bepaalt welk inzicht het sterkst is.",
              },
              {
                icon: Lock,
                title: "Privacy Architectuur",
                desc: "Jouw sessies blijven lokaal. Vragen worden anoniem via onze proxy verstuurd, zonder accountkoppeling of onnodige profilering.",
              },
              {
                icon: BarChart3,
                title: "Gewogen Eindoordeel",
                desc: "Voorzitter Victor synthetiseert alle inzichten tot één helder en onderbouwd eindoordeel, gericht op scherpte en direct toepasbare actie.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-white dark:bg-black border-2 border-black rounded-none p-10 hover:border-[#03B390] hover:shadow-[10px_10px_0_0_#03B390] transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-8 group-hover:bg-[#03B390] transition-colors duration-500">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tighter text-black dark:text-white mb-6">
                  {title}
                </h3>
                <p className="text-lg font-bold text-black/50 dark:text-white/50 leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERGELIJKING ══ */}
      <section
        aria-label="FAINL versus gewone AI-tools"
        className="w-full bg-white dark:bg-black border-t border-black/5 py-24 md:py-32"
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-6 text-center">
            FAINL <span className="text-[#03B390]">VS.</span> GEWONE AI
          </h2>
          <p className="text-center text-xl md:text-2xl text-black/60 dark:text-white/60 font-bold mb-16 md:mb-24 leading-relaxed">
            Waarom is één model nooit genoeg voor kritische vragen?
          </p>

          <div className="border-2 border-black dark:border-white/20 overflow-hidden shadow-[20px_20px_0_0_#03B390]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_140px_140px] bg-black text-white px-6 py-6 gap-4">
              <span className="font-black uppercase tracking-[0.2em] text-sm text-white/40">Protocol Check</span>
              <span className="font-black uppercase tracking-[0.2em] text-sm text-center text-white/40">Single AI</span>
              <span className="font-black uppercase tracking-[0.2em] text-sm text-center text-[#03B390]">FAINL</span>
            </div>

            {/* Rows */}
            <div className="divide-y-2 divide-black/5 bg-white dark:bg-black">
              {([
                ["Parallelle Intelligentie (5+ Modellen)", false, true],
                ["Live Adversarial Debat", false, true],
                ["Autonome Foutcorrectie", false, true],
                [" Chairman's Verdict Synthese", false, true],
                ["Volledige Bron Transparantie", false, true],
                ["Privacy-First Proxy Layer", "Beperkt", true],
                ["Gegarandeerd Eindoordeel", false, true],
              ] as [string, boolean | string, boolean][]).map(([label, single, fainl]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_140px_140px] items-center px-6 py-6 gap-4 hover:bg-zinc-50 dark:hover:bg-[#03B390]/5 transition-colors duration-200"
                >
                  <span className="font-black uppercase tracking-tight text-lg md:text-xl text-black dark:text-white">
                    {label}
                  </span>
                  <span className="flex items-center justify-center">
                    {single === true ? (
                      <CheckCircle2 className="w-6 h-6 text-[#03B390]" />
                    ) : single === false ? (
                      <span className="w-6 h-6 flex items-center justify-center bg-black/5 text-black/20 font-black text-xs">✕</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-black/30 text-center leading-tight">{single}</span>
                    )}
                  </span>
                  <span className="flex items-center justify-center">
                    {fainl ? (
                      <CheckCircle2 className="w-8 h-8 text-[#03B390] drop-shadow-[0_0_10px_rgba(3,179,144,0.3)]" />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center bg-black/5 text-black/20 font-black text-xs">✕</span>
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
        className="w-full bg-white dark:bg-black border-t border-black/5 py-24 md:py-32"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-6 text-center">
            FAQ
          </h2>
          <p className="text-center text-xl md:text-2xl text-black/60 dark:text-white/60 font-bold mb-16 md:mb-24 leading-relaxed">
            Alles wat je moet weten over het FAINL Protocol.
          </p>

          <div className="bg-white dark:bg-black border-2 border-black rounded-none px-6 md:px-12 divide-y-2 divide-black/5">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          <p className="text-center mt-12 text-lg font-black uppercase tracking-widest text-[#03B390]">
            Meer vragen?{" "}
            <Link to="/faq" className="underline hover:text-black transition-colors">Bekijk volledige FAQ</Link>
            {" "}of{" "}
            <Link to="/contact" className="underline hover:text-black transition-colors">Neem contact op</Link>
          </p>
        </div>
      </section>

      {/* ══ PRIJZEN ══ */}
      <section
        aria-label="Prijzen en abonnementen"
        className="w-full bg-white dark:bg-black py-24 md:py-32 border-t border-black/5"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-6">
            EERLIJKE PRIJS
          </h2>
          <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 font-bold mb-16 md:mb-24 leading-relaxed max-w-2xl mx-auto">
            Geen verborgen kossten. Betaal voor wat je gebruikt. Start vandaag met twee gratis sessies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PRICING.CREDITS.slice(0, 3).map((pkg) => (
              <button
                key={pkg.count}
                type="button"
                onClick={() => window.open(pkg.stripeUrl, "_blank")}
                className="flex flex-col items-center justify-center p-10 bg-white dark:bg-black border-2 border-black rounded-none hover:border-[#03B390] hover:shadow-[10px_10px_0_0_#03B390] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-6xl font-black mb-2 text-black dark:text-white">{pkg.count}</div>
                <div className="text-lg font-black uppercase tracking-[0.3em] text-[#03B390] mb-6">
                  CREDITS
                </div>
                <div className="text-4xl font-black text-black dark:text-white">€{pkg.price}</div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => window.open(PRICING.SUBSCRIPTIONS[0].stripeUrl, "_blank")}
              className="flex flex-col items-center justify-center p-10 bg-black text-white border-2 border-black rounded-none hover:shadow-[10px_10px_0_0_#03B390] hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#03B390] text-black text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap">
                Abonnement
              </div>
              <div className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">
                {PRICING.SUBSCRIPTIONS[0].name}
              </div>
              <div className="text-lg font-black uppercase tracking-[0.3em] text-[#03B390] mb-6">
                {PRICING.SUBSCRIPTIONS[0].creditsPerMonth} CREDITS/MO
              </div>
              <div className="text-4xl font-black text-white">€{PRICING.SUBSCRIPTIONS[0].price}</div>
              <div className="text-lg font-black text-white/40 mt-2 uppercase tracking-widest">
                per maand
              </div>
            </button>
          </div>

          <p className="text-center text-lg font-black uppercase tracking-widest text-black/30">
            <Link to="/tokens" className="inline-flex items-center gap-3 underline hover:text-[#03B390] transition-colors">
              Bekijk alle pakketten
              <ArrowRight className="w-5 h-5" />
            </Link>
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section
        aria-label="Aan de slag met FAINL"
        className="w-full bg-white dark:bg-black py-32 md:py-48 flex flex-col items-center text-center border-t border-black/5"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.8] mb-10">
            Klaar voor de<br /><span className="text-[#03B390]">Waarheid?</span>
          </h2>
          <p className="text-xl md:text-3xl font-bold text-black/60 dark:text-white/60 mb-16 max-w-2xl mx-auto leading-tight italic">
            "Stel je vraag. Laat de modellen strijden. Ontvang het enige antwoord dat telt."
          </p>

          <button
            type="button"
            onClick={() => navigate("/mission")}
            className="inline-flex items-center gap-4 px-16 py-8 bg-black text-white font-black text-xl uppercase tracking-[0.3em] border-4 border-black hover:bg-white hover:text-black transition-all duration-500 group shadow-[20px_20px_0_0_#03B390]"
          >
            Start Gratis Sessie
            <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-4" />
          </button>
          
          <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-black/20">
            Twee sessies gratis — Geen creditcard vereist.
          </p>
        </div>
      </section>
    </>
  );
};
