import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Shown at the top of the page. Hidden on the homepage, which starts with its Hero section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'marquee'},
        {type: 'categoryGrid'},
        {type: 'featuredProducts'},
        {type: 'storyBlock'},
        {type: 'testimonialStrip'},
        {type: 'journalTeaser'},
        {type: 'newsletter'},
        {type: 'callToAction'},
        {type: 'infoSection'},
      ],
      options: {
        insertMenu: {
          views: [{name: 'list'}],
        },
      },
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
})
