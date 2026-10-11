import Link from 'next/link'

import NewsletterForm from '@/app/components/site/NewsletterForm'
import {InstagramIcon, PinterestIcon} from '@/app/components/ui/Icons'
import {SpinBadge} from '@/app/components/ui/Stem'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

const SHOP_LINKS = [
  {label: 'Shop all', href: '/shop'},
  {label: 'Bouquets', href: '/category/bouquets'},
  {label: 'Arrangements', href: '/category/arrangements'},
  {label: 'Dried & Everlasting', href: '/category/dried'},
  {label: 'House Plants', href: '/category/plants'},
  {label: 'Gifts & Subscriptions', href: '/category/gifts'},
]

const STUDIO_LINKS = [
  {label: 'About us', href: '/about'},
  {label: 'The Journal', href: '/journal'},
  {label: 'Occasions', href: '/occasions'},
  {label: 'Delivery & care', href: '/delivery'},
  {label: 'Contact', href: '/contact'},
]

export default async function Footer() {
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})
  const contact = settings?.contact
  const title = settings?.title || 'Petal & Verse'

  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-forest-deep text-paper sm:rounded-t-[4rem]">
      <div className="container pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-blush">Letters, in bloom</p>
            <h2 className="mt-5 max-w-md text-4xl sm:text-5xl">
              Seasonal notes, once a <em className="font-wonk text-blush">month</em>.
            </h2>
            <div className="mt-8 max-w-md">
              <NewsletterForm tone="dark" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] text-paper/50 uppercase">Shop</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {SHOP_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] text-paper/50 uppercase">Studio</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {STUDIO_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-sans text-xs tracking-[0.2em] text-paper/50 uppercase">Visit</h3>
              <div className="mt-5 space-y-4 text-sm text-paper/80">
                {contact?.address && <p className="whitespace-pre-line">{contact.address}</p>}
                {contact?.hours && <p className="whitespace-pre-line">{contact.hours}</p>}
                {contact?.email && (
                  <p>
                    <a href={`mailto:${contact.email}`} className="link-underline text-paper">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact?.phone && <p>{contact.phone}</p>}
                <div className="flex gap-3 pt-1">
                  {contact?.instagram && (
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="grid h-10 w-10 place-items-center rounded-full border border-paper/25 hover:bg-paper hover:text-ink"
                    >
                      <InstagramIcon size={18} />
                    </a>
                  )}
                  {contact?.pinterest && (
                    <a
                      href={contact.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Pinterest"
                      className="grid h-10 w-10 place-items-center rounded-full border border-paper/25 hover:bg-paper hover:text-ink"
                    >
                      <PinterestIcon size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-20">
          <SpinBadge
            text="hand-tied · foam-free · same-day · "
            className="absolute -top-14 right-0 hidden h-28 w-28 text-blush sm:grid"
          />
          <p
            aria-hidden
            className="font-display text-[19vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-paper/95 select-none lg:text-[16.5vw]"
          >
            {title.split(' & ')[0]}
            <em className="font-wonk text-blush">&amp;</em>
            {title.split(' & ')[1] ?? ''}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {title}. {settings?.tagline}
          </p>
        
        </div>
      </div>
    </footer>
  )
}
