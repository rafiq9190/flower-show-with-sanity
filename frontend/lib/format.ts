const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatPrice(value: number | null | undefined) {
  if (value == null) return ''
  return currency.format(value)
}

/** Formats a number padded to two digits, e.g. 3 → "03" — used for editorial numbering */
export function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Splits "Flowers that *speak*" into segments so the starred words can be italicised */
export function splitEmphasis(text: string | null | undefined) {
  if (!text) return []
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) => ({
    text: part.startsWith('*') && part.endsWith('*') ? part.slice(1, -1) : part,
    em: part.startsWith('*') && part.endsWith('*'),
  }))
}

/** Removes the *emphasis* markers for plain-text contexts like <title> */
export function stripEmphasis(text: string | null | undefined) {
  return (text || '').replace(/\*/g, '')
}
