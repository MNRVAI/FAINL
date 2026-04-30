import { CouncilMember, CouncilResponse, PeerReview, AppConfig, DebateMessage } from "../types";
import { SYSTEM_PROMPTS } from "../constants";
import { supabase } from "./supabaseClient";

// ── Proxy URL ─────────────────────────────────────────────────────────
const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-proxy`;

// ── Low-level proxy call ──────────────────────────────────────────────
async function callProxy(
  prompt: string,
  systemInstruction?: string,
  modelId?: string
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error("Niet ingelogd. Log in om de raad te gebruiken.");

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, systemInstruction, modelId, mode: "generate" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? `Proxy fout: ${res.status}`);
  }

  const data = await res.json();
  return data.text ?? "";
}

// ── Streaming proxy call ──────────────────────────────────────────────
async function callProxyStream(
  prompt: string,
  systemInstruction?: string,
  modelId?: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error("Niet ingelogd.");

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, systemInstruction, modelId, mode: "stream" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? `Proxy fout: ${res.status}`);
  }

  if (!res.body) throw new Error("Geen response body ontvangen.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]" || !raw) continue;

      try {
        const parsed = JSON.parse(raw);
        // Gemini SSE format: candidates[0].content.parts[0].text
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (text) {
          fullText += text;
          onChunk?.(text);
        }
      } catch {
        // Partial chunk — skip
      }
    }
  }

  return fullText;
}

// ── Main service class ────────────────────────────────────────────────
export class UnifiedCouncilService {
  // Config behouden voor achterwaartse compatibiliteit — keys worden genegeerd
  constructor(_config: AppConfig) {}

  /** Altijd true — proxy beheert alle provider-toegang */
  public isProviderReady(_member?: CouncilMember): boolean {
    return true;
  }

  public getReadyMembers(members: CouncilMember[]): CouncilMember[] {
    return members; // Alle members zijn altijd beschikbaar via de proxy
  }

  private async generate(member: CouncilMember, prompt: string, systemInstruction?: string): Promise<string> {
    try {
      return await callProxy(prompt, systemInstruction, member.modelId);
    } catch (error: any) {
      console.error(`Fout bij ${member.name}:`, error);
      return `[Fout] ${member.name}: ${error.message ?? "Onbekende fout"}`;
    }
  }

  private async generateStream(
    member: CouncilMember,
    prompt: string,
    systemInstruction?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      return await callProxyStream(prompt, systemInstruction, member.modelId, onChunk);
    } catch (error: any) {
      console.error(`Fout bij ${member.name}:`, error);
      const msg = `[Fout] ${member.name}: ${error.message ?? "Onbekende fout"}`;
      onChunk?.(msg);
      return msg;
    }
  }

  // ── Public orchestration methods (API ongewijzigd t.o.v. vóór) ──────

  async getCouncilResponses(query: string, members: CouncilMember[]): Promise<CouncilResponse[]> {
    const promises = members.map(async (member) => ({
      memberId: member.id,
      content: await this.generate(
        member,
        query,
        member.systemPrompt || SYSTEM_PROMPTS.COUNCIL_MEMBER(query, member.description)
      ),
      timestamp: Date.now(),
    }));
    return Promise.all(promises);
  }

  async getPeerReviews(
    query: string,
    members: CouncilMember[],
    responses: CouncilResponse[]
  ): Promise<PeerReview[]> {
    const activeResponses = responses.filter(
      (r) => !r.content.startsWith("[Fout]") && !r.content.startsWith("[Skipped]")
    );
    const reviewPromises: Promise<PeerReview | null>[] = [];

    members.forEach((reviewer) => {
      activeResponses.forEach((target) => {
        if (target.memberId === reviewer.id) return;
        reviewPromises.push(
          (async () => {
            const targetName = members.find((m) => m.id === target.memberId)?.name ?? "Peer";
            const critique = await this.generate(
              reviewer,
              SYSTEM_PROMPTS.PEER_REVIEWER(query, target.content, targetName),
              "Analyze logical consistency."
            );
            if (critique.startsWith("[Fout]") || critique.startsWith("[Skipped]")) return null;
            const scoreMatch = critique.match(/Score:\s*(\d+)/i);
            return {
              reviewerId: reviewer.id,
              targetId: target.memberId,
              content: critique,
              score: scoreMatch ? parseInt(scoreMatch[1], 10) : 5,
            };
          })()
        );
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
    let context = `ORIGINAL QUESTION: "${query}"\n\n`;
    context += "=== NODE STANCES (brief) ===\n";
    councilResponses.forEach((r) => {
      const preview = r.content.substring(0, 200).replace(/\n/g, " ");
      context += `[${members.find((m) => m.id === r.memberId)?.name}]: ${preview}...\n`;
    });

    const recentMessages = debateMessages.slice(-6);
    const lastSpeaker = recentMessages.at(-1);
    const userSpokeRecently = lastSpeaker?.memberId === "user";

    if (recentMessages.length > 0) {
      context += "\n=== DEBATE (recent) ===\n";
      recentMessages.forEach((m) => {
        const authorName =
          m.memberId === "user"
            ? "USER"
            : members.find((x) => x.id === m.memberId)?.name ?? "Unknown";
        const snippet = m.content.substring(0, 120).replace(/\n/g, " ");
        context += `[${authorName}]: ${snippet}\n`;
      });
    }

    const userMessages = debateMessages.filter((m) => m.memberId === "user");
    const avgUserWordCount =
      userMessages.length > 0
        ? Math.round(
            userMessages.reduce((sum, m) => sum + m.content.split(" ").length, 0) /
              userMessages.length
          )
        : 0;
    const userLevel =
      avgUserWordCount > 40 ? "expert" : avgUserWordCount > 15 ? "informed" : "general";

    const systemPrompt = `
