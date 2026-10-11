import Photo from '@/app/components/ui/Photo'
import {FlowerRule} from '@/app/components/ui/Stem'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function TestimonialStrip({block}: {block: ExtractPageBuilderType<'testimonialStrip'>}) {
  const testimonials = block.testimonials || []
  if (!testimonials.length) return null
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="reveal text-center">
          {block.eyebrow && <p className="eyebrow justify-center">{block.eyebrow}</p>}
          {block.heading && <h2 className="mt-4 text-4xl sm:text-5xl">{block.heading}</h2>}
          <FlowerRule className="mx-auto mt-8 max-w-xs" />
        </div>
      </div>
      <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:px-8 lg:px-12 [scrollbar-width:none]">
        {testimonials.map((t, i) => (
          <figure
            key={t._id}
            className={`reveal flex w-[85vw] max-w-md shrink-0 snap-center flex-col justify-between rounded-[2rem] p-8 sm:w-[28rem] sm:p-10 ${
              i % 3 === 0 ? 'bg-blush-soft' : i % 3 === 1 ? 'bg-paper-deep' : 'bg-forest text-paper'
            }`}
          >
            <span aria-hidden className="font-display text-7xl leading-none text-terracotta">
              &ldquo;
            </span>
            <blockquote className="-mt-6 font-display text-2xl leading-snug italic">{t.quote}</blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              {t.image ? (
                <Photo image={t.image} width={120} sizes="3.5rem" className="oval h-14 w-14 shrink-0" />
              ) : (
                <span className="grid h-14 w-14 place-items-center rounded-full bg-moss font-display text-xl text-paper">
                  {t.name?.[0]}
                </span>
              )}
              <span>
                <span className="block font-medium">{t.name}</span>
                {t.location && <span className="text-xs opacity-70">{t.location}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
