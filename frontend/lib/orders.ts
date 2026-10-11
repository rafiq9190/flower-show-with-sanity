import 'server-only'

import type Stripe from 'stripe'

import {writeClient, writeToken} from '@/sanity/lib/writeClient'

export type OrderSummary = {
  orderNumber: string
  email: string | null
  name: string | null
  deliveryDate: string | null
  giftMessage: string | null
  items: {name: string; variant: string | null; quantity: number; unitPrice: number}[]
  subtotal: number
  shipping: number
  total: number
  saved: boolean
}

const toDollars = (cents: number | null | undefined) => Math.round(cents ?? 0) / 100

export function orderNumberFor(sessionId: string) {
  return `PV-${sessionId.slice(-8).toUpperCase()}`
}

/**
 * Reads a paid Checkout Session and writes it to Sanity as an `order` document.
 * Idempotent: the document ID is derived from the session ID, so the webhook and the
 * success page can both call this without creating duplicates.
 */
export async function recordOrder(stripe: Stripe, sessionId: string): Promise<OrderSummary | null> {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') return null

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
    expand: ['data.price.product'],
  })

  const items = lineItems.data.map((li) => {
    const product = li.price?.product as Stripe.Product | undefined
    return {
      productId: product?.metadata?.sanityId || null,
      name: product?.metadata?.productName || li.description || 'Flowers',
      variant: product?.metadata?.variant || null,
      quantity: li.quantity ?? 1,
      unitPrice: toDollars(li.price?.unit_amount),
    }
  })

  const shippingDetails = session.collected_information?.shipping_details
  const address = shippingDetails?.address
  const summary: OrderSummary = {
    orderNumber: orderNumberFor(session.id),
    email: session.customer_details?.email ?? null,
    name: shippingDetails?.name || session.customer_details?.name || null,
    deliveryDate: session.metadata?.deliveryDate || null,
    giftMessage: session.metadata?.giftMessage || null,
    items: items.map(({name, variant, quantity, unitPrice}) => ({name, variant, quantity, unitPrice})),
    subtotal: toDollars(session.amount_subtotal),
    shipping: toDollars(session.shipping_cost?.amount_total),
    total: toDollars(session.amount_total),
    saved: false,
  }

  if (!writeToken) {
    console.warn('SANITY_API_WRITE_TOKEN is not set — order was not saved to Sanity')
    return summary
  }

  await writeClient.createIfNotExists({
    _id: `order-${session.id}`,
    _type: 'order',
    status: 'paid',
    orderNumber: summary.orderNumber,
    email: summary.email ?? undefined,
    customerName: summary.name ?? undefined,
    phone: session.customer_details?.phone ?? undefined,
    shippingAddress: address
      ? {
          name: shippingDetails?.name ?? undefined,
          line1: address.line1 ?? undefined,
          line2: address.line2 ?? undefined,
          city: address.city ?? undefined,
          state: address.state ?? undefined,
          postalCode: address.postal_code ?? undefined,
          country: address.country ?? undefined,
        }
      : undefined,
    deliveryDate: summary.deliveryDate ?? undefined,
    giftMessage: summary.giftMessage ?? undefined,
    items: items.map((item, i) => ({
      _key: `item${i}`,
      _type: 'orderItem',
      product: item.productId ? {_type: 'reference', _ref: item.productId, _weak: true} : undefined,
      name: item.name,
      variant: item.variant ?? undefined,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total,
    stripeSessionId: session.id,
    createdAt: new Date(session.created * 1000).toISOString(),
  })

  return {...summary, saved: true}
}
