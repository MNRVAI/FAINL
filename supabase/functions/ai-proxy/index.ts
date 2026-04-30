import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ── Types ────────────────────────────────────────────────────────────
interface ProxyRequest {
  prompt: string;
  systemInstruction?: string;
  modelId?: string;
  mode: "generate" | "stream";
}

interface ProxyResponse {
  text?: string;
  error?: string;
}

// ── CORS headers ─────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Main handler ─────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Pre-flight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    // 1. Authenticate the caller via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(401, "Unauthorized: missing token");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email) {
      return errorResponse(401, "Unauthorized: invalid token");
    }

    // 2. Parse body
    const body: ProxyRequest = await req.json();
    const { prompt, systemInstruction, modelId = "gemini-2.0-flash", mode = "generate" } = body;

    if (!prompt?.trim()) {
      return errorResponse(400, "Missing required field: prompt");
    }

    // 3. Get the API key from secure environment (NEVER exposed to client)
    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) {
      console.error("GOOGLE_AI_API_KEY environment variable not set");
      return errorResponse(500, "Service not configured");
    }

    // 4. Build the Gemini request
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:${
      mode === "stream" ? "streamGenerateContent?alt=sse" : "generateContent"
    }?key=${apiKey}`;

    const contents: any[] = [{ role: "user", parts: [{ text: prompt }] }];
    const geminiBody: any = { contents, generationConfig: { temperature: 0.7 } };
    if (systemInstruction) {
      geminiBody.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    // 5. Call Google Gemini
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return errorResponse(502, `Model error: ${geminiRes.status}`);
    }

    // 6. Handle streaming vs non-streaming
    if (mode === "stream") {
      // Pass through the SSE stream from Gemini
      return new Response(geminiRes.body, {
        headers: {
          ...CORS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // 7. Non-streaming: extract text and return
    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const result: ProxyResponse = { text };

    return new Response(JSON.stringify(result), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("ai-proxy unexpected error:", err);
    return errorResponse(500, err.message ?? "Internal server error");
  }
});

// ── Helpers ───────────────────────────────────────────────────────────
function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
