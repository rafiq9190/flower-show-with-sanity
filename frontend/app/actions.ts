'use server'

import {draftMode} from 'next/headers'

import {assertWriteToken, writeClient} from '@/sanity/lib/writeClient'

export async function disableDraftMode() {
  'use server'
  await Promise.allSettled([
    (await draftMode()).disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ])
}

export type FormState = {status: 'idle' | 'success' | 'error'; message?: string}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Newsletter sign-up — stores a `subscriber` document (idempotent per email) */
export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  if (!EMAIL_RE.test(email)) return {status: 'error', message: 'Please enter a valid email address.'}

  try {
    assertWriteToken()
    const id = `subscriber-${Buffer.from(email).toString('hex').slice(0, 60)}`
    await writeClient.createIfNotExists({
      _id: id,
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
    })
    return {status: 'success', message: 'Thank you — your first letter is on its way.'}
  } catch (error) {
    console.error(error)
    return {status: 'error', message: 'Sorry, we couldn’t sign you up right now. Please try again later.'}
  }
}

/** Contact form — stores an `enquiry` document for the team to follow up in the Studio */
export async function sendEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const topic = String(formData.get('topic') || 'General').trim()
  const message = String(formData.get('message') || '').trim()

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return {status: 'error', message: 'Please add your name, a valid email and a short message.'}
  }

  try {
    assertWriteToken()
    await writeClient.create({
      _type: 'enquiry',
      name: name.slice(0, 120),
      email: email.slice(0, 200),
      topic: topic.slice(0, 60),
      message: message.slice(0, 4000),
      receivedAt: new Date().toISOString(),
      handled: false,
    })
    return {status: 'success', message: 'Message received. We reply within one working day.'}
  } catch (error) {
    console.error(error)
    return {status: 'error', message: 'Sorry, something went wrong. Please email us instead.'}
  }
}
