import NewsletterForm from '@/app/components/site/NewsletterForm'
import Photo from '@/app/components/ui/Photo'
import {SpinBadge} from '@/app/components/ui/Stem'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function Newsletter({block}: {block: ExtractPageBuilderType<'newsletter'>}) {
  return (
    <section className="container py-12">
      <div className="reveal relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-blush px-6 py-14 sm:px-12 lg:grid-cols-2 lg:px-16 lg:py-20">
        <div className="relative z-10">
          <p className="eyebrow">The newsletter</p>
          <h2 className="mt-4 text-5xl sm:text-6xl">{block.heading}</h2>
          {block.body && <p className="mt-5 max-w-md text-ink-soft">{block.body}</p>}
          <div className="mt-8 max-w-md">
            <NewsletterForm />
          </div>
        </div>
        {block.image && (
          <div className="relative mx-auto w-full max-w-sm">
            <Photo image={block.image} width={800} sizes="(min-width: 1024px) 30vw, 80vw" className="oval aspect-[3/4]" />
            <SpinBadge
              text="no spam · just flowers · "
              className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-paper text-forest"
            />
          </div>
        )}
      </div>
    </section>
  )
}
