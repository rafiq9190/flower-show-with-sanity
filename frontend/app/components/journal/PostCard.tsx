import {format} from 'date-fns'
import Link from 'next/link'

import Photo from '@/app/components/ui/Photo'
import type {PostCardData} from '@/sanity/lib/types'
import {dataAttr} from '@/sanity/lib/utils'

export function PostMeta({post, className = ''}: {post: Pick<PostCardData, 'date' | 'readingTime' | 'tags'>; className?: string}) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] tracking-[0.18em] text-ink-soft uppercase ${className}`}>
      {post.tags?.[0] && <span className="text-terracotta">{post.tags[0]}</span>}
      {post.date && <time dateTime={post.date}>{format(new Date(post.date), 'd MMM yyyy')}</time>}
      <span>{Math.max(1, post.readingTime ?? 1)} min read</span>
    </p>
  )
}

export default function PostCard({
  post,
  size = 'md',
  priority = false,
}: {
  post: PostCardData
  size?: 'lg' | 'md' | 'sm'
  priority?: boolean
}) {
  const large = size === 'lg'
  const small = size === 'sm'
  return (
    <article
      className={`group reveal relative ${small ? 'grid grid-cols-[7rem_1fr] items-center gap-5' : 'flex flex-col'}`}
      data-sanity={dataAttr({id: post._id, type: 'post', path: 'title'}).toString()}
    >
      <Link href={`/journal/${post.slug}`} className="block" aria-label={post.title}>
        <Photo
          image={post.coverImage}
          width={large ? 1400 : 800}
          sizes={large ? '(min-width: 1024px) 60vw, 100vw' : small ? '7rem' : '(min-width: 1024px) 33vw, 100vw'}
          priority={priority}
          className={
            small
              ? 'aspect-square rounded-full'
              : large
                ? 'aspect-[4/3] rounded-[2rem] lg:aspect-[16/11]'
                : 'aspect-[4/3] rounded-t-full rounded-b-2xl'
          }
          imgClassName="transition-transform duration-[1200ms] group-hover:scale-105"
        />
      </Link>
      <div className={small ? '' : 'mt-6'}>
        <PostMeta post={post} />
        <h3
          className={`mt-3 text-balance ${large ? 'text-4xl sm:text-5xl' : small ? 'text-xl' : 'text-2xl sm:text-3xl'}`}
        >
          <Link href={`/journal/${post.slug}`} className="link-underline">
            {post.title}
          </Link>
        </h3>
        {!small && post.excerpt && (
          <p className={`mt-3 text-ink-soft ${large ? 'max-w-xl text-lg' : 'line-clamp-3 text-sm'}`}>{post.excerpt}</p>
        )}
      </div>
    </article>
  )
}
