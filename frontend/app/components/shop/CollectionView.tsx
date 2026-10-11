import Link from 'next/link'

import ProductGrid from '@/app/components/product/ProductGrid'
import Photo from '@/app/components/ui/Photo'
import type {ProductCardData, SanityImageData} from '@/sanity/lib/types'

type Props = {
  kind: 'Category' | 'Occasion'
  title: string | null
  description: string | null
  image: SanityImageData
  products: ProductCardData[]
}

/** Shared layout for category and occasion listings: arch hero + product grid */
export default function CollectionView({kind, title, description, image, products}: Props) {
  return (
    <>
      <header className="container pt-8 pb-16 lg:pt-14">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="hero-in text-xs tracking-wider text-ink-soft">
              <Link href="/shop" className="link-underline">
                Shop
              </Link>{' '}
              / {kind}
            </nav>
            <h1 className="hero-in mt-6 text-[clamp(3.2rem,9vw,8rem)] leading-[0.9] [animation-delay:100ms]">
              <em className="font-wonk">{title}</em>
            </h1>
            {description && (
              <p className="hero-in mt-6 max-w-lg text-lg text-ink-soft [animation-delay:200ms]">{description}</p>
            )}
            <p className="hero-in mt-6 text-sm [animation-delay:260ms]">
              <span className="font-display text-terracotta italic">{products.length}</span> pieces in this collection
            </p>
          </div>
          {image && (
            <div className="lg:col-span-4 lg:col-start-9">
              <Photo
                image={image}
                width={900}
                priority
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="arch reveal-clip mx-auto aspect-[4/5] max-w-sm"
              />
            </div>
          )}
        </div>
      </header>
      <section className="container">
        <ProductGrid products={products} numbered columns={3} />
      </section>
    </>
  )
}
