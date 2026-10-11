import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (rule) => rule.required()}),
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location / context', type: 'string'}),
    defineField({name: 'image', title: 'Photo', type: 'altImage'}),
  ],
  preview: {select: {title: 'name', subtitle: 'quote', media: 'image'}},
})
