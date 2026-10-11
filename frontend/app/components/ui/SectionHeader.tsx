import Emphasis from '@/app/components/ui/Emphasis'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  number?: string
  align?: 'left' | 'center'
  children?: React.ReactNode
}

/** Editorial section header with an oversized index number ("No. 02") */
export default function SectionHeader({eyebrow, heading, intro, number, align = 'left', children}: Props) {
  const centered = align === 'center'
  return (
    <div
      className={`reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        centered ? 'items-center text-center md:flex-col md:items-center' : ''
      }`}
    >
      <div className={`max-w-2xl ${centered ? 'mx-auto' : ''}`}>
        <div className={`flex items-baseline gap-4 ${centered ? 'justify-center' : ''}`}>
          {number && <span className="font-display text-sm text-terracotta italic">No. {number}</span>}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
        {heading && (
          <h2 className="mt-4 text-4xl text-balance sm:text-5xl lg:text-6xl">
            <Emphasis text={heading} />
          </h2>
        )}
        {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">{intro}</p>}
      </div>
      {children}
    </div>
  )
}
