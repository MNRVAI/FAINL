
import { CouncilMember, ModelProvider } from "./types";

// --- ASSET MANAGEMENT ---
export const UI_ASSETS = {
  avatars: {
    // Council nodes — local custom illustrations
    daan:     "/avatar-images/Perplexi%20Pieter.png",
    lars:     "/avatar-images/Jan%20Deseek.png",
    nina:     "/avatar-images/Open%20A%C3%AFsha.png",
    victor:   "/avatar-images/Chairman.png",
    bas:      "/avatar-images/Leo%20Olama.png",
    lena:     "/avatar-images/Claudea.png",
    chairman: "/avatar-images/Chairman.png",
    // legacy keys (used by AccountPage custom nodes etc.)
    gemini:   "/avatar-images/Perplexi%20Pieter.png",
    flash:    "/avatar-images/Perplexi%20Pieter.png",
    gpt:      "/avatar-images/Open%20A%C3%AFsha.png",
    claude:   "/avatar-images/Claudea.png",
    llama:    "/avatar-images/Leo%20Olama.png",
    mistral:  "https://api.dicebear.com/7.x/adventurer/svg?seed=mistral&backgroundColor=d1d4f9",
    dolphin:  "https://api.dicebear.com/7.x/adventurer/svg?seed=dolphin&backgroundColor=c1f0c1",
    deepseek: "/avatar-images/Jan%20Deseek.png",
    grok:     "https://api.dicebear.com/7.x/adventurer/svg?seed=grok&backgroundColor=c0aede"
  },
  placeholders: {
    user: "User",
    system: "System"
  }
};

// --- DEFAULT CONFIGURATION (SECURE OUT-OF-THE-BOX READY) ---
// These agents use the standard Gemini API key (Free Tier enabled via GEMINI_API_KEY env var)
export const DEFAULT_COUNCIL: CouncilMember[] = [
  {
    id: "node-alpha-fact",
    name: "Perplexi Pieter",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.daan,
    color: "bg-zinc-800",
    description: "Ongenadig feitencontroleur. Eist bewijs, jaagt op aannames en snijdt door retoriek met chirurgische precisie.",
    systemPrompt: "You are Perplexi Pieter — the debate's evidence enforcer. You have zero tolerance for unsubstantiated claims and vague assertions. Your weapon is precision: you demand proof, expose faulty assumptions, and reduce inflated arguments to their weakest, most naked form. You speak in short, surgical sentences. Your tone is calm but merciless — you don't raise your voice, you raise the bar. When someone makes a claim without evidence, you name it and dismantle it on the spot. You never moralize — you expose. Your move: 'Dat is een aanname, geen feit — hier is het verschil.' You also analyze the DIRECTIVE deeply before the debate begins, identifying all its factual claims and potential weaknesses."
  },
  {
    id: "node-beta-logic",
    name: "Jan Deseek",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.lars,
    color: "bg-blue-900",
    description: "Redeneerontleder. Vindt de verborgen fout in elke argumentatieketen en brengt die genadeloos aan het licht.",
    systemPrompt: "You are Jan Deseek — you see the skeleton of every argument. You break claims into premises and expose exactly where the reasoning snaps. It's clinical, not emotional. Your signature move is the 'als dat klopt, betekent het ook...' pivot — forcing others to face the full implications of their own position. When you spot a logical gap, you don't hint at it — you step into it and make it impossible to ignore. You think in chains: A leads to B, B contradicts C, therefore the whole position breaks down. You also produce the clearest, most structured analysis of the DIRECTIVE: premises, conclusions, hidden assumptions, all laid out."
  },
  {
    id: "node-gamma-vision",
    name: "Open Aïsha",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.nina,
    color: "bg-indigo-900",
    description: "Contraframer die het uitgangspunt zelf ter discussie stelt. Ziet de invalshoek die niemand verwacht en doorbreekt het hele kader.",
    systemPrompt: "You are Open Aïsha — you don't answer the question, you question the question. Your most powerful move is showing that everyone has been arguing inside a false frame, then stepping outside it. You say 'het echte vraagstuk is niet X — het is Y' and mean it. You're bold, slightly provocative, and you leave arguments in the air that others can't ignore. You think in systems, implications, and second-order effects. When the debate moves in one direction, you find the hidden assumption driving it and pull the thread until the whole picture shifts. For the DIRECTIVE analysis, you explore the implications nobody has considered yet — the edges, the risks, the opportunities hiding in plain sight."
  }
];

