import type Stripe from 'stripe'

import {getSiteUrl} from '@/lib/site'
import {getStripe} from '@/lib/stripe'
import {client} from '@/sanity/lib/client'
import {checkoutProductsQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

type CheckoutItem = {productId: string; variantKey?: string; quantity: number}
type CheckoutBody = {items?: CheckoutItem[]; deliveryDate?: string; giftMessage?: string}

const error = (message: string, status = 400) => Response.json({error: message}, {status})

/**
 * Creates a Stripe Checkout Session from the cart. Prices are always re-read from Sanity,
 * never trusted from the browser.
 */
export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) {
    return error('Payments are not configured yet. Add STRIPE_SECRET_KEY to frontend/.env.local.', 503)
  }

  let body: CheckoutBody
  try {
    body = await request.json()
  } catch {
    return error('Invalid request body')
  }

  const items = (body.items || []).filter(
    (i) => typeof i?.productId === 'string' && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 20,
  )
  if (!items.length || items.length > 30) return error('Your bag is empty.')

  if (body.deliveryDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.deliveryDate)) {
    return error('Please choose a valid delivery date.')
  }

  const trusted = client.withConfig({useCdn: false, stega: false})
  const [products, settings] = await Promise.all([
    trusted.fetch(checkoutProductsQuery, {ids: [...new Set(items.map((i) => i.productId))]}),
    trusted.fetch(settingsQuery),
  ])

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  let subtotal = 0

  for (const item of items) {
    const product = products.find((p) => p._id === item.productId)
    if (!product || product.inStock === false) {
      return error(`${product?.name || 'An item in your bag'} is no longer available.`, 409)
    }
    const variant = item.variantKey ? product.variants?.find((v) => v._key === item.variantKey) : undefined
    if (item.variantKey && !variant) return error(`Please re-select a size for ${product.name}.`, 409)

    const price = variant?.price ?? product.price
    if (price == null) return error(`${product.name} has no price.`, 409)
    subtotal += price * item.quantity

    const image = product.image?.asset ? urlForImage(product.image).width(800).height(1000).fit('crop').url() : undefined
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(price * 100),
        product_data: {
          name: variant?.label ? `${product.name} — ${variant.label}` : product.name || 'Flowers',
          images: image ? [image] : undefined,
          metadata: {
            sanityId: product._id,
            productName: product.name || '',
            variant: variant?.label || '',
          },
        },
      },
    })
  }

  const fee = settings?.deliveryFee ?? 12
  const threshold = settings?.freeDeliveryThreshold
  const freeDelivery = threshold != null && subtotal >= threshold
  const origin = getSiteUrl(request.headers.get('origin'))

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {allowed_countries: ['US', 'CA', 'GB', 'AU', 'IE', 'NZ']},
      phone_number_collection: {enabled: true},
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: freeDelivery ? 'Free hand delivery' : 'Hand delivery',
            fixed_amount: {amount: freeDelivery ? 0 : Math.round(fee * 100), currency: 'usd'},
          },
        },
      ],
      metadata: {
        deliveryDate: body.deliveryDate || '',
        giftMessage: (body.giftMessage || '').slice(0, 450),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })
    return Response.json({url: session.url})
  } catch (err) {
    console.error(err)
    return error('Stripe could not create a checkout session. Check your Stripe keys.', 502)
  }
}
