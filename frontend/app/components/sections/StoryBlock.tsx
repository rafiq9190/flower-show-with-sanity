import {type PortableTextBlock} from 'next-sanity'
import {stegaClean} from '@sanity/client/stega'

import PortableText from '@/app/components/PortableText'
import ResolvedLink from '@/app/components/ResolvedLink'
import Emphasis from '@/app/components/ui/Emphasis'
import Photo from '@/app/components/ui/Photo'
import {Stem} from '@/app/components/ui/Stem'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

const TONES = {
  paper: {section: 'bg-paper text-ink', muted: 'text-ink-soft', em: 'text-terracotta', btn: 'btn-primary', stem: 'text-moss/40'},
  forest: {section: 'bg-forest text-paper', muted: 'text-paper/70', em: 'text-blush', btn: 'btn-blush', stem: 'text-paper/15'},
  blush: {section: 'bg-blush-soft text-ink', muted: 'text-ink-soft', em: 'text-terracotta', btn: 'btn-primary', stem: 'text-terracotta/25'},
}

export default function StoryBlock({block}: {block: ExtractPageBuilderType<'storyBlock'>}) {
  const tone = TONES[(stegaClean(block.tone) as keyof typeof TONES) || 'paper'] ?? TONES.paper
  const imageRight = stegaClean(block.imagePosition) === 'right'

  return (
    <section className={`relative overflow-hidden ${tone.section} ${block.tone && stegaClean(block.tone) !== 'paper' ? 'my-10 rounded-[2.5rem] sm:mx-4 sm:rounded-[4rem]' : ''}`}>
      <Stem className={`pointer-events-none absolute -right-8 -bottom-10 h-[30rem] ${tone.stem}`} />
      <div className="container grid items-center gap-14 py-20 lg:grid-cols-12 lg:gap-10 lg:py-32">
        <div className={`relative lg:col-span-6 ${imageRight ? 'lg:order-2 lg:col-start-7' : ''}`}>
          <div className="relative mx-auto aspect-[4/5] max-w-lg">
            {block.image && (
              <Photo
                image={block.image}
                width={1000}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className={`arch reveal-clip absolute inset-y-0 ${imageRight ? 'right-0' : 'left-0'} w-[82%]`}
              />
            )}
            {block.secondaryImage && (
              <Photo
                image={block.secondaryImage}
                width={500}
                sizes="(min-width: 1024px) 18vw, 40vw"
                className={`oval reveal absolute bottom-[-6%] ${imageRight ? 'left-0' : 'right-0'} aspect-[3/4] w-[40%] border-[6px] ${
                  stegaClean(block.tone) === 'forest' ? 'border-forest' : stegaClean(block.tone) === 'blush' ? 'border-blush-soft' : 'border-paper'
                }`}
              />
            )}
          </div>
        </div>

        <div className={`relative z-10 lg:col-span-5 ${imageRight ? 'lg:order-1' : 'lg:col-start-8'}`}>
          {block.eyebrow && <p className={`eyebrow reveal ${tone.muted}`}>{block.eyebrow}</p>}
          <h2 className="reveal mt-5 text-4xl text-balance sm:text-5xl lg:text-6xl">
            <Emphasis text={block.heading} emClassName={tone.em} />
          </h2>
          {block.body && (
            <div className={`reveal mt-8 ${tone.muted}`}>
              <PortableText
                value={block.body as PortableTextBlock[]}
                className="space-y-4 text-lg leading-relaxed"
              />
            </div>
          )}
          {block.stats && block.stats.length > 0 && (
            <dl className="reveal mt-10 grid grid-cols-3 gap-4 border-t border-current/15 pt-8">
              {block.stats.map((stat) => (
                <div key={stat._key} className="flex flex-col-reverse gap-1">
                  <dt className={`text-xs ${tone.muted}`}>{stat.label}</dt>
                  <dd className="font-display text-4xl sm:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {block.button?.buttonText && block.button.link && (
            <ResolvedLink link={block.button.link} className={`${tone.btn} reveal mt-10`}>
              {block.button.buttonText} <span aria-hidden>→</span>
            </ResolvedLink>
          )}
        </div>
      </div>
    </section>
  )
}
