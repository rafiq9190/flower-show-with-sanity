import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'

import PostCard from '@/app/components/journal/PostCard'
import PortableText from '@/app/components/PortableText'
import AddToCart from '@/app/components/product/AddToCart'
import ProductGallery from '@/app/components/product/ProductGallery'
import ProductGrid from '@/app/components/product/ProductGrid'
import {LeafIcon, TruckIcon, HeartIcon} from '@/app/components/ui/Icons'
import {FlowerRule} from '@/app/components/ui/Stem'
import {getSiteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/live'
import {productQuery, productSlugs} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, urlForImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({query: productSlugs, perspective: 'published', stega: false})
  return data
}

export async function generateMetadata(props: PageProps<'/shop/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: product} = await sanityFetch({query: productQuery, params, stega: false})
  if (!product) return {}
  const ogImage = resolveOpenGraphImage(product.image)
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.tagline,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

const PROMISES = [
  {icon: TruckIcon, title: 'Same-day delivery', text: 'Order by 1pm, Monday to Saturday.'},
  {icon: LeafIcon, title: 'Foam-free & seasonal', text: 'Locally grown, compostable wrapping.'},
  {icon: HeartIcon, title: 'Hand-written card', text: 'Add your note in the bag.'},
]

export default async function ProductPage(props: PageProps<'/shop/[slug]'>) {
  const params = await props.params
  const {data: product} = await sanityFetch({query: productQuery, params})
  if (!product?._id) notFound()

  const images = (product.images || []).filter((img) => img?.asset?._ref)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.tagline,
    image: images.map((img) => urlForImage(img).width(1200).url()),
    category: product.category?.title,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: product.fromPrice,
      highPrice: Math.max(product.price ?? 0, ...(product.variants || []).map((v) => v.price ?? 0)),
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: `${getSiteUrl()}/shop/${product.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}} />

      <div className="container pt-6 lg:pt-10">
        <nav aria-label="Breadcrumb" className="text-xs tracking-wider text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="link-underline">
                Shop
              </Link>
            </li>
            {product.category?.slug && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="link-underline">
                    {product.category.title}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={images} name={product.name || ''} />
            </div>
          </div>

          <div className="lg:col-span-5">
            {product.category?.title && <p className="eyebrow">{product.category.title}</p>}
            <h1 className="mt-4 text-5xl leading-[0.95] sm:text-6xl">{product.name}</h1>
            {product.tagline && (
              <p className="mt-4 font-display text-xl text-ink-soft italic">{product.tagline}</p>
            )}

            <div className="mt-8">
              <AddToCart
                product={{
                  _id: product._id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  inStock: product.inStock,
                  image: product.image,
                }}
                variants={product.variants}
              />
            </div>

            <ul className="mt-10 grid gap-4 rounded-[1.5rem] bg-paper-deep/60 p-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {PROMISES.map(({icon: Icon, title, text}) => (
                <li key={title} className="flex gap-3 text-sm xl:flex-col xl:gap-2">
                  <Icon className="mt-0.5 shrink-0 text-moss" />
                  <span>
                    <span className="block font-medium">{title}</span>
                    <span className="text-xs text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {product.description && (
                <details open className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl">
                    The story
                    <span className="text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <PortableText
                    className="mt-4 space-y-4 leading-relaxed text-ink-soft"
                    value={product.description as PortableTextBlock[]}
                  />
                </details>
              )}
              {product.careNotes && product.careNotes.length > 0 && (
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl">
                    Care notes
                    <span className="text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <ol className="mt-4 space-y-3 text-ink-soft">
                    {product.careNotes.map((note, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-display text-terracotta italic">0{i + 1}</span>
                        {note}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl">
                  Delivery
                  <span className="text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-ink-soft">
                  Hand-delivered in reusable boxes. Choose your delivery date in the bag.{' '}
                  <Link href="/delivery" className="underline underline-offset-4">
                    Delivery & care details
                  </Link>
                  .
                </p>
              </details>
            </div>

            {product.occasions && product.occasions.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-xs tracking-[0.2em] text-ink-soft uppercase">Perfect for</span>
                {product.occasions.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/occasion/${o.slug}`}
                    className="rounded-full border border-ink/15 px-3 py-1 text-sm hover:border-ink"
                  >
                    {o.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {product.stories && product.stories.length > 0 && (
        <section className="container mt-24">
          <FlowerRule />
          <h2 className="mt-12 text-4xl sm:text-5xl">
            From the <em className="font-wonk text-terracotta">journal</em>
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {product.stories.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {product.related && product.related.length > 0 && (
        <section className="container mt-24">
          <h2 className="text-4xl sm:text-5xl">
            You may also <em className="font-wonk text-terracotta">love</em>
          </h2>
          <div className="mt-12">
            <ProductGrid products={product.related} />
          </div>
        </section>
      )}
    </>
  )
}
