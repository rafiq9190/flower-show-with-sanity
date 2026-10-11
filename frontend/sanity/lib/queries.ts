import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

/* -------------------------------------------------------------------------- */
/*                                  Fragments                                 */
/* -------------------------------------------------------------------------- */

const imageFields = /* groq */ `
  ...,
  "lqip": asset->metadata.lqip
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

const productCard = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  tagline,
  price,
  compareAtPrice,
  "fromPrice": coalesce(math::min(variants[].price), price),
  "variantCount": count(variants),
  inStock,
  featured,
  colors,
  "createdAt": _createdAt,
  "image": images[0]{${imageFields}},
  "hoverImage": images[1]{${imageFields}},
  "category": category->{title, "slug": slug.current},
`

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage{${imageFields}},
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  tags,
  featured,
  "readingTime": round(length(pt::text(content)) / 750),
`

const categoryCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  description,
  image{${imageFields}},
  "productCount": count(*[_type == "product" && references(^._id)])
`

const testimonialCard = /* groq */ `
  _id,
  quote,
  name,
  location,
  image{${imageFields}}
`

/* -------------------------------------------------------------------------- */
/*                                    Pages                                   */
/* -------------------------------------------------------------------------- */

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    seo,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "hero" => {
        ...,
        primaryButton {..., ${linkFields}},
        secondaryButton {..., ${linkFields}},
        images[]{${imageFields}}
      },
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        },
        image{${imageFields}}
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
      _type == "featuredProducts" => {
        ...,
        button {..., ${linkFields}},
        "products": select(
          count(products) > 0 => products[]->{${productCard}},
          *[_type == "product" && featured == true && defined(slug.current)] | order(_createdAt asc) [0...8] {${productCard}}
        )
      },
      _type == "categoryGrid" => {
        ...,
        "categories": select(
          count(categories) > 0 => categories[]->{${categoryCard}},
          *[_type == "category" && defined(slug.current)] | order(orderRank asc) {${categoryCard}}
        )
      },
      _type == "storyBlock" => {
        ...,
        button {..., ${linkFields}},
        image{${imageFields}},
        secondaryImage{${imageFields}}
      },
      _type == "testimonialStrip" => {
        ...,
        "testimonials": select(
          count(testimonials) > 0 => testimonials[]->{${testimonialCard}},
          *[_type == "testimonial"] | order(_createdAt asc) {${testimonialCard}}
        )
      },
      _type == "journalTeaser" => {
        ...,
        "posts": *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0...3] {${postFields}}
      },
      _type == "newsletter" => {
        ...,
        image{${imageFields}}
      },
    },
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current != "home"]
  {"slug": slug.current}
`)

/* -------------------------------------------------------------------------- */
/*                                    Shop                                    */
/* -------------------------------------------------------------------------- */

export const shopQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)
    && (!defined($category) || category->slug.current == $category)
    && (!defined($occasion) || $occasion in occasions[]->slug.current)
    && (!defined($color) || $color in colors)
  ] | order(featured desc, _createdAt asc) {
    ${productCard}
  }
`)

export const shopFacetsQuery = defineQuery(`
  {
    "categories": *[_type == "category" && defined(slug.current)] | order(orderRank asc) {title, "slug": slug.current},
    "occasions": *[_type == "occasion" && defined(slug.current)] | order(title asc) {title, "slug": slug.current},
  }
`)

export const productQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    ${productCard}
    variants[]{_key, label, stems, price},
    description,
    careNotes,
    "images": images[]{${imageFields}},
    "occasions": occasions[]->{title, "slug": slug.current},
    seo,
    "related": *[
      _type == "product" && _id != ^._id && defined(slug.current)
      && (category._ref == ^.category._ref || featured == true)
    ] | order(featured desc, _createdAt asc) [0...4] {${productCard}},
    "stories": *[_type == "post" && defined(slug.current) && references(^._id)] | order(date desc) [0...2] {${postFields}}
  }
`)

export const productSlugs = defineQuery(`
  *[_type == "product" && defined(slug.current)]{"slug": slug.current}
`)

export const categoryPageQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    description,
    image{${imageFields}},
    "products": *[_type == "product" && defined(slug.current) && references(^._id)] | order(featured desc, _createdAt asc) {${productCard}}
  }
`)

export const occasionPageQuery = defineQuery(`
  *[_type == "occasion" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    description,
    image{${imageFields}},
    "products": *[_type == "product" && defined(slug.current) && references(^._id)] | order(featured desc, _createdAt asc) {${productCard}}
  }
`)

export const categorySlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)]{"slug": slug.current}
`)

export const occasionSlugs = defineQuery(`
  *[_type == "occasion" && defined(slug.current)]{"slug": slug.current}
`)

/** Used server-side at checkout to re-price the cart from trusted data. */
export const checkoutProductsQuery = defineQuery(`
  *[_type == "product" && _id in $ids]{
    _id,
    name,
    price,
    inStock,
    "slug": slug.current,
    variants[]{_key, label, price},
    "image": images[0]
  }
`)

/* -------------------------------------------------------------------------- */
/*                                   Journal                                  */
/* -------------------------------------------------------------------------- */

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      },
      _type == "productCallout" => {
        ...,
        "product": product->{${productCard}}
      },
      _type == "altImage" => {${imageFields}}
    },
    ${postFields}
    seo,
    "relatedProducts": relatedProducts[]->{${productCard}},
    "morePosts": *[_type == "post" && _id != ^._id && defined(slug.current)] | order(date desc) [0...2] {${postFields}}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

/* -------------------------------------------------------------------------- */
/*                                    Misc                                    */
/* -------------------------------------------------------------------------- */

export const sitemapData = defineQuery(`
  *[_type in ["page", "post", "product", "category", "occasion"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const occasionsIndexQuery = defineQuery(`
  *[_type == "occasion" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    image{${imageFields}},
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)
