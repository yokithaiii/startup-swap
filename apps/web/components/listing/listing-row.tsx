'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, TrendingUp, Eye, ImageIcon, ExternalLink, Users } from 'lucide-react'
import { Listing } from '@/types'
import { CATEGORIES } from '@/lib/constants'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'

interface ListingRowProps {
  listing: Listing
}

export function ListingRow({ listing }: ListingRowProps) {
  const category     = CATEGORIES.find(c => c.value === listing.category)
  const symbol       = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'
  const { isFavorite, toggle } = useFavorites()
  const [favCount, setFavCount] = useState(listing.favorites)

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    const wasFav = isFavorite(listing.id)
    setFavCount(c => wasFav ? Math.max(0, c - 1) : c + 1)
    toggle(listing.id)
  }

  const allTech = [
    ...listing.techStack.frontend.slice(0, 2),
    ...listing.techStack.backend.slice(0, 1),
  ]
  const techExtra =
    listing.techStack.frontend.length +
    listing.techStack.backend.length - allTech.length

  return (
    <Card className="p-0">
      <CardContent className="p-5">
        <div className="flex items-start gap-5">

          {/* Thumbnail */}
          <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {listing.thumbnailUrl ? (
              <img
                src={listing.thumbnailUrl}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground/20" strokeWidth={1} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/listing/${listing.slug}`}
                    className="font-semibold leading-tight hover:underline underline-offset-2"
                  >
                    {listing.title}
                  </Link>
                  {listing.featured && (
                    <Badge className="border-0 bg-background text-foreground border border-border text-xs font-normal">
                      Топ
                    </Badge>
                  )}
                </div>
                {listing.tagline && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{listing.tagline}</p>
                )}
              </div>
              <span className="shrink-0 text-lg font-bold">
                {symbol}{fmt(listing.price)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {/* Category */}
              <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                {category?.label}
              </span>

              {/* MRR */}
              {(listing.metrics.mrr ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  MRR {symbol}{fmt(listing.metrics.mrr ?? 0)}
                </span>
              )}

              {/* Users */}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {fmt(listing.metrics.users.total)}
              </span>

              {/* Views */}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {listing.views}
              </span>

              {/* Traffic */}
              {listing.metrics.traffic.monthly > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {fmt(listing.metrics.traffic.monthly)}/мес
                </span>
              )}

              {/* Tech stack */}
              {allTech.map(t => (
                <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>
              ))}
              {techExtra > 0 && (
                <span className="text-xs text-muted-foreground">+{techExtra}</span>
              )}

              {/* Negotiable */}
              {listing.priceNegotiable && (
                <span className="text-xs text-muted-foreground">Торг уместен</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleFavorite}
            >
              <Heart className={cn('h-3.5 w-3.5 transition-colors', isFavorite(listing.id) && 'fill-rose-500 text-rose-500')} />
            </Button>
            <Link href={`/listing/${listing.slug}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
