import {useId} from 'react'

/** Hand-drawn botanical stem, used as a decorative divider and flourish */
export function Stem({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 120 320" fill="none" className={className} aria-hidden>
      <path
        d="M60 318C58 250 64 190 58 120 54 80 60 40 62 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M59 230c-18-6-34-22-40-42 20 2 36 18 40 42Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M60 180c16-10 34-14 48-10-10 14-28 18-48 10Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M58 120c-14-8-26-22-28-38 16 4 26 18 28 38Z" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M62 8c-10 4-16 14-14 24 4 10 16 12 22 4 8-8 4-24-8-28Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M62 8c6 6 8 14 4 22" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** Horizontal divider with a small flower in the middle */
export function FlowerRule({className = ''}: {className?: string}) {
  return (
    <div className={`flex items-center gap-4 text-ink/40 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.2">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="12" cy="7" rx="2.6" ry="4.2" transform={`rotate(${r} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  )
}

/** Circular rotating text badge, e.g. "hand-tied · same day · " */
export function SpinBadge({text, className = ''}: {text: string; className?: string}) {
  const id = useId()
  // Let callers override position/display (e.g. `absolute` or `hidden sm:grid`)
  const position = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative'
  const display = /(^|\s)hidden(\s|$)/.test(className) ? '' : 'grid'
  return (
    <div className={`${position} ${display} place-items-center ${className}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-current text-[10.5px] tracking-[0.32em] uppercase">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="12" cy="6.5" rx="2.4" ry="4.4" transform={`rotate(${r} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      </svg>
    </div>
  )
}
