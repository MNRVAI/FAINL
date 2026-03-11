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
        <h1 className="text-[2.4rem] leading-[1.06] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-black uppercase tracking-tighter text-black dark:text-white max-w-3xl mx-auto mb-5 sm:mb-6 md:mb-8">
          Jouw vraag verdient meer dan één{" "}
          <span className="text-[#d1b411]">AI-model.</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg sm:text-xl md:text-2xl font-semibold text-black dark:text-white/80 leading-snug mb-8 sm:mb-10 md:mb-14">
          Eén model geeft <em>een</em> antwoord.{" "}
          <span className="text-black dark:text-white font-black">FAINL geeft het <em>beste</em>.</span>
          <span className="block mt-3 text-base sm:text-lg font-medium text-black/60 dark:text-white/50 leading-relaxed">
            Meerdere AI-modellen analyseren parallel, bevragen elkaars redenering en smelten samen tot één gewogen eindoordeel.
          </span>
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
              className="group flex items-start gap-5 p-6 md:p-8 bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/10 rounded-2xl hover:border-[#d1b411] hover:shadow-[6px_6px_0px_0px_#d1b411] transition-all duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black dark:bg-white rounded-xl group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-black" />
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
                desc: "De Protocol Chairman synthetiseert alle bevindingen tot één Chairman's Verdict — gefocust op consensus en actionable insights.",
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

      {/* ══ USE CASES ══ */}
      <section
        aria-label="Toepassingen van FAINL"
        className="w-full max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-28"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 text-center">
          Voor wie?
        </h2>
        <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 md:mb-16 max-w-xl mx-auto leading-relaxed">
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
              color: "border-blue-500",
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
              color: "border-purple-500",
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
              color: "border-amber-500",
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
              color: "border-emerald-500",
            },
          ].map(({ icon: Icon, label, title, examples, color }) => (
            <article
              key={title}
              className={`bg-white dark:bg-zinc-900 border-2 ${color} rounded-2xl p-6 md:p-8`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-black dark:text-white" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-black/40 dark:text-white/40">
                  {label}
                </span>
              </div>
              <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight text-black dark:text-white mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {examples.map((ex) => (
                  <li
                    key={ex}
                    className="flex items-start gap-2 text-lg md:text-xl text-black dark:text-white/70"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-black/30 dark:text-white/30" />
                    <span className="italic">"{ex}"</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate("/mission")}
                className="mt-6 text-sm font-black uppercase tracking-widest text-black dark:text-white border-b-2 border-black/20 dark:border-white/20 hover:border-[#d1b411] hover:text-[#d1b411] transition-colors pb-0.5"
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
          <p className="text-center text-xl md:text-2xl text-black dark:text-white/80 font-semibold mb-12 leading-relaxed">
            Waarom is één model nooit genoeg?
          </p>

          <div className="overflow-x-auto rounded-2xl border-2 border-black dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_1px_rgba(255,255,255,0.1)]">
            <table className="w-full">
              <thead>
                <tr className="bg-black dark:bg-zinc-800 text-white">
                  <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-sm">
                    Eigenschap
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-sm text-center">
                    ChatGPT / Gemini alleen
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-sm text-center text-[#d1b411]">
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
                    <td className="px-6 py-4 font-bold text-black dark:text-white text-base md:text-lg">
                      {label}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {single === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : single === false ? (
                        <span className="text-red-400 font-black text-xl">✕</span>
                      ) : (
                        <span className="text-sm text-black/40 font-bold">
                          {single}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fainl ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-red-400 font-black text-xl">✕</span>
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
              <div className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
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
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#d1b411] text-black text-xs font-black uppercase tracking-widest rounded-full whitespace-nowrap">
              Abonnement
            </div>
            <div className="text-base font-black uppercase tracking-tight mb-0.5">
              {PRICING.SUBSCRIPTIONS[0].name}
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
              {PRICING.SUBSCRIPTIONS[0].creditsPerMonth} credits/mo
            </div>
            <div className="text-lg font-black">€{PRICING.SUBSCRIPTIONS[0].price}</div>
            <div className="text-xs font-black text-black/30 dark:text-white/30 mt-0.5">
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
            <Star key={i} className="w-5 h-5 fill-[#d1b411] text-[#d1b411]" />
          ))}
          <span className="ml-2 text-sm md:text-base font-black text-black dark:text-white uppercase tracking-widest">
            4.8 / 5 — 247 gebruikers
          </span>
        </div>

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
          className="inline-flex items-center gap-3 px-12 py-6 bg-black text-white font-black text-base uppercase tracking-[0.2em] rounded-xl hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] active:scale-95 transition-all shadow-xl"
        >
          Start nu gratis
          <ArrowRight className="w-6 h-6" />
        </button>

        <p className="mt-6 text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/50 dark:text-white/30">
          Geen creditcard nodig — 2 volledige sessies direct gratis.
        </p>
      </section>
    </>
  );
};
