'use client'

import {useState} from 'react'

import Image from '@/app/components/SanityImage'
import type {SanityImageData} from '@/sanity/lib/types'

type GalleryImage = NonNullable<SanityImageData> & {_key?: string}

/** Product gallery with thumbnails and a hover/tap zoom that follows the pointer */
export default function ProductGallery({images, name}: {images: GalleryImage[]; name: string}) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{x: number; y: number} | null>(null)
  const current = images[active]

  if (!current?.asset?._ref) return null

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 lg:flex-col" role="tablist" aria-label="Product images">
          {images.map((image, i) =>
            image.asset?._ref ? (
              <button
                key={image._key ?? i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setActive(i)}
                className={`relative h-20 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full transition-all lg:h-24 lg:w-20 ${
                  i === active ? 'ring-2 ring-forest ring-offset-2 ring-offset-paper' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  id={image.asset._ref}
                  alt=""
                  width={160}
                  height={200}
                  hotspot={image.hotspot}
                  crop={image.crop}
                  mode="cover"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : null,
          )}
        </div>
      )}
      <div
        className="arch relative aspect-[4/5] flex-1 cursor-zoom-in bg-paper-deep"
        style={current.lqip ? {backgroundImage: `url(${current.lqip})`, backgroundSize: 'cover'} : undefined}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const rect = e.currentTarget.getBoundingClientRect()
          setZoom({x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100})
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <Image
          key={current.asset._ref}
          id={current.asset._ref}
          alt={current.alt || name}
          width={1400}
          hotspot={current.hotspot}
          crop={current.crop}
          mode="cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out"
          style={
            zoom
              ? {transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%`}
              : {transform: 'scale(1)'}
          }
        />
      </div>
    </div>
  )
}
