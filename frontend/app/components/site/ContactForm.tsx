'use client'

import {useActionState} from 'react'

import {sendEnquiry, type FormState} from '@/app/actions'

const TOPICS = ['An order', 'Weddings & events', 'Corporate flowers', 'Subscriptions', 'Something else']

export default function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendEnquiry, {status: 'idle'})

  if (state.status === 'success') {
    return (
      <div className="rounded-[2rem] bg-blush-soft p-10 text-center">
        <p className="font-display text-3xl">Thank you ✿</p>
        <p className="mt-3 text-ink-soft">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs tracking-[0.2em] text-ink-soft uppercase">Your name</span>
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs tracking-[0.2em] text-ink-soft uppercase">Email</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
      </div>
      <fieldset>
        <legend className="mb-3 text-xs tracking-[0.2em] text-ink-soft uppercase">What&rsquo;s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic, i) => (
            <label key={topic} className="cursor-pointer">
              <input type="radio" name="topic" value={topic} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-block rounded-full border border-ink/15 px-4 py-2 text-sm transition-colors peer-checked:border-forest peer-checked:bg-forest peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-terracotta">
                {topic}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-1">
        <span className="text-xs tracking-[0.2em] text-ink-soft uppercase">Message</span>
        <textarea name="message" required minLength={10} rows={5} className="field resize-none" />
      </label>
      {state.status === 'error' && <p className="text-sm text-terracotta">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-primary justify-self-start">
        {pending ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
      </button>
    </form>
  )
}
