import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

/**
 * Inline product card that can be dropped into a journal post.
 */
export const productCallout = defineType({
  name: 'productCallout',
  title: 'Product callout',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'Optional line shown alongside the product, e.g. "What we used in this post".',
    }),
  ],
  preview: {
    select: {title: 'product.name', media: 'product.images.0', note: 'note'},
    prepare: ({title, media, note}) => ({
      title: title || 'No product selected',
      subtitle: note || 'Product callout',
      media,
    }),
  },
})