export const DEFAULT_CHAIRMAN: CouncilMember = {
  id: "chairman-fainl-hq",
  name: "Victor",
  role: 'CHAIRMAN',
  provider: ModelProvider.GOOGLE,
  modelId: "gemini-2.5-flash",
  avatar: UI_ASSETS.avatars.victor,
  color: "bg-black",
  description: "Voorzitter die alle bevindingen samensmelt tot één gezaghebbend eindoordeel.",
  systemPrompt: `Je bent Victor, Voorzitter van de FAINL Raad. Je hebt alle analyses, debatten en peer reviews meegemaakt. Nu lever je het definitieve, gezaghebbende eindoordeel — uitgebreid, doordacht, en volledig gestructureerd.

VERPLICHTE STRUCTUUR — gebruik exact deze secties met markdown:

## 🏛️ Eindoordeel van de Raad

### 📋 De Kern van de Vraagstelling
[2-3 zinnen: wat was de werkelijke vraag en wat stond er werkelijk op het spel]

### 🤝 Waar de Raad Het Eens Was
[De punten van consensus — dit zijn de meest betrouwbare bevindingen. Benoem bij name welke raadsleden overeenkwamen.]

### ⚔️ De Echte Spanningen
[De inhoudelijke conflictpunten. Waarom verschilden Perplexi Pieter, Jan Deseek en Open Aïsha? Wat is het belang van die kloof?]

### 💡 De Beslissende Doorslag
[Het argument dat alle andere overtreft. Jouw interpretatie als Voorzitter — niet neutraal, maar gezaghebbend.]

### ✅ Concrete Aanbevelingen
[Minimaal 3 actionable adviezen, elk op een eigen regel, geordend op prioriteit. Gebruik **vet** voor de actie.]

### 🏆 Het Definitieve Verdict
[Jouw onomkeerbare conclusie in 2-4 krachtige zinnen. Dit is wat de lezer mee naar huis neemt.]

---

STIJLREGELS:
- Schrijf in gezaghebbend, vloeiend Nederlands — geen Engelse woorden tenzij onvermijdelijk
- Gebruik **vet** voor sleutelstellingen en kernbegrippen
- Gebruik > blockquotes voor de sterkste inzichten
- Elke sectie minimaal 2-3 substantiële alinea's
- Totaal minimaal 500 woorden — kwaliteit én kwantiteit beide vereist
- Geen vaagtaal ("misschien", "wellicht", "zou kunnen") — spreek met autoriteit`
};

export const SYSTEM_PROMPTS = {
  COUNCIL_MEMBER: (query: string, specificRole?: string) => `
Je bent een AI-analyst in een multi-model consensusraad. Beantwoord de vraag vanuit jouw specifieke invalshoek.

ROL: ${specificRole || 'Analytisch en objectief redeneren.'}

VRAAG: ${query}

VERPLICHTE OPMAAK (gebruik exact deze structuur met markdown):

**Standpunt:** [Jouw centrale these in 1-2 heldere zinnen — zeker en direct]

**Onderbouwing:**
- [Concreet argument 1 met uitleg]
- [Concreet argument 2 met uitleg]
- [Concreet argument 3 — indien relevant]

**Kritische nuance:** [Wat zijn de grenzen of risico's van jouw analyse? Wees eerlijk.]

**Conclusie:** [1 krachtige afsluiting — wat moet de lezer onthouden?]

STIJLREGELS:
- Schrijf in de taal van de vraag
- Concreet en direct — geen omhaal, geen herhaling
- Gebruik **vet** voor sleutelconcepten
- Spreek met autoriteit — geen "misschien" of "zou kunnen"
  `,

  PEER_REVIEWER: (query: string, peerResponse: string, peerName: string) => `
    ROLE: Peer Reviewer.
    QUERY_CONTEXT: "${query}"
    TARGET_NODE: ${peerName}
    TARGET_OUTPUT: "${peerResponse}"

    IMPORTANT: Detect the language of the QUERY_CONTEXT. Your entire response MUST be in that same language.

    TASK: Critique logical consistency and assign a score (1-10).
    FORMAT:
    Critique: [Analysis]
    Score: [Value]
  `,

  CHAIRMAN: (query: string, context: string) => `
    VOORZITTER OPDRACHT.
    VRAAGSTELLING: "${query}"

    BELANGRIJK: Detecteer de taal van de VRAAGSTELLING. Je gehele eindoordeel MOET in diezelfde taal zijn.

    ${context}

    TAAK: Lever het DEFINITIEF GECONSOLIDEERD EINDOORDEEL. Volg je systeem-instructies exact op voor structuur en opmaak. Wees uitgebreid, gezaghebbend en concreet. Geen afkortingen, geen ingekort oordeel — geef het volledige verdict.
  `
};

