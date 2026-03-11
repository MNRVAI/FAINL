import { CouncilMember, CouncilResponse, PeerReview, ModelProvider, AppConfig, DebateMessage } from "../types";
import { SYSTEM_PROMPTS } from "../constants";

// Supabase project URL — safe to expose (anon key is public)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://bbsqosivxfcpkgehfwmm.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
const PROXY_URL = `${SUPABASE_URL}/functions/v1/ai-proxy`;

// Providers handled server-side via the Edge Function — no API keys needed in the browser
const PROXIED_PROVIDERS = new Set<ModelProvider>([
  ModelProvider.GOOGLE,
  ModelProvider.ANTHROPIC,
  ModelProvider.OPENAI,
  ModelProvider.GROQ,
  ModelProvider.DEEPSEEK,
  ModelProvider.MISTRAL,
  ModelProvider.OPENROUTER,
  ModelProvider.NEMOTRON,
  ModelProvider.GLM,
]);

const PROVIDER_STRING: Partial<Record<ModelProvider, string>> = {
  [ModelProvider.GOOGLE]:    'google',
  [ModelProvider.ANTHROPIC]: 'anthropic',
  [ModelProvider.OPENAI]:    'openai',
  [ModelProvider.GROQ]:      'groq',
  [ModelProvider.DEEPSEEK]:  'deepseek',
  [ModelProvider.MISTRAL]:   'mistral',
  [ModelProvider.OPENROUTER]:'openrouter',
  [ModelProvider.NEMOTRON]:  'nemotron',
  [ModelProvider.GLM]:       'glm',
};

export class UnifiedCouncilService {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  // Check if a provider is usable
  public isProviderReady(provider: ModelProvider): boolean {
    if (PROXIED_PROVIDERS.has(provider)) return true;
    if (provider === ModelProvider.OLLAMA) return true;
    if (provider === ModelProvider.CUSTOM) return !!(this.config.customKey);
    return false;
  }

