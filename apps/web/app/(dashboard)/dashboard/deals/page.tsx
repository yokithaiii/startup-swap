'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpRight, CheckCircle2, Circle, Handshake, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Milestone {
  title: string
  pct:   number
  done:  boolean
}

interface DealUser {
  id:         string
  first_name: string | null
  last_name:  string | null
  avatar_url: string | null
}

interface Deal {
  id:          string
  status:      string
  final_price: number
  currency:    string
  milestones:  Milestone[]
  created_at:  string
  completed_at?: string
  listing:     { id: string; title: string; slug: string; thumbnail_url: string | null } | null
  buyer:       DealUser | null
  seller:      DealUser | null
}

const STATUS: Record<string, { label: string; className: string }> = {
  IN_PROGRESS: { label: 'В процессе',  className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  COMPLETED:   { label: 'Завершена',   className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  CANCELLED:   { label: 'Отменена',    className: 'bg-muted text-muted-foreground border-border' },
}

function displayName(u: DealUser | null) {
  if (!u) return 'Пользователь'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Пользователь'
}

function initials(u: DealUser | null) {
  return displayName(u).charAt(0).toUpperCase()
}

export default function DealsPage() {
  const [deals, setDeals]           = useState<Deal[]>([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [loading, setLoading]       = useState(true)
  const [updating, setUpdating]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(json => {
        setDeals(json.deals ?? [])
        setCurrentUserId(json.currentUserId ?? '')
      })
      .catch(() => toast.error('Не удалось загрузить сделки'))
      .finally(() => setLoading(false))
  }, [])

  const handleMilestone = async (dealId: string, milestoneIndex: number) => {
    setUpdating(`${dealId}-${milestoneIndex}`)
    try {
      const res  = await fetch(`/api/deals/${dealId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'milestone', milestoneIndex }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error); return }

      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...json.deal } : d))
      toast.success('Этап отмечен как выполненный')
    } catch {
      toast.error('Ошибка сети')
    } finally {
      setUpdating(null)
    }
  }

  const handleComplete = async (dealId: string) => {
    setUpdating(dealId)
    try {
      const res  = await fetch(`/api/deals/${dealId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'complete' }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error); return }

      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...json.deal } : d))
      toast.success('Сделка завершена')
    } catch {
      toast.error('Ошибка сети')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Сделки</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Отслеживайте прогресс активных сделок
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Handshake className="mb-3 h-10 w-10 text-muted-foreground/20" strokeWidth={1} />
          <p className="font-medium">Нет активных сделок</p>
          <p className="mt-1 text-sm text-muted-foreground">Сделки появятся после принятия оффера</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => {
            const s        = STATUS[deal.status] ?? STATUS.IN_PROGRESS
            const isBuyer  = deal.buyer?.id  === currentUserId
            const other    = isBuyer ? deal.seller : deal.buyer
            const symbol   = deal.currency === 'USD' ? '$' : deal.currency === 'EUR' ? '€' : '₽'
            const progress = (deal.milestones ?? [])
              .filter(m => m.done)
              .reduce((acc, m) => acc + m.pct, 0)
            const nextMilestoneIdx = (deal.milestones ?? []).findIndex(m => !m.done)
            const isActive = deal.status === 'IN_PROGRESS'
            const allDone  = (deal.milestones ?? []).every(m => m.done)

            return (
              <Card key={deal.id} className="p-0 overflow-hidden">
                <CardContent className="p-4 sm:p-6 space-y-5">

                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {deal.listing ? (
                          <Link href={`/listing/${deal.listing.slug}`} className="group flex items-center gap-1.5">
                            <h3 className="font-semibold group-hover:underline underline-offset-4 truncate text-sm sm:text-base">
                              {deal.listing.title}
                            </h3>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          </Link>
                        ) : (
                          <h3 className="font-semibold text-muted-foreground text-sm">Проект удалён</h3>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="font-bold text-sm sm:text-base">{symbol}{Number(deal.final_price).toLocaleString()}</p>
                        <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', s.className)}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={other?.avatar_url ?? undefined} />
                        <AvatarFallback className="text-[10px]">{initials(other)}</AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/dashboard/users/${other?.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
                      >
                        {isBuyer ? 'Продавец' : 'Покупатель'}: {displayName(other)}
                      </Link>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(deal.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    {(deal.milestones ?? []).map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {m.done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                        )}
                        <span className={cn(
                          'flex-1 text-sm',
                          m.done && 'line-through opacity-40'
                        )}>
                          {m.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{m.pct}%</span>
                        {/* Кнопка подтверждения — только для следующего невыполненного */}
                        {isActive && i === nextMilestoneIdx && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2"
                            disabled={updating === `${deal.id}-${i}`}
                            onClick={() => handleMilestone(deal.id, i)}
                          >
                            {updating === `${deal.id}-${i}` ? '...' : 'Выполнено'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    {isActive && allDone && (
                      <Button
                        size="sm"
                        disabled={updating === deal.id}
                        onClick={() => handleComplete(deal.id)}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        {updating === deal.id ? 'Завершаем...' : 'Завершить сделку'}
                      </Button>
                    )}
                    <Link href="/dashboard/messages">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="mr-1.5 h-4 w-4" />
                        <span className="hidden sm:inline">Написать {isBuyer ? 'продавцу' : 'покупателю'}</span>
                        <span className="sm:hidden">Написать</span>
                      </Button>
                    </Link>
                    {deal.status === 'COMPLETED' && deal.completed_at && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Завершена {new Date(deal.completed_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
