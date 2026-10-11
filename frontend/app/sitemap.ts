import type {MetadataRoute} from 'next'

import {getSiteUrl} from '@/lib/site'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

const PATHS: Record<string, (slug: string) => string> = {
  page: (slug) => (slug === 'home' ? '' : `/${slug}`),
  post: (slug) => `/journal/${slug}`,
  product: (slug) => `/shop/${slug}`,
  category: (slug) => `/category/${slug}`,
  occasion: (slug) => `/occasion/${slug}`,
}

const PRIORITY: Record<string, number> = {page: 0.8, product: 0.9, category: 0.7, occasion: 0.6, post: 0.6}

/**
 * Generates /sitemap.xml from every routable Sanity document plus the static routes.
 * Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const {data} = await sanityFetch({query: sitemapData, perspective: 'published', stega: false})

  const staticRoutes: MetadataRoute.Sitemap = ['/shop', '/journal', '/occasions', '/contact'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const dynamicRoutes: MetadataRoute.Sitemap = (data || [])
    .filter((doc) => doc.slug && PATHS[doc._type])
    .map((doc) => ({
      url: `${base}${PATHS[doc._type](doc.slug!)}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: doc._type === 'post' ? 'monthly' : 'weekly',
      priority: doc.slug === 'home' ? 1 : PRIORITY[doc._type],
    }))

  return [...dynamicRoutes, ...staticRoutes]
}
