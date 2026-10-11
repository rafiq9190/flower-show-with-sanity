import type {Metadata} from 'next'

import ContactForm from '@/app/components/site/ContactForm'
import {Stem} from '@/app/components/ui/Stem'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about orders, weddings, events and flower subscriptions.',
}

export default async function ContactPage() {
  const {data: settings} = await sanityFetch({query: settingsQuery})
  const contact = settings?.contact

  return (
    <div className="container relative pt-14 lg:pt-20">
      <Stem className="pointer-events-none absolute top-0 right-4 hidden h-96 text-moss/30 lg:block" />
      <p className="hero-in eyebrow">Say hello</p>
      <h1 className="hero-in mt-5 max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.92] [animation-delay:100ms]">
        Write to us, <em className="font-wonk text-terracotta">we write back</em>.
      </h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          {contact?.address && (
            <div>
              <h2 className="eyebrow">The studio</h2>
              <p className="mt-3 font-display text-2xl whitespace-pre-line">{contact.address}</p>
            </div>
          )}
          {contact?.hours && (
            <div>
              <h2 className="eyebrow">Opening hours</h2>
              <p className="mt-3 whitespace-pre-line text-ink-soft">{contact.hours}</p>
            </div>
          )}
          <div>
            <h2 className="eyebrow">Direct</h2>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="link-underline mt-3 block font-display text-2xl">
                {contact.email}
              </a>
            )}
            {contact?.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="mt-1 block text-ink-soft">
                {contact.phone}
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
