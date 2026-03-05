export enum ModelProvider {
  GOOGLE = "Google (Direct)",
  OPENAI = "OpenAI",
  ANTHROPIC = "Anthropic",
  GROQ = "Groq",
  DEEPSEEK = "DeepSeek",
  MISTRAL = "Mistral AI",
  OPENROUTER = "OpenRouter",
  OLLAMA = "Ollama (Local)",
  CUSTOM = "Custom (OpenAI Compatible)",
  MIMO = "MiMo-V2-Flash",
  DEVSTRAL = "Devstral 2 2512",
  KAT = "KAT-Coder-Pro V1",
  OLMO = "Olmo 3 32B Think",
  NEMOTRON = "Nemotron 3 Nano",
  GEMMA = "Gemma 3 12B",
  GLM = "GLM 4.5 Air",
}

export interface CouncilMember {
  id: string;
  name: string;
  role: "MEMBER" | "CHAIRMAN";
  provider: ModelProvider;
  modelId: string; // The API model string
  baseUrl?: string; // For custom endpoints (Groq, LocalAI)
  avatar: string;
  color: string; // Tailwind class
  description: string;
  systemPrompt?: string; // Custom instructions for this specific member
}

export interface PeerReview {
  reviewerId: string;
  targetId: string;
  content: string;
  score: number; // 1-10
}

export interface CouncilResponse {
  memberId: string;
  content: string;
  timestamp: number;
}

export interface DebateMessage {
  id: string;
  memberId: string;
  content: string;
  timestamp: number;
}

export enum WorkflowStage {
  IDLE = "IDLE",
  PROCESSING_COUNCIL = "PROCESSING_COUNCIL",
  DEBATE = 'DEBATE',
  PEER_REVIEW = "PEER_REVIEW",
  SYNTHESIZING = "SYNTHESIZING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export enum AppView {
  HOME = 'HOME',
  PRICING = 'PRICING',
  ACCOUNT = 'ACCOUNT',
  COOKBOOK = 'COOKBOOK',
  FAQ = 'FAQ',
  CONTACT = 'CONTACT',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface SessionState {
  id: string;
  stage: WorkflowStage;
  query: string;
  councilResponses: CouncilResponse[];
  debateMessages: DebateMessage[];
  reviews: PeerReview[];
  synthesis: string;
  error?: string;
  isArchived?: boolean;
}

export interface AppConfig {
  googleKey: string;
  openRouterKey: string;
  openaiKey: string;
  anthropicKey: string;
  deepseekKey: string;
  groqKey: string;
  mistralKey: string;
  customKey: string;
  // New Keys
  mimoKey: string;
  devstralKey: string;
  katKey: string;
  olmoKey: string;
  nemotronKey: string;
  gemmaKey: string;
  glmKey: string;
  activeCouncil: CouncilMember[];
  chairmanId: string;
  // Usage Tracking
  turnsUsed: number;
  creditsRemaining: number;
  isLifetime: boolean;
  totalTurnsAllowed: number;
}
