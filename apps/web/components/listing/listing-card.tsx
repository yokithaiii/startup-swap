'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, Users, Eye, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Listing } from '@/types'
import { CATEGORIES } from '@/lib/constants'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const category     = CATEGORIES.find(c => c.value === listing.category)
  const currencySymbol = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'
  const { isFavorite, toggle } = useFavorites()
  const [favCount, setFavCount] = useState(listing.favorites)

  // Собираем все изображения: сначала images[], потом thumbnailUrl как fallback
  const allImages = listing.images?.length
    ? listing.images
    : listing.thumbnailUrl
    ? [listing.thumbnailUrl]
    : []

  const hasMultiple = allImages.length > 1

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: hasMultiple })
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    emblaApi?.scrollPrev()
    setActiveIndex(i => (i - 1 + allImages.length) % allImages.length)
  }, [emblaApi, allImages.length])

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    emblaApi?.scrollNext()
    setActiveIndex(i => (i + 1) % allImages.length)
  }, [emblaApi, allImages.length])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000)    return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    const wasFav = isFavorite(listing.id)
    setFavCount(c => wasFav ? Math.max(0, c - 1) : c + 1)
    toggle(listing.id)
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md py-0">
      <Link href={`/listing/${listing.slug}`} className="h-full flex flex-col">

        {/* Image / Slider */}
        <div className="relative h-44 overflow-hidden border-b bg-muted">
          {allImages.length > 0 ? (
            <>
              {/* Embla viewport */}
              <div ref={emblaRef} className="h-full overflow-hidden">
                <div className="flex h-full">
                  {allImages.map((src, i) => (
                    <div key={i} className="relative h-full min-w-full shrink-0">
                      <Image
                        src={src}
                        alt={`${listing.title} — фото ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                          'object-cover transition-transform duration-300',
                          !hasMultiple && 'group-hover:scale-105',
                        )}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Стрелки — только если картинок > 1 */}
              {hasMultiple && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-background"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-background"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Точки-индикаторы */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {allImages.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-1 rounded-full transition-all',
                          i === activeIndex
                            ? 'w-4 bg-white'
                            : 'w-1 bg-white/50',
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground/25">
                <ImageIcon className="h-8 w-8" strokeWidth={1} />
                <span className="text-xs">Нет фото</span>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {listing.featured && (
            <Badge className="absolute left-3 top-3 border-0 bg-background/90 text-foreground backdrop-blur-sm">
              Топ
            </Badge>
          )}

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              'absolute top-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100',
              hasMultiple ? 'right-3' : 'right-3',
            )}
            onClick={handleFavorite}
          >
            <Heart className={cn('h-4 w-4 transition-colors', isFavorite(listing.id) && 'fill-rose-500 text-rose-500')} />
          </Button>

          {/* Favorites count */}
          {favCount > 0 && !hasMultiple && (
            <div className={cn(
              'absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm transition-colors',
              isFavorite(listing.id)
                ? 'bg-rose-500/20 text-rose-500'
                : 'bg-background/80 text-muted-foreground',
            )}>
              <Heart className={cn('h-3 w-3', isFavorite(listing.id) && 'fill-rose-500')} />
              {favCount}
            </div>
          )}
        </div>

        <CardHeader className="space-y-2 pb-3 pt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">{category?.label}</Badge>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{listing.views}</span>
            </div>
          </div>
          <h3 className="line-clamp-1 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
          {listing.tagline && (
            <p className="line-clamp-1 text-sm text-muted-foreground">{listing.tagline}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[...listing.techStack.frontend.slice(0, 2), ...listing.techStack.backend.slice(0, 2)].map(tech => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">{tech}</Badge>
            ))}
            {listing.techStack.frontend.length + listing.techStack.backend.length > 4 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{listing.techStack.frontend.length + listing.techStack.backend.length - 4}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">MRR</span>
              </div>
              <p className="font-semibold text-emerald-500">{currencySymbol}{formatNumber(listing.metrics.mrr || 0)}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="text-xs">Польз.</span>
              </div>
              <p className="font-semibold">{formatNumber(listing.metrics.users.total)}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span className="text-xs">Трафик</span>
              </div>
              <p className="font-semibold">{formatNumber(listing.metrics.traffic.monthly)}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-3 mt-auto">
          <div>
            <p className="text-xl font-bold tracking-tight">
              {currencySymbol}{formatNumber(listing.price)}
            </p>
            {listing.priceNegotiable && (
              <p className="text-xs text-muted-foreground">Торг уместен</p>
            )}
          </div>
          <Button size="sm" variant="ghost" className="gap-1 text-sm">
            Открыть <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
