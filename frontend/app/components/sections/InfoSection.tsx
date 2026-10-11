import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function InfoSection({block, index}: {block: ExtractPageBuilderType<'infoSection'>; index: number}) {
  return (
    <section className="container">
      <div className="reveal grid gap-6 border-t border-ink/15 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-4">
          <span className="font-display text-sm text-terracotta italic">No. {String(index + 1).padStart(2, '0')}</span>
          {block.heading && <h2 className="mt-2 text-4xl sm:text-5xl">{block.heading}</h2>}
          {block.subheading && <p className="eyebrow mt-4">{block.subheading}</p>}
        </div>
        {block.content?.length ? (
          <div className="lg:col-span-7 lg:col-start-6">
            <PortableText className="prose prose-lg prose-petal" value={block.content as PortableTextBlock[]} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
