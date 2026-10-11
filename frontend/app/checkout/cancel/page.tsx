import type {Metadata} from 'next'
import Link from 'next/link'

import {Stem} from '@/app/components/ui/Stem'

export const metadata: Metadata = {title: 'Checkout cancelled', robots: {index: false}}

export default function CancelPage() {
  return (
    <div className="container py-24 text-center">
      <Stem className="mx-auto h-48 text-moss" />
      <h1 className="mt-8 text-5xl sm:text-6xl">
        No rush — your bag is <em className="font-wonk text-terracotta">still here</em>.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">
        Checkout was cancelled and you haven&rsquo;t been charged. Your flowers are waiting whenever you&rsquo;re ready.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/cart" className="btn-primary">
          Return to bag
        </Link>
        <Link href="/shop" className="btn-ghost">
          Keep browsing
        </Link>
      </div>
    </div>
  )
}
