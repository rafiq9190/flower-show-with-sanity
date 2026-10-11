import type {Metadata} from 'next'
import Link from 'next/link'

import Photo from '@/app/components/ui/Photo'
import {pad} from '@/lib/format'
import {sanityFetch} from '@/sanity/lib/live'
import {occasionsIndexQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Shop by occasion',
  description: 'Flowers for birthdays, anniversaries, weddings, sympathy — and for no reason at all.',
}

export default async function OccasionsPage() {
  const {data: occasions} = await sanityFetch({query: occasionsIndexQuery})

  return (
    <div className="container pt-14 lg:pt-20">
      <p className="hero-in eyebrow">Shop by occasion</p>
      <h1 className="hero-in mt-5 max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.92] [animation-delay:100ms]">
        What would you like to <em className="font-wonk text-terracotta">say</em>?
      </h1>

      <ul className="mt-16 border-t border-ink/15">
        {occasions.map((o, i) => (
          <li key={o._id} className="reveal border-b border-ink/15">
            <Link
              href={`/occasion/${o.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:gap-10 sm:py-8"
            >
              <span className="font-display text-sm text-terracotta italic">{pad(i + 1)}</span>
              <span className="flex items-center gap-6">
                <Photo
                  image={o.image}
                  width={300}
                  sizes="8rem"
                  className="oval hidden h-24 w-20 shrink-0 transition-all duration-700 group-hover:w-32 sm:block"
                />
                <span>
                  <span className="block font-display text-4xl transition-all duration-500 group-hover:translate-x-2 group-hover:italic sm:text-6xl">
                    {o.title}
                  </span>
                  {o.description && <span className="mt-1 block max-w-lg text-sm text-ink-soft">{o.description}</span>}
                </span>
              </span>
              <span className="text-sm whitespace-nowrap text-ink-soft">
                {o.productCount} <span className="hidden sm:inline">pieces</span> →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
