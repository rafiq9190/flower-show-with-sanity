import ResolvedLink from '@/app/components/ResolvedLink'
import ProductGrid from '@/app/components/product/ProductGrid'
import SectionHeader from '@/app/components/ui/SectionHeader'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

export default function FeaturedProducts({block}: {block: ExtractPageBuilderType<'featuredProducts'>}) {
  return (
    <section className="container py-20 lg:py-28">
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} number="02">
        {block.button?.buttonText && block.button.link && (
          <ResolvedLink link={block.button.link} className="btn-ghost shrink-0 self-start md:self-auto">
            {block.button.buttonText}
          </ResolvedLink>
        )}
      </SectionHeader>
      <div className="mt-14">
        <ProductGrid products={(block.products || []).slice(0, 8)} numbered />
      </div>
    </section>
  )
}
