'use client'

import {useCart} from '@/app/components/cart/CartProvider'
import {BagIcon} from '@/app/components/ui/Icons'

export default function CartButton() {
  const {open, count, hydrated} = useCart()
  return (
    <button
      type="button"
      onClick={open}
      className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-ink/5"
      aria-label={`Open bag${hydrated && count ? `, ${count} items` : ''}`}
    >
      <BagIcon size={22} />
      {hydrated && count > 0 && (
        <span className="absolute top-1 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[0.65rem] font-semibold text-paper">
          {count}
        </span>
      )}
    </button>
  )
}
