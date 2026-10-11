import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function Marquee({block}: {block: ExtractPageBuilderType<'marquee'>}) {
  const words = block.words || []
  if (!words.length) return null
  const loop = [...words, ...words]
  return (
    <section aria-label="Flowers in season" className="overflow-hidden py-6">
      <div className="-mx-4 -rotate-1 border-y border-ink/15 bg-blush-soft py-5">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10 [animation-duration:60s]">
          {loop.map((word, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span
                className={`font-display text-4xl sm:text-6xl ${i % 2 ? 'font-wonk text-terracotta italic' : ''}`}
              >
                {word}
              </span>
              <span aria-hidden className="text-2xl text-moss">
                ✿
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
