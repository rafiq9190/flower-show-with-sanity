import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {product} from './documents/product'
import {category} from './documents/category'
import {occasion} from './documents/occasion'
import {order} from './documents/order'
import {testimonial} from './documents/testimonial'
import {subscriber} from './documents/subscriber'
import {enquiry} from './documents/enquiry'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {seo} from './objects/seo'
import {altImage} from './objects/altImage'
import {productCallout} from './objects/productCallout'
import {hero} from './sections/hero'
import {marquee} from './sections/marquee'
import {featuredProducts} from './sections/featuredProducts'
import {categoryGrid} from './sections/categoryGrid'
import {storyBlock} from './sections/storyBlock'
import {testimonialStrip} from './sections/testimonialStrip'
import {journalTeaser} from './sections/journalTeaser'
import {newsletter} from './sections/newsletter'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Shop
  product,
  category,
  occasion,
  order,
  testimonial,
  subscriber,
  enquiry,
  // Content
  page,
  post,
  person,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
  seo,
  altImage,
  productCallout,
  // Page builder sections
  hero,
  marquee,
  featuredProducts,
  categoryGrid,
  storyBlock,
  testimonialStrip,
  journalTeaser,
  newsletter,
]
