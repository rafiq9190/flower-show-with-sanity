'use client'

import {useEffect} from 'react'

import {useCart} from '@/app/components/cart/CartProvider'

/** Empties the bag once an order has been confirmed */
export default function ClearCart() {
  const {clear, hydrated} = useCart()
  useEffect(() => {
    if (hydrated) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])
  return null
}
