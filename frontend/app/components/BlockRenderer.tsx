import React from 'react'

import CallToAction from '@/app/components/sections/CallToAction'
import CategoryGrid from '@/app/components/sections/CategoryGrid'
import FeaturedProducts from '@/app/components/sections/FeaturedProducts'
import Hero from '@/app/components/sections/Hero'
import InfoSection from '@/app/components/sections/InfoSection'
import JournalTeaser from '@/app/components/sections/JournalTeaser'
import Marquee from '@/app/components/sections/Marquee'
import Newsletter from '@/app/components/sections/Newsletter'
import StoryBlock from '@/app/components/sections/StoryBlock'
import TestimonialStrip from '@/app/components/sections/TestimonialStrip'
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks = {
  hero: Hero,
  marquee: Marquee,
  categoryGrid: CategoryGrid,
  featuredProducts: FeaturedProducts,
  storyBlock: StoryBlock,
  testimonialStrip: TestimonialStrip,
  journalTeaser: JournalTeaser,
  newsletter: Newsletter,
  callToAction: CallToAction,
  infoSection: InfoSection,
} as unknown as BlocksType

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          pageId: pageId,
          pageType: pageType,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="container my-8 rounded-3xl bg-paper-deep p-20 text-center text-ink-soft">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
