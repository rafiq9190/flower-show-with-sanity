'use client'

import {useState} from 'react'
import {toast} from 'sonner'

import {useCart} from '@/app/components/cart/CartProvider'

/** Sends the cart to /api/checkout and redirects to Stripe Checkout */
export function useCheckout() {
  const {lines, deliveryDate, giftMessage} = useCart()
  const [pending, setPending] = useState(false)

  async function checkout() {
    if (!lines.length) return
    setPending(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: lines.map((l) => ({productId: l.productId, variantKey: l.variantKey, quantity: l.quantity})),
          deliveryDate,
          giftMessage,
        }),
      })
      const data = (await res.json()) as {url?: string; error?: string}
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.')
      window.location.assign(data.url)
    } catch (error) {
      toast.error('Could not start checkout', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
      setPending(false)
    }
  }

  return {checkout, pending}
}
