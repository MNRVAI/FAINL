
import { CouncilMember, ModelProvider } from "./types";

// --- ASSET MANAGEMENT ---
export const UI_ASSETS = {
  avatars: {
    gemini: "https://api.dicebear.com/7.x/bottts/svg?seed=gemini",
    flash: "https://api.dicebear.com/7.x/bottts/svg?seed=flash",
    gpt: "https://api.dicebear.com/7.x/bottts/svg?seed=gpt4",
    claude: "https://api.dicebear.com/7.x/bottts/svg?seed=claude",
    llama: "https://api.dicebear.com/7.x/bottts/svg?seed=llama",
    mistral: "https://api.dicebear.com/7.x/bottts/svg?seed=mistral",
    dolphin: "https://api.dicebear.com/7.x/bottts/svg?seed=dolphin",
    deepseek: "https://api.dicebear.com/7.x/bottts/svg?seed=deepseek",
    chairman: "https://api.dicebear.com/7.x/bottts/svg?seed=chairman",
    grok: "https://api.dicebear.com/7.x/bottts/svg?seed=grok"
  },
  placeholders: {
    user: "User",
    system: "System"
  }
};

// --- DEFAULT CONFIGURATION (SECURE OUT-OF-THE-BOX READY) ---
// These three agents use the standard Gemini API key (Free Tier enabled)
export const DEFAULT_COUNCIL: CouncilMember[] = [
  {
    id: "node-alpha-fact",
    name: "Analyst Alpha",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-3-flash-preview",
    avatar: UI_ASSETS.avatars.flash,
    color: "bg-zinc-800",
    description: "Specialized in factual verification and logical auditing.",
    systemPrompt: "You are Analyst Alpha. Your role is strictly factual. Identify any empirical errors or logical fallacies in the user's directive. Be precise and brief."
  },
  {
    id: "node-beta-logic",
    name: "Logic Specialist",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-3-pro-preview",
    avatar: UI_ASSETS.avatars.gemini,
    color: "bg-blue-900",
    description: "Focused on structural reasoning and step-by-step analysis.",
    systemPrompt: "You are the Logic Specialist. Deconstruct the user directive and propose a structurally sound methodology. Focus on reasoning depth."
  },
  {
    id: "node-gamma-vision",
    name: "Strategic Visionary",
    role: 'MEMBER',
    provider: ModelProvider.GOOGLE,
    modelId: "gemini-3-pro-preview",
    avatar: UI_ASSETS.avatars.chairman,
    color: "bg-indigo-900",
    description: "Explores creative synthesis and alternative perspectives.",
    systemPrompt: "You are the Strategic Visionary. Look for implications, edge cases, and creative opportunities within the directive. Offer unconventional but high-impact insights."
  }
];

export const DEFAULT_CHAIRMAN: CouncilMember = {
  id: "chairman-fainl-hq",
  name: "Protocol Chairman",
  role: 'CHAIRMAN',
  provider: ModelProvider.GOOGLE,
  modelId: "gemini-3-pro-preview",
  avatar: UI_ASSETS.avatars.chairman,
  color: "bg-black",
  description: "The primary authority for synthesizing autonomous consensus.",
  systemPrompt: "You are the Protocol Chairman. Your objective is to synthesize the council's disparate findings into a single, cohesive, and authoritative verdict. Filter noise and prioritize consensus points."
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
    description: "Adds external model providers to the council for broader logical diversity. Requires additional keys.",
    members: [
      ...DEFAULT_COUNCIL,
      {
        id: 'ext_1', name: 'Critic (Llama)', role: 'MEMBER', provider: ModelProvider.GROQ,
        modelId: 'llama3-70b-8192', avatar: UI_ASSETS.avatars.llama, color: 'bg-orange-600',
        description: 'Hard-line critical review node.', systemPrompt: 'Be extremely critical.'
      },
      {
        id: 'ext_2', name: 'Creative (Claude)', role: 'MEMBER', provider: ModelProvider.ANTHROPIC,
        modelId: 'claude-3-5-sonnet-20240620', avatar: UI_ASSETS.avatars.claude, color: 'bg-amber-700',
        description: 'Nuanced semantic analysis.', systemPrompt: 'Focus on semantic nuance.'
      }
    ],
    chairman: DEFAULT_CHAIRMAN
  }
];

export const PRICING = {
  TURNS: [
    { count: 10, price: 19.99, label: "Starter Pack", stripeUrl: "https://buy.stripe.com/8x228k6Ca1Bxf7X1rM7Re04" },
    { count: 30, price: 49.99, label: "Pro Pack", stripeUrl: "https://buy.stripe.com/28E3cogcKfsne3T1rM7Re06" },
    { count: 100, price: 149.99, label: "Expert Pack", stripeUrl: "https://buy.stripe.com/6oU7sE5y6a83f7XfiC7Re07" },
  ],
};

export const USAGE_LIMITS = {
  FREE_TURNS: 1,
  CREDITS_PER_TURN: 1
};
