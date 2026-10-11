import {PackageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const ORDER_STATUSES = [
  {title: 'Paid', value: 'paid'},
  {title: 'Preparing', value: 'preparing'},
  {title: 'Out for delivery', value: 'out-for-delivery'},
  {title: 'Delivered', value: 'delivered'},
  {title: 'Cancelled', value: 'cancelled'},
]

/**
 * Orders are created by the Stripe webhook / checkout success page. Only `status` is editable in the Studio.
 */
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ORDER_STATUSES, layout: 'radio', direction: 'horizontal'},
      initialValue: 'paid',
    }),
    defineField({name: 'orderNumber', title: 'Order number', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({name: 'customerName', title: 'Customer name', type: 'string', readOnly: true}),
    defineField({name: 'phone', title: 'Phone', type: 'string', readOnly: true}),
    defineField({
      name: 'shippingAddress',
      title: 'Delivery address',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({name: 'name', type: 'string'}),
        defineField({name: 'line1', type: 'string'}),
        defineField({name: 'line2', type: 'string'}),
        defineField({name: 'city', type: 'string'}),
        defineField({name: 'state', type: 'string'}),
        defineField({name: 'postalCode', type: 'string'}),
        defineField({name: 'country', type: 'string'}),
      ],
    }),
    defineField({name: 'deliveryDate', title: 'Delivery date', type: 'date', readOnly: true}),
    defineField({name: 'giftMessage', title: 'Gift message', type: 'text', rows: 3, readOnly: true}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'orderItem',
          fields: [
            defineField({name: 'product', type: 'reference', to: [{type: 'product'}], weak: true}),
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'variant', type: 'string'}),
            defineField({name: 'quantity', type: 'number'}),
            defineField({name: 'unitPrice', title: 'Unit price (USD)', type: 'number'}),
          ],
          preview: {
            select: {name: 'name', variant: 'variant', quantity: 'quantity', unitPrice: 'unitPrice'},
            prepare: ({name, variant, quantity, unitPrice}) => ({
              title: `${quantity} × ${name}`,
              subtitle: [variant, unitPrice != null && `$${unitPrice}`].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    defineField({name: 'subtotal', title: 'Subtotal (USD)', type: 'number', readOnly: true}),
    defineField({name: 'shipping', title: 'Delivery fee (USD)', type: 'number', readOnly: true}),
    defineField({name: 'total', title: 'Total (USD)', type: 'number', readOnly: true}),
    defineField({name: 'stripeSessionId', title: 'Stripe session', type: 'string', readOnly: true}),
    defineField({name: 'createdAt', title: 'Placed at', type: 'datetime', readOnly: true}),
  ],
  orderings: [{title: 'Newest', name: 'createdDesc', by: [{field: 'createdAt', direction: 'desc'}]}],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      total: 'total',
      status: 'status',
      deliveryDate: 'deliveryDate',
    },
    prepare: ({orderNumber, customerName, total, status, deliveryDate}) => ({
      title: `${orderNumber || 'Order'} · ${customerName || 'Unknown'}`,
      subtitle: [status, total != null && `$${total}`, deliveryDate && `deliver ${deliveryDate}`]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
