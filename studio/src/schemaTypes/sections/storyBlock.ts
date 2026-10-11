import {BookIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const storyBlock = defineType({
  name: 'storyBlock',
  title: 'Story block',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Wrap words in *asterisks* to set them in italic.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'blockContentTextOnly'}),
    defineField({name: 'image', title: 'Main image', type: 'altImage'}),
    defineField({name: 'secondaryImage', title: 'Inset image', type: 'altImage'}),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({name: 'button', title: 'Button', type: 'button'}),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {list: ['left', 'right'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'left',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          {title: 'Paper', value: 'paper'},
          {title: 'Forest', value: 'forest'},
          {title: 'Blush', value: 'blush'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'paper',
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare: ({title, media}) => ({title, subtitle: 'Story block', media}),
  },
})
