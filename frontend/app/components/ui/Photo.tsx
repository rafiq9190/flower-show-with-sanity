import Image from '@/app/components/SanityImage'
import type {SanityImageData} from '@/sanity/lib/types'

type PhotoProps = {
  image: SanityImageData | undefined
  /** Requested pixel width for the largest srcset candidate */
  width?: number
  height?: number
  sizes?: string
  alt?: string
  /** Classes for the wrapper — give it a size or aspect ratio */
  className?: string
  imgClassName?: string
  priority?: boolean
}

/**
 * Server-safe Sanity image that fills its wrapper, with the LQIP blur as a background placeholder.
 */
export default function Photo({
  image,
  width = 1200,
  height,
  sizes = '100vw',
  alt,
  className = '',
  imgClassName = '',
  priority = false,
}: PhotoProps) {
  const ref = image?.asset?._ref
  // Only default to `relative` when the caller hasn't positioned the wrapper themselves
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className)
  return (
    <div
      className={`${positioned ? '' : 'relative'} overflow-hidden bg-paper-deep ${className}`}
      style={
        image?.lqip
          ? {backgroundImage: `url(${image.lqip})`, backgroundSize: 'cover', backgroundPosition: 'center'}
          : undefined
      }
    >
      {ref && (
        <Image
          id={ref}
          alt={alt ?? image?.alt ?? ''}
          width={width}
          height={height}
          hotspot={image?.hotspot}
          crop={image?.crop}
          mode="cover"
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  )
}
