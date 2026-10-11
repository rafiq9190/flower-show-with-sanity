import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'subscribedAt', title: 'Subscribed at', type: 'datetime'}),
  ],
  preview: {select: {title: 'email', subtitle: 'subscribedAt'}},
})
