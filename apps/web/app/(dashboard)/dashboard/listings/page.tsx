import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockListings } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/constants'
import { ImageIcon, Eye, MessageSquare, Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react'

const myListings = mockListings.slice(0, 3)

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  PENDING_REVIEW: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  DRAFT: 'text-muted-foreground bg-muted border-border',
  SOLD: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Активен',
  PENDING_REVIEW: 'На проверке',
  DRAFT: 'Черновик',
  SOLD: 'Продан',
}

export default function MyListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
          <p className="mt-1 text-sm text-muted-foreground">{myListings.length} проекта</p>
        </div>
        <Link href="/sell/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Разместить проект
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {myListings.map(listing => {
          const category = CATEGORIES.find(c => c.value === listing.category)
          const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.DRAFT
          const statusLabel = STATUS_LABELS[listing.status] ?? listing.status

          return (
            <Card key={listing.id} className="p-0">
              <CardContent className="p-5">
                <div className="flex items-start gap-5">
                  {/* Thumbnail */}
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/20" strokeWidth={1} />
                  </div>

                  {/* Main info */}
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

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <Badge variant="outline" className="font-normal">{category?.label}</Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        {listing.views} просм.
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {listing.inquiries} запросов
                      </span>
                      <span className="font-semibold text-foreground">
                        ${listing.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/listing/${listing.slug}`}>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
