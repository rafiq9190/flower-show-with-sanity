import {DocumentsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const journalTeaser = defineType({
  name: 'journalTeaser',
  title: 'Journal teaser',
  type: 'object',
  icon: DocumentsIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title, subtitle: 'Latest journal posts'}),
  },
})
