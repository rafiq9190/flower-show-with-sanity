import {formatPrice} from '@/lib/format'

export default function Price({
  price,
  compareAtPrice,
  from = false,
  className = '',
}: {
  price?: number | null
  compareAtPrice?: number | null
  from?: boolean
  className?: string
}) {
  if (price == null) return null
  const onSale = compareAtPrice != null && compareAtPrice > price
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      {from && <span className="text-[0.7em] tracking-widest text-ink-soft uppercase">from</span>}
      <span className={onSale ? 'text-terracotta' : ''}>{formatPrice(price)}</span>
      {onSale && <s className="text-[0.85em] text-ink-soft">{formatPrice(compareAtPrice)}</s>}
    </span>
  )
}
