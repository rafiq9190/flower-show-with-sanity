/** Absolute site URL used for Stripe redirects, sitemap and metadata */
export function getSiteUrl(fallbackOrigin?: string | null) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  return (fromEnv || fallbackOrigin || 'http://localhost:3000').replace(/\/$/, '')
}
