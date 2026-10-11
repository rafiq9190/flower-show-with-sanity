import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import CollectionView from '@/app/components/shop/CollectionView'
import {sanityFetch} from '@/sanity/lib/live'
import {occasionPageQuery, occasionSlugs} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({query: occasionSlugs, perspective: 'published', stega: false})
  return data
}

export async function generateMetadata(props: PageProps<'/occasion/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data} = await sanityFetch({query: occasionPageQuery, params, stega: false})
  const ogImage = resolveOpenGraphImage(data?.image)
  return {
    title: data?.title,
    description: data?.description,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function OccasionPage(props: PageProps<'/occasion/[slug]'>) {
  const params = await props.params
  const {data} = await sanityFetch({query: occasionPageQuery, params})
  if (!data?._id) notFound()
  return (
    <CollectionView
      kind="Occasion"
      title={data.title}
      description={data.description}
      image={data.image}
      products={data.products}
    />
  )
}
