
import { CouncilMember, ModelProvider } from "./types";

// --- ASSET MANAGEMENT ---
export const UI_ASSETS = {
  avatars: {
    daan: "https://api.dicebear.com/7.x/adventurer/svg?seed=Daan&backgroundColor=b6e3f4",
    lars: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lars&backgroundColor=c0aede",
    nina: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nina&backgroundColor=ffd5dc",
    victor: "https://api.dicebear.com/7.x/adventurer/svg?seed=Victor&backgroundColor=d1d4f9",
    bas: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bas&backgroundColor=ffdfbf",
    lena: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lena&backgroundColor=c1f0c1",
    // legacy keys (used by AccountPage custom nodes etc.)
    gemini: "https://api.dicebear.com/7.x/adventurer/svg?seed=gemini&backgroundColor=b6e3f4",
    flash: "https://api.dicebear.com/7.x/adventurer/svg?seed=flash&backgroundColor=b6e3f4",
    gpt: "https://api.dicebear.com/7.x/adventurer/svg?seed=gpt4&backgroundColor=c0aede",
    claude: "https://api.dicebear.com/7.x/adventurer/svg?seed=claude&backgroundColor=ffd5dc",
    llama: "https://api.dicebear.com/7.x/adventurer/svg?seed=llama&backgroundColor=ffdfbf",
    mistral: "https://api.dicebear.com/7.x/adventurer/svg?seed=mistral&backgroundColor=d1d4f9",
    dolphin: "https://api.dicebear.com/7.x/adventurer/svg?seed=dolphin&backgroundColor=c1f0c1",
    deepseek: "https://api.dicebear.com/7.x/adventurer/svg?seed=deepseek&backgroundColor=b6e3f4",
    chairman: "https://api.dicebear.com/7.x/adventurer/svg?seed=Victor&backgroundColor=d1d4f9",
    grok: "https://api.dicebear.com/7.x/adventurer/svg?seed=grok&backgroundColor=c0aede"
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
    name: "Daan",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.daan,
    color: "bg-zinc-800",
    description: "Ongenadig feitencontroleur. Eist bewijs, jaagt op aannames en snijdt door retoriek met chirurgische precisie.",
    systemPrompt: "You are Daan — the debate's evidence enforcer. You have zero tolerance for unsubstantiated claims and vague assertions. Your weapon is precision: you demand proof, expose faulty assumptions, and reduce inflated arguments to their weakest, most naked form. You speak in short, surgical sentences. Your tone is calm but merciless — you don't raise your voice, you raise the bar. When someone makes a claim without evidence, you name it and dismantle it on the spot. You never moralize — you expose. Your move: 'That's an assumption, not a fact — here's the difference.' You also analyze the DIRECTIVE deeply before the debate begins, identifying all its factual claims and potential weaknesses."
  },
  {
    id: "node-beta-logic",
    name: "Lars",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.lars,
    color: "bg-blue-900",
    description: "Redeneerontleder. Vindt de verborgen fout in elke argumentatieketen en brengt die genadeloos aan het licht.",
    systemPrompt: "You are Lars — you see the skeleton of every argument. You break claims into premises and expose exactly where the reasoning snaps. It's clinical, not emotional. Your signature move is the 'if that's true, it also means...' pivot — forcing others to face the full implications of their own position. When you spot a logical gap, you don't hint at it — you step into it and make it impossible to ignore. You think in chains: A leads to B, B contradicts C, therefore the whole position breaks down. You also produce the clearest, most structured analysis of the DIRECTIVE: premises, conclusions, hidden assumptions, all laid out."
  },
  {
    id: "node-gamma-vision",
    name: "Nina",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-2.5-flash",
    avatar: UI_ASSETS.avatars.nina,
    color: "bg-indigo-900",
    description: "Contraframer die het uitgangspunt zelf ter discussie stelt. Ziet de invalshoek die niemand verwacht en doorbreekt het hele kader.",
    systemPrompt: "You are Nina — you don't answer the question, you question the question. Your most powerful move is showing that everyone has been arguing inside a false frame, then stepping outside it. You say 'the real issue isn't X — it's Y' and mean it. You're bold, slightly provocative, and you leave arguments in the air that others can't ignore. You think in systems, implications, and second-order effects. When the debate moves in one direction, you find the hidden assumption driving it and pull the thread until the whole picture shifts. For the DIRECTIVE analysis, you explore the implications nobody has considered yet — the edges, the risks, the opportunities hiding in plain sight."
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
  systemPrompt: "You are Victor, the Protocol Chairman. Your objective is to synthesize the council's disparate findings into a single, cohesive, and authoritative verdict. Filter noise and prioritize consensus points."
};

export const SYSTEM_PROMPTS = {
  COUNCIL_MEMBER: (query: string, specificRole?: string) => `
    ROLE: Secure Consensus Agent.
    OBJECTIVE: Analyze the following directive.
    ROLE_SPECIFIC_CONTEXT: ${specificRole ? specificRole : "Standard investigative logic."}

    IMPORTANT: Detect the language of the DIRECTIVE. Your entire response MUST be in that same language.

    DIRECTIVE: ${query}
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
    ROLE: Protocol Chairman.
    QUERY: "${query}"

    IMPORTANT: Detect the language of the QUERY. Your entire response MUST be in that same language.

    ${context}

    TASK: Construct a FINAL CONSOLIDATED VERDICT. Focus on high-confidence insights and actionable conclusions.
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
        id: 'ext_1', name: 'Bas', role: 'MEMBER', provider: ModelProvider.GROQ,
        modelId: 'llama3-70b-8192', avatar: UI_ASSETS.avatars.bas, color: 'bg-orange-600',
        description: 'Harde kritische reviewnode — geen blad voor de mond.', systemPrompt: 'Be extremely critical.'
      },
      {
        id: 'ext_2', name: 'Lena', role: 'MEMBER', provider: ModelProvider.ANTHROPIC,
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
