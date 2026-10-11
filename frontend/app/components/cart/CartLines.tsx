'use client'

import Link from 'next/link'

import {useCart} from '@/app/components/cart/CartProvider'
import Image from '@/app/components/SanityImage'
import {CloseIcon, MinusIcon, PlusIcon} from '@/app/components/ui/Icons'
import {formatPrice} from '@/lib/format'

export default function CartLines({onNavigate}: {onNavigate?: () => void}) {
  const {lines, setQuantity, removeItem} = useCart()

  return (
    <ul className="divide-y divide-ink/10">
      {lines.map((line) => (
        <li key={line.id} className="flex gap-4 py-5">
          <Link
            href={`/shop/${line.slug}`}
            onClick={onNavigate}
            className="relative h-28 w-22 shrink-0 overflow-hidden rounded-t-full rounded-b-xl bg-paper-deep"
          >
            {line.imageRef && (
              <Image
                id={line.imageRef}
                alt={line.imageAlt || line.name}
                width={180}
                height={224}
                mode="cover"
                className="h-full w-full object-cover"
              />
            )}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/shop/${line.slug}`} onClick={onNavigate} className="font-display text-lg leading-tight">
                  {line.name}
                </Link>
                {line.variantLabel && <p className="text-xs text-ink-soft">{line.variantLabel}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeItem(line.id)}
                className="cursor-pointer rounded-full p-1 text-ink-soft hover:bg-ink/5 hover:text-ink"
                aria-label={`Remove ${line.name}`}
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="inline-flex items-center rounded-full border border-ink/15">
                <button
                  type="button"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full hover:bg-ink/5"
                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon size={14} />
                </button>
                <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                <button
                  type="button"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full hover:bg-ink/5"
                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
              <span className="text-sm font-medium tabular-nums">{formatPrice(line.price * line.quantity)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