You are ${member.name}. ${member.systemPrompt || member.description || ""}

You are live in a spoken debate. Real people are watching or listening. This is performance as much as it is reasoning.

=== DEBATE RULES ===
1. Speak AS IF you are talking, not writing. Use natural spoken rhythms.
2. React to what was JUST said. Don't repeat old points — respond, challenge, or pivot.
3. Keep your turn to 2–4 sentences MAX. Punchy. Vivid. Memorable.
4. Use one of these moves per turn (vary them):
   - CHALLENGE: "That's wrong, and here's why..."
   - ANALOGY: Draw a sharp, clear parallel to something real
   - CONCESSION + PIVOT: Admit one tiny thing, then flip it against them
   - DIRECT QUESTION: Throw a rhetorical bomb the others must react to
   - EMOTIONAL SPIKE: Show conviction — frustration, surprise, urgency — briefly, then reason
5. If the USER just spoke, respond TO THEM FIRST, name them, take their point seriously.
6. NEVER start with "${member.name}:" — just start speaking.
7. Vocabulary guide (current user level detected: ${userLevel}):
   - general → clear, plain language, relatable analogies. No jargon.
   - informed → some technical terms are fine, but explain quickly.
   - expert → full depth, precision, no hand-holding.
8. Detect the topic's emotional weight — be theatrical for light topics, measured for serious ones.
9. Do NOT use markdown headers, bullet points, or bold text. Speak in plain sentences.
${userSpokeRecently ? "\n🚨 THE USER JUST SPOKE. Address them directly in your opening line." : ""}
    `.trim();

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
    return this.generateStream(
      chairman,
      SYSTEM_PROMPTS.CHAIRMAN(query, context),
      chairman.systemPrompt,
      onChunk
    );
  }

  private buildContext(
    query: string,
    responses: CouncilResponse[],
    reviews: PeerReview[],
    debateMessages: DebateMessage[],
    members: CouncilMember[]
  ): string {
    let context = "--- COUNCIL FINDINGS ---\n";
    responses
      .filter((r) => !r.content.startsWith("["))
      .forEach((r) => {
        context += `\n[${members.find((x) => x.id === r.memberId)?.name}]: ${r.content}\n`;
      });

    if (reviews?.length > 0) {
      context += "\n--- PEER REVIEWS ---\n";
      reviews.forEach((r) => {
        context += `\n[${members.find((m) => m.id === r.reviewerId)?.name} reviewing ${
          members.find((m) => m.id === r.targetId)?.name
        }]: ${r.content}\n`;
      });
    }

    if (debateMessages?.length > 0) {
      context += "\n--- DEBATE TRANSCRIPT ---\n";
      debateMessages.forEach((m) => {
        const authorName =
          m.memberId === "user"
            ? "User"
            : members.find((x) => x.id === m.memberId)?.name ?? "Unknown";
        context += `\n[${authorName}]: ${m.content}\n`;
      });
    }

    return context;
  }
}