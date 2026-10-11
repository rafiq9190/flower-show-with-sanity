import type {Metadata} from 'next'

import Filters, {PRICES, SortLinks, type ShopParams} from '@/app/components/shop/Filters'
import ProductGrid from '@/app/components/product/ProductGrid'
import {Stem} from '@/app/components/ui/Stem'
import {sanityFetch} from '@/sanity/lib/live'
import {shopFacetsQuery, shopQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Shop flowers',
  description: 'Seasonal bouquets, arrangements, dried flowers and house plants — hand-tied and delivered.',
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

export default async function ShopPage(props: PageProps<'/shop'>) {
  const sp = await props.searchParams
  const params: ShopParams = {
    category: one(sp.category),
    occasion: one(sp.occasion),
    color: one(sp.color),
    price: one(sp.price),
    sort: one(sp.sort),
  }

  const [{data: products}, {data: facets}] = await Promise.all([
    sanityFetch({
      query: shopQuery,
      params: {category: params.category ?? null, occasion: params.occasion ?? null, color: params.color ?? null},
    }),
    sanityFetch({query: shopFacetsQuery}),
  ])

  // Price bands and sorting run here so editors can keep prices as simple numbers
  const band = PRICES.find((p) => p.slug === params.price)
  const filtered = (products || [])
    .filter((p) => !band || ((p.fromPrice ?? 0) >= band.min && (p.fromPrice ?? 0) < band.max))
    .sort((a, b) => {
      switch (params.sort) {
        case 'price-asc':
          return (a.fromPrice ?? 0) - (b.fromPrice ?? 0)
        case 'price-desc':
          return (b.fromPrice ?? 0) - (a.fromPrice ?? 0)
        case 'newest':
          return (b.createdAt || '').localeCompare(a.createdAt || '')
        default:
          return 0
      }
    })

  const activeCategory = facets?.categories.find((c) => c.slug === params.category)

  return (
    <>
      <header className="relative overflow-hidden">
        <Stem className="pointer-events-none absolute -top-4 right-4 h-72 text-moss/30 sm:right-20" />
        <div className="container pt-14 pb-10 lg:pt-20">
          <p className="hero-in eyebrow">The flower market</p>
          <h1 className="hero-in mt-5 text-[clamp(3rem,9vw,8rem)] leading-[0.9] [animation-delay:100ms]">
            {activeCategory ? (
              <em className="font-wonk text-terracotta">{activeCategory.title}</em>
            ) : (
              <>
                Shop <em className="font-wonk text-terracotta">all</em>
              </>
            )}
            <sup className="ml-2 align-super font-sans text-base text-ink-soft not-italic">({filtered.length})</sup>
          </h1>
        </div>
      </header>

      <div className="container">
        <div className="rounded-[2rem] border border-ink/10 bg-paper-deep/50 p-5 sm:p-7">
          <Filters params={params} categories={facets?.categories || []} occasions={facets?.occasions || []} />
        </div>
        <div className="mt-8 mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-soft">
            Showing {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </p>
          <SortLinks params={params} />
        </div>
        <ProductGrid products={filtered} numbered />
      </div>
    </>
  )
}
