import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Wrap words in *asterisks* to set them in italic, e.g. "Flowers that *speak* softly".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'subheading', title: 'Subheading', type: 'text', rows: 3}),
    defineField({name: 'primaryButton', title: 'Primary button', type: 'button'}),
    defineField({name: 'secondaryButton', title: 'Secondary button', type: 'button'}),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Up to three images, arranged as an arch, an oval and a small inset.',
      of: [defineArrayMember({type: 'altImage'})],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'images.0'},
    prepare: ({title, media}) => ({title, subtitle: 'Hero', media}),
  },
})
