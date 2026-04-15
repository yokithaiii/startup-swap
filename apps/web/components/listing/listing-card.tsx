'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, Users, Eye, ImageIcon } from 'lucide-react'
import { Listing } from '@/types'
import { CATEGORIES } from '@/lib/constants'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const category = CATEGORIES.find(c => c.value === listing.category)
  const currencySymbol = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md py-0">
      <Link href={`/listing/${listing.slug}`} className="h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden border-b bg-muted">
          {listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
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
            className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader className="space-y-2 pb-3 pt-3">
          {/* Category & Views */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {category?.label}
            </Badge>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{listing.views}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {listing.title}
          </h3>

          {/* Tagline */}
          {listing.tagline && (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {listing.tagline}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {[...listing.techStack.frontend.slice(0, 2), ...listing.techStack.backend.slice(0, 2)].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
            {(listing.techStack.frontend.length + listing.techStack.backend.length > 4) && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{listing.techStack.frontend.length + listing.techStack.backend.length - 4}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">MRR</span>
              </div>
              <p className="font-semibold">{currencySymbol}{formatNumber(listing.metrics.mrr || 0)}</p>
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
