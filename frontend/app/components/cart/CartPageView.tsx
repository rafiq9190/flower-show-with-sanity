'use client'

import Link from 'next/link'

import {useCart} from '@/app/components/cart/CartProvider'
import CartLines from '@/app/components/cart/CartLines'
import CartSummary from '@/app/components/cart/CartSummary'
import {Stem} from '@/app/components/ui/Stem'

export default function CartPageView() {
  const {lines, hydrated, count} = useCart()

  if (!hydrated) return <div className="h-96" />

  if (!lines.length) {
    return (
      <div className="py-16 text-center">
        <Stem className="mx-auto h-48 text-moss" />
        <p className="mt-8 font-display text-3xl">Your bag is empty — for now.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Find something lovely
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="eyebrow mb-2">{count} items</p>
        <CartLines />
      </div>
      <div className="lg:col-span-5">
        <div className="rounded-[2rem] bg-paper-deep/70 p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="mb-6 font-display text-3xl">Delivery & payment</h2>
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
