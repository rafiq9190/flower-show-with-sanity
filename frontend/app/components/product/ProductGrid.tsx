import ProductCard from '@/app/components/product/ProductCard'
import type {ProductCardData} from '@/sanity/lib/types'

/** Asymmetric product grid — every other column is offset for a magazine feel */
export default function ProductGrid({
  products,
  numbered = false,
  columns = 4,
}: {
  products: ProductCardData[]
  numbered?: boolean
  columns?: 3 | 4
}) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/20 p-16 text-center">
        <p className="font-display text-2xl">Nothing blooming here yet.</p>
        <p className="mt-2 text-sm text-ink-soft">Try another filter — new stems arrive every morning.</p>
      </div>
    )
  }
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {products.map((product, i) => (
        <div key={product._id} className={i % 2 === 1 ? 'mt-10 lg:mt-16' : ''}>
          <ProductCard
            product={product}
            index={numbered ? i : undefined}
            shape={i % 3 === 1 ? 'arch' : 'rect'}
            sizes={columns === 4 ? '(min-width: 1024px) 22vw, 50vw' : '(min-width: 1024px) 30vw, 50vw'}
          />
        </div>
      ))}
    </div>
  )
}
