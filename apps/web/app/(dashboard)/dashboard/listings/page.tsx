'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ImageIcon, Eye, MessageSquare, Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { getMyListings, deleteListing, publishListing, delistListing } from '@/lib/api/listings'
import { toast } from 'sonner'

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

export default function MyListingsPage() {
  const [listings, setListings]         = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    getMyListings()
      .then(setListings)
      .catch(() => toast.error('Не удалось загрузить проекты'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await deleteListing(deleteId)
      setListings(prev => prev.filter(l => l.id !== deleteId))
      toast.success('Проект удалён')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const updated = await publishListing(id)
      setListings(prev => prev.map(l => l.id === id ? updated : l))
      toast.success('Отправлено на верификацию')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelist = async (id: string) => {
    try {
      const updated = await delistListing(id)
      setListings(prev => prev.map(l => l.id === id ? updated : l))
      toast.success('Снято с публикации')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? '...' : `${listings.length} проектов`}
          </p>
        </div>
        <Link href="/sell/new">
          <Button><Plus className="mr-2 h-4 w-4" />Разместить проект</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">Нет проектов</p>
          <p className="mt-1 text-sm text-muted-foreground">Разместите первый проект</p>
          <Link href="/sell/new" className="mt-4">
            <Button><Plus className="mr-2 h-4 w-4" />Разместить</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => {
            const category   = CATEGORIES.find(c => c.value === listing.category)
            const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.DRAFT
            const statusLabel = STATUS_LABELS[listing.status] ?? listing.status
            const canDelete  = ['DRAFT', 'REJECTED', 'DELISTED'].includes(listing.status)

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
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold leading-tight">{listing.title}</h3>
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{listing.tagline}</p>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-xs text-muted-foreground border rounded px-2 py-0.5">{category?.label}</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />{listing.views}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />{listing.inquiries}
                        </span>
                        <span className="font-semibold">${Number(listing.price).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      {listing.status === 'ACTIVE' && (
                        <>
                          <Link href={`/listing/${listing.slug}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleDelist(listing.id)}>
                            Снять
                          </Button>
                        </>
                      )}
                      {listing.status === 'DRAFT' && (
                        <Button size="sm" className="h-8 text-xs" onClick={() => handlePublish(listing.id)}>
                          Опубликовать
                        </Button>
                      )}
                      {listing.status === 'REJECTED' && (
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handlePublish(listing.id)}>
                          Переотправить
                        </Button>
                      )}
                      <Link href={`/dashboard/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      {canDelete && (
                        <Button
                          variant="outline" size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(listing.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить проект?</DialogTitle>
            <DialogDescription>
              Это действие необратимо. Проект будет удалён навсегда.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Удаляем...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
