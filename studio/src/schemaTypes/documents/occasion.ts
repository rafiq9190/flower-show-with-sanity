import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const occasion = defineType({
  name: 'occasion',
  title: 'Occasion',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Image', type: 'altImage'}),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
})
