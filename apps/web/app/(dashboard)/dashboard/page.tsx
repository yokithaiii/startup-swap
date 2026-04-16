'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORIES } from '@/lib/constants'
import { dbToListing } from '@/lib/adapters/listing'
import { useAuthStore } from '@/store/auth'
import { Listing } from '@/types'
import {
  Package, Eye, MessageSquare, Handshake,
  TrendingUp, ArrowRight, ImageIcon, Clock,
  ExternalLink, Pencil
} from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:         'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  PENDING_REVIEW: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  DRAFT:          'text-muted-foreground bg-muted border-border',
  SOLD:           'text-blue-500 bg-blue-500/10 border-blue-500/20',
  DELISTED:       'text-muted-foreground bg-muted border-border',
  REJECTED:       'text-destructive bg-destructive/10 border-destructive/20',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE:         'Активен',
  PENDING_REVIEW: 'На проверке',
  DRAFT:          'Черновик',
  SOLD:           'Продан',
  DELISTED:       'Снят',
  REJECTED:       'Отклонён',
}


interface DashOffer {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
  buyer_id: string
  seller_id: string
  listing: { title: string; slug: string }
  buyer:  { first_name: string | null; last_name: string | null }
  seller: { first_name: string | null; last_name: string | null }
}

const OFFER_STATUS: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Ожидает',   className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  accepted:  { label: 'Принят',    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected:  { label: 'Отклонён', className: 'bg-muted text-muted-foreground border-border' },
  countered: { label: 'Встречный', className: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60)  return `${m} мин. назад`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h} ч. назад`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d} дн. назад`
  return new Date(iso).toLocaleDateString('ru-RU')
}

