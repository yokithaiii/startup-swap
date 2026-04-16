'use client'

import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  images: string[]
  title: string
  featured?: boolean
}

export function ImageSlider({ images, title, featured }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [current, setCurrent] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  // Подписываемся на select через useEffect — единственный надёжный способ
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  const openLightbox = (i: number) => {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  if (!images.length) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground/20" strokeWidth={1} />
        </div>
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            Топ
          </span>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted group">
        {/* Embla viewport */}
        <div className="h-full w-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {images.map((src, i) => (
              <div
                key={src}
                className="relative h-full w-full shrink-0 cursor-zoom-in"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={src}
                  alt={`${title} — ${i + 1}`}
                  className="h-full w-full object-cover select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-200',
                    i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2 py-0.5 text-xs backdrop-blur-sm">
              {current + 1} / {images.length}
            </div>
          </>
        )}

        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            Топ
          </span>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map(src => ({ src }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(0,0,0,0.92)' } as any }}
      />
    </>
  )
}
