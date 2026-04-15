import { Marquee } from '@/components/ui/marquee'
import { Badge } from '@/components/ui/badge'
import { mockListings } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/constants'
import { TrendingUp, Users, ImageIcon } from 'lucide-react'
import { Listing } from '@/types'

function MarqueeCard({ listing }: { listing: Listing }) {
  const category = CATEGORIES.find(c => c.value === listing.category)
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* Image placeholder */}
      <div className="flex h-36 items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground/25">
          <ImageIcon className="h-7 w-7" strokeWidth={1} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs font-normal">
            {category?.label}
          </Badge>
          {listing.featured && (
            <Badge className="text-xs font-normal border-0 bg-muted text-muted-foreground">
              Featured
            </Badge>
          )}
        </div>

        <p className="line-clamp-1 text-sm font-semibold">{listing.title}</p>
        {listing.tagline && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{listing.tagline}</p>
        )}

        <div className="flex items-center justify-between pt-1 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              ${formatNumber(listing.metrics.mrr || 0)} MRR
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(listing.metrics.users.total)}
            </span>
          </div>
          <span className="text-sm font-bold">${formatNumber(listing.price)}</span>
        </div>
      </div>
    </div>
  )
}

export function ListingMarquee() {
  const row1 = mockListings.slice(0, 3)
  const row2 = mockListings.slice(3, 6)

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

      <div className="space-y-4 py-4">
        <Marquee pauseOnHover>
          {[...row1, ...row1].map((listing, i) => (
            <MarqueeCard key={`r1-${i}`} listing={listing} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover>
          {[...row2, ...row2].map((listing, i) => (
            <MarqueeCard key={`r2-${i}`} listing={listing} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}
