import Link from 'next/link'

import {Stem} from '@/app/components/ui/Stem'

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <Stem className="mx-auto h-44 text-moss" />
        <p className="mt-6 font-display text-[8rem] leading-none text-terracotta italic">404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">This page has wilted.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          The page you were looking for may have been moved, or perhaps it was only ever a bud.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back home
          </Link>
          <Link href="/shop" className="btn-ghost">
            Shop flowers
          </Link>
        </div>
      </div>
    </div>
  )
}
