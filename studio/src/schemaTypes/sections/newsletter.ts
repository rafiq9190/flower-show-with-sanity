import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter signup',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Image', type: 'altImage'}),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title, subtitle: 'Newsletter signup', media}),
  },
})
