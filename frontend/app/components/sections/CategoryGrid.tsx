import Link from 'next/link'

import Emphasis from '@/app/components/ui/Emphasis'
import Photo from '@/app/components/ui/Photo'
import {pad} from '@/lib/format'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

// Bento layout: one tall arch, then a mix of wide and square tiles
const LAYOUT = [
  'lg:col-span-5 lg:row-span-2 aspect-[4/5] lg:aspect-auto arch',
  'lg:col-span-4 aspect-[4/3] lg:aspect-auto rounded-[2rem]',
  'lg:col-span-3 aspect-square lg:aspect-auto rounded-t-full rounded-b-[2rem]',
  'lg:col-span-3 aspect-square lg:aspect-auto rounded-[2rem]',
  'lg:col-span-4 aspect-[4/3] lg:aspect-auto rounded-[2rem]',
]

export default function CategoryGrid({block}: {block: ExtractPageBuilderType<'categoryGrid'>}) {
  const categories = block.categories || []
  return (
    <section className="container py-20 lg:py-32">
      <div className="reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
          <h2 className="mt-4 text-5xl sm:text-6xl lg:text-7xl">
            <Emphasis text={block.heading} emClassName="text-terracotta" />
          </h2>
        </div>
        <Link href="/shop" className="link-underline self-start text-sm md:self-auto">
          Shop everything →
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:auto-rows-[15rem] lg:grid-cols-12">
        {categories.map((category, i) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}`}
            className={`group reveal relative overflow-hidden ${i === 0 ? 'col-span-2' : ''} ${LAYOUT[i % LAYOUT.length]}`}
          >
            <Photo
              image={category.image}
              width={900}
              sizes="(min-width: 1024px) 40vw, 50vw"
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1400ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-paper sm:p-7">
              <div>
                <span className="font-display text-sm italic opacity-80">{pad(i + 1)}</span>
                <h3 className="text-2xl leading-none sm:text-3xl lg:text-4xl">{category.title}</h3>
              </div>
              <span className="hidden rounded-full border border-paper/50 px-3 py-1 text-xs whitespace-nowrap backdrop-blur-sm sm:inline">
                {category.productCount} pieces
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
