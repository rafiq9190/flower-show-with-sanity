import type {Metadata} from 'next'

import PageBuilder from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({query: getPageQuery, params: {slug: 'home'}, stega: false})
  return {
    title: page?.seo?.title ? {absolute: page.seo.title} : undefined,
    description: page?.seo?.description,
  }
}

export default async function HomePage() {
  const {data: page} = await sanityFetch({query: getPageQuery, params: {slug: 'home'}})

  if (!page?._id) {
    return (
      <div className="container py-40 text-center">
        <h1 className="text-5xl">Welcome to your flower shop</h1>
        <p className="mt-4 text-ink-soft">
          Run <code className="rounded bg-paper-deep px-2 py-1">npm run seed</code> or create a page with the slug
          &ldquo;home&rdquo; in the Studio.
        </p>
      </div>
    )
  }

  return <PageBuilder page={page as GetPageQueryResult} />
}
