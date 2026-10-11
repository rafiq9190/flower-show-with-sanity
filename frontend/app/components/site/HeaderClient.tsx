'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

import CartButton from '@/app/components/cart/CartButton'
import {CloseIcon, MenuIcon} from '@/app/components/ui/Icons'
import {Stem} from '@/app/components/ui/Stem'

export type NavItem = {label: string; href: string}

export default function HeaderClient({
  title,
  announcement,
  nav,
}: {
  title: string
  announcement: string[]
  nav: NavItem[]
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0])
  const [first, ...rest] = title.split(' & ')

  return (
    <>
      {announcement.length > 0 && (
        <div className="overflow-hidden bg-forest py-2 text-[0.7rem] tracking-[0.2em] text-paper uppercase">
          <div className="flex w-max animate-marquee gap-12 pr-12">
            {[...announcement, ...announcement, ...announcement, ...announcement].map((msg, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                {msg}
                <span aria-hidden className="text-blush">
                  ✿
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div
          className={`container flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}
        >
          <div className="flex flex-1 items-center">
            <button
              type="button"
              className="-ml-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={24} />
            </button>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-sm">
                {nav.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`link-underline py-1 ${isActive(item.href) ? 'bg-[length:100%_1px]' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="shrink-0 text-center font-display text-2xl leading-none tracking-tight sm:text-3xl"
          >
            {first}
            {rest.length > 0 && (
              <>
                {' '}
                <em className="font-wonk text-terracotta">&amp;</em> {rest.join(' & ')}
              </>
            )}
          </Link>

          <div className="flex flex-1 items-center justify-end gap-7">
            <ul className="hidden items-center gap-7 text-sm lg:flex">
              {nav.slice(4).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`link-underline py-1 ${isActive(item.href) ? 'bg-[length:100%_1px]' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[70] flex flex-col bg-forest text-paper transition-[clip-path] duration-700 ease-[var(--ease-petal)] lg:hidden ${
          menuOpen
            ? '[clip-path:circle(150%_at_2rem_2rem)]'
            : 'pointer-events-none [clip-path:circle(0%_at_2rem_2rem)]'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="container flex h-20 items-center justify-between">
          <span className="font-display text-2xl">{title}</span>
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full hover:bg-paper/10"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
          >
            <CloseIcon size={24} />
          </button>
        </div>
        <nav aria-label="Mobile" className="container flex flex-1 flex-col justify-center">
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  className="group flex items-baseline gap-4 font-display text-5xl"
                >
                  <span className="text-sm text-blush italic">0{i + 1}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-2 group-hover:italic">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Stem className="pointer-events-none absolute right-4 bottom-0 h-72 text-paper/20" />
      </div>
    </>
  )
}
