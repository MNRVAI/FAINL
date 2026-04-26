import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.error('VITE_STRIPE_PUBLIC_KEY is missing! Check your .env or GitHub Variables/Secrets.');
}

export const stripePromise = loadStripe(stripePublicKey || '');
