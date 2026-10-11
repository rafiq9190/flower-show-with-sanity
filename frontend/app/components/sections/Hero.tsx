import ResolvedLink from '@/app/components/ResolvedLink'
import Emphasis from '@/app/components/ui/Emphasis'
import Photo from '@/app/components/ui/Photo'
import {SpinBadge, Stem} from '@/app/components/ui/Stem'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

type Props = {block: ExtractPageBuilderType<'hero'>}

export default function Hero({block}: Props) {
  const {eyebrow, heading, subheading, primaryButton, secondaryButton, images = []} = block
  const [main, second, third] = images || []

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-28">
      <Stem className="pointer-events-none absolute top-10 -left-6 hidden h-[26rem] text-moss/40 lg:block" />
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 lg:col-span-6 xl:col-span-6">
          {eyebrow && <p className="hero-in eyebrow">{eyebrow}</p>}
          <h1 className="hero-in mt-6 text-[clamp(3.2rem,8.5vw,7.5rem)] leading-[0.92] text-balance [animation-delay:120ms]">
            <Emphasis text={heading} emClassName="text-terracotta" />
          </h1>
          {subheading && (
            <p className="hero-in mt-8 max-w-md text-lg leading-relaxed text-ink-soft [animation-delay:240ms]">
              {subheading}
            </p>
          )}
          <div className="hero-in mt-10 flex flex-wrap gap-3 [animation-delay:360ms]">
            {primaryButton?.buttonText && primaryButton.link && (
              <ResolvedLink link={primaryButton.link} className="btn-primary">
                {primaryButton.buttonText} <span aria-hidden>→</span>
              </ResolvedLink>
            )}
            {secondaryButton?.buttonText && secondaryButton.link && (
              <ResolvedLink link={secondaryButton.link} className="btn-ghost">
                {secondaryButton.buttonText}
              </ResolvedLink>
            )}
          </div>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-6">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-xl">
            {main && (
              <Photo
                image={main}
                width={1200}
                sizes="(min-width: 1024px) 40vw, 90vw"
                priority
                className="arch reveal-clip absolute top-0 right-0 h-[88%] w-[72%] shadow-2xl shadow-forest/20"
              />
            )}
            {second && (
              <Photo
                image={second}
                width={700}
                sizes="(min-width: 1024px) 20vw, 45vw"
                priority
                className="oval absolute bottom-0 left-0 h-[52%] w-[44%] border-[6px] border-paper"
              />
            )}
            {third && (
              <Photo
                image={third}
                width={400}
                sizes="12rem"
                className="absolute top-[6%] left-[8%] h-[24%] w-[20%] animate-float rounded-full border-4 border-paper"
              />
            )}
            <SpinBadge
              text="seasonal · hand-tied · delivered · "
              className="absolute right-[-2%] bottom-[4%] h-28 w-28 rounded-full bg-blush text-ink sm:h-32 sm:w-32"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
