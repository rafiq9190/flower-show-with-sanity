import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const featuredProducts = defineType({
  name: 'featuredProducts',
  title: 'Featured products',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2}),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description: 'Leave empty to show products marked as "Featured".',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({name: 'button', title: 'Button', type: 'button'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title, subtitle: 'Featured products'}),
  },
})
