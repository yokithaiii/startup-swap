'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CATEGORIES } from '@/lib/constants'
import {
  ArrowLeft, Building2,
  Star, Package, ShoppingBag, TrendingUp,
  CheckCircle2, Calendar, Eye, Heart, ExternalLink
} from 'lucide-react'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  bio: string | null
  company: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  reputation: number
  total_sales: number
  total_purchases: number
  created_at: string
  email_verified: boolean
  identity_verified: boolean
}

interface Listing {
  id: string
  title: string
  slug: string
  tagline: string | null
  category: string
  price: number
  currency: string
  thumbnail_url: string | null
  views: number
  favorites: number
  metrics: any
  published_at: string | null
}

interface Stats {
  totalListings: number
  totalSales: number
  totalPurchases: number
  reputation: number
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [profile, setProfile]   = useState<Profile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats]       = useState<Stats | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then(json => {
        if (!json) return
        setProfile(json.profile)
        setListings(json.listings)
        setStats(json.stats)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Пользователь'
    : ''

  const initials = displayName.charAt(0).toUpperCase()

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : '—'

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold">Пользователь не найден</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />Назад
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </button>

      {loading ? (
        <div className="space-y-6">
          <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>)}
          </div>
        </div>
      ) : profile && (
        <>
          {/* Profile card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <Avatar className="h-20 w-20 shrink-0">
                  <AvatarImage src={profile.avatar_url ?? undefined} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold">{displayName}</h1>
                      {profile.identity_verified && (
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Верифицирован
                        </Badge>
                      )}
                      {profile.email_verified && (
                        <Badge variant="outline" className="gap-1 font-normal text-xs">
                          <CheckCircle2 className="h-3 w-3 text-blue-500" />
                          Email
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      {profile.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />{profile.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />На платформе с {joinedDate}
                      </span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{profile.bio}</p>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2">
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Сайт <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Button>
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          @{profile.twitter} <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Button>
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          LinkedIn <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Star,        color: 'text-amber-500',   label: 'Репутация',  value: stats?.reputation ?? 0 },
              { icon: Package,     color: 'text-violet-500',  label: 'Проектов',   value: stats?.totalListings ?? 0 },
              { icon: TrendingUp,  color: 'text-emerald-500', label: 'Продано',    value: stats?.totalSales ?? 0 },
              { icon: ShoppingBag, color: 'text-blue-500',    label: 'Куплено',    value: stats?.totalPurchases ?? 0 },
            ].map(({ icon: Icon, color, label, value }) => (
              <Card key={label} className="p-0">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active listings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Активные проекты
                {listings.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({listings.length})</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                  <Package className="mb-2 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
                  <p className="text-sm text-muted-foreground">Нет активных проектов</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {listings.map(listing => {
                    const category = CATEGORIES.find(c => c.value === listing.category)
                    const symbol   = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'
                    const mrr      = listing.metrics?.mrr ?? 0

                    return (
                      <Link key={listing.id} href={`/listing/${listing.slug}`} target="_blank">
                        <div className="mb-2 flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                          {/* Thumbnail */}
                          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                            {listing.thumbnail_url ? (
                              <img src={listing.thumbnail_url} alt={listing.title} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground/20" strokeWidth={1} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="truncate font-semibold text-sm">{listing.title}</p>
                            {listing.tagline && (
                              <p className="truncate text-xs text-muted-foreground">{listing.tagline}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="border rounded px-1.5 py-0.5">{category?.label}</span>
                              {mrr > 0 && (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <TrendingUp className="h-3 w-3" />MRR {symbol}{fmt(mrr)}
                                </span>
                              )}
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{listing.favorites}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="shrink-0 text-right flex gap-2">
                            <p className="font-bold text-base text-lg">{symbol}{Number(listing.price).toLocaleString()}</p>
                            <ExternalLink className="mt-1 h-3.5 w-3.5 text-muted-foreground ml-auto" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
