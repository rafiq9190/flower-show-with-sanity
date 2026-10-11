import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import CollectionView from '@/app/components/shop/CollectionView'
import {sanityFetch} from '@/sanity/lib/live'
import {categoryPageQuery, categorySlugs} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({query: categorySlugs, perspective: 'published', stega: false})
  return data
}

export async function generateMetadata(props: PageProps<'/category/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data} = await sanityFetch({query: categoryPageQuery, params, stega: false})
  const ogImage = resolveOpenGraphImage(data?.image)
  return {
    title: data?.title,
    description: data?.description,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function CategoryPage(props: PageProps<'/category/[slug]'>) {
  const params = await props.params
  const {data} = await sanityFetch({query: categoryPageQuery, params})
  if (!data?._id) notFound()
  return (
    <CollectionView
      kind="Category"
      title={data.title}
      description={data.description}
      image={data.image}
      products={data.products}
    />
  )
}
