import {CommentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      readOnly: true,
    }),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 6, readOnly: true}),
    defineField({name: 'receivedAt', title: 'Received at', type: 'datetime', readOnly: true}),
    defineField({name: 'handled', title: 'Handled', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {title: 'name', topic: 'topic', handled: 'handled'},
    prepare: ({title, topic, handled}) => ({
      title,
      subtitle: [topic, handled ? 'Handled' : 'New'].filter(Boolean).join(' · '),
    }),
  },
})
