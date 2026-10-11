import {defineField, defineType} from 'sanity'

/**
 * Image with required alt text and optional caption. Used for product galleries and inline images.
 */
export const altImage = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    aiAssist: {imageDescriptionField: 'alt'},
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})
