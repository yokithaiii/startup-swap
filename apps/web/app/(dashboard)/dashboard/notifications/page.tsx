'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import {
  MessageSquare, DollarSign, CheckCircle2,
  XCircle, Package, Bell, BellOff, Trash2
} from 'lucide-react'

type NotificationType =
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'listing_approved'
  | 'listing_rejected'
  | 'new_message'

interface Notification {
  id:         string
  type:       NotificationType
  title:      string
  message:    string
  read:       boolean
  link:       string | null
  created_at: string
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  offer_received:   { icon: DollarSign,    color: 'text-violet-500',       bg: 'bg-violet-500/10' },
  offer_accepted:   { icon: CheckCircle2,  color: 'text-emerald-500',      bg: 'bg-emerald-500/10' },
  offer_rejected:   { icon: XCircle,       color: 'text-destructive',      bg: 'bg-destructive/10' },
  listing_approved: { icon: Package,       color: 'text-emerald-500',      bg: 'bg-emerald-500/10' },
  listing_rejected: { icon: Package,       color: 'text-destructive',      bg: 'bg-destructive/10' },
  new_message:      { icon: MessageSquare, color: 'text-sky-500',          bg: 'bg-sky-500/10' },
  default:          { icon: Bell,          color: 'text-muted-foreground', bg: 'bg-muted' },
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000)        return 'только что'
  if (diff < 3_600_000)     return `${Math.floor(diff / 60_000)} мин. назад`
  if (diff < 86_400_000)    return `${Math.floor(diff / 3_600_000)} ч. назад`
  if (diff < 604_800_000)   return `${Math.floor(diff / 86_400_000)} дн. назад`
  return new Date(iso).toLocaleDateString('ru-RU')
}

export default function NotificationsPage() {
  const { user, profile }                 = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState<'all' | 'unread'>('all')

  const currentUserId = user?.id ?? profile?.id ?? ''

  // Загрузка
  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(json => setNotifications(json.notifications ?? []))
      .finally(() => setLoading(false))
  }, [])

  // Realtime
  useEffect(() => {
    if (!currentUserId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
        },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [currentUserId])

  const unreadCount = notifications.filter(n => !n.read).length
  const visible     = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
  }

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    await fetch('/api/notifications', { method: 'PATCH' })
  }

  const remove = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Уведомления</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? '...' : unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Всё прочитано'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <BellOff className="mr-2 h-4 w-4" />
            Прочитать все
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 rounded-lg border p-1 w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {f === 'all' ? 'Все' : 'Непрочитанные'}
            {f === 'unread' && unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 min-w-4 rounded-full px-1 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-start gap-4 rounded-xl border p-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
          <p className="font-medium">Нет уведомлений</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === 'unread' ? 'Все уведомления прочитаны' : 'Пока ничего нет'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(n => {
            const cfg  = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.default
            const Icon = cfg.icon
            const content = (
              <div
                className={cn(
                  'group flex items-start gap-4 rounded-xl border p-4 transition-colors cursor-pointer',
                  !n.read && 'bg-muted/40'
                )}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', cfg.bg)}>
                  <Icon className={cn('h-4 w-4', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm', !n.read ? 'font-semibold' : 'font-medium')}>
                      {n.title}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(n.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={e => { e.stopPropagation(); remove(n.id) }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )

            return (
              <div key={n.id}>
                {content}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
