// @ts-ignore: Deno-specific import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Deno-specific global
const SECRETS: Record<string, string | undefined> = {
  google:     Deno.env.get('GEMINI_API_KEY'),
  anthropic:  Deno.env.get('ANTHROPIC_API_KEY'),
  openai:     Deno.env.get('OPENAI_API_KEY'),
  groq:       Deno.env.get('GROQ_API_KEY'),
  deepseek:   Deno.env.get('DEEPSEEK_API_KEY'),
  mistral:    Deno.env.get('MISTRAL_API_KEY'),
  openrouter: Deno.env.get('OPENROUTER_API_KEY'),
  nemotron:   Deno.env.get('NEMOTRON_API_KEY'),
  glm:        Deno.env.get('GLM_API_KEY'),
}

const BASE_URLS: Record<string, string> = {
  openai:     'https://api.openai.com/v1',
  groq:       'https://api.groq.com/openai/v1',
  deepseek:   'https://api.deepseek.com',
  mistral:    'https://api.mistral.ai/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  nemotron:   'https://integrate.api.nvidia.com/v1',
  glm:        'https://open.bigmodel.cn/api/paas/v4',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ProxyRequest {
  provider: string
  modelId: string
  prompt: string
  systemInstruction?: string
  stream?: boolean
  baseUrl?: string
  temperature?: number
  maxTokens?: number
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: ProxyRequest = await req.json()
    const {
      provider,
      modelId,
      prompt,
      systemInstruction,
      stream = false,
      baseUrl,
      temperature = 0.7,
      maxTokens = 2048,
    } = body

    if (!provider || !modelId || !prompt) {
      return errRes('Missing required fields: provider, modelId, prompt', 400)
    }

    if (provider === 'google') {
      return stream
        ? googleStream(modelId, prompt, systemInstruction, temperature, maxTokens)
        : google(modelId, prompt, systemInstruction, temperature, maxTokens)
    }

    if (provider === 'anthropic') {
      return stream
        ? anthropicStream(modelId, prompt, systemInstruction, temperature, maxTokens)
        : anthropic(modelId, prompt, systemInstruction, temperature, maxTokens)
    }

    // OpenAI-compatible providers
    return stream
      ? genericStream(provider, modelId, prompt, systemInstruction, temperature, maxTokens, baseUrl)
      : generic(provider, modelId, prompt, systemInstruction, temperature, maxTokens, baseUrl)

  } catch (error: any) {
    return errRes(error?.message ?? 'Unknown error', 500)
  }
})

// ─── Google Gemini ────────────────────────────────────────────────────────────

async function google(
  modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048
): Promise<Response> {
  const apiKey = SECRETS.google
  if (!apiKey) return errRes('Google API key not set on server', 503)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`
  const body: any = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return errRes(`Google ${res.status}: ${await res.text()}`, res.status)
  const data = await res.json()
  return okRes({ content: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '' })
}

async function googleStream(
  modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048
): Promise<Response> {
  const apiKey = SECRETS.google
  if (!apiKey) return errRes('Google API key not set on server', 503)

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:streamGenerateContent?key=${apiKey}&alt=sse`
  const body: any = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  }
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] }

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!upstream.ok || !upstream.body) return errRes(`Google stream ${upstream.status}`, upstream.status)

  return sseTransform(upstream.body, (line) => {
    try {
      const parsed = JSON.parse(line)
      return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    } catch { return '' }
  })
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

async function anthropic(
  modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048
): Promise<Response> {
  const apiKey = SECRETS.anthropic
  if (!apiKey) return errRes('Anthropic API key not set on server', 503)

  const body: any = {
    model: modelId,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
    temperature,
  }
  if (systemInstruction) body.system = systemInstruction

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) return errRes(`Anthropic ${res.status}: ${await res.text()}`, res.status)
  const data = await res.json()
  return okRes({ content: data.content?.[0]?.text ?? '' })
}

async function anthropicStream(
  modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048
): Promise<Response> {
  const apiKey = SECRETS.anthropic
  if (!apiKey) return errRes('Anthropic API key not set on server', 503)

  const body: any = {
    model: modelId,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    stream: true,
  }
  if (systemInstruction) body.system = systemInstruction

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!upstream.ok || !upstream.body) return errRes(`Anthropic stream ${upstream.status}`, upstream.status)

  return sseTransform(upstream.body, (line) => {
    try {
      const parsed = JSON.parse(line)
      return parsed.type === 'content_block_delta' ? (parsed.delta?.text ?? '') : ''
    } catch { return '' }
  })
}

// ─── OpenAI-compatible ────────────────────────────────────────────────────────

async function generic(
  provider: string, modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048, customBaseUrl?: string
): Promise<Response> {
  const apiKey = SECRETS[provider]
  const baseUrl = customBaseUrl || BASE_URLS[provider]
  if (!apiKey) return errRes(`${provider} API key not set on server`, 503)
  if (!baseUrl) return errRes(`Unknown provider: ${provider}`, 400)

  const messages: any[] = []
  if (systemInstruction) messages.push({ role: 'system', content: systemInstruction })
  messages.push({ role: 'user', content: prompt })

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelId, messages, temperature, max_tokens: maxTokens }),
  })
  if (!res.ok) return errRes(`${provider} ${res.status}: ${await res.text()}`, res.status)
  const data = await res.json()
  return okRes({ content: data.choices?.[0]?.message?.content ?? '' })
}

async function genericStream(
  provider: string, modelId: string, prompt: string, systemInstruction?: string,
  temperature = 0.7, maxTokens = 2048, customBaseUrl?: string
): Promise<Response> {
  const apiKey = SECRETS[provider]
  const baseUrl = customBaseUrl || BASE_URLS[provider]
  if (!apiKey) return errRes(`${provider} API key not set on server`, 503)
  if (!baseUrl) return errRes(`Unknown provider: ${provider}`, 400)

  const messages: any[] = []
  if (systemInstruction) messages.push({ role: 'system', content: systemInstruction })
  messages.push({ role: 'user', content: prompt })

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelId, messages, temperature, max_tokens: maxTokens, stream: true }),
  })
  if (!upstream.ok || !upstream.body) return errRes(`${provider} stream ${upstream.status}`, upstream.status)

  return sseTransform(upstream.body, (line) => {
    try {
      const parsed = JSON.parse(line)
      return parsed.choices?.[0]?.delta?.content ?? ''
    } catch { return '' }
  })
}

// ─── Shared SSE transformer ───────────────────────────────────────────────────

function sseTransform(
  upstreamBody: ReadableStream<Uint8Array>,
  extractText: (line: string) => string
): Response {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder();

  (async () => {
    const reader = upstreamBody.getReader()
    let buffer = ''
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (!payload || payload === '[DONE]') continue
          const text = extractText(payload)
          if (text) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
          }
        }
      }
    } finally {
      await writer.write(encoder.encode('data: [DONE]\n\n'))
      await writer.close().catch(() => {})
    }
  })()

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function okRes(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function errRes(message: string, status = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
