import {type PortableTextBlock} from 'next-sanity'
import {stegaClean} from '@sanity/client/stega'

import PortableText from '@/app/components/PortableText'
import ResolvedLink from '@/app/components/ResolvedLink'
import Photo from '@/app/components/ui/Photo'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function CallToAction({block}: {block: ExtractPageBuilderType<'callToAction'>}) {
  const {heading, eyebrow, body, button, image, theme, contentAlignment} = block
  const dark = stegaClean(theme) === 'dark'
  const imageFirst = stegaClean(contentAlignment) === 'imageFirst'

  return (
    <section className="container py-12">
      <div
        className={`reveal grid items-center gap-10 overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:grid-cols-2 lg:p-14 ${
          dark ? 'bg-ink text-paper' : 'bg-paper-deep'
        }`}
      >
        <div className={imageFirst ? 'lg:order-2' : ''}>
          {eyebrow && <p className={`eyebrow ${dark ? 'text-blush' : ''}`}>{eyebrow}</p>}
          <h2 className="mt-4 text-4xl sm:text-5xl">{heading}</h2>
          {body && (
            <PortableText
              value={body as PortableTextBlock[]}
              className={`mt-5 space-y-3 text-lg ${dark ? 'text-paper/75' : 'text-ink-soft'}`}
            />
          )}
          {button?.buttonText && button.link && (
            <ResolvedLink link={button.link} className={`${dark ? 'btn-blush' : 'btn-primary'} mt-8`}>
              {button.buttonText} <span aria-hidden>→</span>
            </ResolvedLink>
          )}
        </div>
        {image?.asset?._ref && (
          <Photo image={image} width={900} sizes="(min-width: 1024px) 40vw, 90vw" className="arch aspect-[4/3] lg:aspect-[5/4]" />
        )}
      </div>
    </section>
  )
}
