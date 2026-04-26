
// @ts-ignore: Deno-specific import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore: Deno-specific global
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceAmount, description, successUrl, cancelUrl, metadata } = await req.json()

    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }

    // Create a Stripe Checkout Session via the REST API (no SDK needed in Deno)
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[0]': 'card',
        'payment_method_types[1]': 'ideal',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': description || 'FAINL Access',
        'line_items[0][price_data][unit_amount]': String(Math.round(priceAmount * 100)), // Stripe expects cents
        'line_items[0][quantity]': '1',
        'success_url': successUrl,
        'cancel_url': cancelUrl,
        ...(metadata ? Object.fromEntries(
          Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, String(v)])
        ) : {}),
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create Stripe Checkout Session')
    }

    return new Response(
      JSON.stringify({ sessionId: data.id, url: data.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
