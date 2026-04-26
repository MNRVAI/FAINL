
import { CouncilMember, ModelProvider } from "./types";

// --- ASSET MANAGEMENT ---
export const UI_ASSETS = {
  avatars: {
    gemini:   "🧠",
    flash:    "⚡",
    gpt:      "🤖",
    claude:   "🌊",
    llama:    "🦙",
    mistral:  "💨",
    dolphin:  "🐬",
    deepseek: "🔍",
    chairman: "⚖️",
    grok:     "🌀"
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

export const TOKEN_PACKAGES = [
  { tokens: 1,  price: '1,99',  stripeUrl: 'https://buy.stripe.com/5kQ00c7Ge5RN4tjdau7Re0i' },
  { tokens: 3,  price: '5,49',  stripeUrl: 'https://buy.stripe.com/5kQ8wI9Om1Bx4tjdau7Re0j' },
  { tokens: 5,  price: '8,49',  stripeUrl: 'https://buy.stripe.com/7sY28kf8Gcgb5xn4DY7Re0k' },
  { tokens: 10, price: '15,99', stripeUrl: 'https://buy.stripe.com/eVq9AMbWubc79ND1rM7Re0l' },
  { tokens: 15, price: '22,49', stripeUrl: 'https://buy.stripe.com/14AfZa6Ca5RN6Br5I27Re0m' },
];

export const USAGE_LIMITS = {
  FREE_TURNS: 1,
  CREDITS_PER_TURN: 1
};
