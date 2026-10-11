import type {AllPostsQueryResult, GetPageQueryResult, ShopQueryResult} from '@/sanity.types'

export type PageBuilderSection = NonNullable<NonNullable<GetPageQueryResult>['pageBuilder']>[number]
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  {_type: T}
>

// Represents a Link after GROQ dereferencing (page/post become slug strings)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page' | 'post'
  href?: string
  page?: string | null
  post?: string | null
  openInNewTab?: boolean
}

/** Product shape shared by every product grid (see `productCard` in queries.ts) */
export type ProductCardData = ShopQueryResult[number]

/** Post shape shared by every post list (see `postFields` in queries.ts) */
export type PostCardData = AllPostsQueryResult[number]

/** An image projected with `imageFields` (asset reference plus LQIP placeholder) */
export type SanityImageData = {
  asset?: {_ref: string}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  alt?: string
  caption?: string
  lqip?: string | null
} | null