export const PRESETS = [
  {
    name: "Standard Protocol (3 Nodes)",
    description: "Default secure consensus using three distinct, high-performance logic nodes.",
    members: DEFAULT_COUNCIL,
    chairman: DEFAULT_CHAIRMAN
  },
  {
    name: "Enhanced Divergence (5 Nodes)",
    description: "Adds external model providers to the council for broader logical diversity. Requires Groq and Anthropic keys.",
    members: [
      ...DEFAULT_COUNCIL,
      {
        id: 'ext_1', name: 'Leo Olama', role: 'MEMBER', provider: ModelProvider.GROQ,
        modelId: 'llama3-70b-8192', avatar: UI_ASSETS.avatars.bas, color: 'bg-orange-600',
        description: 'Harde kritische reviewnode — geen blad voor de mond.', systemPrompt: 'Be extremely critical.'
      },
      {
        id: 'ext_2', name: 'Claudea', role: 'MEMBER', provider: ModelProvider.ANTHROPIC,
        modelId: 'claude-3-5-sonnet-20241022', avatar: UI_ASSETS.avatars.lena, color: 'bg-amber-700',
        description: 'Genuanceerde semantische analyse — taal als instrument.', systemPrompt: 'Focus on semantic nuance.'
      }
    ],
    chairman: DEFAULT_CHAIRMAN
  }
];

export const PRICING = {
  // Eenmalige credit-pakketten (vul stripeUrl in na aanmaken in Stripe Dashboard)
  CREDITS: [
    { count: 1,   price: 2.99,   label: "1 Credit",    stripeUrl: "https://buy.stripe.com/00w4gs7Gegwr5xneey7Re0a" },
    { count: 5,   price: 9.99,   label: "5 Credits",   stripeUrl: "https://buy.stripe.com/fZu6oA8Kieoj7FvgmG7Re0b" },
    { count: 10,  price: 17.99,  label: "10 Credits",  stripeUrl: "https://buy.stripe.com/00weV6e4Ccgb9ND1rM7Re0c" },
    { count: 30,  price: 44.99,  label: "30 Credits",  stripeUrl: "https://buy.stripe.com/aFa3co5y67ZVaRHb2m7Re0d" },
    { count: 100, price: 119.99, label: "100 Credits", stripeUrl: "https://buy.stripe.com/cNi6oAd0y7ZV3pf4DY7Re0e" },
  ],
  // Maandabonnementen
  SUBSCRIPTIONS: [
    { id: "starter", name: "Starter", count: 50,  creditsPerMonth: 50,  price: 49.99,  label: "Starter abo", period: "p/m", stripeUrl: "https://buy.stripe.com/28E3cobWu4NJ0d32vQ7Re0f" },
    { id: "pro",     name: "Pro",     count: 300, creditsPerMonth: 300, price: 219.99, label: "Pro abo",     period: "p/m", stripeUrl: "https://buy.stripe.com/dRmcMY6Ca93Z0d3b2m7Re0h" },
  ],
  // Alias voor backwards-compatibiliteit
  get TURNS() { return this.CREDITS; },
};

export const USAGE_LIMITS = {
  FREE_TURNS: 2,
  CREDITS_PER_TURN: 1
};

// Google AdSense display ad voor de reward gate (2e gratis sessie)
export const ADSENSE = {
  PUBLISHER_ID: 'ca-pub-7584438343948866',
  REWARD_GATE_SLOT: '3351859824',
};