function formatName(p: { first_name: string | null; last_name: string | null } | null) {
  if (!p) return 'Покупатель'
  return [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Покупатель'
}

export default function DashboardPage() {
  const { profile, user } = useAuthStore()
  const firstName = profile?.first_name 
    ?? user?.firstName
    ?? profile?.email?.split('@')[0] 
    ?? 'Пользователь'

  const [myListings, setMyListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [recentOffers, setRecentOffers] = useState<DashOffer[]>([])
  const [offersLoading, setOffersLoading] = useState(true)

  useEffect(() => {
    fetch('/api/listings/my')
      .then(r => r.json())
      .then(json => setMyListings((json.listings ?? []).map(dbToListing)))
      .catch(() => setMyListings([]))
      .finally(() => setListingsLoading(false))

    Promise.all([
      fetch('/api/offers?type=received').then(r => r.json()),
      fetch('/api/offers?type=sent').then(r => r.json()),
    ])
      .then(([rec, sent]) => {
        const all = [...(rec.offers ?? []), ...(sent.offers ?? [])]
        all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setRecentOffers(all)
      })
      .catch(() => setRecentOffers([]))
      .finally(() => setOffersLoading(false))
  }, [])

  const activeCount    = myListings.filter(l => l.status === 'ACTIVE').length
  const totalViews     = myListings.reduce((sum, l) => sum + (l.views ?? 0), 0)
  const pendingOffers  = recentOffers.filter(o => o.status === 'pending' && o.seller_id === user?.id).length

  const stats = [
    { label: 'Активных проектов',  value: listingsLoading ? null : String(activeCount),          icon: Package,       trend: null },
    { label: 'Просмотров за месяц', value: listingsLoading ? null : totalViews.toLocaleString(), icon: Eye,           trend: null },
    { label: 'Входящих офферов',   value: offersLoading   ? null : String(pendingOffers),         icon: MessageSquare, trend: pendingOffers > 0 ? `${pendingOffers} новых` : null },
    { label: 'Активных сделок',    value: '0',                                                    icon: Handshake,     trend: null },
  ]

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>
        <p className="mt-1 text-sm text-muted-foreground">Добро пожаловать, {firstName}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <Card key={label} className="p-0">
            <CardContent className="pt-5 pb-5 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {value === null ? (
                    <Skeleton className="mt-1 h-8 w-16" />
                  ) : (
                    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                  )}
                  {trend && <p className="mt-1 text-xs text-emerald-500">{trend}</p>}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* My listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Мои проекты</CardTitle>
            <Link href="/dashboard/listings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Все проекты <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {listingsLoading ? (
              <>
                <Skeleton className="h-[76px] w-full rounded-lg" />
                <Skeleton className="h-[76px] w-full rounded-lg" />
              </>
            ) : myListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                <Package className="mb-2 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">У вас пока нет проектов</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myListings.slice(0, 3).map(listing => {
                  const category    = CATEGORIES.find(c => c.value === listing.category)
                  const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.DRAFT
                  const statusLabel = STATUS_LABELS[listing.status] ?? listing.status
                  const symbol      = listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : '₽'

                  return (
                    <div key={listing.id} className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      {/* Thumbnail */}
                      <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                        {listing.thumbnailUrl ? (
                          <img
                            src={listing.thumbnailUrl}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/20" strokeWidth={1} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-tight">{listing.title}</p>
                            {listing.tagline && (
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{listing.tagline}</p>
                            )}
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="border rounded px-1.5 py-0.5">{category?.label}</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{listing.inquiries}</span>
                          <span className="font-semibold text-foreground">{symbol}{Number(listing.price).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        {listing.status === 'ACTIVE' && (
                          <Link href={`/listing/${listing.slug}`}>
                            <Button variant="outline" size="icon" className="h-7 w-7">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <Link href="/sell/new">
              <div className="mt-1 flex items-center justify-center rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                + Разместить новый проект
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Последние офферы</CardTitle>
            <Link href="/dashboard/offers">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Все <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {offersLoading ? (
              <>
                <Skeleton className="h-[88px] w-full rounded-lg" />
                <Skeleton className="h-[88px] w-full rounded-lg" />
              </>
            ) : recentOffers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">Входящих офферов пока нет</p>
              </div>
            ) : (
              recentOffers.slice(0, 4).map(offer => {
                const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.pending
                const symbol = offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : '₽'
                const isReceived = offer.seller_id === user?.id
                const counterpart = isReceived ? offer.buyer : offer.seller
                return (
                  <div key={offer.id} className="space-y-1.5 rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight line-clamp-1">{offer.listing.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {isReceived ? (
                            <Link href={`/dashboard/users/${offer.buyer_id}`} className="hover:underline underline-offset-2 hover:text-foreground transition-colors">
                              от {formatName(counterpart)}
                            </Link>
                          ) : (
                            <Link href={`/dashboard/users/${offer.seller_id}`} className="hover:underline underline-offset-2 hover:text-foreground transition-colors">
                              → {formatName(counterpart)}
                            </Link>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{isReceived ? '↓' : '↑'}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${s.className}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold">{symbol}{Number(offer.amount).toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(offer.created_at)}
                      </div>
                    </div>
                    {isReceived && offer.status === 'pending' && (
                      <Link href="/dashboard/offers">
                        <Button size="sm" className="h-7 w-full text-xs mt-1">Ответить</Button>
                      </Link>
                    )}
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: MessageSquare, text: 'Новый оффер на «AI-Powered Content Generator SaaS» — $68 000', time: '2 часа назад', color: 'text-violet-500' },
              { icon: Eye, text: '«E-Commerce Analytics Dashboard» просмотрели 45 раз за сегодня', time: '5 часов назад', color: 'text-blue-500' },
              { icon: TrendingUp, text: 'Оффер на «E-Commerce Analytics Dashboard» принят — $115 000', time: '3 дня назад', color: 'text-emerald-500' },
              { icon: Package, text: 'Проект «AI-Powered Content Generator SaaS» прошёл верификацию', time: '5 дней назад', color: 'text-amber-500' },
            ].map(({ icon: Icon, text, time, color }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-muted/50`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
