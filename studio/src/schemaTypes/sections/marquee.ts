import {EllipsisHorizontalIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const marquee = defineType({
  name: 'marquee',
  title: 'Bloom marquee',
  type: 'object',
  icon: EllipsisHorizontalIcon,
  fields: [
    defineField({
      name: 'words',
      title: 'Words',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(3),
    }),
  ],
  preview: {
    select: {words: 'words'},
    prepare: ({words}) => ({title: (words || []).join(' · '), subtitle: 'Bloom marquee'}),
  },
})
