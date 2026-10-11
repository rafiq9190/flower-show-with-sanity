'use client'

import Link from 'next/link'
import {useEffect, useRef} from 'react'

import {useCart} from '@/app/components/cart/CartProvider'
import CartLines from '@/app/components/cart/CartLines'
import CartSummary from '@/app/components/cart/CartSummary'
import {CloseIcon} from '@/app/components/ui/Icons'
import {Stem} from '@/app/components/ui/Stem'

export default function CartDrawer() {
  const {isOpen, close, lines, count} = useCart()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[var(--ease-petal)] outline-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-3xl">
            Your bag <span className="text-base text-ink-soft italic">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-full p-2 hover:bg-ink/5"
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <Stem className="h-40 text-moss" />
            <p className="font-display text-2xl">Your bag is empty — for now.</p>
            <Link href="/shop" onClick={close} className="btn-primary">
              Find something lovely
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <CartLines onNavigate={close} />
            </div>
            <div className="border-t border-ink/10 bg-paper-deep/60 px-6 py-5">
              <CartSummary />
              <Link
                href="/cart"
                onClick={close}
                className="mt-3 block text-center text-xs text-ink-soft underline underline-offset-4"
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
