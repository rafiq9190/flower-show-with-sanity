import 'server-only'

import {client} from '@/sanity/lib/client'

/**
 * Client with write access, used for orders, newsletter sign-ups and enquiries.
 * Requires SANITY_API_WRITE_TOKEN (an Editor token) — never expose this to the browser.
 */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN

export const writeClient = client.withConfig({
  token: writeToken,
  useCdn: false,
  perspective: 'raw',
  stega: false,
})

export function assertWriteToken() {
  if (!writeToken) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN — add an Editor token to frontend/.env.local')
  }
}
