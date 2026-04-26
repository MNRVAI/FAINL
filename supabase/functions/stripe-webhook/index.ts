
// @ts-ignore: Deno-specific import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno-specific import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// @ts-ignore: Deno-specific global
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
// @ts-ignore: Deno-specific global
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
// @ts-ignore: Deno-specific global
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
// @ts-ignore: Deno-specific global
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

/**
 * Stripe Webhook Handler
 * 
 * Listens for `checkout.session.completed` events from Stripe Payment Links.
 * When a customer completes a purchase, this function:
 * 1. Verifies the webhook signature (if STRIPE_WEBHOOK_SECRET is set)
 * 2. Extracts the token count from the session metadata or line items
 * 3. Credits the tokens to the user's account in Supabase
 * 
 * Setup:
 * - In Stripe Dashboard → Developers → Webhooks → Add endpoint
 * - URL: https://<project>.supabase.co/functions/v1/stripe-webhook
 * - Events: checkout.session.completed
 * - Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET env var
 */
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    // Verify webhook signature if secret is configured
    if (STRIPE_WEBHOOK_SECRET && signature) {
      const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET)
      if (!isValid) {
        console.error('Invalid Stripe webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }
    }

    const event = JSON.parse(body)

    // Only process completed checkout sessions
    if (event.type !== 'checkout.session.completed') {
      return new Response(
        JSON.stringify({ received: true, skipped: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = event.data.object
    const customerEmail = session.customer_details?.email || session.customer_email
    const amountTotal = session.amount_total // in cents

    if (!customerEmail) {
      console.error('No customer email in session:', session.id)
      return new Response(
        JSON.stringify({ error: 'No customer email found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Determine token count from amount (matching TOKEN_PACKAGES)
    const tokenCount = getTokenCountFromAmount(amountTotal)

    if (tokenCount === 0) {
      console.error('Unknown payment amount:', amountTotal)
      return new Response(
        JSON.stringify({ error: 'Unknown payment amount', amount: amountTotal }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Credit tokens in Supabase
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

      // Upsert token balance for user
      const { error: upsertError } = await supabase
        .from('user_tokens')
        .upsert(
          {
            email: customerEmail,
            tokens_purchased: tokenCount,
            stripe_session_id: session.id,
            amount_paid: amountTotal,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'stripe_session_id' } // Idempotent: prevent double-crediting
        )

      if (upsertError) {
        console.error('Failed to credit tokens:', upsertError)
        return new Response(
          JSON.stringify({ error: 'Failed to credit tokens', details: upsertError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`Credited ${tokenCount} tokens to ${customerEmail} (session: ${session.id})`)
    }

    return new Response(
      JSON.stringify({
        received: true,
        email: customerEmail,
        tokens: tokenCount,
        sessionId: session.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

/**
 * Map Stripe amount (in cents) to token count.
 * Must stay in sync with TOKEN_PACKAGES in constants.ts.
 */
function getTokenCountFromAmount(amountCents: number): number {
  const mapping: Record<number, number> = {
    199:  1,   // €1,99
    549:  3,   // €5,49
    849:  5,   // €8,49
    1599: 10,  // €15,99
    2249: 15,  // €22,49
  }
  return mapping[amountCents] || 0
}

/**
 * Verify Stripe webhook signature using HMAC-SHA256.
 * Implements Stripe's v1 signature verification without the Stripe SDK.
 */
async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = signatureHeader.split(',')
    let timestamp = ''
    let signature = ''

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key === 't') timestamp = value
      if (key === 'v1') signature = value
    }

    if (!timestamp || !signature) return false

    // Check timestamp tolerance (5 minutes)
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - parseInt(timestamp)) > 300) return false

    const signedPayload = `${timestamp}.${payload}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return expectedSignature === signature
  } catch {
    return false
  }
}
