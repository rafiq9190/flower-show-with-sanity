import type {Metadata, ResolvingMetadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'

import PostCard, {PostMeta} from '@/app/components/journal/PostCard'
import PortableText from '@/app/components/PortableText'
import ProductCard from '@/app/components/product/ProductCard'
import Photo from '@/app/components/ui/Photo'
import Image from '@/app/components/SanityImage'
import {FlowerRule} from '@/app/components/ui/Stem'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({query: postPagesSlugs, perspective: 'published', stega: false})
  return data
}

export async function generateMetadata(
  props: PageProps<'/journal/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({query: postQuery, params, stega: false})
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.seo?.title || post?.title,
    description: post?.seo?.description || post?.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post?.date,
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: PageProps<'/journal/[slug]'>) {
  const params = await props.params
  const {data: post} = await sanityFetch({query: postQuery, params})
  if (!post?._id) notFound()

  const content = (post.content || []) as PortableTextBlock[]
  const toc = content
    .filter((b) => b._type === 'block' && b.style === 'h2')
    .map((b) => ({
      key: b._key,
      text: (b.children as {text?: string}[] | undefined)?.map((c) => c.text).join('') || '',
    }))

  return (
    <>
      <article>
        <header className="container pt-12 text-center lg:pt-16">
          <Link href="/journal" className="hero-in eyebrow justify-center">
            The Journal
          </Link>
          <h1 className="hero-in mx-auto mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-balance [animation-delay:100ms]">
            {post.title}
          </h1>
          <div className="hero-in mt-8 flex flex-col items-center gap-4 [animation-delay:200ms]">
            {post.author?.firstName && (
              <div className="flex items-center gap-3 text-sm">
                {post.author.picture?.asset?._ref && (
                  <Image
                    id={post.author.picture.asset._ref}
                    alt=""
                    width={80}
                    height={80}
                    hotspot={post.author.picture.hotspot}
                    crop={post.author.picture.crop}
                    mode="cover"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <span>
                  Words by <strong className="font-medium">{post.author.firstName} {post.author.lastName}</strong>
                </span>
              </div>
            )}
            <PostMeta post={post} className="justify-center" />
          </div>
        </header>

        {post.coverImage && (
          <div className="container mt-12">
            <Photo
              image={post.coverImage}
              width={2000}
              priority
              sizes="100vw"
              className="reveal-clip aspect-[4/3] rounded-t-[50vw] rounded-b-[2rem] sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
        )}

        <div className="container mt-16 grid gap-12 lg:grid-cols-12">
          {toc.length > 2 && (
            <aside className="hidden lg:col-span-3 lg:block">
              <nav aria-label="In this story" className="sticky top-28">
                <p className="eyebrow">In this story</p>
                <ol className="mt-5 space-y-3 border-l border-ink/15 pl-5 text-sm">
                  {toc.map((h, i) => (
                    <li key={h.key}>
                      <a href={`#${h.key}`} className="text-ink-soft transition-colors hover:text-ink">
                        <span className="mr-2 font-display text-terracotta italic">{i + 1}.</span>
                        {h.text.replace(/^\d+\.\s*/, '')}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
          <div className={toc.length > 2 ? 'lg:col-span-7 lg:col-start-5' : 'mx-auto w-full max-w-2xl lg:col-span-12'}>
            {post.excerpt && (
              <p className="mb-10 font-display text-2xl leading-snug text-forest italic sm:text-3xl">{post.excerpt}</p>
            )}
            {content.length > 0 && (
              <PortableText
                className="prose prose-lg prose-petal first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-terracotta"
                value={content}
              />
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/journal?tag=${encodeURIComponent(t)}`}
                    className="rounded-full border border-ink/15 px-3 py-1 text-xs hover:border-ink"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {post.relatedProducts && post.relatedProducts.length > 0 && (
        <section className="mt-24 bg-blush-soft py-20">
          <div className="container">
            <p className="eyebrow">Shop the story</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Flowers from this <em className="font-wonk text-terracotta">piece</em>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {post.relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {post.morePosts && post.morePosts.length > 0 && (
        <section className="container mt-24">
          <FlowerRule />
          <h2 className="mt-12 text-4xl sm:text-5xl">Keep reading</h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {post.morePosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