  // Verify a user-supplied key for local/custom providers (proxied providers don't need this)
  public async verifyProviderKey(provider: ModelProvider, key: string): Promise<boolean> {
    if (!key) return false;
    if (PROXIED_PROVIDERS.has(provider)) return true; // server handles it
    try {
      if (provider === ModelProvider.OLLAMA) {
        const baseUrl = 'http://localhost:11434/v1';
        const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ollama` } });
        return res.status === 200;
      }
      // Generic OpenAI-compatible check for custom
      const baseUrl = this.config.customBaseUrl || 'http://localhost:1234/v1';
      const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  public getReadyMembers(members: CouncilMember[]): CouncilMember[] {
    return members.filter(m => this.isProviderReady(m.provider));
  }

  // ─── Proxy calls ────────────────────────────────────────────────────────────

  private async callProxy(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    const provider = PROVIDER_STRING[member.provider];
    if (!provider) throw new Error(`Provider ${member.provider} not supported by proxy`);

    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ provider, modelId: member.modelId, prompt, systemInstruction, stream: false }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(data.error || `Proxy error ${res.status}`);
    }
    const data = await res.json();
    return data.content || '';
  }

  private async callProxyStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const provider = PROVIDER_STRING[member.provider];
    if (!provider) throw new Error(`Provider ${member.provider} not supported by proxy`);

    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ provider, modelId: member.modelId, prompt, systemInstruction, stream: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(data.error || `Proxy error ${res.status}`);
    }
    if (!res.body) throw new Error('No response body from proxy');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          const text = parsed.content || '';
          if (text) { fullText += text; onChunk?.(text); }
        } catch { /* partial JSON */ }
      }
    }
    return fullText;
  }

  // ─── Local/custom provider calls (Ollama, Custom) ───────────────────────────

  private async callLocal(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    let apiKey = '';
    let baseUrl = '';
    if (member.provider === ModelProvider.OLLAMA) {
      apiKey = 'ollama';
      baseUrl = member.baseUrl || 'http://localhost:11434/v1';
    } else {
      apiKey = this.config.customKey || '';
      baseUrl = member.baseUrl || (this.config as any).customBaseUrl || 'http://localhost:1234/v1';
    }

    const messages: any[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7 }),
    });
    if (!res.ok) throw new Error(`Local API Error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private async callLocalStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    let apiKey = '';
    let baseUrl = '';
    if (member.provider === ModelProvider.OLLAMA) {
      apiKey = 'ollama';
      baseUrl = member.baseUrl || 'http://localhost:11434/v1';
    } else {
      apiKey = this.config.customKey || '';
      baseUrl = member.baseUrl || (this.config as any).customBaseUrl || 'http://localhost:1234/v1';
    }

    const messages: any[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: member.modelId, messages, temperature: 0.7, stream: true }),
    });
    if (!res.ok) throw new Error(`Local API Error ${res.status}`);
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          const text = parsed.choices?.[0]?.delta?.content || '';
          if (text) { fullText += text; onChunk?.(text); }
        } catch { /* partial JSON */ }
      }
    }
    return fullText;
  }

  // ─── Internal routing ────────────────────────────────────────────────────────

  private async generate(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      return `[Skipped] ${member.name}: Provider not configured.`;
    }
    try {
      if (PROXIED_PROVIDERS.has(member.provider)) {
        return await this.callProxy(member, prompt, systemInstruction);
      }
      return await this.callLocal(member, prompt, systemInstruction);
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = error.message || 'Unknown error';
      if (msg.includes('401') || msg.toLowerCase().includes('invalid api key')) {
        return `[Unauthorized] ${member.name}: Invalid or missing API key.`;
      }
      return `[Error] ${member.name}: ${msg}`;
    }
  }

  private async generateStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.isProviderReady(member.provider)) {
      const msg = `[Skipped] ${member.name}: Provider not configured.`;
      onChunk?.(msg);
      return msg;
    }
    try {
      if (PROXIED_PROVIDERS.has(member.provider)) {
        return await this.callProxyStream(member, prompt, systemInstruction, onChunk);
      }
      return await this.callLocalStream(member, prompt, systemInstruction, onChunk);
    } catch (error: any) {
      console.error(`Error with ${member.name}:`, error);
      const msg = `[Error] ${member.name}: ${error.message || 'Unknown error'}`;
      onChunk?.(msg);
      return msg;
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  async getCouncilResponses(query: string, members: CouncilMember[]): Promise<CouncilResponse[]> {
    const promises = members.map(async (member) => ({
      memberId: member.id,
      content: await this.generate(member, query, member.systemPrompt || SYSTEM_PROMPTS.COUNCIL_MEMBER(query, member.description)),
      timestamp: Date.now()
    }));
    return Promise.all(promises);
  }

  async getPeerReviews(query: string, members: CouncilMember[], responses: CouncilResponse[]): Promise<PeerReview[]> {
    const activeResponses = responses.filter(r => !r.content.startsWith("[Skipped]") && !r.content.startsWith("[Unauthorized]"));
    const reviewPromises: Promise<PeerReview | null>[] = [];

    members.forEach(reviewer => {
      activeResponses.forEach(target => {
        if (target.memberId === reviewer.id) return;
        reviewPromises.push((async () => {
          const critique = await this.generate(
            reviewer,
            SYSTEM_PROMPTS.PEER_REVIEWER(query, target.content, members.find(m => m.id === target.memberId)?.name || "Peer"),
            "Analyze logical consistency."
          );
          if (critique.startsWith("[Skipped]") || critique.startsWith("[Unauthorized]")) return null;
          const scoreMatch = critique.match(/Score:\s*(\d+)/i);
          return { reviewerId: reviewer.id, targetId: target.memberId, content: critique, score: scoreMatch ? parseInt(scoreMatch[1], 10) : 5 };
        })());
      });
    });

    const results = await Promise.all(reviewPromises);
    return results.filter((r): r is PeerReview => r !== null);
  }

  async generateDebateResponse(
    query: string,
    member: CouncilMember,
    councilResponses: CouncilResponse[],
    debateMessages: DebateMessage[],
    members: CouncilMember[]
  ): Promise<string> {
    const ownStance = councilResponses.find(r => r.memberId === member.id);

    let context = `DEBATE TOPIC: "${query}"\n\n`;

    if (ownStance) {
      context += `=== YOUR ESTABLISHED POSITION (defend and evolve this) ===\n`;
      context += `${ownStance.content.substring(0, 400).replace(/\n/g, ' ')}\n\n`;
    }

    context += `=== OTHER NODES' POSITIONS ===\n`;
    councilResponses.filter(r => r.memberId !== member.id).forEach(r => {
      const m = members.find(x => x.id === r.memberId);
      if (m) context += `[${m.name}]: ${r.content.substring(0, 280).replace(/\n/g, ' ')}...\n`;
    });

    const recentMessages = debateMessages.slice(-10);
    const lastMsg = recentMessages.length > 0 ? recentMessages[recentMessages.length - 1] : null;
    const userSpokeRecently = lastMsg?.memberId === 'user';
    const lastSpeakerName = lastMsg
      ? (lastMsg.memberId === 'user' ? 'the USER' : (members.find(x => x.id === lastMsg.memberId)?.name ?? 'someone'))
      : null;

    if (recentMessages.length > 0) {
      context += `\n=== LIVE DEBATE TRANSCRIPT (last ${recentMessages.length} turns) ===\n`;
      recentMessages.forEach(m => {
        const isSelf = m.memberId === member.id;
        const authorName = m.memberId === 'user' ? 'USER' : (members.find(x => x.id === m.memberId)?.name ?? 'Unknown');
        const snippet = m.content.substring(0, 300).replace(/\n/g, ' ');
        context += `${isSelf ? '[YOU]' : `[${authorName}]`}: ${snippet}\n`;
      });
    }

    const totalTurns = debateMessages.filter(m => m.memberId !== 'user').length;
    const stage = totalTurns < 3 ? 'opening' : totalTurns < 10 ? 'clash' : 'closing';

    const userMessages = debateMessages.filter(m => m.memberId === 'user');
    const avgUserWordCount = userMessages.length > 0
      ? Math.round(userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0) / userMessages.length)
      : 0;
    const userLevel = avgUserWordCount > 40 ? 'expert' : avgUserWordCount > 15 ? 'informed' : 'general';

    const otherNames = members.filter(m => m.id !== member.id).map(m => m.name);

    const systemPrompt = `You are ${member.name}. ${member.systemPrompt || member.description || ''}

This is a LIVE high-stakes debate. Real people are watching and listening. Every word counts.

=== YOUR DEBATE IDENTITY ===
You have a clear position (see above). Defend it. You may concede minor points strategically, but never abandon your core stance without a compelling reason from the debate.
The other debaters you can address by name: ${otherNames.join(', ')}.

=== HOW TO SPEAK — MANDATORY RULES ===

1. OPEN with a spoken-word marker that signals your move. Pick one that fits:
   - Challenging: "No — and here's exactly why:", "Hold on, [name] —", "That's precisely wrong:", "Wait, that logic falls apart immediately:"
   - Countering: "Actually, [name] just proved my point:", "Let me push back on that:", "I hear you, but you're missing something critical:"
   - Questioning: "[name], you haven't answered this:", "But what happens when...?", "Can anyone here explain why...?"
   - Conceding to flip: "Fair — I'll grant you that. But it actually proves the opposite:"
   - Bold assertion: "Here's what nobody's said yet:", "Look at what's actually happening:", "The real issue isn't X — it's Y:"

2. ADDRESS people BY NAME when responding to them. If ${lastSpeakerName} just spoke, open by naming them.

3. LENGTH: 2–4 sentences. No padding. No "in summary". Every sentence must punch.

4. DEBATE MOVES — vary these across turns:
   - DIRECT COUNTER: Quote their core claim, then dismantle it in one sharp move
   - ANALOGY WEAPON: Drop a vivid real-world parallel that reframes everything
   - CONCESSION + FLIP: Grant their minor point, then show it supports YOUR argument
   - RHETORICAL BOMB: Ask the question they cannot ignore — make them sweat
   - EVIDENCE SPIKE: Anchor with a concrete fact, number, or example they can't wave away

5. DEBATE STAGE — this is the ${stage} phase:
${stage === 'opening' ? '   → Establish your ground. State your core position boldly. Make the first strike count.' : ''}${stage === 'clash' ? '   → The debate is heated. Find the weakest point in the last argument and attack it directly. Be aggressive but precise.' : ''}${stage === 'closing' ? '   → Deliver your most memorable argument. Cut through the noise. Land it with conviction — this is your final word.' : ''}

6. VOCABULARY — user sophistication detected: ${userLevel}
   - general → Plain language. Concrete examples. No jargon. Like talking to a sharp friend.
   - informed → Technical terms OK, brief explanation inline.
   - expert → Full precision. No hand-holding. Dense and sharp.

7. READ the topic's emotional weight:
   - Serious/sensitive → Measured, precise, empathetic. Conviction without cruelty.
   - Intellectual/playful → Sharp wit, confident energy, a little theatrical.

8. NEVER use markdown, headers, bullets, bold, or italic. Speak in plain, powerful spoken sentences.
9. NEVER start with your own name followed by a colon.
10. NEVER just summarize what was said — always advance, attack, or reframe.
${userSpokeRecently ? `\n🔴 CRITICAL: The USER just spoke. Your FIRST sentence MUST directly address them. Quote or paraphrase what they said and respond to it head-on. This is their debate too.` : ''}`.trim();

    return this.generate(member, context, systemPrompt);
  }

  async synthesize(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[],
    chairman: CouncilMember
  ): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generate(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt);
  }

  async synthesizeStream(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[],
    chairman: CouncilMember,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const context = this.buildContext(query, responses, reviews, debateMessages, members);
    return this.generateStream(chairman, SYSTEM_PROMPTS.CHAIRMAN(query, context), chairman.systemPrompt, onChunk);
  }

  private buildContext(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[]
  ): string {
    let context = "--- COUNCIL FINDINGS ---\n";
    responses.filter(r => !r.content.startsWith("[")).forEach(r => {
      context += `\n[${members.find(x => x.id === r.memberId)?.name}]: ${r.content}\n`;
    });

    if (reviews && reviews.length > 0) {
      context += "\n--- PEER REVIEWS ---\n";
      reviews.forEach(r => {
        context += `\n[${members.find(m => m.id === r.reviewerId)?.name} reviewing ${members.find(m => m.id === r.targetId)?.name}]: ${r.content}\n`;
      });
    }

    if (debateMessages && debateMessages.length > 0) {
      context += "\n--- DEBATE TRANSCRIPT ---\n";
      debateMessages.forEach(m => {
        const authorName = m.memberId === 'user' ? 'User' : members.find(x => x.id === m.memberId)?.name || 'Unknown';
        context += `\n[${authorName}]: ${m.content}\n`;
      });
    }

    return context;
  }
}
