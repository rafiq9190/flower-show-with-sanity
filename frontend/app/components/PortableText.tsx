/**
 * Renders Portable Text: links, anchored headings, captioned images and inline product callouts.
 * Learn more: https://www.sanity.io/docs/block-content
 */

import Link from 'next/link'
import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'

import Price from '@/app/components/product/Price'
import ResolvedLink from '@/app/components/ResolvedLink'
import Photo from '@/app/components/ui/Photo'
import type {ProductCardData} from '@/sanity/lib/types'

function ProductCallout({product, note}: {product?: ProductCardData | null; note?: string}) {
  if (!product?.slug) return null
  return (
    <aside className="not-prose my-12 overflow-hidden rounded-[2rem] bg-blush-soft">
      <Link href={`/shop/${product.slug}`} className="group grid items-center gap-6 p-4 sm:grid-cols-[10rem_1fr_auto] sm:p-5">
        <Photo
          image={product.image}
          width={400}
          sizes="10rem"
          className="arch aspect-[4/5] w-full sm:w-40"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="px-2 sm:px-0">
          {note && <p className="eyebrow">{note}</p>}
          <p className="mt-3 font-display text-3xl">{product.name}</p>
          {product.tagline && <p className="mt-1 text-sm text-ink-soft">{product.tagline}</p>}
          <Price
            price={product.fromPrice}
            from={(product.variantCount ?? 0) > 1}
            className="mt-3 text-sm font-medium"
          />
        </div>
        <span className="btn-primary mx-2 mb-2 sm:mx-0 sm:mb-0 sm:mr-4">Shop now</span>
      </Link>
    </aside>
  )
}

const anchor = (key?: string) => (
  <a
    href={`#${key}`}
    aria-hidden
    className="absolute top-0 bottom-0 left-0 -ml-6 hidden items-center text-base text-ink/30 no-underline opacity-0 transition-opacity group-hover:opacity-100 md:flex"
  >
    #
  </a>
)

export default function CustomPortableText({className = '', value}: {className?: string; value: PortableTextBlock[]}) {
  const components: PortableTextComponents = {
    types: {
      altImage: ({value}) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="not-prose my-12">
            <Photo image={value} width={1400} sizes="(min-width: 768px) 720px, 100vw" className="aspect-[3/2] rounded-[2rem]" />
            {value.caption && (
              <figcaption className="mt-3 text-center font-display text-sm text-ink-soft italic">{value.caption}</figcaption>
            )}
          </figure>
        )
      },
      // Legacy image blocks from the starter template
      image: ({value}) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="not-prose my-12">
            <Photo image={value} width={1400} sizes="(min-width: 768px) 720px, 100vw" className="aspect-[3/2] rounded-[2rem]" />
          </figure>
        )
      },
      productCallout: ({value}) => <ProductCallout product={value.product} note={value.note} />,
    },
    block: {
      h2: ({children, value}) => (
        <h2 id={value?._key} className="group relative scroll-mt-28">
          {anchor(value?._key)}
          {children}
        </h2>
      ),
      h3: ({children, value}) => (
        <h3 id={value?._key} className="group relative scroll-mt-28">
          {anchor(value?._key)}
          {children}
        </h3>
      ),
    },
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
  }

  return (
    <div className={className}>
      <PortableText components={components} value={value} />
    </div>
  )
}
