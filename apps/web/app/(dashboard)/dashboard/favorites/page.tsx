'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORIES } from '@/lib/constants'
import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'
import {
  Heart, Package, TrendingUp, Eye,
  ExternalLink, ImageIcon, X, LayoutList, LayoutGrid,
} from 'lucide-react'

interface FavoriteListing {
  id:            string
  title:         string
  tagline:       string | null
  slug:          string
  category:      string
  price:         number
  currency:      string
  thumbnail_url: string | null
  views:         number
  favorites:     number
  metrics:       any
  featured:      boolean
  tech_frontend: string[]
  tech_backend:  string[]
}

type ViewMode = 'list' | 'grid'

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

/* ─── List row ───────────────────────────────────────────── */

function ListRow({
  listing,
  onRemove,
}: {
  listing: FavoriteListing
  onRemove: (id: string) => void
}) {
  const category = CATEGORIES.find(c => c.value === listing.category)
  const symbol   = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'
  const mrr      = listing.metrics?.mrr ?? 0
  const allTech  = [...(listing.tech_frontend ?? []), ...(listing.tech_backend ?? [])]

  return (
    <Card className="p-0">
      <CardContent className="p-5">
        <div className="flex items-start gap-5">
          {/* Thumbnail */}
          <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {listing.thumbnail_url ? (
              <img
                src={listing.thumbnail_url}
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
                <h3 className="truncate font-semibold leading-tight">{listing.title}</h3>
                {listing.tagline && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{listing.tagline}</p>
                )}
              </div>
              <span className="shrink-0 font-bold text-base">
                {symbol}{Number(listing.price).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                {category?.label}
              </span>
              {mrr > 0 && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" />
                  MRR {symbol}{fmt(mrr)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />{listing.views}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />{listing.favorites}
              </span>
              {allTech.slice(0, 3).map(t => (
                <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>
              ))}
              {allTech.length > 3 && (
                <span className="text-xs text-muted-foreground">+{allTech.length - 3}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/listing/${listing.slug}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(listing.id)}
              title="Убрать из избранного"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Grid card ──────────────────────────────────────────── */

function GridCard({
  listing,
  onRemove,
}: {
  listing: FavoriteListing
  onRemove: (id: string) => void
}) {
  const category = CATEGORIES.find(c => c.value === listing.category)
  const symbol   = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'
  const mrr      = listing.metrics?.mrr ?? 0
  const allTech  = [...(listing.tech_frontend ?? []), ...(listing.tech_backend ?? [])]

  return (
    <div className="group relative rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-md">
      {/* Remove button */}
      <button
        onClick={() => onRemove(listing.id)}
        className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-destructive"
        title="Убрать из избранного"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Thumbnail */}
      <Link href={`/listing/${listing.slug}`}>
        <div className="relative h-40 w-full overflow-hidden border-b bg-muted">
          {listing.thumbnail_url ? (
            <Image
              src={listing.thumbnail_url}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground/20" strokeWidth={1} />
            </div>
          )}
          {listing.featured && (
            <Badge className="absolute left-3 top-3 border-0 bg-background/90 text-foreground backdrop-blur-sm">
              Топ
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Link href={`/listing/${listing.slug}`}>
            <p className="truncate font-semibold hover:underline underline-offset-2">
              {listing.title}
            </p>
          </Link>
          {listing.tagline && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{listing.tagline}</p>
          )}
        </div>

        {/* Category + tech */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs font-normal">{category?.label}</Badge>
          {allTech.slice(0, 2).map(t => (
            <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>
          ))}
          {allTech.length > 2 && (
            <Badge variant="secondary" className="text-xs font-normal">+{allTech.length - 2}</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {mrr > 0 && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <TrendingUp className="h-3 w-3" />MRR {symbol}{fmt(mrr)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />{listing.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />{listing.favorites}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-lg font-bold">{symbol}{Number(listing.price).toLocaleString()}</p>
          <Link href={`/listing/${listing.slug}`}>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              Открыть <ExternalLink className="ml-1.5 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function FavoritesPage() {
  const [listings, setListings] = useState<FavoriteListing[]>([])
  const [loading, setLoading]   = useState(true)
  const [view, setView]         = useState<ViewMode>('list')
  const { toggle }              = useFavorites()

  useEffect(() => {
    fetch('/api/favorites?full=1')
      .then(r => r.json())
      .then(json => setListings(json.listings ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id))
    await toggle(id)
  }

  const count = listings.length
  const countLabel = count === 1 ? 'проект' : count < 5 ? 'проекта' : 'проектов'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Избранное</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? '...' : `${count} ${countLabel}`}
          </p>
        </div>

        {/* View toggle */}
        {!loading && listings.length > 0 && (
          <div className="flex items-center rounded-lg border p-1 gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-7 w-7', view === 'list' && 'bg-muted')}
              onClick={() => setView('list')}
              title="Список"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-7 w-7', view === 'grid' && 'bg-muted')}
              onClick={() => setView('grid')}
              title="Карточки"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <Heart className="mb-3 h-10 w-10 text-muted-foreground/20" strokeWidth={1} />
          <p className="font-medium">Нет сохранённых проектов</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Нажмите на сердечко на карточке проекта, чтобы сохранить его здесь
          </p>
          <Link href="/browse" className="mt-6">
            <Button variant="outline">Перейти в каталог</Button>
          </Link>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-4">
          {listings.map(l => (
            <ListRow key={l.id} listing={l} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map(l => (
            <GridCard key={l.id} listing={l} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
