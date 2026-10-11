import {
  BasketIcon,
  CogIcon,
  DocumentsIcon,
  EnvelopeIcon,
  PackageIcon,
  StarIcon,
  TagIcon,
  UserIcon,
  DocumentTextIcon,
  CommentIcon,
  DocumentIcon,
} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

import {ORDER_STATUSES} from '../schemaTypes/documents/order'

/**
 * Studio navigation, grouped the way a florist works: shop, orders, journal, site.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Petal & Verse')
    .items([
      S.listItem()
        .title('Shop')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Shop')
            .items([
              S.documentTypeListItem('product').title('Products').icon(BasketIcon),
              S.documentTypeListItem('category').title('Categories').icon(TagIcon),
              S.documentTypeListItem('occasion').title('Occasions').icon(StarIcon),
              S.documentTypeListItem('testimonial').title('Testimonials').icon(CommentIcon),
            ]),
        ),
      S.listItem()
        .title('Orders')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Orders')
            .items([
              S.listItem()
                .title('All orders')
                .icon(PackageIcon)
                .child(
                  S.documentTypeList('order')
                    .title('All orders')
                    .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
                ),
              S.divider(),
              ...ORDER_STATUSES.map(({title, value}) =>
                S.listItem()
                  .id(`orders-${value}`)
                  .title(title)
                  .icon(PackageIcon)
                  .child(
                    S.documentTypeList('order')
                      .title(`${title} orders`)
                      .filter('_type == "order" && status == $status')
                      .params({status: value})
                      .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
                  ),
              ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Journal')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Journal')
            .items([
              S.documentTypeListItem('post').title('Posts').icon(DocumentTextIcon),
              S.documentTypeListItem('person').title('Authors').icon(UserIcon),
            ]),
        ),
      S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
      S.divider(),
      S.listItem()
        .title('Inbox')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Inbox')
            .items([
              S.documentTypeListItem('enquiry').title('Enquiries').icon(CommentIcon),
              S.documentTypeListItem('subscriber').title('Newsletter subscribers').icon(EnvelopeIcon),
            ]),
        ),
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
