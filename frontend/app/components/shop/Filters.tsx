import Link from 'next/link'

export type ShopParams = {
  category?: string
  occasion?: string
  color?: string
  price?: string
  sort?: string
}

type Option = {title: string | null; slug: string | null}

export const COLORS = [
  {slug: 'blush', title: 'Blush', swatch: '#e9c4be'},
  {slug: 'white', title: 'White', swatch: '#fbf8f1'},
  {slug: 'red', title: 'Red', swatch: '#a8262b'},
  {slug: 'yellow', title: 'Yellow', swatch: '#f1c232'},
  {slug: 'purple', title: 'Purple', swatch: '#8166a8'},
  {slug: 'orange', title: 'Orange', swatch: '#e07a3f'},
  {slug: 'green', title: 'Green', swatch: '#7c8b5a'},
]

export const PRICES = [
  {slug: 'under-50', title: 'Under $50', min: 0, max: 50},
  {slug: '50-100', title: '$50 – $100', min: 50, max: 100},
  {slug: 'over-100', title: 'Over $100', min: 100, max: Infinity},
]

export const SORTS = [
  {slug: 'featured', title: 'Featured'},
  {slug: 'price-asc', title: 'Price: low to high'},
  {slug: 'price-desc', title: 'Price: high to low'},
  {slug: 'newest', title: 'Newest'},
]

function href(current: ShopParams, key: keyof ShopParams, value?: string) {
  const next = new URLSearchParams()
  for (const [k, v] of Object.entries(current)) if (v) next.set(k, v)
  if (!value || current[key] === value) next.delete(key)
  else next.set(key, value)
  const qs = next.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

function Chip({active, href, children}: {active: boolean; href: string; children: React.ReactNode}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors ${
        active ? 'border-forest bg-forest text-paper' : 'border-ink/15 hover:border-ink'
      }`}
    >
      {children}
    </Link>
  )
}

function Group({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
      <span className="w-24 shrink-0 text-[0.7rem] tracking-[0.2em] text-ink-soft uppercase">{label}</span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
        {children}
      </div>
    </div>
  )
}

export default function Filters({
  params,
  categories,
  occasions,
}: {
  params: ShopParams
  categories: Option[]
  occasions: Option[]
}) {
  const activeCount = [params.category, params.occasion, params.color, params.price].filter(Boolean).length
  return (
    <div className="flex flex-col gap-5">
      <Group label="Category">
        <Chip active={!params.category} href={href(params, 'category')}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={params.category === c.slug} href={href(params, 'category', c.slug!)}>
            {c.title}
          </Chip>
        ))}
      </Group>
      <Group label="Occasion">
        {occasions.map((o) => (
          <Chip key={o.slug} active={params.occasion === o.slug} href={href(params, 'occasion', o.slug!)}>
            {o.title}
          </Chip>
        ))}
      </Group>
      <Group label="Colour">
        {COLORS.map((c) => (
          <Chip key={c.slug} active={params.color === c.slug} href={href(params, 'color', c.slug)}>
            <span className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{background: c.swatch}} />
            {c.title}
          </Chip>
        ))}
      </Group>
      <Group label="Price">
        {PRICES.map((p) => (
          <Chip key={p.slug} active={params.price === p.slug} href={href(params, 'price', p.slug)}>
            {p.title}
          </Chip>
        ))}
        {activeCount > 0 && (
          <Link href={params.sort ? `/shop?sort=${params.sort}` : '/shop'} scroll={false} className="self-center px-3 text-sm underline underline-offset-4">
            Clear all
          </Link>
        )}
      </Group>
    </div>
  )
}

export function SortLinks({params}: {params: ShopParams}) {
  const current = params.sort || 'featured'
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span className="text-[0.7rem] tracking-[0.2em] text-ink-soft uppercase">Sort</span>
      {SORTS.map((s) => (
        <Link
          key={s.slug}
          href={href({...params, sort: undefined}, 'sort', s.slug === 'featured' ? undefined : s.slug)}
          scroll={false}
          className={current === s.slug ? 'font-medium underline underline-offset-4' : 'text-ink-soft hover:text-ink'}
        >
          {s.title}
        </Link>
      ))}
    </div>
  )
}
