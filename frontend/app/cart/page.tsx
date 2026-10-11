import type {Metadata} from 'next'

import CartPageView from '@/app/components/cart/CartPageView'

export const metadata: Metadata = {title: 'Your bag', robots: {index: false}}

export default function CartPage() {
  return (
    <div className="container pt-14 lg:pt-20">
      <h1 className="hero-in mb-12 text-[clamp(3rem,8vw,6rem)] leading-none">
        Your <em className="font-wonk text-terracotta">bag</em>
      </h1>
      <CartPageView />
    </div>
  )
}
