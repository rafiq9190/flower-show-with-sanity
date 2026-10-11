import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata, Viewport} from 'next'
import {Fraunces, Inter} from 'next/font/google'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import {handleError} from '@/app/client-utils'
import CartDrawer from '@/app/components/cart/CartDrawer'
import {CartProvider} from '@/app/components/cart/CartProvider'
import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/site/Footer'
import Header from '@/app/components/site/Header'
import {getSiteUrl} from '@/lib/site'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = new URL(settings?.ogImage?.metadataBase || getSiteUrl())
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: `${title} — Seasonal flowers, delivered`,
    },
    description: toPlainText(description),
    openGraph: {
      siteName: title,
      type: 'website',
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#f6f1e7',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only z-[90] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <CartProvider
          deliveryFee={settings?.deliveryFee ?? 12}
          freeDeliveryThreshold={settings?.freeDeliveryThreshold ?? null}
        >
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--color-ink)',
                color: 'var(--color-paper)',
                border: 'none',
                borderRadius: '999px',
              },
            }}
          />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
