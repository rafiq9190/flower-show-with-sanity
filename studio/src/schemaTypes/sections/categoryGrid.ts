import {ThLargeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const categoryGrid = defineType({
  name: 'categoryGrid',
  title: 'Category grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Leave empty to show all categories.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title, subtitle: 'Category grid'}),
  },
})
