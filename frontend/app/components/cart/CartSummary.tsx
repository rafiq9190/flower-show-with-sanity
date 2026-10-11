'use client'

import {useCart} from '@/app/components/cart/CartProvider'
import {useCheckout} from '@/app/components/cart/useCheckout'
import {formatPrice} from '@/lib/format'

/** Delivery details, free-delivery progress and the checkout button */
export default function CartSummary() {
  const {subtotal, deliveryFee, freeDeliveryThreshold, deliveryDate, giftMessage, setDetails} = useCart()
  const {checkout, pending} = useCheckout()

  const freeDelivery = freeDeliveryThreshold != null && subtotal >= freeDeliveryThreshold
  const shipping = freeDelivery ? 0 : deliveryFee
  const remaining = freeDeliveryThreshold != null ? Math.max(0, freeDeliveryThreshold - subtotal) : null
  const progress = freeDeliveryThreshold ? Math.min(100, (subtotal / freeDeliveryThreshold) * 100) : 0
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex flex-col gap-5">
      {remaining != null && (
        <div>
          <p className="text-xs text-ink-soft">
            {freeDelivery ? (
              <>You&rsquo;ve unlocked <strong className="text-forest">free hand delivery</strong> 🌿</>
            ) : (
              <>
                Add <strong className="text-ink">{formatPrice(remaining)}</strong> for free delivery
              </>
            )}
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-moss transition-all duration-700" style={{width: `${progress}%`}} />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        <label className="grid gap-1 text-xs font-medium tracking-wide text-ink-soft">
          Delivery date
          <input
            type="date"
            min={today}
            value={deliveryDate}
            onChange={(e) => setDetails({deliveryDate: e.target.value})}
            className="field-boxed"
          />
        </label>
        <label className="grid gap-1 text-xs font-medium tracking-wide text-ink-soft">
          Gift note <span className="font-normal">(we write it by hand)</span>
          <textarea
            rows={2}
            maxLength={300}
            value={giftMessage}
            placeholder="Happy birthday, sunshine…"
            onChange={(e) => setDetails({giftMessage: e.target.value})}
            className="field-boxed resize-none"
          />
        </label>
      </div>

      <dl className="grid gap-2 border-t border-ink/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between font-display text-2xl">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>

      <button type="button" onClick={checkout} disabled={pending} className="btn-primary w-full py-4">
        {pending ? 'Opening secure checkout…' : 'Checkout securely'}
      </button>
      <p className="text-center text-[0.7rem] text-ink-soft">Payments are processed securely by Stripe.</p>
    </div>
  )
}
