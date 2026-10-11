import 'server-only'

import Stripe from 'stripe'

let stripe: Stripe | null = null

/** Returns a Stripe client, or null when STRIPE_SECRET_KEY isn't configured yet */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripe) {
    stripe = new Stripe(key, {appInfo: {name: 'Petal & Verse'}})
  }
  return stripe
}
