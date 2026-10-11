import {CommentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const testimonialStrip = defineType({
  name: 'testimonialStrip',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description: 'Leave empty to show all testimonials.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Testimonials', subtitle: 'Testimonials'}),
  },
})
