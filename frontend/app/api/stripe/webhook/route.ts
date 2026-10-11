import type Stripe from 'stripe'

import {recordOrder} from '@/lib/orders'
import {getStripe} from '@/lib/stripe'

/**
 * Stripe webhook — saves paid orders to Sanity.
 * Local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return Response.json({error: 'Stripe webhook is not configured'}, {status: 503})
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return Response.json({error: 'Missing signature'}, {status: 400})

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(await request.text(), signature, secret)
  } catch (err) {
    console.error('Webhook signature verification failed', err)
    return Response.json({error: 'Invalid signature'}, {status: 400})
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    try {
      await recordOrder(stripe, event.data.object.id)
    } catch (err) {
      console.error('Failed to record order', err)
      // Let Stripe retry
      return Response.json({error: 'Failed to record order'}, {status: 500})
    }
  }

  return Response.json({received: true})
}
