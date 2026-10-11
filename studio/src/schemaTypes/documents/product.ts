import {BasketIcon, ImagesIcon, TagIcon, SearchIcon, DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const PRODUCT_COLORS = [
  {title: 'Blush', value: 'blush'},
  {title: 'White', value: 'white'},
  {title: 'Red', value: 'red'},
  {title: 'Yellow', value: 'yellow'},
  {title: 'Purple', value: 'purple'},
  {title: 'Orange', value: 'orange'},
  {title: 'Green', value: 'green'},
]

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  groups: [
    {name: 'details', title: 'Details', icon: DocumentTextIcon, default: true},
    {name: 'media', title: 'Media', icon: ImagesIcon},
    {name: 'merch', title: 'Merchandising', icon: TagIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'details',
      description: 'A short poetic line shown on product cards.',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      group: 'details',
      description: 'Base price. Used when the product has no size options.',
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price (USD)',
      type: 'number',
      group: 'details',
      description: 'Optional original price, shown struck through.',
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: 'variants',
      title: 'Size options',
      type: 'array',
      group: 'details',
      description: 'e.g. Petite / Classic / Grand. The first option is selected by default.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'stems', title: 'Stem count / size note', type: 'string'}),
            defineField({
              name: 'price',
              title: 'Price (USD)',
              type: 'number',
              validation: (rule) => rule.required().min(0).precision(2),
            }),
          ],
          preview: {
            select: {title: 'label', price: 'price', stems: 'stems'},
            prepare: ({title, price, stems}) => ({
              title,
              subtitle: [price != null && `$${price}`, stems].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContentTextOnly',
      group: 'details',
    }),
    defineField({
      name: 'careNotes',
      title: 'Care notes',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      description: 'The second image is shown when hovering over the product card.',
      of: [defineArrayMember({type: 'altImage'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'merch',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'occasions',
      title: 'Occasions',
      type: 'array',
      group: 'merch',
      of: [defineArrayMember({type: 'reference', to: [{type: 'occasion'}]})],
    }),
    defineField({
      name: 'colors',
      title: 'Colour palette',
      type: 'array',
      group: 'merch',
      of: [defineArrayMember({type: 'string'})],
      options: {list: PRODUCT_COLORS, layout: 'grid'},
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'merch',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      group: 'merch',
      initialValue: true,
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Price, low to high', name: 'priceAsc', by: [{field: 'price', direction: 'asc'}]},
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', price: 'price', category: 'category.title', media: 'images.0', inStock: 'inStock'},
    prepare: ({title, price, category, media, inStock}) => ({
      title,
      subtitle: [price != null && `$${price}`, category, inStock === false && 'Sold out']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
