import Link from 'next/link'

import PostCard from '@/app/components/journal/PostCard'
import SectionHeader from '@/app/components/ui/SectionHeader'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function JournalTeaser({block}: {block: ExtractPageBuilderType<'journalTeaser'>}) {
  const [first, ...rest] = block.posts || []
  if (!first) return null
  return (
    <section className="container py-20 lg:py-28">
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} number="04">
        <Link href="/journal" className="btn-ghost shrink-0 self-start md:self-auto">
          All stories
        </Link>
      </SectionHeader>
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <PostCard post={first} size="lg" />
        </div>
        <div className="flex flex-col gap-12 lg:col-span-5">
          {rest.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
