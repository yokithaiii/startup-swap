'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, ArrowUpRight, Package } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Offer {
  id:         string
  amount:     number
  currency:   string
  message:    string
  conditions: string | null
  status:     'pending' | 'accepted' | 'rejected' | 'countered'
  created_at: string
  listing:    { id: string; title: string; slug: string; thumbnail_url: string | null }
  buyer:      { id: string; first_name: string | null; last_name: string | null }
  seller:     { id: string; first_name: string | null; last_name: string | null }
}

const STATUS: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Ожидает',   className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  accepted:  { label: 'Принят',    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected:  { label: 'Отклонён', className: 'bg-muted text-muted-foreground border-border' },
  countered: { label: 'Встречный', className: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
}

function formatName(p: { first_name: string | null; last_name: string | null } | null) {
  if (!p) return 'Пользователь'
  return [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Пользователь'
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60)   return `${m} мин. назад`
  const h = Math.floor(m / 60)
  if (h < 24)   return `${h} ч. назад`
  const d = Math.floor(h / 24)
  if (d < 7)    return `${d} дн. назад`
  return new Date(iso).toLocaleDateString('ru-RU')
}

function OfferCard({
  offer, type, onStatusChange,
}: {
  offer: Offer
  type: 'received' | 'sent'
  onStatusChange: (id: string, status: string) => void
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const s = STATUS[offer.status] ?? STATUS.pending
  const symbol = offer.currency === 'USD' ? '$' : offer.currency === 'EUR' ? '€' : '₽'

  const updateStatus = async (status: string) => {
    setLoading(status)
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error); return }
      onStatusChange(offer.id, status)
      toast.success(status === 'accepted' ? 'Оффер принят' : 'Оффер отклонён')
    } catch {
      toast.error('Ошибка сети')
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="p-0">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/listing/${offer.listing.slug}`} className="group flex items-center gap-1.5">
              <p className="font-semibold leading-tight group-hover:underline underline-offset-4 line-clamp-1">
                {offer.listing.title}
              </p>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {type === 'received' ? (
                <Link
                  href={`/dashboard/users/${offer.buyer.id}`}
                  className="hover:underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  от {formatName(offer.buyer)}
                </Link>
              ) : (
                <Link
                  href={`/dashboard/users/${offer.seller.id}`}
                  className="hover:underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  продавец: {formatName(offer.seller)}
                </Link>
              )}
            </p>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
            {s.label}
          </span>
        </div>

        <p className="text-2xl font-bold">
          {symbol}{Number(offer.amount).toLocaleString()}
        </p>

        <p className="text-sm text-muted-foreground line-clamp-2">{offer.message}</p>

        {offer.conditions && (
          <p className="text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {offer.conditions}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(offer.created_at)}
          </div>
          {type === 'received' && offer.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm" className="h-7 text-xs"
                disabled={!!loading}
                onClick={() => updateStatus('accepted')}
              >
                {loading === 'accepted' ? '...' : 'Принять'}
              </Button>
              <Button
                size="sm" variant="outline" className="h-7 text-xs"
                disabled={!!loading}
                onClick={() => updateStatus('rejected')}
              >
                {loading === 'rejected' ? '...' : 'Отклонить'}
              </Button>
            </div>
          )}
          {type === 'sent' && offer.status === 'pending' && (
            <Button
              size="sm" variant="outline" className="h-7 text-xs text-destructive hover:text-destructive"
              disabled={!!loading}
              onClick={() => updateStatus('rejected')}
            >
              {loading ? '...' : 'Отозвать'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <Package className="mb-2 h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default function OffersPage() {
  const [received, setReceived] = useState<Offer[]>([])
  const [sent, setSent]         = useState<Offer[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/offers?type=received').then(r => r.json()),
      fetch('/api/offers?type=sent').then(r => r.json()),
    ])
      .then(([r, s]) => {
        setReceived(r.offers ?? [])
        setSent(s.offers ?? [])
      })
      .catch(() => toast.error('Не удалось загрузить офферы'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = (type: 'received' | 'sent', id: string, status: string) => {
    const update = (list: Offer[]) =>
      list.map(o => o.id === id ? { ...o, status: status as Offer['status'] } : o)
    if (type === 'received') setReceived(update)
    else setSent(update)
  }

  const pendingCount = received.filter(o => o.status === 'pending').length

  const SkeletonCard = () => (
    <Card className="p-0"><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Офферы</h1>
        <p className="mt-1 text-sm text-muted-foreground">Управляйте входящими и исходящими предложениями</p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received" className="gap-2">
            Входящие
            {pendingCount > 0 && (
              <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Исходящие</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4 space-y-3">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : received.length === 0 ? (
            <EmptyState text="Входящих офферов пока нет" />
          ) : (
            received.map(o => (
              <OfferCard
                key={o.id} offer={o} type="received"
                onStatusChange={(id, status) => handleStatusChange('received', id, status)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-4 space-y-3">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : sent.length === 0 ? (
            <EmptyState text="Вы ещё не отправляли офферов" />
          ) : (
            sent.map(o => (
              <OfferCard
                key={o.id} offer={o} type="sent"
                onStatusChange={(id, status) => handleStatusChange('sent', id, status)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
