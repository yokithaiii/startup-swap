'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { CATEGORIES } from '@/lib/constants'
import { toast } from 'sonner'
import { ImageIcon, ExternalLink, CheckCircle2, XCircle, Eye, Calendar } from 'lucide-react'

const STATUSES = [
  { value: 'PENDING_REVIEW', label: 'На проверке' },
  { value: 'ACTIVE',         label: 'Активные' },
  { value: 'REJECTED',       label: 'Отклонённые' },
  { value: 'DRAFT',          label: 'Черновики' },
]

interface AdminListing {
  id:             string
  title:          string
  tagline:        string | null
  category:       string
  status:         string
  price:          number
  currency:       string
  slug:           string
  thumbnail_url:  string | null
  created_at:     string
  profiles:       { id: string; first_name: string | null; last_name: string | null; email: string } | null
}

export default function AdminListingsPage() {
  const [status, setStatus]         = useState('PENDING_REVIEW')
  const [listings, setListings]     = useState<AdminListing[]>([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)

  // Диалог отклонения
  const [rejectId, setRejectId]     = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async (s: string) => {
    setLoading(true)
    fetch(`/api/admin/listings?status=${s}&limit=50`)
      .then(r => r.json())
      .then(json => {
        setListings(json.listings ?? [])
        setTotal(json.total ?? 0)
      })
      .catch(() => toast.error('Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(status) }, [status, load])

  const handleApprove = async (id: string) => {
    setActionLoading(true)
    try {
      const res  = await fetch(`/api/admin/listings/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'approve' }),
      })
      if (!res.ok) throw new Error()
      setListings(prev => prev.filter(l => l.id !== id))
      setTotal(t => t - 1)
      toast.success('Листинг одобрен и опубликован')
    } catch {
      toast.error('Не удалось одобрить')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/listings/${rejectId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'reject' }),
      })
      if (!res.ok) throw new Error()
      setListings(prev => prev.filter(l => l.id !== rejectId))
      setTotal(t => t - 1)
      toast.success('Листинг отклонён')
      setRejectId(null)
      setRejectNote('')
    } catch {
      toast.error('Не удалось отклонить')
    } finally {
      setActionLoading(false)
    }
  }

  const symbol = (currency: string) =>
    currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₽'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Проекты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? '...' : `${total} в статусе "${STATUSES.find(s => s.value === status)?.label}"`}
        </p>
      </div>

      <Tabs value={status} onValueChange={s => { setStatus(s) }}>
        <TabsList>
          {STATUSES.map(s => (
            <TabsTrigger key={s.value} value={s.value}>{s.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">Нет листингов в этом статусе</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => {
            const cat = CATEGORIES.find(c => c.value === listing.category)
            const sellerName = listing.profiles
              ? [listing.profiles.first_name, listing.profiles.last_name].filter(Boolean).join(' ') || listing.profiles.email
              : 'Неизвестен'

            return (
              <Card key={listing.id} className="p-0">
                <CardContent className="p-5">
                  <div className="flex items-start gap-5">
                    {/* Thumbnail */}
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                      {listing.thumbnail_url ? (
                        <img src={listing.thumbnail_url} alt={listing.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground/20" strokeWidth={1} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold leading-tight">{listing.title}</p>
                          {listing.tagline && (
                            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{listing.tagline}</p>
                          )}
                        </div>
                        <p className="shrink-0 font-bold">
                          {symbol(listing.currency)}{Number(listing.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{cat?.label}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(listing.created_at).toLocaleDateString('ru-RU')}
                        </span>
                        {listing.profiles && (
                          <Link
                            href={`/dashboard/users/${listing.profiles.id}`}
                            className="hover:text-foreground hover:underline underline-offset-2"
                          >
                            {sellerName}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/listing/${listing.slug}`} target="_blank">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      {listing.status === 'PENDING_REVIEW' && (
                        <>
                          <Button
                            size="sm" className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                            disabled={actionLoading}
                            onClick={() => handleApprove(listing.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Одобрить
                          </Button>
                          <Button
                            size="sm" variant="outline"
                            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                            disabled={actionLoading}
                            onClick={() => { setRejectId(listing.id); setRejectNote('') }}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Отклонить
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Reject dialog */}
      <Dialog open={!!rejectId} onOpenChange={open => !open && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить листинг</DialogTitle>
            <DialogDescription>
              Укажите причину — продавец увидит её в своём дашборде.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Причина отклонения (необязательно)"
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>Отмена</Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? 'Отклоняем...' : 'Отклонить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
