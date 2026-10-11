import type {Metadata} from 'next'
import Link from 'next/link'

import PostCard from '@/app/components/journal/PostCard'
import {FlowerRule} from '@/app/components/ui/Stem'
import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'The Journal',
  description: 'Flower care guides, seasonal notes and stories from the Petal & Verse studio.',
}

export default async function JournalPage(props: PageProps<'/journal'>) {
  const sp = await props.searchParams
  const tag = typeof sp.tag === 'string' ? sp.tag : undefined
  const {data: posts} = await sanityFetch({query: allPostsQuery})

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort()
  const visible = tag ? posts.filter((p) => p.tags?.includes(tag)) : posts
  const featured = !tag ? visible.find((p) => p.featured) || visible[0] : undefined
  const rest = visible.filter((p) => p._id !== featured?._id)

  return (
    <div className="container pt-14 lg:pt-20">
      <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="hero-in eyebrow">Notes from the flower bench</p>
          <h1 className="hero-in mt-5 text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] [animation-delay:100ms]">
            The <em className="font-wonk text-terracotta">Journal</em>
          </h1>
        </div>
        <p className="hero-in max-w-sm text-ink-soft lg:col-span-4 [animation-delay:200ms]">
          Care guides, seasonal notes and the occasional love letter to a particularly good tulip.
        </p>
      </header>

      <nav aria-label="Filter by topic" className="mt-12 flex flex-wrap gap-2">
        <Link
          href="/journal"
          scroll={false}
          className={`rounded-full border px-4 py-2 text-sm ${!tag ? 'border-forest bg-forest text-paper' : 'border-ink/15 hover:border-ink'}`}
        >
          All stories
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/journal?tag=${encodeURIComponent(t)}`}
            scroll={false}
            className={`rounded-full border px-4 py-2 text-sm ${tag === t ? 'border-forest bg-forest text-paper' : 'border-ink/15 hover:border-ink'}`}
          >
            {t}
          </Link>
        ))}
      </nav>

      {featured && (
        <section className="mt-14">
          <PostCard post={featured} size="lg" priority />
        </section>
      )}

      {rest.length > 0 && (
        <>
          <FlowerRule className="my-16" />
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <div key={post._id} className={i % 3 === 1 ? 'lg:mt-20' : ''}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </>
      )}

      {visible.length === 0 && <p className="mt-16 text-center text-ink-soft">No stories with that tag yet.</p>}
    </div>
  )
}
