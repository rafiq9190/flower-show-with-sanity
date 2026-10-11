import type {Metadata} from 'next'
import {notFound, redirect} from 'next/navigation'

import PageBuilderPage from '@/app/components/PageBuilder'
import Emphasis from '@/app/components/ui/Emphasis'
import {Stem} from '@/app/components/ui/Stem'
import {stripEmphasis} from '@/lib/format'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })

  return {
    title: page?.seo?.title || page?.name,
    description: page?.seo?.description || page?.subheading || stripEmphasis(page?.heading),
  } satisfies Metadata
}

export default async function Page(props: PageProps<'/[slug]'>) {
  const params = await props.params
  if (params.slug === 'home') redirect('/')

  const {data: page} = await sanityFetch({query: getPageQuery, params})

  if (!page?._id) notFound()

  return (
    <>
      <header className="relative overflow-hidden">
        <Stem className="pointer-events-none absolute top-0 right-6 h-80 text-moss/30" />
        <div className="container pt-16 pb-12 lg:pt-24 lg:pb-16">
          {page.subheading && <p className="hero-in eyebrow">{page.subheading}</p>}
          <h1 className="hero-in mt-6 max-w-5xl text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-balance [animation-delay:120ms]">
            <Emphasis text={page.heading} emClassName="text-terracotta" />
          </h1>
        </div>
      </header>
      <PageBuilderPage page={page as GetPageQueryResult} />
    </>
  )
}
