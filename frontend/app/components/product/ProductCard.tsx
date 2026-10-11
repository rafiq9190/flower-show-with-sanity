import Link from 'next/link'

import Photo from '@/app/components/ui/Photo'
import Price from '@/app/components/product/Price'
import {pad} from '@/lib/format'
import type {ProductCardData} from '@/sanity/lib/types'
import {dataAttr} from '@/sanity/lib/utils'

type Props = {
  product: ProductCardData
  index?: number
  shape?: 'arch' | 'rect'
  sizes?: string
}

/** Product card with a hover image swap and an editorial index number */
export default function ProductCard({product, index, shape = 'rect', sizes = '(min-width: 1024px) 25vw, 50vw'}: Props) {
  const soldOut = product.inStock === false
  return (
    <article
      className="group reveal relative flex flex-col"
      data-sanity={dataAttr({id: product._id, type: 'product', path: 'name'}).toString()}
    >
      <Link href={`/shop/${product.slug}`} className="block" aria-label={product.name ?? 'View product'}>
        <div
          className={`relative aspect-[4/5] overflow-hidden ${
            shape === 'arch' ? 'arch' : 'rounded-2xl'
          } transition-[border-radius] duration-700 group-hover:rounded-[2rem]`}
        >
          <Photo
            image={product.image}
            width={800}
            sizes={sizes}
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {product.hoverImage && (
            <Photo
              image={product.hoverImage}
              width={800}
              sizes={sizes}
              className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {soldOut && (
              <span className="rounded-full bg-ink px-3 py-1 text-[0.65rem] tracking-widest text-paper uppercase">
                Sold out
              </span>
            )}
            {!soldOut && product.compareAtPrice != null && product.compareAtPrice > (product.fromPrice ?? 0) && (
              <span className="rounded-full bg-terracotta px-3 py-1 text-[0.65rem] tracking-widest text-paper uppercase">
                Sale
              </span>
            )}
          </div>
          <span className="absolute right-3 bottom-3 translate-y-2 rounded-full bg-paper/90 px-4 py-2 text-xs font-medium opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View flowers →
          </span>
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {index != null && <span className="font-display text-xs text-terracotta italic">No. {pad(index + 1)}</span>}
          <h3 className="font-display text-xl leading-tight sm:text-2xl">
            <Link href={`/shop/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          {product.tagline && <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.tagline}</p>}
        </div>
        <Price
          price={product.fromPrice}
          compareAtPrice={product.compareAtPrice}
          from={(product.variantCount ?? 0) > 1}
          className="shrink-0 pt-4 text-sm font-medium whitespace-nowrap"
        />
      </div>
    </article>
  )
}
