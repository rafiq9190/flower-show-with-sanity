'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState} from 'react'

export type CartLine = {
  id: string
  productId: string
  slug: string
  name: string
  variantKey?: string
  variantLabel?: string
  price: number
  imageRef?: string
  imageAlt?: string
  quantity: number
}

type CartState = {
  lines: CartLine[]
  deliveryDate: string
  giftMessage: string
  hydrated: boolean
}

type Action =
  | {type: 'hydrate'; state: Partial<CartState> | null}
  | {type: 'add'; line: Omit<CartLine, 'quantity' | 'id'>; quantity: number}
  | {type: 'remove'; id: string}
  | {type: 'setQuantity'; id: string; quantity: number}
  | {type: 'setDetails'; deliveryDate?: string; giftMessage?: string}
  | {type: 'clear'}

const STORAGE_KEY = 'petal-verse-cart-v1'
const MAX_QTY = 20

const emptyState: CartState = {lines: [], deliveryDate: '', giftMessage: '', hydrated: false}

const lineId = (productId: string, variantKey?: string) => `${productId}:${variantKey || 'default'}`

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        ...(Array.isArray(action.state?.lines) ? action.state : {}),
        hydrated: true,
      }
    case 'add': {
      const id = lineId(action.line.productId, action.line.variantKey)
      const existing = state.lines.find((l) => l.id === id)
      const lines = existing
        ? state.lines.map((l) =>
            l.id === id ? {...l, ...action.line, quantity: Math.min(MAX_QTY, l.quantity + action.quantity)} : l,
          )
        : [...state.lines, {...action.line, id, quantity: Math.min(MAX_QTY, action.quantity)}]
      return {...state, lines}
    }
    case 'remove':
      return {...state, lines: state.lines.filter((l) => l.id !== action.id)}
    case 'setQuantity':
      return {
        ...state,
        lines:
          action.quantity <= 0
            ? state.lines.filter((l) => l.id !== action.id)
            : state.lines.map((l) =>
                l.id === action.id ? {...l, quantity: Math.min(MAX_QTY, action.quantity)} : l,
              ),
      }
    case 'setDetails':
      return {
        ...state,
        deliveryDate: action.deliveryDate ?? state.deliveryDate,
        giftMessage: action.giftMessage ?? state.giftMessage,
      }
    case 'clear':
      return {...emptyState, hydrated: state.hydrated}
  }
}

type CartContextValue = CartState & {
  count: number
  subtotal: number
  isOpen: boolean
  deliveryFee: number
  freeDeliveryThreshold: number | null
  open: () => void
  close: () => void
  addItem: (line: Omit<CartLine, 'quantity' | 'id'>, quantity?: number) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  setDetails: (details: {deliveryDate?: string; giftMessage?: string}) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  children,
  deliveryFee = 12,
  freeDeliveryThreshold = null,
}: {
  children: React.ReactNode
  deliveryFee?: number
  freeDeliveryThreshold?: number | null
}) {
  const [state, dispatch] = useReducer(reducer, emptyState)
  const [isOpen, setOpen] = useState(false)
  const {hydrated} = state

  // Restore the cart from this browser. Storage can be unavailable (private mode), so guard every access.
  useEffect(() => {
    let saved: Partial<CartState> | null = null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) saved = JSON.parse(raw)
    } catch {
      // ignore
    }
    dispatch({type: 'hydrate', state: saved})
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      const {lines, deliveryDate, giftMessage} = state
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({lines, deliveryDate, giftMessage}))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  // Lock page scroll while the drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  const addItem = useCallback((line: Omit<CartLine, 'quantity' | 'id'>, quantity = 1) => {
    dispatch({type: 'add', line, quantity})
    setOpen(true)
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      count: state.lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: state.lines.reduce((sum, l) => sum + l.quantity * l.price, 0),
      isOpen,
      deliveryFee,
      freeDeliveryThreshold,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addItem,
      removeItem: (id) => dispatch({type: 'remove', id}),
      setQuantity: (id, quantity) => dispatch({type: 'setQuantity', id, quantity}),
      setDetails: (details) => dispatch({type: 'setDetails', ...details}),
      clear: () => dispatch({type: 'clear'}),
    }),
    [state, isOpen, deliveryFee, freeDeliveryThreshold, addItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
