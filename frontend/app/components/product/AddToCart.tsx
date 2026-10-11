'use client'

import {useState} from 'react'
import {toast} from 'sonner'

import {useCart} from '@/app/components/cart/CartProvider'
import Price from '@/app/components/product/Price'
import {MinusIcon, PlusIcon} from '@/app/components/ui/Icons'
import {formatPrice} from '@/lib/format'

type Variant = {_key: string; label: string | null; stems?: string | null; price: number | null}

type Props = {
  product: {
    _id: string
    slug: string | null
    name: string | null
    price: number | null
    compareAtPrice?: number | null
    inStock?: boolean | null
    image?: {asset?: {_ref: string}; alt?: string} | null
  }
  variants: Variant[] | null
}

export default function AddToCart({product, variants}: Props) {
  const options = (variants || []).filter((v) => v.label && v.price != null)
  const [selected, setSelected] = useState(options[0]?._key)
  const [quantity, setQuantity] = useState(1)
  const {addItem} = useCart()

  const variant = options.find((v) => v._key === selected)
  const price = variant?.price ?? product.price ?? 0
  const soldOut = product.inStock === false

  function handleAdd() {
    addItem(
      {
        productId: product._id,
        slug: product.slug || '',
        name: product.name || 'Flowers',
        variantKey: variant?._key,
        variantLabel: variant?.label || undefined,
        price,
        imageRef: product.image?.asset?._ref,
        imageAlt: product.image?.alt,
      },
      quantity,
    )
    toast.success(`${product.name} added to your bag`)
    setQuantity(1)
  }

  return (
    <div className="flex flex-col gap-8">
      <Price
        price={price}
        compareAtPrice={product.compareAtPrice}
        className="font-display text-4xl"
      />

      {options.length > 1 && (
        <fieldset>
          <legend className="eyebrow mb-4">Choose a size</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {options.map((v) => {
              const isActive = v._key === selected
              return (
                <label
                  key={v._key}
                  className={`relative flex cursor-pointer flex-col rounded-2xl border px-4 py-3 transition-all ${
                    isActive ? 'border-forest bg-forest text-paper' : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v._key}
                    checked={isActive}
                    onChange={() => setSelected(v._key)}
                    className="sr-only"
                  />
                  <span className="font-display text-lg">{v.label}</span>
                  <span className={`text-xs ${isActive ? 'text-paper/70' : 'text-ink-soft'}`}>
                    {[v.stems, formatPrice(v.price)].filter(Boolean).join(' · ')}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-ink/20">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full hover:bg-ink/5"
            aria-label="Decrease quantity"
          >
            <MinusIcon size={16} />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full hover:bg-ink/5"
            aria-label="Increase quantity"
          >
            <PlusIcon size={16} />
          </button>
        </div>
        <button type="button" onClick={handleAdd} disabled={soldOut} className="btn-primary flex-1 py-4">
          {soldOut ? 'Sold out' : 'Add to bag'}
          {!soldOut && <span className="opacity-70">· {formatPrice(price * quantity)}</span>}
        </button>
      </div>
    </div>
  )
}
