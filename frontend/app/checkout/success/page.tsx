import {format} from 'date-fns'
import type {Metadata} from 'next'
import Link from 'next/link'

import ClearCart from '@/app/components/cart/ClearCart'
import {SpinBadge, Stem} from '@/app/components/ui/Stem'
import {formatPrice} from '@/lib/format'
import {recordOrder, type OrderSummary} from '@/lib/orders'
import {getStripe} from '@/lib/stripe'

export const metadata: Metadata = {title: 'Thank you', robots: {index: false}}

export default async function SuccessPage(props: PageProps<'/checkout/success'>) {
  const {session_id} = await props.searchParams
  const stripe = getStripe()

  let order: OrderSummary | null = null
  if (stripe && typeof session_id === 'string' && session_id.startsWith('cs_')) {
    try {
      // Also records the order here, so orders are saved even when the webhook isn't running locally
      order = await recordOrder(stripe, session_id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container relative overflow-hidden pt-16 pb-10 lg:pt-24">
      <ClearCart />
      <Stem className="pointer-events-none absolute top-0 right-0 h-96 text-moss/30" />
      <div className="mx-auto max-w-3xl text-center">
        <SpinBadge text="thank you · thank you · " className="hero-in mx-auto h-32 w-32 rounded-full bg-blush text-ink" />
        <h1 className="hero-in mt-10 text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] [animation-delay:100ms]">
          Your flowers are <em className="font-wonk text-terracotta">on their way</em>.
        </h1>
        <p className="hero-in mt-6 text-lg text-ink-soft [animation-delay:200ms]">
          {order
            ? `We’ve sent a confirmation to ${order.email}. Our florists will start on your order shortly.`
            : 'Thank you for your order. A confirmation email is on its way.'}
        </p>
      </div>

      {order && (
        <div className="reveal mx-auto mt-14 max-w-xl rounded-[2rem] bg-paper-deep/70 p-8">
          <div className="flex items-baseline justify-between border-b border-ink/10 pb-4">
            <span className="eyebrow">Order</span>
            <span className="font-display text-xl">{order.orderNumber}</span>
          </div>
          <ul className="divide-y divide-ink/10">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between gap-4 py-4 text-sm">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="grid gap-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd>{order.shipping ? formatPrice(order.shipping) : 'Free'}</dd>
            </div>
            {order.deliveryDate && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery date</dt>
                <dd>{format(new Date(`${order.deliveryDate}T12:00:00`), 'EEEE d MMMM')}</dd>
              </div>
            )}
            <div className="flex justify-between font-display text-2xl">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
          {order.giftMessage && (
            <blockquote className="mt-6 rounded-2xl bg-paper p-5 text-center font-display text-lg italic">
              &ldquo;{order.giftMessage}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-primary">
          Continue shopping
        </Link>
        <Link href="/journal/make-cut-flowers-last" className="btn-ghost">
          How to make them last
        </Link>
      </div>
    </div>
  )
}
