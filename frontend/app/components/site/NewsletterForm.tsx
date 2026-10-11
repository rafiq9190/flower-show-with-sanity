'use client'

import {useActionState} from 'react'

import {subscribe, type FormState} from '@/app/actions'
import {ArrowIcon} from '@/app/components/ui/Icons'

export default function NewsletterForm({tone = 'light'}: {tone?: 'light' | 'dark'}) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, {status: 'idle'})
  const dark = tone === 'dark'

  if (state.status === 'success') {
    return <p className={`font-display text-xl italic ${dark ? 'text-blush' : 'text-forest'}`}>{state.message}</p>
  }

  return (
    <form action={action} className="w-full">
      <div
        className={`flex items-center border-b ${dark ? 'border-paper/40 focus-within:border-paper' : 'border-ink/30 focus-within:border-ink'}`}
      >
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className={`w-full bg-transparent py-3 text-base outline-none ${
            dark ? 'text-paper placeholder:text-paper/40' : 'text-ink placeholder:text-ink/40'
          }`}
        />
        <button
          type="submit"
          disabled={pending}
          className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full transition-transform hover:translate-x-1 disabled:opacity-50"
          aria-label="Subscribe"
        >
          <ArrowIcon />
        </button>
      </div>
      {state.status === 'error' && <p className="mt-2 text-xs text-terracotta">{state.message}</p>}
    </form>
  )
}
